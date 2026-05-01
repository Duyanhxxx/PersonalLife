# AI README

## Current Tech Stack
- Framework: Next.js 16 App Router with TypeScript
- Styling: Tailwind CSS v4, `shadcn/ui`, Radix-compatible Base UI primitives, Lucide Icons
- Backend: Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- State Management: Zustand
- Deployment Target: Vercel

## Database Schema
- Status: Phase 2 schema drafted in `supabase/migrations`
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
- Enums:
  - `document_kind`: `page`, `database`, `view`, `template`
  - `editor_kind`: `tiptap`, `novel`
- Triggers and functions:
  - `handle_new_user()` creates or syncs a `profiles` row from `auth.users`
  - `create_default_workspace_sections()` seeds system sections for each new user
  - `manage_document_hierarchy()` enforces same-user nesting, depth calculation, and archive timestamps
  - `set_updated_at()` updates `updated_at` automatically
- Security:
  - Row Level Security enabled on `profiles`, `workspace_sections`, and `documents`
  - Policies restrict read/write access to the authenticated owner

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

## Architecture Notes
- We are using App Router and keeping route files thin by moving reusable logic into `components`, `lib`, `hooks`, and `actions`
- Supabase access is split into browser and server helpers under `lib/supabase`
- File size discipline remains active: keep files under roughly 200-250 lines
- Product direction now supports both generic Notion pages and domain-specific sections like finance, calendar, tasks, habits, missions, and reading
- `documents.properties_schema` and `documents.properties_data` let us mimic lightweight Notion databases without creating many separate tables too early

## Next Steps
- Apply the SQL migrations in Supabase
- Phase 3: build authentication flows and the main app layout with a collapsible sidebar
- Start the sidebar around section-aware navigation so each workspace area can have its own top-level entry
