# AI README

## Current Tech Stack
- Framework: Next.js 16 App Router with TypeScript
- Styling: Tailwind CSS v4, `shadcn/ui`, Radix-compatible Base UI primitives, Lucide Icons
- Backend: Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- State Management: Zustand
- i18n: Custom Dictionary System (EN/VI support)
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
    - Daily calendar events with date range, optional start/end time (`time without time zone`), tone, context layer (`work`, `personal`, `health`, `study`), and notes
  - `finance_entries`
    - Daily income/expense records with amount, category, and optional `wallet_id`
  - `finance_wallets`
    - Budget envelopes / sinking funds for projects, trips, or campaigns with budget targets and date windows
  - `finance_commitments`
    - Upcoming scheduled income/expense items used for end-of-month cashflow projection
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
  - `daily_workspace_bootstraps`
    - One-time per-user/per-day bootstrap record so seeded daily planner/task templates are not re-created after manual deletion
  - `inspiration_quotes`
    - Global or user-owned quote library for the homepage inspiration hero
- Security: Row Level Security (RLS) enabled on all tables; storage bucket policies for avatars and book covers.

## Folder Structure Overview
- `app`
  - App Router routes, layouts, auth pages, workspace pages, and route handlers only
- `actions`
  - Server Actions for auth, documents, sections, planner, finance, habits, missions, and reading CRUD
- `components/ui`
  - Shared `shadcn/ui` primitives and low-level reusable interface pieces
- `components/sidebar`
  - Sidebar shell, search, mobile drawer, section navigation, and recursive document tree
- `components/workspace`
  - Dashboard cards, section views, calendar/finance/todo/mission/reading UIs, and responsive mobile toggles
- `components/editor`
  - TipTap editor integration and document editing surfaces
- `lib`
  - Supabase clients, i18n, workspace data loaders, daily bootstrap, helpers, and theme utilities
- `hooks`
  - Reusable client hooks for stateful UI behaviors
- `types`
  - Shared TypeScript domain models for documents and workspace entities
- `supabase/migrations`
  - Full schema, RLS, storage, and seed migrations

## Completed Features (Latest Updates)
- **Calendar Upgrade**: Calendar now supports context filters, multi-day timeline bars, and week/day time-blocking views in addition to the month grid.
- **Finance Upgrade**: Finance now includes project wallets, upcoming cashflow commitments, end-of-month projection, and a category mix visualization.
- **Homepage Cleanup**: The explicit `Image source: Live Unsplash` label was removed from the homepage while keeping the dynamic background system intact.
- **Focus Mode Stabilization**: Simplified the fullscreen deep-work overlay to avoid the heavier blur/render path that could destabilize some macOS browsers.
- **Unsplash Runtime Compatibility**: Inspiration backgrounds now support both `UNSPLASH_ACCESS_KEY` and `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`, and the hero visibly labels whether the current image came from live Unsplash or the fallback set.
- **Daily Inspiration Homepage**: `/app` now opens with a quote-driven hero and rotating nature background, with optional Unsplash API support via `UNSPLASH_ACCESS_KEY`.
- **Focus / Deep Work Mode**: Added a fullscreen focus experience with a Pomodoro timer, nature background, and a single highlighted task.
- **Deletion Bug Fix for Seeded Daily Items**: Default planner events and starter tasks are now seeded only once per day, so deleting completed tasks or upcoming events no longer causes them to reappear.
- **Realtime Workspace Refresh**: Dashboard and data sections now subscribe to Supabase Postgres changes and auto-refresh when planner, finance, tasks, missions, reading, or habits data changes.
- **Mobile Task/Mission/Reading UX Pass**: Added dedicated mobile toggles and compact views for `to-do`, `missions`, and `reading` so phone usage is no longer just compressed desktop cards.
- **Tailwind Design Cleanup Pass**: Core workspace surfaces now use a more consistent premium palette based on `#05386B`, `#379683`, `#5CDB95`, `#8EE4AF`, and `#EDF5E1`.
- **Lint Stabilization Pass**: Cleaned active lint/type issues in documents, editor, search, habits, and i18n-related files so the project builds safely again.
- **Responsive Calendar & Finance Views**: Added mobile-friendly month/list toggles so dense grids are easier to use on phones while desktop keeps the richer calendar layout.
- **Finance Trends Chart**: Visualizes income vs. expense totals over the last 6 months using a premium monochromatic bar chart.
- **Habit Activity Heatmap**: 90-day activity grid (GitHub-style) to track long-term consistency and patterns.
- **Global Search (Command+K)**: Real-time, workspace-wide search modal that queries documents, finance, tasks, missions, and habits simultaneously.
- **Event Reminders**: Browser notification system that alerts users 10 minutes before a scheduled planner event starts.
- **Premium Mobile Experience**: Refined "Sheet" style navigation for mobile devices with localized headers and smooth transitions.
- **Full i18n Localization**: Every component (Missions, Reading, Calendar, etc.) is now dynamically translated between English and Vietnamese.
- **Finance Modernization**: Inline editing and clearer deletion (trash icon) for financial records.
- **Daily Workspace Bootstrap**: Planner and to-do templates now initialize automatically for each new day in Vietnam time, keeping daily views fresh without losing history.

