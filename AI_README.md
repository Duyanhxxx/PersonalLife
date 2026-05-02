# AI README

## Current Tech Stack
- Framework: Next.js 16 App Router with TypeScript
- Styling: Tailwind CSS v4, `shadcn/ui`, Radix-compatible Base UI primitives, Lucide Icons
- Backend: Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- State Management: Zustand
- Deployment Target: Vercel

## Database Schema
- Status: Fully expanded with all section-specific tables and habits support
- Tables:
  - `profiles`
    - `id` -> `auth.users.id`
    - Stores user profile metadata, timezone, and default section
  - `workspace_sections`
    - `user_id` -> `profiles.id`
    - First-class workspace areas: `notes`, `finance`, `calendar`, `tasks`, `habits`, `missions`, `reading`
  - `documents`
    - `user_id` -> `profiles.id`
    - `section_id` -> `workspace_sections.id`
    - `parent_id` -> `documents.id` for infinite nesting
    - Stores editor content, page properties schema, page property values, metadata, ordering, and archive state
  - `planner_events`
    - Daily calendar events with date, optional start/end time (`time without time zone`), tone, and notes
  - `finance_entries`
    - Daily income/expense records with amount and category
  - `todo_items`
    - Daily tasks with priority, color, and completion state
  - `missions`
    - Goal definitions with target and current progress values
  - `mission_entries`
    - Daily mission check-ins and progress deltas
  - `reading_books`
    - Reading cards with title, author, cover image, and status lane
  - `habits`
    - Habit definitions with title and color
  - `habit_logs`
    - Daily habit completion records; unique constraint on `(habit_id, log_date)`
- Enums:
  - `document_kind`: `page`, `database`, `view`, `template`
  - `editor_kind`: `tiptap`, `novel`
  - `finance_entry_type`: `income`, `expense`
  - `todo_priority`: `urgent`, `important`, `normal`, `low`
  - `book_status`: `to_read`, `reading`, `finished`
- Triggers and functions:
  - `handle_new_user()` creates or syncs a `profiles` row from `auth.users`
  - `create_default_workspace_sections()` seeds system sections for each new user
  - `manage_document_hierarchy()` enforces same-user nesting, depth calculation, and archive timestamps
  - `set_updated_at()` updates `updated_at` automatically on all relevant tables including `habits`
  - `seed_default_workspace_documents()` seeds starter section documents/templates
- Security:
  - Row Level Security enabled on all tables
  - Policies restrict read/write access to the authenticated owner
  - Storage bucket `book-covers` for public reading-cover display with authenticated upload/update/delete policies

## Routing Structure
- `/` — Root redirect: authenticated → `/app`, guest → `/login`
- `/login` — Email/password + OAuth login
- `/signup` — Email/password + OAuth signup
- `/auth/callback` — Supabase OAuth callback handler
- `/app` — **Home / Dashboard only** (`TodayDashboard` + section quick-nav cards)
- `/app/[section]` — **Dynamic section page** (each section gets its own route)
  - `/app/calendar?month=YYYY-MM` — Calendar with planner events
  - `/app/finance?month=YYYY-MM` — Finance with income/expense grid
  - `/app/tasks` — To-do section with daily tasks
  - `/app/missions` — Mission section with progress tracking
  - `/app/reading` — Reading section with Trello-style lanes
  - `/app/habits` — Habits section with daily check-off
  - `/app/notes` — Notes/Documents with document panel + archive sidebar
  - `/app/[custom-slug]` — Any user-created custom section → falls back to DocumentPanel
- `/app/settings` — Settings & Studio (section CRUD: create, rename, delete)

## Navigation System
- The sidebar uses `usePathname()` to determine the active section (NOT `useSearchParams`)
- Section links point to `/app/[section]` routes
- The `SectionNav` component also includes a top-level "Dashboard" link pointing to `/app`
- Month navigation (calendar/finance) appends `?month=YYYY-MM` to the section route
- The `TodayDashboard` **only appears on `/app` (home)**; it never appears on section pages

## Folder Structure Overview
- `app/`: Route segments, layouts, and route-level UI only
  - `app/(workspace)/app/page.tsx` — Home dashboard
  - `app/(workspace)/app/[section]/page.tsx` — Dynamic section page
  - `app/(workspace)/app/settings/page.tsx` — Settings & Studio
- `components/ui/`: Shared `shadcn/ui` primitives
- `components/editor/`: Notion-style editor components
- `components/sidebar/`: Sidebar, navigation tree, and workspace controls
- `components/workspace/`: All section components
- `actions/`: Server Actions for all mutations
- `hooks/`: Client hooks for auth, documents, and UI state
- `lib/`: Utilities and Supabase client helpers
  - `lib/date.ts` — `todayIso()` uses `Asia/Ho_Chi_Minh` timezone via `Intl.DateTimeFormat`
