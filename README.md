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


## VALÉRIO AI Dashboard — cloud workspace setup

The Projects and Tasks modules use Supabase (PostgreSQL + Supabase Auth). The browser app uses only the Supabase publishable/anon key; never expose a `service_role` key in frontend code.

### Setup

1. Create a Supabase project.
2. In the Supabase SQL Editor, run `supabase/migrations/202611130001_projects_tasks.sql`.
3. Copy `.env.example` to `.env.local`.
4. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` using the project's API settings.
5. Run `npm install` and `npm run dev`.

Create an account in the app, or sign in with an existing Supabase Auth account. A new account receives the current VALÉRIO roadmap as a one-time starter workspace. Projects and tasks are then stored in the cloud and scoped to the signed-in user through Row Level Security (RLS).

### Current implementation scope

- Supabase email/password authentication.
- Cloud CRUD for projects and tasks.
- Per-user RLS policies and project/task ownership constraints.
- One-time starter workspace initialization.
- AI Manager integration, file storage, calendar, and activity persistence are not part of this first milestone.
