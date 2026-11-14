-- MADEIRA AI transit GTFS core schema. Applied to the isolated Preview project.
create schema if not exists private;
create table if not exists public.transit_feeds (
 id uuid primary key default gen_random_uuid(), source_url text not null, publisher_name text,
 publisher_url text, feed_version text not null, feed_start_date date not null, feed_end_date date not null,
 feed_timezone text not null default 'Europe/Lisbon', downloaded_at timestamptz not null default now(),
 http_last_modified timestamptz, license_status text not null default 'not_provided',
 data_status text not null default 'preview', unique(source_url,feed_version), check(feed_end_date>=feed_start_date)
);
create table if not exists public.transit_agencies (
 feed_id uuid not null references public.transit_feeds(id) on delete cascade, agency_id text not null,
 agency_name text not null, agency_url text, agency_timezone text not null default 'Europe/Lisbon',
 agency_lang text, agency_phone text, agency_email text, primary key(feed_id,agency_id)
);
create table if not exists public.transit_routes (
 feed_id uuid not null references public.transit_feeds(id) on delete cascade, route_id text not null,
 agency_id text, route_short_name text, route_long_name text, route_desc text, route_type integer not null,
 route_url text, route_color text, route_text_color text, primary key(feed_id,route_id),
 foreign key(feed_id,agency_id) references public.transit_agencies(feed_id,agency_id)
);
create table if not exists public.transit_stops (
 feed_id uuid not null references public.transit_feeds(id) on delete cascade, stop_id text not null,
 stop_code text, stop_name text not null, stop_desc text, stop_lat double precision not null,
 stop_lon double precision not null, location_type integer not null default 0, parent_station text,
 wheelchair_boarding integer, platform_code text, primary key(feed_id,stop_id),
 check(stop_lat between -90 and 90), check(stop_lon between -180 and 180)
);
create table if not exists public.transit_trips (
 feed_id uuid not null references public.transit_feeds(id) on delete cascade, trip_id text not null,
 route_id text not null, service_id text not null, trip_headsign text, trip_short_name text,
 direction_id integer, block_id text, shape_id text, wheelchair_accessible integer, bikes_allowed integer,
 primary key(feed_id,trip_id), foreign key(feed_id,route_id) references public.transit_routes(feed_id,route_id)
);
create table if not exists public.transit_service_dates (
 feed_id uuid not null references public.transit_feeds(id) on delete cascade, service_id text not null,
 service_date date not null, exception_type integer not null check(exception_type in (1,2)),
 primary key(feed_id,service_id,service_date)
);
create table if not exists public.transit_stop_times (
 feed_id uuid not null, trip_id text not null, stop_sequence integer not null, stop_id text not null,
 arrival_seconds integer not null, departure_seconds integer not null, stop_headsign text,
 pickup_type integer, drop_off_type integer, shape_dist_traveled double precision,
 primary key(feed_id,trip_id,stop_sequence),
 foreign key(feed_id,trip_id) references public.transit_trips(feed_id,trip_id) on delete cascade,
 foreign key(feed_id,stop_id) references public.transit_stops(feed_id,stop_id),
 check(stop_sequence>=0), check(arrival_seconds>=0 and departure_seconds>=0)
);
create index if not exists transit_stops_name_idx on public.transit_stops(feed_id,lower(stop_name));
create index if not exists transit_stops_coords_idx on public.transit_stops(feed_id,stop_lat,stop_lon);
create index if not exists transit_routes_short_name_idx on public.transit_routes(feed_id,route_short_name);
create index if not exists transit_trips_route_service_idx on public.transit_trips(feed_id,route_id,service_id);
create index if not exists transit_service_dates_date_idx on public.transit_service_dates(feed_id,service_date,service_id);
create index if not exists transit_stop_times_stop_departure_idx on public.transit_stop_times(feed_id,stop_id,departure_seconds);
create index if not exists transit_stop_times_trip_sequence_idx on public.transit_stop_times(feed_id,trip_id,stop_sequence);
alter table public.transit_feeds enable row level security;
alter table public.transit_agencies enable row level security;
alter table public.transit_routes enable row level security;
alter table public.transit_stops enable row level security;
alter table public.transit_trips enable row level security;
alter table public.transit_service_dates enable row level security;
alter table public.transit_stop_times enable row level security;
create policy "Preview transit feeds are readable" on public.transit_feeds for select to anon,authenticated using(data_status in ('preview','ready'));
create policy "Preview transit agencies are readable" on public.transit_agencies for select to anon,authenticated using(exists(select 1 from public.transit_feeds f where f.id=feed_id and f.data_status in ('preview','ready')));
create policy "Preview transit routes are readable" on public.transit_routes for select to anon,authenticated using(exists(select 1 from public.transit_feeds f where f.id=feed_id and f.data_status in ('preview','ready')));
create policy "Preview transit stops are readable" on public.transit_stops for select to anon,authenticated using(exists(select 1 from public.transit_feeds f where f.id=feed_id and f.data_status in ('preview','ready')));
create policy "Preview transit trips are readable" on public.transit_trips for select to anon,authenticated using(exists(select 1 from public.transit_feeds f where f.id=feed_id and f.data_status in ('preview','ready')));
create policy "Preview transit service dates are readable" on public.transit_service_dates for select to anon,authenticated using(exists(select 1 from public.transit_feeds f where f.id=feed_id and f.data_status in ('preview','ready')));
create policy "Preview transit stop times are readable" on public.transit_stop_times for select to anon,authenticated using(exists(select 1 from public.transit_feeds f where f.id=feed_id and f.data_status in ('preview','ready')));
revoke all privileges on public.transit_feeds,public.transit_agencies,public.transit_routes,public.transit_stops,public.transit_trips,public.transit_service_dates,public.transit_stop_times from public,anon,authenticated;
grant select on public.transit_feeds,public.transit_agencies,public.transit_routes,public.transit_stops,public.transit_trips,public.transit_service_dates,public.transit_stop_times to anon,authenticated;
grant select,insert,update,delete on public.transit_feeds,public.transit_agencies,public.transit_routes,public.transit_stops,public.transit_trips,public.transit_service_dates,public.transit_stop_times to service_role;

