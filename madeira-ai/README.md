# MADEIRA AI

An independent, responsive island platform for travellers, residents, property seekers and investors.

**Product name:** MADEIRA AI  
**Creator credit:** Created by VALÉRIO

## Included in this first MVP

- Responsive desktop and mobile web app shell.
- Russian, English and Portuguese interface labels.
- Explore section with Madeira points of interest and an OpenStreetMap embed.
- Real-estate area guide and a property due-diligence checklist.
- Travel, transport, weather and business-opportunity sections.
- Guest mode and Supabase email/password authentication.
- Saved places stored in Supabase for signed-in users (local browser storage in guest mode).
- AI concierge preview with clearly labelled sample responses.

## Run locally

1. Open this folder as the Vite project root.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and enter the Supabase project URL and publishable/anon key.
4. Apply `supabase/migrations/202611130001_madeira_ai.sql` in the Supabase SQL Editor.
5. Start: `npm run dev`

Without Supabase environment values, the app runs in guest/demo mode. Cloud authentication and cloud saved places require the migration and environment values.

## Deploy to Vercel

Import the repository and set **Root Directory** to `madeira-ai`. Vercel will detect Vite; use `npm run build` and `dist` as the output directory. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables.

## Honest MVP boundaries

This first version does not yet provide live property listings, verified booking inventory, live weather data, payments, route status feeds, or a connected LLM. It labels sample opportunity ideas and concierge responses as previews. Those integrations require approved data providers, source verification and an AI server-side endpoint; never put an OpenAI secret key in browser code.

## Next implementation milestones

1. Apply the Supabase migration and verify sign-up, sign-in and saved-place persistence.
2. Connect authoritative Madeira tourism, municipal planning, weather and trail-status sources.
3. Add verified property and business listings with source links and timestamps.
4. Connect the AI concierge through a secure server-side API.
5. Add booking/partner workflows and production mobile packaging.
