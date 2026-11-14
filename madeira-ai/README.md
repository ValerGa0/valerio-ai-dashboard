# MADEIRA AI

An independent, responsive island platform for travellers, residents, property seekers, businesses and investors across Madeira and Porto Santo.

**Product name:** MADEIRA AI  
**AI engine:** AI concierge  
**Creator credit:** Created by VALÉRIO

## Included in this MVP

- Responsive desktop and mobile web app shell.
- Archipelago-intelligence workspace covering all 11 municipalities, backed by Supabase tables for sources, directory entries, needs, opportunities, planning documents and indicators.
- Official-source register with provenance notes and verification statuses; public catalogue tables are read-only under Row Level Security.
- Russian, English and Portuguese interface labels.
- Explore section with Madeira points of interest and an OpenStreetMap map.
- Real-estate area guide and a property due-diligence checklist.
- Travel, transport, weather and business-opportunity sections.
- Guest mode and Supabase email/password authentication.
- Saved places stored in Supabase for signed-in users (local browser storage in guest mode).
- Server-side AI concierge endpoint (`/api/concierge`) using an OpenAI API key stored only in Vercel environment variables.
- Live IPMA daily forecast endpoint (`/api/weather`) for Funchal and Porto Santo, plus official source directory (`/api/sources`).
- Planning register: 20 municipal planning/construction documents across all 11 municipalities, with status caveats.
- Official aggregate indicator set: 40 business, construction and housing indicators.
- Expanded shared directory: **254 active entries across all 11 municipalities**, including tourism, food, accommodation, construction, health, public services, utilities, transport, agriculture and business support.
- Healthcare additions include SESARAM hospital/health-centre references, urgent-care contacts for eight municipalities, Funchal Bom Jesus and the official pharmacy locator. Hospital entries were already present.
- Public-service additions include SIMplifica, ARM water/waste services, EEM electricity, IEM employment and citizen-facing services.
- Economy additions include Invest Madeira, IDE, Madeira Parques Empresariais, GESBA, CARAM, ACIF-CCIM and Startup Madeira, plus five company-sourced profiles: Bordal, Henriques & Henriques, Vinhos Barbeito, Madeira Wine Company and Blandy’s Wine Lodge.
- Transport additions include SIGA public transport operators, Porto Santo Line ferry and ANA airports in Madeira and Porto Santo. The interface links directly to SIGA route timetables and service alerts, the Porto Santo Line timetable, and ANA flight status. A TiiM-hosted Rede SIGA GTFS feed endpoint has been identified and exposed as a candidate source; automated ingestion and validation are not yet implemented.
- Private, authenticated community-needs submission workflow with consent and moderation; raw submissions are not public.
- Authenticated AI opportunity-analysis endpoint using official database evidence plus live web research, limited to 3 runs per user per hour.

## Directory data quality

The current Preview database contains 254 active directory entries across all 11 municipalities and 56 active source records. Entries marked `source_listed` are present in an official/operator source; this does not independently guarantee current opening status, service availability or contact accuracy. The new health, public-service, economy and transport additions are source-listed and require direct operational verification where applicable.

Transport timetables, ferry departures, airport operations, pharmacy duty rosters and health-centre service hours are dynamic. The GTFS feed endpoint shown in the UI is a candidate discovered through the MobilityData feed catalogue and must be validated against TiiM before automated ingestion or redistribution. The platform links to primary sources; do not treat static catalogue text as live availability. The pharmacy locator is linked as an official search service rather than pretending that a static list is a real-time pharmacy database.

The directory is not a complete island-wide business census. The 40 indicators are aggregate indicators, not parcel-level or company-level records. No parcel-level buildability determinations or confirmed public land listings have been imported yet. Raw community submissions remain private until moderation. The AI concierge and opportunity analysis require `OPENAI_API_KEY` in the Vercel server environment. Never put an OpenAI secret key in browser code.

## Run locally

1. Open this folder as the Vite project root.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and enter the Supabase project URL and publishable/anon key.
4. Apply the migrations in `supabase/migrations/` in numeric order, through `202611140025_import_madeira_local_businesses.sql`.
5. Start: `npm run dev`

Without Supabase environment values, the app runs in guest/demo mode. Cloud authentication and cloud saved places require the migration and environment values.

## Deploy to Vercel

Import the repository and set **Root Directory** to `madeira-ai`. Vercel will detect Vite; use `npm run build` and `dist` as the output directory. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, or the public Vercel variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The Vite config exposes only `VITE_` and `NEXT_PUBLIC_` variables to browser code; never expose service-role or secret keys. Add `OPENAI_API_KEY` as a server-only environment variable (do not prefix it with `VITE_`). Optionally set `OPENAI_MODEL` (default `gpt-4.1-mini`).

## Next implementation milestones

1. Expand healthcare coverage with individual clinic and pharmacy listings only where current official records can be imported.
2. Expand municipal and everyday services by parish, with coverage boundaries clearly stated.
3. Import official company and establishment datasets by sector and municipality; distinguish company statistics from live directory listings.
4. Add route, stop and timetable data from SIGA and live operator sources, plus ferry and flight status integrations where APIs permit.
5. Expand verified local enterprise listings by municipality and sector; company website records remain source-listed until operationally reconfirmed.\n6. Identify real public land-bank, auction and lease offers; never infer a listing from zoning plans.
7. Review private resident/visitor submissions and publish only anonymised, evidence-backed needs.
8. Improve AI opportunity analysis as the evidence base grows, with explicit confidence and due-diligence steps.
