import { createClient } from "npm:@supabase/supabase-js@2.57.0";
import JSZip from "npm:jszip@3.10.1";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FEED_URL = "https://gtfs.tiim.pt/rede-siga/rede-siga-gtfs.zip";
const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

function* csvObjects(text: string): Generator<Record<string, string>> {
  let headers: string[] | null = null;
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"' && field.length === 0) {
      quoted = true;
    } else if (c === ",") {
      row.push(field); field = "";
    } else if (c === "\n") {
      row.push(field.replace(/\r$/, "")); field = "";
      if (!headers) headers = row;
      else if (row.some((v) => v !== "")) {
        const record: Record<string, string> = {};
        headers.forEach((h, n) => record[h] = row[n] ?? "");
        yield record;
      }
      row = [];
    } else {
      field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field.replace(/\r$/, ""));
    if (!headers) headers = row;
    else if (row.some((v) => v !== "")) {
      const record: Record<string, string> = {};
      headers.forEach((h, n) => record[h] = row[n] ?? "");
      yield record;
    }
  }
}

function requiredFile(zip: JSZip, name: string) {
  const file = zip.file(name);
  if (!file) throw new Error(`Required GTFS file missing: ${name}`);
  return file;
}
function toDate(value: string) {
  if (!/^\d{8}$/.test(value)) throw new Error("Invalid GTFS date");
  return `${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6,8)}`;
}
function toSeconds(value: string) {
  const match = /^(\d{1,3}):(\d{2}):(\d{2})$/.exec(value);
  if (!match) throw new Error(`Invalid GTFS time: ${value}`);
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
}
async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function importFile(
  zip: JSZip, fileName: string, table: string, feedId: string,
  transform: (row: Record<string,string>) => Record<string,unknown>,
  onConflict: string, batchSize = 4000
) {
  const text = await requiredFile(zip, fileName).async("string");
  let batch: Record<string,unknown>[] = [];
  let count = 0;
  for (const row of csvObjects(text)) {
    batch.push({ feed_id: feedId, ...transform(row) });
    if (batch.length >= batchSize) {
      const { error } = await db.from(table).upsert(batch, { onConflict });
      if (error) throw new Error(`Import ${table} failed: ${error.message}`);
      count += batch.length; batch = [];
    }
  }
  if (batch.length) {
    const { error } = await db.from(table).upsert(batch, { onConflict });
    if (error) throw new Error(`Import ${table} failed: ${error.message}`);
    count += batch.length;
  }
  return count;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "POST required" }), { status: 405, headers: { "Content-Type": "application/json" } });
  try {
    const token = req.headers.get("x-import-token") || "";
    if (token.length < 32) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    const tokenHash = await sha256(token);
    const { data: allowed, error: authError } = await db.rpc("claim_transit_import_token", { p_token_hash: tokenHash });
    if (authError || allowed !== true) return new Response(JSON.stringify({ error: "Unauthorized or expired import token" }), { status: 401 });

    const response = await fetch(FEED_URL, { headers: { "User-Agent": "MADEIRA-AI/1.0" } });
    if (!response.ok) throw new Error(`GTFS source returned HTTP ${response.status}`);
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("zip")) throw new Error("GTFS source did not return a ZIP archive");
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength > 80 * 1024 * 1024) throw new Error("GTFS archive exceeds the 80 MB import limit");
    const zip = await JSZip.loadAsync(bytes);
    for (const name of ["agency.txt","routes.txt","stops.txt","trips.txt","stop_times.txt","calendar_dates.txt","feed_info.txt"]) requiredFile(zip,name);

    const feedInfoText = await requiredFile(zip,"feed_info.txt").async("string");
    const feedInfo = [...csvObjects(feedInfoText)][0];
    if (!feedInfo) throw new Error("feed_info.txt is empty");
    const startDate = toDate(feedInfo.feed_start_date);
    const endDate = toDate(feedInfo.feed_end_date);
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Lisbon", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    if (endDate < today) throw new Error(`GTFS feed expired on ${endDate}`);

    const modified = response.headers.get("last-modified");
    const { data: feed, error: feedError } = await db.from("transit_feeds").upsert({
      source_url: FEED_URL,
      publisher_name: feedInfo.feed_publisher_name || "Rede SIGA",
      publisher_url: feedInfo.feed_publisher_url || "https://siga.madeira.gov.pt/",
      feed_version: feedInfo.feed_version || modified || "unknown",
      feed_start_date: startDate,
      feed_end_date: endDate,
      feed_timezone: "Europe/Lisbon",
      http_last_modified: modified ? new Date(modified).toISOString() : null,
      license_status: zip.file("license.txt") ? "provided" : "not_provided",
      data_status: "preview"
    }, { onConflict: "source_url,feed_version" }).select("id").single();
    if (feedError || !feed) throw new Error(`Could not create feed record: ${feedError?.message || "unknown error"}`);
    const feedId = feed.id;

    const counts: Record<string,number> = {};
    counts.agencies = await importFile(zip,"agency.txt","transit_agencies",feedId,r=>({
      agency_id:r.agency_id, agency_name:r.agency_name, agency_url:r.agency_url || null,
      agency_timezone:r.agency_timezone || "Europe/Lisbon", agency_lang:r.agency_lang || null,
      agency_phone:r.agency_phone || null, agency_email:r.agency_email || null
    }),"feed_id,agency_id",500);
    counts.routes = await importFile(zip,"routes.txt","transit_routes",feedId,r=>({
      route_id:r.route_id, agency_id:r.agency_id || null, route_short_name:r.route_short_name || null,
      route_long_name:r.route_long_name || null, route_desc:r.route_desc || null,
      route_type:Number(r.route_type), route_url:r.route_url || null,
      route_color:r.route_color || null, route_text_color:r.route_text_color || null
    }),"feed_id,route_id",1000);
    counts.stops = await importFile(zip,"stops.txt","transit_stops",feedId,r=>({
      stop_id:r.stop_id, stop_code:r.stop_code || null, stop_name:r.stop_name,
      stop_desc:r.stop_desc || null, stop_lat:Number(r.stop_lat), stop_lon:Number(r.stop_lon),
      location_type:Number(r.location_type || 0), parent_station:r.parent_station || null,
      wheelchair_boarding:r.wheelchair_boarding ? Number(r.wheelchair_boarding) : null,
      platform_code:r.platform_code || null
    }),"feed_id,stop_id",2000);
    counts.trips = await importFile(zip,"trips.txt","transit_trips",feedId,r=>({
      trip_id:r.trip_id, route_id:r.route_id, service_id:r.service_id,
      trip_headsign:r.trip_headsign || null, trip_short_name:r.trip_short_name || null,
      direction_id:r.direction_id ? Number(r.direction_id) : null, block_id:r.block_id || null,
      shape_id:r.shape_id || null, wheelchair_accessible:r.wheelchair_accessible ? Number(r.wheelchair_accessible) : null,
      bikes_allowed:r.bikes_allowed ? Number(r.bikes_allowed) : null
    }),"feed_id,trip_id",3000);
    counts.service_dates = await importFile(zip,"calendar_dates.txt","transit_service_dates",feedId,r=>({
      service_id:r.service_id, service_date:toDate(r.date), exception_type:Number(r.exception_type)
    }),"feed_id,service_id,service_date",1000);
    counts.stop_times = await importFile(zip,"stop_times.txt","transit_stop_times",feedId,r=>({
      trip_id:r.trip_id, stop_sequence:Number(r.stop_sequence), stop_id:r.stop_id,
      arrival_seconds:toSeconds(r.arrival_time), departure_seconds:toSeconds(r.departure_time),
      stop_headsign:r.stop_headsign || null, pickup_type:r.pickup_type ? Number(r.pickup_type) : null,
      drop_off_type:r.drop_off_type ? Number(r.drop_off_type) : null,
      shape_dist_traveled:r.shape_dist_traveled ? Number(r.shape_dist_traveled) : null
    }),"feed_id,trip_id,stop_sequence",4000);

    const { error: readyError } = await db.from("transit_feeds").update({ data_status: "ready" }).eq("id",feedId);
    if (readyError) throw new Error(`Imported data but could not mark feed ready: ${readyError.message}`);
    return new Response(JSON.stringify({
      ok:true, feedId, feedVersion:feedInfo.feed_version, feedStartDate:startDate, feedEndDate:endDate,
      publisher:feedInfo.feed_publisher_name, licenseStatus:zip.file("license.txt") ? "provided" : "not_provided",
      httpLastModified:modified, counts
    }), { status:200, headers: { "Content-Type":"application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Import failed" }), { status:500, headers: { "Content-Type":"application/json" } });
  }
});