## Project Evaluation & Missing Features
Based on the latest implementation, here is the streamlined direction:

### 1. Analytics & Insights
- [x] **Finance Trends**: Monthly bar charts implemented.
- [x] **Habit Heatmaps**: 90-day grid implemented.
- **Category Breakdown**: Pie charts for expense categories in the Finance section.
- **Milestone Projection**: Estimated completion dates for long-running goals based on current pace.

### 2. Core Modules To Expand
- **Milestones & Goals Management**: Existing `missions` foundation can evolve into a more explicit long-horizon milestones module.
- **Weekly / Monthly Reflection Log**: Summaries that pull from reading, habits, tasks, and finance, followed by a short reflection entry.
- **Health & Fitness Expansion**: Habits is the current base, but it can grow into a fuller health and physical tracking module.

## Future Development Roadmap
1. **Short-term**: Milestones UI refinement, finance category charts, and quote management.
2. **Medium-term**: Reflection logs, offline/PWA support, and Google Calendar sync.
3. **Long-term**: AI-powered productivity assistant and deeper health / life analytics.

## Next Steps
1. Add optimistic client-side mutations for planner, finance, tasks, and habits so updates feel instant even before the server round-trip completes.
2. Add drag-and-drop calendar block editing and resize interactions on week/day views.
3. Build a dedicated milestones/goals screen on top of the current `missions` data model.
4. Add weekly/monthly reflection tables, summaries, and writing prompts.

## Architecture Notes
- Daily planner/task state is initialized by `lib/workspace/daily.ts` using Vietnam-local date boundaries (`Asia/Ho_Chi_Minh`) rather than one-time SQL seeding alone.
- Seeded daily items are now protected by `daily_workspace_bootstraps`, which prevents deleted default tasks/events from being re-created on the same day.
- Realtime sync is handled by a thin client layer: `hooks/use-realtime-refresh.ts` and `components/workspace/workspace-realtime-sync.tsx`, keeping section pages server-rendered while still responding to live Supabase changes.
- Homepage inspiration is served by `lib/workspace/inspiration.ts` and rendered by `components/workspace/inspiration-hero.tsx`, with optional Unsplash API use and a curated fallback background set.
- Inspiration image source is surfaced directly in the UI so production env issues are easier to spot without opening logs.
- Calendar UI is now split into `calendar-planner.tsx`, `calendar-time-grid.tsx`, and `calendar-timeline-view.tsx` to keep the weekly/day/timeline logic modular.
- Finance UI is now split into `finance-visual-dashboard.tsx`, `finance-wallets-panel.tsx`, and `finance-ledger-panel.tsx` so wallets, projections, and ledger editing evolve independently.

---
*Last Updated: 2026-05-04*
