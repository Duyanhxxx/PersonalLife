# AI README

## Current Tech Stack
- Framework: Next.js 16 App Router with TypeScript
- Styling: Tailwind CSS v4, `shadcn/ui`, Radix-compatible Base UI primitives, Lucide Icons
- Backend: Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- State Management: Zustand
- Deployment Target: Vercel

## Database Schema
- Status: Expanded through dashboard/section-specific entities in `supabase/migrations`
- Tables:
  - `profiles`
    - `id` -> `auth.users.id`
    - Stores user profile metadata, timezone, and default section
  - `workspace_sections`
    - `user_id` -> `profiles.id`
    - First-class workspace areas such as `notes`, `finance`, `calendar`, `tasks`, `habits`, `missions`, and `reading`
  - `documents`
    - `user_id` -> `profiles.id`
    - `section_id` -> `workspace_sections.id`
    - `parent_id` -> `documents.id` for infinite nesting
    - Stores editor content, page properties schema, page property values, metadata, ordering, and archive state
  - `planner_events`
    - Daily calendar events with date, optional start/end time, tone, and notes
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
  - `set_updated_at()` updates `updated_at` automatically
  - `seed_default_workspace_documents()` seeds starter section documents/templates
- Security:
  - Row Level Security enabled on `profiles`, `workspace_sections`, and `documents`
  - Policies restrict read/write access to the authenticated owner
  - Storage bucket `book-covers` added for public reading-cover display with authenticated upload/update/delete policies

## Folder Structure Overview
- `app/`: Route segments, layouts, and route-level UI only
- `components/ui/`: Shared `shadcn/ui` primitives
- `components/editor/`: Notion-style editor components
- `components/sidebar/`: Sidebar, navigation tree, and workspace controls
- `actions/`: Server Actions for document and workspace mutations
- `hooks/`: Client hooks for auth, documents, and UI state
- `lib/`: Utilities and Supabase client helpers
- `types/`: Shared TypeScript types
- `supabase/migrations/`: Versioned SQL schema files for Supabase

## Completed Features
- Phase 1 project scaffold created with Next.js, TypeScript, Tailwind CSS, and App Router
- `shadcn/ui` initialized with `components.json`
- Supabase dependencies installed and initial client/server helpers added
- Base modular folder structure created to enforce small, focused files
- Environment variable template planned via `.env.example`
- Phase 2 database schema drafted with profiles, workspace sections, documents, RLS policies, and default section seeding
- Phase 3 authentication flow added with email/password, Google, GitHub, and Supabase callback handling
- Protected workspace layout added with a collapsible, section-aware sidebar shell
- Root route now redirects signed-in users to `/app` and guests to `/login`
- Phase 4 document data layer added with section-aware Supabase fetch helpers and recursive tree shaping
- Sidebar now renders real nested documents, supports creating root and child pages, and links active documents into the workspace view
- Archive and restore document flows added, alongside a smoother workspace surface and the new green-blue palette inspired by the provided reference
- Starter workspace templates now seed into sections for schedule, task bank, workout system, finance, missions, and reading
- Section CRUD added for custom sections, with protected system sections and safe document fallback on delete
- Workspace detail panel now understands template-style metadata and renders richer previews for schedules, tasks, and workouts
- Dashboard now summarizes today’s schedule, tasks, finance totals, active missions, and reading queue
- Calendar section now renders a real month grid with event CRUD
- Finance section now renders a month grid for daily income/expense tracking with CRUD
- To-do section now focuses on daily tasks with colored urgency categories and done/delete actions
- Mission section now supports daily progress logging with progress bars and CRUD
- Reading section now uses Trello-style status lanes and supports book cover upload via Supabase Storage
- Auth UX improved with password visibility icons and signup password confirmation

## Architecture Notes
- We are using App Router and keeping route files thin by moving reusable logic into `components`, `lib`, `hooks`, and `actions`
- Supabase access is split into browser and server helpers under `lib/supabase`
- File size discipline remains active: keep files under roughly 200-250 lines
- Product direction now supports both generic Notion pages and domain-specific sections like finance, calendar, tasks, habits, missions, and reading
- `documents.properties_schema` and `documents.properties_data` let us mimic lightweight Notion databases without creating many separate tables too early
- Auth is handled with Supabase SSR helpers, proxy-based session refresh, server actions for login/signup/logout, and an OAuth callback route
- The workspace shell is split into reusable sidebar/auth components to keep layouts thin
- Document tree shaping happens in `lib/workspace/documents.ts`, while `actions/documents.ts` owns create, rename, archive, and restore mutations
- `actions/sections.ts` owns custom section create, rename, and delete flows
- Workspace visuals now use a palette centered on `#05386B`, `#379683`, `#5CDB95`, `#8EE4AF`, and `#EDF5E1`
- Seeded section templates are stored in `documents.metadata`, which lets us render structured previews before the rich editor lands
- Section-specific operational data now lives in dedicated tables instead of being forced into `documents.metadata`
- `/app` now behaves as a dashboard-first workspace shell while still keeping the document system available for notes/templates

## Next Steps
- Apply the SQL migrations in Supabase
- Set the Vercel environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL`
- Phase 5: integrate the rich text editor into the active document view
- Add realtime and optimistic updates so the sidebar tree reacts instantly to mutations
- Add edit flows for planner/finance/tasks/reading cards beyond create/delete/status toggles