- `types/`: Shared TypeScript types
- `supabase/migrations/`: Versioned SQL schema files

## Completed Features
- Phase 1 project scaffold: Next.js, TypeScript, Tailwind CSS v4, App Router
- `shadcn/ui` initialized with `components.json`
- Supabase dependencies installed with browser/server client helpers
- Base modular folder structure enforcing small, focused files
- Phase 2 database schema: profiles, workspace sections, documents, RLS policies, default section seeding
- Phase 3 authentication: email/password, Google, GitHub OAuth, Supabase SSR callback
- Protected workspace layout with collapsible, section-aware sidebar
- Root route redirects: signed-in → `/app`, guest → `/login`
- Phase 4 document data layer: section-aware fetch helpers, recursive tree shaping
- Sidebar renders real nested documents, supports creating root/child pages
- Archive and restore document flows
- Starter workspace templates seeded into sections
- Section CRUD: create, rename, delete (system sections protected)
- Workspace detail panel with template metadata previews
- **Calendar** section: real month grid with event CRUD, Prev/Next month navigation
- **Finance** section: month grid with income/expense tracking, month summary, CRUD
- **To-do** section: daily tasks with colored priority tags (fixed inline-block overlap), done toggle, delete
- **Missions** section: create missions, log daily progress, progress bars, delete
- **Reading** section: Trello-style status lanes (To read / Reading / Finished), book cover upload via Supabase Storage
- **Habits** section: create habits, daily check-off toggle, color-coded, delete — with `habit_logs` table and RLS
- Auth UX: password visibility icons, signup password confirmation
- **Settings & Studio page** (`/app/settings`): section CRUD moved off the main workspace
- **Route-based navigation**: each section is its own `/app/[section]` route; sidebar uses `usePathname()`
- **Dashboard home** (`/app`): `TodayDashboard` + section quick-nav cards only; no section content mixed in
- Timezone fix: `todayIso()` and SQL seeds use `Asia/Ho_Chi_Minh` (UTC+7) for correct Vietnamese local date
- `SectionHeader`: doc-creation buttons hidden for data sections (calendar, finance, tasks, missions, reading, habits)
- Archive panel: only shown on document sections (notes, custom), not on data sections

## Architecture Notes
- App Router with thin route files; logic lives in `components`, `lib`, `hooks`, `actions`
- Supabase access split into browser (`lib/supabase/client.ts`) and server (`lib/supabase/server.ts`) helpers
- File size discipline: keep files under 200-250 lines
- Domain-specific sections use dedicated tables; notes/custom sections use `documents` + `documents.metadata`
- Auth: Supabase SSR helpers, proxy-based session refresh, server actions for login/signup/logout, OAuth callback
- Workspace shell splits sidebar/auth into reusable components
- Document tree shaping: `lib/workspace/documents.ts`; mutations: `actions/documents.ts`
- Section mutations: `actions/sections.ts`
- Workspace palette: `#05386B`, `#379683`, `#5CDB95`, `#8EE4AF`, `#EDF5E1`
- `SectionNav` uses `usePathname()` — active section = `pathname.split("/")[2]`
- `AppSidebar` also uses `usePathname()` for the document tree's active section
- `sectionThemes` keys on `SystemSectionSlug`; falls back to `notes` theme for custom sections
- `todayIso()` uses `Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" })` — not `new Date()` (UTC)
- SQL planner event seeds use `(now() at time zone 'Asia/Ho_Chi_Minh')::date` for VN-correct seeding
- `start_time` / `end_time` in `planner_events` are `time without time zone`; seed casts text with `::time`

## What Still Needs Work
- **Rich text editor**: `DocumentPanel` shows a placeholder; TipTap or Novel not yet connected
- **Search**: UI exists in sidebar but has no handler or query
- **Mobile sidebar**: Sidebar is `hidden md:flex`; no mobile hamburger drawer
- **Edit flows**: Calendar/Finance/Tasks/Missions/Reading/Habits support create & delete but no inline edit
- **Realtime updates**: All data is server-fetched; no Supabase realtime subscriptions or optimistic UI
- **Habit streak display**: `habit_logs` table exists but streak computation not yet surfaced in UI

## Next Steps
- Apply the SQL migrations in Supabase (including new `20260502000000_habits.sql`)
- Set Vercel environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`
- Phase 5: integrate the rich text editor (TipTap/Novel) into the document panel
- Add edit flows for planner events, finance entries, todo items, missions, reading books, habits
- Add mobile sidebar drawer (sheet component from shadcn/ui)
- Implement workspace search with Supabase full-text search
- Add realtime subscriptions for instant sidebar tree updates
