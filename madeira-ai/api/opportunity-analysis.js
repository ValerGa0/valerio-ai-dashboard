function jsonHeaders(apiKey, accessToken) {
  return {
    apikey: apiKey,
    Authorization: "Bearer " + accessToken,
    "Content-Type": "application/json",
  };
}

async function readTable(baseUrl, headers, table, params) {
  const url = new URL(baseUrl + "/rest/v1/" + table);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  const response = await fetch(url, { headers: { ...headers, Accept: "application/json" }, signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error("Could not read " + table + " (" + response.status + ").");
  return response.json();
}

function collectSources(output) {
  const found = new Map();
  for (const item of Array.isArray(output) ? output : []) {
    if (item.type === "web_search_call") for (const source of item.action?.sources || item.results || []) {
      const url = source.url || source.uri;
      if (url && /^https?:\/\//i.test(url)) found.set(url, { title: source.title || source.domain || url, url });
    }
    if (item.type === "message") for (const content of item.content || []) for (const annotation of content.annotations || []) {
      if (annotation.type === "url_citation" && annotation.url && /^https?:\/\//i.test(annotation.url)) found.set(annotation.url, { title: annotation.title || annotation.url, url: annotation.url });
    }
  }
  return [...found.values()].slice(0, 10);
}

const MUNICIPALITIES = new Set([
  "calheta", "camara-de-lobos", "funchal", "machico", "ponta-do-sol",
  "porto-moniz", "ribeira-brava", "santa-cruz", "santana", "sao-vicente", "porto-santo"
]);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const authorization = req.headers?.authorization || req.headers?.Authorization || "";
  const accessToken = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!accessToken) return res.status(401).json({ error: "Sign in to MADEIRA AI before running an analysis." });

  const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return res.status(503).json({ error: "Supabase server configuration is missing." });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "AI service is not configured. Add OPENAI_API_KEY to the Vercel server environment." });

  const municipalityId = String(req.body?.municipalityId || "all");
  if (municipalityId !== "all" && !MUNICIPALITIES.has(municipalityId)) return res.status(400).json({ error: "Unknown municipality." });

  const headers = jsonHeaders(supabaseKey, accessToken);
  try {
    const authResponse = await fetch(supabaseUrl + "/auth/v1/user", { headers, signal: AbortSignal.timeout(10000) });
    if (!authResponse.ok) return res.status(401).json({ error: "Your session is invalid or expired. Sign in again." });
    const user = await authResponse.json();

    const recentRuns = await readTable(supabaseUrl, headers, "island_ai_analysis_runs", {
      select: "id", user_id: "eq." + user.id,
      created_at: "gte." + new Date(Date.now() - 60 * 60 * 1000).toISOString(), limit: "4"
    });
    if (recentRuns.length >= 3) return res.status(429).json({ error: "Limit reached: up to 3 AI analyses per account per hour." });

    const runInsert = await fetch(supabaseUrl + "/rest/v1/island_ai_analysis_runs", {
      method: "POST", headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify({ user_id: user.id, municipality_id: municipalityId === "all" ? null : municipalityId }),
      signal: AbortSignal.timeout(10000)
    });
    if (!runInsert.ok) return res.status(429).json({ error: "Could not register this analysis request. Please try again later." });

    const municipalityFilter = municipalityId === "all" ? {} : { municipality_id: "eq." + municipalityId };
    const regionFilter = municipalityId === "all" ? {} : { or: "(municipality_id.is.null,municipality_id.eq." + municipalityId + ")" };
    const [directory, needs, opportunities, land, planning, indicators, sources] = await Promise.all([
      readTable(supabaseUrl, headers, "island_directory_entries", { select: "name,category,municipality_id,parish,verification_status,source_id", is_active: "eq.true", ...municipalityFilter, order: "municipality_id.asc", limit: "150" }),
      readTable(supabaseUrl, headers, "island_needs", { select: "title,category,municipality_id,description,evidence_summary,validation_status,priority", validation_status: "eq.validated", ...municipalityFilter, limit: "80" }),
      readTable(supabaseUrl, headers, "island_opportunities", { select: "title,category,municipality_id,description,evidence_summary,status", status: "in.(research,validated,partnering,in_progress)", ...municipalityFilter, limit: "80" }),
      readTable(supabaseUrl, headers, "island_land_opportunities", { select: "title,municipality_id,opportunity_type,location_label,area_sqm,land_classification,buildability_status,evidence_summary,source_url,verification_status", verification_status: "in.(source_listed,verified)", ...municipalityFilter, limit: "80" }),
      readTable(supabaseUrl, headers, "island_planning_documents", { select: "municipality_id,document_type,title,status,summary,source_url,document_url", status: "in.(approved,in_force,public_consultation,under_revision)", ...municipalityFilter, limit: "80" }),
      readTable(supabaseUrl, headers, "island_construction_indicators", { select: "municipality_id,metric_key,segment,metric_label,metric_value,unit,reference_year,comparison_period,source_url,notes", ...regionFilter, order: "reference_year.desc", limit: "120" }),
      readTable(supabaseUrl, headers, "island_sources", { select: "name,category,publisher,url,authority,scope,update_note", is_active: "eq.true", order: "name", limit: "80" })
    ]);

    const dataset = {
      scope: municipalityId === "all" ? "All 11 municipalities: Madeira and Porto Santo" : municipalityId,
      generatedAt: new Date().toISOString(),
      directory,
      validatedNeeds: needs,
      researchedOpportunities: opportunities,
      verifiedLandOpportunities: land,
      currentPlanningDocuments: planning,
      officialIndicators: indicators,
      sourceRegister: sources
    };

    const instructions = [
      "You are MADEIRA AI's evidence-led business and investment research analyst for Madeira and Porto Santo. Write in Russian unless the user explicitly chooses another language.",
      "Analyse the supplied MADEIRA AI database snapshot and supplement it with fresh public web research. Prefer official regional/municipal sources, DREM, PRIT, IRIG, IFCN, and direct operators. Cite clickable source URLs and dates.",
      "Separate verified facts, source-listed directory leads, validated needs, hypotheses, and data gaps. The dataset may be incomplete. An empty table is not evidence that a service, need, parcel or opportunity does not exist.",
      "Never infer parcel buildability from a map, PDM summary, listing, zoning label or aggregate statistic. State that parcel-specific written confirmation from the relevant Câmara Municipal and title/cadastral checks are required.",
      "Do not invent live property listings, land parcels, partners, prices, permissions, subsidies, revenue forecasts, IRR or investment returns. Do not promise returns or legal eligibility.",
      "Produce: (1) a short market signal summary; (2) up to 5 ranked business/investment project hypotheses, each with location, target customer, evidence, why now, missing proof, first validation steps, key risks and possible local partners only if verified; (3) a separate property/construction outlook based on official statistics; (4) a 30-day validation plan; (5) an explicit confidence level for each idea. If there are no validated needs, say so and label ideas as hypotheses, not proven demand.",
      "Use only the supplied curated data and public sources. Never access or infer private community submissions. Raw user reports are private and excluded until moderation."
    ].join("\n\n");

    const model = process.env.MADEIRA_SEARCH_MODEL || process.env.OPENAI_MODEL || "gpt-6-astra";
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: "Bearer " + process.env.OPENAI_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        model, instructions,
        input: "Prepare an evidence-led business and investment opportunity analysis for the selected scope. Database snapshot:\n" + JSON.stringify(dataset),
        tools: [{ type: "web_search", search_context_size: "medium", external_web_access: true }],
        tool_choice: "required",
        include: ["web_search_call.action.sources"],
        max_output_tokens: 2600,
        store: false
      }),
      signal: AbortSignal.timeout(55000)
    });
    const payload = await response.json();
    if (!response.ok) return res.status(response.status === 429 ? 429 : 502).json({ error: payload?.error?.message || "AI analysis could not be completed." });
    const answer = payload.output_text || (payload.output || []).filter(item => item.type === "message").flatMap(item => item.content || []).filter(item => item.type === "output_text").map(item => item.text).join("\n");
    if (!answer) return res.status(502).json({ error: "AI analysis returned an empty response." });
    return res.status(200).json({ answer, sources: collectSources(payload.output), analyzedAt: new Date().toISOString(), scope: dataset.scope, counts: { directory: directory.length, validatedNeeds: needs.length, opportunities: opportunities.length, verifiedLand: land.length, planningDocuments: planning.length, indicators: indicators.length } });
  } catch (error) {
    return res.status(502).json({ error: error.message || "Could not build the investment analysis." });
  }
}
