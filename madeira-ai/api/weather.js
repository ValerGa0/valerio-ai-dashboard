const LOCATIONS = [
  // These location identifiers are confirmed in IPMA's official districts/islands catalogue.
  { id: 2310300, name: "Funchal" },
  { id: 2320100, name: "Porto Santo" }
];

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    const [locations, rawWarnings] = await Promise.all([
      Promise.all(LOCATIONS.map(async location => {
        try {
          const r = await fetch(`https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/${location.id}.json`, { signal: AbortSignal.timeout(7000) });
          if (!r.ok) return { ...location, available: false, days: [] };
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
        } catch (_) {
          return { ...location, available: false, days: [] };
        }
      })),
      fetch("https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json", { signal: AbortSignal.timeout(7000) })
        .then(async response => response.ok ? response.json() : [])
        .catch(() => [])
    ]);
    const warnings = Array.isArray(rawWarnings) ? rawWarnings.filter(w => String(w.idAreaAviso || "").toUpperCase() === "MCS" && ["yellow", "orange", "red"].includes(String(w.awarenessLevelID || "").toLowerCase())) : [];
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");
    return res.status(200).json({
      provider: "IPMA", fetchedAt: new Date().toISOString(), sourceUrl: "https://api.ipma.pt/",
      locations, warnings
    });
  } catch (_) {
    return res.status(502).json({ error: "IPMA data is temporarily unavailable. Consult the official IPMA website." });
  }
}
