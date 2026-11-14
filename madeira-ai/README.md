# MADEIRA AI

An independent, responsive island platform for travellers, residents, property seekers and investors.

**Product name:** MADEIRA AI
**AI engine:** AI concierge  
**Creator credit:** Created by VALÉRIO

## Included in this first MVP

- Responsive desktop and mobile web app shell.
- MADEIRA AI archipelago-intelligence workspace covering all 10 Madeira municipalities and Porto Santo, backed by a central Supabase data model for sources, directory entries, needs and opportunities.
- Official-source register with provenance notes and verification statuses; public catalogue tables are read-only under Row Level Security.
- Russian, English and Portuguese interface labels.
- Explore section with Madeira points of interest and an OpenStreetMap embed.
- Real-estate area guide and a property due-diligence checklist.
- Travel, transport, weather and business-opportunity sections.
- Guest mode and Supabase email/password authentication.
- Saved places stored in Supabase for signed-in users (local browser storage in guest mode).
- Server-side AI concierge endpoint (`/api/concierge`) using an OpenAI API key stored only in Vercel environment variables.
- Live IPMA daily forecast endpoint (`/api/weather`) for Funchal and Porto Santo, plus official source directory (`/api/sources`).
- Official Madeira source links for IFCN trail status, Visit Madeira, PRIT municipal plans and IRIG geospatial data.
- Initial shared directory import: 208 records across all 11 municipalities: Porto Moniz (29), Machico (35), Calheta (31), Ponta do Sol (26), Câmara de Lobos (14), Ribeira Brava (10), Santa Cruz (11), Santana (4), São Vicente (8), Funchal (21) and Porto Santo (19) (17 municipal restaurant listings plus accommodation, transport, activity, retail and service leads), with verification status and source provenance.
- Archipelago source register covering municipal portals, municipal business directories, PRIT and DREM business/construction/housing statistics.
- Property and planning data model for municipal plans and public land opportunities, plus 40 official regional/municipal business and construction indicators.
- Private, authenticated community-needs submission workflow with consent and moderation; raw submissions are not public.
- Authenticated AI opportunity-analysis endpoint using official database evidence plus live web research, limited to 3 runs per user per hour.

## Run locally

1. Open this folder as the Vite project root.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and enter the Supabase project URL and publishable/anon key.
4. Apply these migrations in order: `202611130001_madeira_ai.sql`, `202611140002_meta_madeira_island_intelligence.sql`, `202611140003_meta_madeira_foreign_key_indexes.sql`, `202611140004_import_porto_moniz_directory.sql`, `202611140005_archipelago_sources.sql`, `202611140006_property_construction_data.sql`, `202611140007_private_need_submissions.sql`, `202611140008_ai_analysis_usage_limit.sql`, `202611140009_import_machico_directory.sql`, `202611140010_refine_official_indicators.sql`, `202611140011_archipelago_fk_indexes.sql`, `202611140012_import_calheta_ponta_do_sol_tourism.sql`, and `202611140013_import_calheta_ponta_pdm.sql`, `202611140014_expand_ponta_sol_calheta_tourism.sql`, and `202611140015_correct_directory_municipalities.sql`, `202611140016_import_ribeira_camara_santacruz_santana.sql`, `202611140017_import_porto_santo_tourism.sql`, and `202611140018_import_funchal_sao_vicente_tourism.sql`, and `202611140019_import_three_more_pdm_and_building_rules.sql`, `202611140020_import_machico_porto_santo_pdm.sql`, `202611140021_import_santa_cruz_santana_pdm.sql`, and `202611140022_import_funchal_pdm_procedure.sql`.
5. Start: `npm run dev`

Without Supabase environment values, the app runs in guest/demo mode. Cloud authentication and cloud saved places require the migration and environment values.

## Deploy to Vercel

Import the repository and set **Root Directory** to `madeira-ai`. Vercel will detect Vite; use `npm run build` and `dist` as the output directory. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, or the public Vercel variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The Vite config exposes only `VITE_` and `NEXT_PUBLIC_` variables to browser code; never expose service-role or secret keys. Add `OPENAI_API_KEY` as a server-only environment variable (do not prefix it with `VITE_`). Optionally set `OPENAI_MODEL` (default `gpt-4.1-mini`).

## Honest MVP boundaries

Preview currently contains 29 Porto Moniz directory records, 34 source records and 40 official aggregate business/construction/housing indicators. This is not a complete island-wide business census. No parcel-level buildability determinations or confirmed public land listings have been imported yet; planning and land tables are ready for verified records. Raw community submissions remain private until moderation. The AI concierge and opportunity analysis require `OPENAI_API_KEY` in the Vercel server environment. Never put an OpenAI secret key in browser code.

## Next implementation milestones

1. Expand the first-pass business and service catalogues in all 11 municipalities, starting with non-tourism sectors and underrepresented parishes.
2. Import current municipal PDM documents, land-bank offers and public property records for the remaining municipalities, with source dates and verification status.
3. Add municipality-level housing, construction and property indicators wherever DREM publishes them.
4. Review private resident/visitor submissions and publish only anonymised, evidence-backed needs.
5. Improve AI opportunity analysis as the evidence base grows, with explicit confidence and due-diligence steps.
6. Add booking/partner workflows and production mobile packaging.
