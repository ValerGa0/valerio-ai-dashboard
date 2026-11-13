const numberParam = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const lat = numberParam(req.query?.lat);
  const lon = numberParam(req.query?.lon);
  if (lat === null || lon === null || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return res.status(400).json({ error: "Valid latitude and longitude are required." });
  }

  try {
    const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
    weatherUrl.search = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
      timezone: "auto"
    }).toString();

    const [weatherResult, placeResult] = await Promise.allSettled([
      fetch(weatherUrl, { signal: AbortSignal.timeout(8000) }).then(async (r) => {
        if (!r.ok) throw new Error("Weather provider unavailable");
        return r.json();
      }),
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=10`, {
        headers: { "User-Agent": "MADEIRA-AI/0.1", "Accept-Language": req.headers["accept-language"] || "ru,en" },
        signal: AbortSignal.timeout(6000)
      }).then(async (r) => {
        if (!r.ok) throw new Error("Reverse geocoding unavailable");
        return r.json();
      })
    ]);

    if (weatherResult.status !== "fulfilled") throw weatherResult.reason;
    const weather = weatherResult.value;
    const current = weather.current;
    if (!current) throw new Error("Current weather is unavailable");

    const address = placeResult.status === "fulfilled" ? placeResult.value.address || {} : {};
    const locationName = address.city || address.town || address.village || address.municipality ||
      address.county || address.state || "Ваше местоположение";

    res.setHeader("Cache-Control", "private, no-store");
    return res.status(200).json({
      provider: "Open-Meteo",
      fetchedAt: new Date().toISOString(),
      location: { name: locationName, country: address.country || null, latitude: lat, longitude: lon },
      current: {
        temperatureC: current.temperature_2m,
        feelsLikeC: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        precipitationMm: current.precipitation,
        weatherCode: current.weather_code,
        windKmh: current.wind_speed_10m,
        isDay: current.is_day === 1
      }
    });
  } catch (_) {
    return res.status(502).json({ error: "Не удалось получить погоду для текущего местоположения. Попробуйте ещё раз." });
  }
}
