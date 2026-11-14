import "dotenv/config";
import { resolve } from "node:path";
import { readFile } from "node:fs/promises";
import { config } from "dotenv";
import JSZip from "jszip";
import { parse as parseStream } from "csv-parse";
import { parse as parseSync } from "csv-parse/sync";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local"), override: false });

const FEED_URL = "https://gtfs.tiim.pt/rede-siga/rede-siga-gtfs.zip";
const SOURCE_PUBLISHER_URL = "https://siga.madeira.gov.pt/";
const dryRun = process.argv.includes("--dry-run");
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function requiredFile(zip, name) {
  const file = zip.file(name);
  if (!file) throw new Error(`Required GTFS file missing: ${name}`);
  return file;
}
function gtfsDate(value) {
  if (!/^\d{8}$/.test(value || "")) throw new Error("Invalid GTFS date in feed_info/calendar_dates");
  return `${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6,8)}`;
}
function gtfsSeconds(value) {
  const match = /^(\d{1,3}):(\d{2}):(\d{2})$/.exec(value || "");
  if (!match) throw new Error(`Invalid GTFS time: ${value}`);
  return Number(match[1])*3600+Number(match[2])*60+Number(match[3]);
}
async function countFile(zip, name) {
  let count=0;
  const parser=requiredFile(zip,name).nodeStream().pipe(parseStream({columns:true,bom:true,skip_empty_lines:true}));
  for await (const _row of parser) count++;
  return count;
}
async function importFile(db, zip, fileName, table, feedId, transform, conflict, batchSize=1500) {
  const parser=requiredFile(zip,fileName).nodeStream().pipe(parseStream({columns:true,bom:true,skip_empty_lines:true}));
  let batch=[],count=0;
  for await (const raw of parser) {
    batch.push({feed_id:feedId,...transform(raw)});
    if(batch.length>=batchSize) {
      const {error}=await db.from(table).upsert(batch,{onConflict:conflict});
      if(error)throw new Error(`Import ${table} failed: ${error.message}`);
      count+=batch.length;batch=[];
    }
  }
  if(batch.length) {
    const {error}=await db.from(table).upsert(batch,{onConflict:conflict});
    if(error)throw new Error(`Import ${table} failed: ${error.message}`);
    count+=batch.length;
  }
  console.log(`  ${table}: ${count.toLocaleString("en-US")} rows`);
  return count;
}

