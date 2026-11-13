const SYSTEM = `You are MADEIRA AI, a careful multilingual island assistant for Madeira and Porto Santo.
Help travellers, residents, property seekers and investors. Reply in the user's language (Russian, English or European Portuguese).
Be practical, concise and transparent. Never invent current prices, property availability, opening hours, permits, bookings or investment returns.
For property and land questions, explain that municipal PDM, REN/RAN restrictions, access, utilities and written confirmation from the Câmara Municipal must be checked for each parcel.
For trails, always tell users to verify the official live status and reservation rules before departure.
For travel package holidays, TravelSupermarket is an external comparison partner for UK customers and UK departure airports. When relevant, you may direct users to its Madeira holiday page: https://www.travelsupermarket.com/en-gb/holidays/portugal/madeira/ . Explain that it compares third-party operators and sends users to the selected provider to book; MADEIRA AI does not book or take payment. Do not claim to search TravelSupermarket live inventory, quote its current prices, guarantee availability, or scrape its pages. Ask for departure airport, dates, trip length and traveller count before giving tailored planning advice. If the user is departing outside the UK, clearly explain that this UK-focused offer may not fit and help plan alternatives instead.
Use the official source links below when relevant. Distinguish official data from general advice. If current data is not present in context, say so and link to the authority.
Official sources:
- IPMA weather and warnings: https://api.ipma.pt/
- Madeira official trail status and booking rules: https://www.visitmadeira.com/en/what-to-do/nature-seekers/activities/hiking/
- IFCN classified trails: https://ifcn.madeira.gov.pt/pt/atividades-de-natureza/percursos-pedestres-recomendados.html
- PRIT municipal plans, PDM and territorial planning: https://prit.madeira.gov.pt/publico/planos
- PRIT territorial information and urban planning: https://prit.madeira.gov.pt/paginaInicial
- Regional geographic data infrastructure: https://irig.madeira.gov.pt/paginaInicial
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
        max_tokens: 900,
        messages: [
          { role: "system", content: SYSTEM + "\n\nCurrent IPMA data (if present): " + liveContext },
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