create or replace function public.transit_search_stops(p_query text,p_limit integer default 12)
returns table(stop_id text,stop_name text,stop_code text,stop_lat double precision,stop_lon double precision)
language sql stable set search_path=public,pg_temp as $$
 select s.stop_id,s.stop_name,s.stop_code,s.stop_lat,s.stop_lon from public.transit_stops s
 join public.transit_feeds f on f.id=s.feed_id and f.data_status in ('preview','ready')
 where coalesce(trim(p_query),'')<>'' and s.stop_name ilike '%'||trim(p_query)||'%'
 order by s.stop_name limit least(greatest(coalesce(p_limit,12),1),30);
$$;
create or replace function public.transit_nearby_stops(p_lat double precision,p_lon double precision,p_radius_km double precision default 1.5,p_limit integer default 8)
returns table(stop_id text,stop_name text,stop_code text,stop_lat double precision,stop_lon double precision,distance_km double precision)
language sql stable set search_path=public,pg_temp as $$
 select s.stop_id,s.stop_name,s.stop_code,s.stop_lat,s.stop_lon,
 sqrt(power((s.stop_lat-p_lat)*111.32,2)+power((s.stop_lon-p_lon)*111.32*cos(radians(p_lat)),2)) as distance_km
 from public.transit_stops s join public.transit_feeds f on f.id=s.feed_id and f.data_status in ('preview','ready')
 where p_lat between -90 and 90 and p_lon between -180 and 180
 and abs(s.stop_lat-p_lat)<=greatest(p_radius_km,0.1)/110.0
 and abs(s.stop_lon-p_lon)<=greatest(p_radius_km,0.1)/(110.0*greatest(abs(cos(radians(p_lat))),0.05))
 order by distance_km limit least(greatest(coalesce(p_limit,8),1),20);
