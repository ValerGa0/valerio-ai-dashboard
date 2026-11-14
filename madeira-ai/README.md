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
- Initial shared directory import: 29 Porto Moniz records (17 municipal restaurant listings plus accommodation, transport, activity, retail and service leads), with verification status and source provenance.
- Archipelago source register covering municipal portals, municipal business directories, PRIT and DREM business/construction/housing statistics.
- Property and planning data model for municipal plans and public land opportunities, plus 26 official regional/municipal business and construction indicators.
- Private, authenticated community-needs submission workflow with consent and moderation; raw submissions are not public.

## Run locally

1. Open this folder as the Vite project root.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and enter the Supabase project URL and publishable/anon key.
4. Apply the migrations in order: `202611130001_madeira_ai.sql`, `202611140002_meta_madeira_island_intelligence.sql`, `202611140003_meta_madeira_foreign_key_indexes.sql`, `202611140004_import_porto_moniz_directory.sql`, `202611140005_archipelago_sources.sql`, `202611140006_property_construction_data.sql`, and `202611140007_private_need_submissions.sql`.
5. Start: `npm run dev`

Without Supabase environment values, the app runs in guest/demo mode. Cloud authentication and cloud saved places require the migration and environment values.

## Deploy to Vercel

Import the repository and set **Root Directory** to `madeira-ai`. Vercel will detect Vite; use `npm run build` and `dist` as the output directory. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, or the public Vercel variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The Vite config exposes only `VITE_` and `NEXT_PUBLIC_` variables to browser code; never expose service-role or secret keys. Add `OPENAI_API_KEY` as a server-only environment variable (do not prefix it with `VITE_`). Optionally set `OPENAI_MODEL` (default `gpt-4.1-mini`).

## Honest MVP boundaries

This version now reads daily weather forecasts from the official IPMA open-data API and links to official trail and territorial-planning sources. It does not yet provide a complete island-wide business census, live property listings, verified booking inventory, trail-booking inventory, payments, or a continuously monitored investment feed. MADEIRA AI starts with the 11-municipality structure and official source register; directory coverage and needs/opportunities must be populated and validated municipality by municipality. The AI concierge requires `OPENAI_API_KEY` to be configured in the Vercel server environment. Never put an OpenAI secret key in browser code.

## Next implementation milestones

1. Connect the Supabase and Vercel accounts, apply the Supabase migration and verify cloud authentication and saved-place persistence.
2. Configure `OPENAI_API_KEY` in Vercel and test the server-side concierge.
3. Add verified property and business listings with source links and timestamps.
4. Add live trail-status ingestion and booking-provider integrations where permitted.
5. Populate and validate directory entries across all 11 municipalities; import official PDM/land-bank records and municipality-level construction statistics.
6. Review private community submissions, publish only anonymised validated needs, and connect the curated evidence to AI opportunity analysis.
6. Add booking/partner workflows and production mobile packaging.
