const LOCATIONS = [
  { id: 2310300, name: "Funchal" },
  { id: 2310100, name: "Machico" },
  { id: 2310200, name: "Santa Cruz" },
  { id: 2310500, name: "Ponta do Sol" },
  { id: 2310600, name: "Porto Moniz" },
  { id: 2310700, name: "São Vicente" },
  { id: 2310800, name: "Santana" },
  { id: 2320100, name: "Porto Santo" }
];

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    const [locations, warningResponse] = await Promise.all([
      Promise.all(LOCATIONS.map(async location => {
        const r = await fetch(`https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/${location.id}.json`, { signal: AbortSignal.timeout(7000) });
        if (!r.ok) return { ...location, available: false };
        const data = await r.json();
        return { ...location, available: true, updatedAt: data.dataUpdate || null,
          days: Array.isArray(data.data) ? data.data.slice(0, 5).map(day => ({
            date: day.forecastDate,
            minC: day.tMin === "-99.0" ? null : Number(day.tMin),
            maxC: day.tMax === "-99.0" ? null : Number(day.tMax),
            rainProbability: day.precipitaProb === "-99.0" ? null : Number(day.precipitaProb),
            windDirection: day.predWindDir || null, windClass: day.classWindSpeed ?? null,
            weatherType: day.idWeatherType ?? null
          })) : [] };
      })),
      fetch("https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json", { signal: AbortSignal.timeout(7000) })
    ]);
    const rawWarnings = warningResponse.ok ? await warningResponse.json() : [];
    const warnings = Array.isArray(rawWarnings) ? rawWarnings.filter(w => String(w.idAreaAviso || "").toUpperCase() === "MCS") : [];
    return res.status(200).setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600").json({
      provider: "IPMA", fetchedAt: new Date().toISOString(), sourceUrl: "https://api.ipma.pt/",
      locations, warnings
    });
  } catch (_) {
    return res.status(502).json({ error: "IPMA data is temporarily unavailable. Consult the official IPMA website." });
  }
}