$$;
create or replace function public.transit_next_departures(p_stop_id text,p_after_local timestamp without time zone,p_limit integer default 12)
returns table(departure_local timestamp without time zone,route_short_name text,route_long_name text,agency_name text,trip_headsign text,stop_name text,stop_code text)
language sql stable set search_path=public,pg_temp as $$
 with active as (select sd.feed_id,sd.service_id,sd.service_date from public.transit_service_dates sd
 join public.transit_feeds f on f.id=sd.feed_id and f.data_status in ('preview','ready')
 where sd.service_date in (p_after_local::date,p_after_local::date-1) and sd.exception_type=1)
 select a.service_date::timestamp+make_interval(secs=>st.departure_seconds),r.route_short_name,r.route_long_name,ag.agency_name,t.trip_headsign,s.stop_name,s.stop_code
 from active a join public.transit_trips t on t.feed_id=a.feed_id and t.service_id=a.service_id
 join public.transit_stop_times st on st.feed_id=t.feed_id and st.trip_id=t.trip_id
 join public.transit_routes r on r.feed_id=t.feed_id and r.route_id=t.route_id
 left join public.transit_agencies ag on ag.feed_id=r.feed_id and ag.agency_id=r.agency_id
 join public.transit_stops s on s.feed_id=st.feed_id and s.stop_id=st.stop_id
 where st.stop_id=p_stop_id and a.service_date::timestamp+make_interval(secs=>st.departure_seconds)>=p_after_local
 order by 1 limit least(greatest(coalesce(p_limit,12),1),50);
$$;
create or replace function public.transit_search_direct_routes(p_origin_stop_id text,p_destination_stop_id text,p_after_local timestamp without time zone,p_limit integer default 8)
returns table(departure_local timestamp without time zone,arrival_local timestamp without time zone,route_short_name text,route_long_name text,agency_name text,origin_name text,destination_name text)
language sql stable set search_path=public,pg_temp as $$
 with active as (select sd.feed_id,sd.service_id,sd.service_date from public.transit_service_dates sd
 join public.transit_feeds f on f.id=sd.feed_id and f.data_status in ('preview','ready')
 where sd.service_date in (p_after_local::date,p_after_local::date-1) and sd.exception_type=1)
 select a.service_date::timestamp+make_interval(secs=>o.departure_seconds),a.service_date::timestamp+make_interval(secs=>d.arrival_seconds),
 r.route_short_name,r.route_long_name,ag.agency_name,os.stop_name,ds.stop_name
 from active a join public.transit_trips t on t.feed_id=a.feed_id and t.service_id=a.service_id
 join public.transit_stop_times o on o.feed_id=t.feed_id and o.trip_id=t.trip_id and o.stop_id=p_origin_stop_id
 join public.transit_stop_times d on d.feed_id=t.feed_id and d.trip_id=t.trip_id and d.stop_id=p_destination_stop_id and d.stop_sequence>o.stop_sequence
 join public.transit_routes r on r.feed_id=t.feed_id and r.route_id=t.route_id
 left join public.transit_agencies ag on ag.feed_id=r.feed_id and ag.agency_id=r.agency_id
 join public.transit_stops os on os.feed_id=o.feed_id and os.stop_id=o.stop_id
 join public.transit_stops ds on ds.feed_id=d.feed_id and ds.stop_id=d.stop_id
 where a.service_date::timestamp+make_interval(secs=>o.departure_seconds)>=p_after_local
 order by 1 limit least(greatest(coalesce(p_limit,8),1),30);
$$;
grant execute on function public.transit_search_stops(text,integer) to anon,authenticated;
grant execute on function public.transit_nearby_stops(double precision,double precision,double precision,integer) to anon,authenticated;
grant execute on function public.transit_next_departures(text,timestamp without time zone,integer) to anon,authenticated;
grant execute on function public.transit_search_direct_routes(text,text,timestamp without time zone,integer) to anon,authenticated;