async function main() {
  if(!dryRun && (!supabaseUrl || !serviceKey)) {
    throw new Error("Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in madeira-ai/.env.local. Never paste the secret key into chat.");
  }
  if(!dryRun && !supabaseUrl.includes("naapknymotgauzgqurfy.supabase.co")) {
    throw new Error("Safety stop: GTFS importer writes only to the isolated Supabase Preview project (naapknymotgauzgqurfy). Production is not permitted.");
  }
  console.log("Downloading Rede SIGA GTFS feed…");
  const localArchive=process.env.GTFS_ARCHIVE_PATH;
  const response=localArchive?null:await fetch(FEED_URL,{headers:{"User-Agent":"MADEIRA-AI-GTFS-import/1.0"}});
  if(response&&!response.ok)throw new Error(`GTFS download failed: HTTP ${response.status}`);
  const archive=localArchive?await readFile(resolve(process.cwd(),localArchive)):Buffer.from(await response.arrayBuffer());
  console.log(`  ZIP size: ${(archive.length/1024/1024).toFixed(1)} MB`);
  const zip=await JSZip.loadAsync(archive);
  for(const name of ["agency.txt","routes.txt","stops.txt","trips.txt","stop_times.txt","calendar_dates.txt","feed_info.txt"])requiredFile(zip,name);
  const feedInfo=parseSync(await requiredFile(zip,"feed_info.txt").async("string"),{columns:true,bom:true,skip_empty_lines:true})[0];
  if(!feedInfo)throw new Error("feed_info.txt is empty");
  const startDate=gtfsDate(feedInfo.feed_start_date);
  const endDate=gtfsDate(feedInfo.feed_end_date);
  const today=new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Lisbon",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
  if(endDate<today)throw new Error(`GTFS feed expired on ${endDate}; refusing to publish stale schedules`);
  const counts={};
  for(const name of ["agency.txt","routes.txt","stops.txt","trips.txt","calendar_dates.txt","stop_times.txt"]) {
    counts[name]=await countFile(zip,name);
  }
  console.log("Feed:",feedInfo.feed_publisher_name,"version",feedInfo.feed_version,"valid",startDate,"to",endDate);
  console.log("Archive contains licence file:",Boolean(zip.file("license.txt")));
  console.log("Rows:",counts);
  if(dryRun){console.log("Dry run complete. No database changes made.");return;}
  const db=createClient(supabaseUrl,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
  const modified=response?.headers.get("last-modified")||null;
  const {data:feed,error:feedError}=await db.from("transit_feeds").upsert({
    source_url:FEED_URL,publisher_name:feedInfo.feed_publisher_name||"Rede SIGA",
    publisher_url:feedInfo.feed_publisher_url||SOURCE_PUBLISHER_URL,
    feed_version:feedInfo.feed_version||modified||"unknown",
    feed_start_date:startDate,feed_end_date:endDate,feed_timezone:"Europe/Lisbon",
    http_last_modified:modified?new Date(modified).toISOString():null,
    license_status:zip.file("license.txt")?"provided":"not_provided",data_status:"preview"
  },{onConflict:"source_url,feed_version"}).select("id").single();
  if(feedError||!feed)throw new Error(`Could not create feed record: ${feedError?.message||"unknown error"}`);
  const id=feed.id;
  console.log("Importing feed",id,"in batches…");
  await importFile(db,zip,"agency.txt","transit_agencies",id,r=>({
    agency_id:r.agency_id,agency_name:r.agency_name,agency_url:r.agency_url||null,
    agency_timezone:r.agency_timezone||"Europe/Lisbon",agency_lang:r.agency_lang||null,
    agency_phone:r.agency_phone||null,agency_email:r.agency_email||null
  }),"feed_id,agency_id",500);
  await importFile(db,zip,"routes.txt","transit_routes",id,r=>({
    route_id:r.route_id,agency_id:r.agency_id||null,route_short_name:r.route_short_name||null,
    route_long_name:r.route_long_name||null,route_desc:r.route_desc||null,route_type:Number(r.route_type),
    route_url:r.route_url||null,route_color:r.route_color||null,route_text_color:r.route_text_color||null
  }),"feed_id,route_id",1000);
  await importFile(db,zip,"stops.txt","transit_stops",id,r=>({
    stop_id:r.stop_id,stop_code:r.stop_code||null,stop_name:r.stop_name,stop_desc:r.stop_desc||null,
    stop_lat:Number(r.stop_lat),stop_lon:Number(r.stop_lon),location_type:Number(r.location_type||0),
    parent_station:r.parent_station||null,wheelchair_boarding:r.wheelchair_boarding?Number(r.wheelchair_boarding):null,
    platform_code:r.platform_code||null
  }),"feed_id,stop_id",1000);
  await importFile(db,zip,"trips.txt","transit_trips",id,r=>({
    trip_id:r.trip_id,route_id:r.route_id,service_id:r.service_id,trip_headsign:r.trip_headsign||null,
    trip_short_name:r.trip_short_name||null,direction_id:r.direction_id?Number(r.direction_id):null,
    block_id:r.block_id||null,shape_id:r.shape_id||null,
    wheelchair_accessible:r.wheelchair_accessible?Number(r.wheelchair_accessible):null,
    bikes_allowed:r.bikes_allowed?Number(r.bikes_allowed):null
  }),"feed_id,trip_id",1000);
  await importFile(db,zip,"calendar_dates.txt","transit_service_dates",id,r=>({
    service_id:r.service_id,service_date:gtfsDate(r.date),exception_type:Number(r.exception_type)
  }),"feed_id,service_id,service_date",500);
  await importFile(db,zip,"stop_times.txt","transit_stop_times",id,r=>({
    trip_id:r.trip_id,stop_sequence:Number(r.stop_sequence),stop_id:r.stop_id,
    arrival_seconds:gtfsSeconds(r.arrival_time),departure_seconds:gtfsSeconds(r.departure_time),
    stop_headsign:r.stop_headsign||null,pickup_type:r.pickup_type?Number(r.pickup_type):null,
    drop_off_type:r.drop_off_type?Number(r.drop_off_type):null,
    shape_dist_traveled:r.shape_dist_traveled?Number(r.shape_dist_traveled):null
  }),"feed_id,trip_id,stop_sequence",1500);
  const {error:readyError}=await db.from("transit_feeds").update({data_status:"ready"}).eq("id",id);
  if(readyError)throw new Error(`Import completed but feed could not be marked ready: ${readyError.message}`);
  console.log("GTFS import complete. Feed is ready for Preview route search.");
}
main().catch(error=>{console.error("GTFS import failed:",error.message||error);process.exitCode=1;});
