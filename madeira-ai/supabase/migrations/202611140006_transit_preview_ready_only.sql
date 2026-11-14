-- Keep incomplete imports private. Public route search sees only a fully imported feed.
drop policy if exists "Preview transit feeds are readable" on public.transit_feeds;
create policy "Ready transit feeds are readable" on public.transit_feeds for select to anon,authenticated using(data_status='ready');
drop policy if exists "Preview transit agencies are readable" on public.transit_agencies;
create policy "Ready transit agencies are readable" on public.transit_agencies for select to anon,authenticated using(exists(select 1 from public.transit_feeds f where f.id=feed_id and f.data_status='ready'));
drop policy if exists "Preview transit routes are readable" on public.transit_routes;
create policy "Ready transit routes are readable" on public.transit_routes for select to anon,authenticated using(exists(select 1 from public.transit_feeds f where f.id=feed_id and f.data_status='ready'));
drop policy if exists "Preview transit stops are readable" on public.transit_stops;
create policy "Ready transit stops are readable" on public.transit_stops for select to anon,authenticated using(exists(select 1 from public.transit_feeds f where f.id=feed_id and f.data_status='ready'));
drop policy if exists "Preview transit trips are readable" on public.transit_trips;
create policy "Ready transit trips are readable" on public.transit_trips for select to anon,authenticated using(exists(select 1 from public.transit_feeds f where f.id=feed_id and f.data_status='ready'));
drop policy if exists "Preview transit service dates are readable" on public.transit_service_dates;
create policy "Ready transit service dates are readable" on public.transit_service_dates for select to anon,authenticated using(exists(select 1 from public.transit_feeds f where f.id=feed_id and f.data_status='ready'));
drop policy if exists "Preview transit stop times are readable" on public.transit_stop_times;
create policy "Ready transit stop times are readable" on public.transit_stop_times for select to anon,authenticated using(exists(select 1 from public.transit_feeds f where f.id=feed_id and f.data_status='ready'));

create or replace function public.transit_search_stops(p_query text,p_limit integer default 12)
returns table(stop_id text,stop_name text,stop_code text,stop_lat double precision,stop_lon double precision)
language sql stable set search_path=public,pg_temp as $$
 select s.stop_id,s.stop_name,s.stop_code,s.stop_lat,s.stop_lon from public.transit_stops s
 join public.transit_feeds f on f.id=s.feed_id and f.data_status='ready'
 where coalesce(trim(p_query),'')<>'' and s.stop_name ilike '%'||trim(p_query)||'%'
 order by s.stop_name limit least(greatest(coalesce(p_limit,12),1),30);
$$;
create or replace function public.transit_nearby_stops(p_lat double precision,p_lon double precision,p_radius_km double precision default 1.5,p_limit integer default 8)
returns table(stop_id text,stop_name text,stop_code text,stop_lat double precision,stop_lon double precision,distance_km double precision)
language sql stable set search_path=public,pg_temp as $$
 select s.stop_id,s.stop_name,s.stop_code,s.stop_lat,s.stop_lon,
 sqrt(power((s.stop_lat-p_lat)*111.32,2)+power((s.stop_lon-p_lon)*111.32*cos(radians(p_lat)),2)) as distance_km
 from public.transit_stops s join public.transit_feeds f on f.id=s.feed_id and f.data_status='ready'
 where p_lat between -90 and 90 and p_lon between -180 and 180
 and abs(s.stop_lat-p_lat)<=greatest(p_radius_km,0.1)/110.0
 and abs(s.stop_lon-p_lon)<=greatest(p_radius_km,0.1)/(110.0*greatest(abs(cos(radians(p_lat))),0.05))
 order by distance_km limit least(greatest(coalesce(p_limit,8),1),20);
$$;
create or replace function public.transit_next_departures(p_stop_id text,p_after_local timestamp without time zone,p_limit integer default 12)
returns table(departure_local timestamp without time zone,route_short_name text,route_long_name text,agency_name text,trip_headsign text,stop_name text,stop_code text)
language sql stable set search_path=public,pg_temp as $$
 with active as (select sd.feed_id,sd.service_id,sd.service_date from public.transit_service_dates sd
 join public.transit_feeds f on f.id=sd.feed_id and f.data_status='ready'
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
 join public.transit_feeds f on f.id=sd.feed_id and f.data_status='ready'
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
