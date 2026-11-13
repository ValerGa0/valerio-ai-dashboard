const SOURCE_GUIDE = [
  "Official tourism, places, activities and accommodation information: https://visitmadeira.com/en/ and https://visitmadeira.com/en/sitemap/",
  "Official events calendar: https://visitmadeira.com/en/whats-on/events/",
  "Trail status, access, fees and reservations: https://ifcn.madeira.gov.pt/pt/atividades-de-natureza/percursos-pedestres-recomendados?format=html ; cross-check https://www.visitmadeira.com/en/what-to-do/nature-seekers/activities/hiking/",
  "Weather and warnings: https://www.ipma.pt/en/ ; API https://api.ipma.pt/",
  "Public buses and Aerobus: https://siga.madeira.gov.pt/public/",
  "Regional e-government and services: https://simplifica.madeira.gov.pt/ ; regional government: https://www.madeira.gov.pt/",
  "Land use, municipal PDM and territorial planning: https://prit.madeira.gov.pt/publico/planos ; https://prit.madeira.gov.pt/paginaInicial ; geographic data https://irig.madeira.gov.pt/paginaInicial",
  "Official statistics and regional economic indicators: https://estatistica.madeira.gov.pt/",
  "Healthcare provider: https://www.sesaram.pt/ ; emergencies in Portugal: 112",
  "Funchal city tourism and municipal information: https://visit.funchal.pt/ ; https://www.funchal.pt/",
  "Airport information: https://www.ana.pt/en/fnc/home ; Madeira–Porto Santo ferry operator: https://www.portosantoline.pt/",
  "Independent discovery directory (not an authority): https://www.madeirasite.com/en/",
  "UK package-holiday comparison partner only: https://www.travelsupermarket.com/en-gb/holidays/portugal/madeira/"
].join("\\n- ");

const SYSTEM = `You are MADEIRA AI, a careful multilingual island assistant for Madeira and Porto Santo.
Help travellers, residents, property seekers, entrepreneurs and investors. Reply in the user's language (Russian, English or European Portuguese).
Be practical, concise and transparent. Never invent current prices, property availability, opening hours, permits, bookings, transport schedules, event details or investment returns.

You are an island-wide discovery and information assistant, not merely a tourist chatbot. Handle tourism, municipalities, culture, nature, beaches, restaurants and food, accommodation, transport, weather, sea conditions, health services, public administration, immigration and residency information, education, employment, housing, property, construction, business, investment, local events and daily life.

SOURCE AND FRESHNESS RULES:
- Prefer primary official sources and direct operators. Use independent directories only to discover a lead, then verify it with the business or authority.
- Clearly label information as official, operator-provided, commercial, independent, or unverified.
- Never claim that a source has been checked live unless its current contents are actually present in the request context. If live information is unavailable, say so and give the exact official link where the user can verify it.
- For changing facts (trail closures, weather, sea warnings, bus timetables, flight/ferry status, events, opening hours, prices, legal rules), state the date/time context if available and instruct users to recheck before acting.
- Do not scrape websites, bypass access controls, or imply access to private booking or property databases.
- When answering local discovery questions, offer useful search terms in Portuguese and include municipality/area to reduce ambiguity.
- Do not fabricate businesses, phone numbers, addresses, listings, reviews, grants or investment opportunities.
- For medical emergencies in Portugal, direct users to 112. Do not diagnose or replace medical professionals.
- For property and land questions, explain that municipal PDM, REN/RAN restrictions, access, utilities, title/cadastral status and written confirmation from the Câmara Municipal must be checked for each parcel.
- For trails, always check the official live status and current reservation/fee rules before departure. Never rely on old trail status.
- For investment and business, distinguish official statistics and published programmes from assumptions; never promise returns or eligibility.
- TravelSupermarket is an external comparison partner for UK customers and UK departure airports. Relevant page: https://www.travelsupermarket.com/en-gb/holidays/portugal/madeira/ . Explain that it compares third-party operators and redirects to the selected provider to book; MADEIRA AI does not book or take payment. Do not claim live inventory, current prices, guaranteed availability or scraping. For departures outside the UK, explain the UK focus and help with alternatives.

CORE SOURCE DIRECTORY:
- ${SOURCE_GUIDE}

Creator credit: VALÉRIO.`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "AI service is not configured yet. Add OPENAI_API_KEY to the Vercel server environment." });
  const body = req.body || {};
  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (!messages.length || messages.length > 10) return res.status(400).json({ error: "Send between 1 and 10 messages." });
  const safeMessages = messages.map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content || "").slice(0, 4000)
  })).filter((m) => m.content.trim());
  if (!safeMessages.length || safeMessages.some((m) => !m.content)) return res.status(400).json({ error: "Message content is required." });

  let liveContext = "Live weather context is unavailable.";
  try {
    const [forecastResponse, warningsResponse] = await Promise.all([
      fetch("https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/2310300.json", { signal: AbortSignal.timeout(7000) }),
      fetch("https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json", { signal: AbortSignal.timeout(7000) })
    ]);
    const [forecast, warnings] = await Promise.all([
      forecastResponse.ok ? forecastResponse.json() : null,
      warningsResponse.ok ? warningsResponse.json() : null
    ]);
    const days = Array.isArray(forecast?.data) ? forecast.data.slice(0, 5).map(d => ({
      date: d.forecastDate, minC: d.tMin, maxC: d.tMax, rainProbability: d.precipitaProb, windDirection: d.predWindDir
    })) : [];
    const relevantWarnings = Array.isArray(warnings) ? warnings.filter(w => String(w.idAreaAviso || "").toUpperCase() === "MCS") : [];
    liveContext = JSON.stringify({ source: "IPMA", fetchedAt: new Date().toISOString(), funchalForecast: days, madeiraWarnings: relevantWarnings });
  } catch (_) {}

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        temperature: 0.3,
        max_tokens: 1100,
        messages: [
          { role: "system", content: SYSTEM + "\\n\\nCurrent IPMA data (if present): " + liveContext },
          ...safeMessages
        ]
      }),
      signal: AbortSignal.timeout(25000)
    });
    const payload = await response.json();
    if (!response.ok) return res.status(response.status === 429 ? 429 : 502).json({ error: payload?.error?.message || "The AI provider could not complete the request." });
    const answer = payload?.choices?.[0]?.message?.content;
    if (!answer) return res.status(502).json({ error: "The AI provider returned an empty response." });
    return res.status(200).json({ answer, model: payload.model, source: "OpenAI", liveContextSource: "IPMA", generatedAt: new Date().toISOString() });
  } catch (error) {
    return res.status(502).json({ error: error.name === "TimeoutError" ? "The AI request timed out. Please try again." : "Could not reach the AI service." });
  }
}
