# VALÉRIO OS

VALÉRIO OS is a unified ecosystem for building the VALÉRIO direction as one premium AI-powered operating system instead of separate projects.

## Ecosystem pillars

1. **VALÉRIO AI Dashboard** — the central AI Command Center with AI Manager, six specialist agents, projects, tasks, files, activity feed, and quick actions.
2. **VALÉRIO Brand System** — logo, V monogram, colors, typography, brand rules, Brand Book, avatars, covers, and social templates.
3. **VALÉRIO DESIGN** — Instagram, Facebook, TikTok, Telegram, content system, and first publication pipeline.
4. **VALÉRIO Madeira** — premium Madeira app with map, routes, PR tracks, transport, weather, events, bookings, excursions, AI guide, translator, local recommendations, and offline mode.
5. **AI Agents VALÉRIO** — Design, Business, Content, Research, Developer, and Manager agents working under one AI Manager.
6. **Technical base** — interactive prototypes, application structure, frontend, API/AI integrations, GitHub workflow, and publication preparation.

## Product idea

The main idea is to connect brand, dashboard, agents, projects, and products into one luxury-tech ecosystem: **VALÉRIO OS**.

## VALÉRIO AI Dashboard development

The approved desktop direction is the premium graphite / gold VALÉRIO Command Center.

### Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local`.
Only the Supabase publishable key belongs in the browser. Never expose a service-role or secret key.

### Cloud data foundation

The Supabase project has dedicated `public.valerio_projects` and `public.valerio_tasks` tables. Both have row-level security enabled and owner-scoped policies for authenticated users. The frontend client is in `src/lib/supabase.js`.

### Current build scope

The dashboard UI includes responsive navigation, six specialist agent workspaces, project cards, task lists, activity, calendar, analytics, quick actions, and an AI Manager conversation surface. Live AI generation and complete authenticated CRUD wiring are follow-up implementation slices.


## AI Manager — Vercel AI Gateway

The dashboard's `/api/chat` serverless function streams responses from Vercel AI Gateway using the AI SDK. Requests require a valid Supabase session; the server validates the bearer token before sending prompts to the model. The model is configured with `AI_GATEWAY_MODEL` (currently `openai/gpt-5.4-mini`, selected from the live Gateway model catalog).

On Vercel, AI Gateway authentication uses the deployment's Vercel OIDC token. For local development outside Vercel, set `AI_GATEWAY_API_KEY` in the ignored `.env.local` file. Never put this secret in a `VITE_*` variable or commit it.

Run the Vite UI locally with `npm run dev`. To exercise the serverless endpoint locally, use Vercel's local development runtime so `/api/chat` is served as a function.
