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
- Security: Row Level Security (RLS) enabled on all tables; storage bucket policies for avatars and book covers.

## Completed Features (Latest Updates)
- **Finance Trends Chart**: Visualizes income vs. expense totals over the last 6 months using a premium monochromatic bar chart.
- **Habit Activity Heatmap**: 90-day activity grid (GitHub-style) to track long-term consistency and patterns.
- **Global Search (Command+K)**: Real-time, workspace-wide search modal that queries documents, finance, tasks, missions, and habits simultaneously.
- **Event Reminders**: Browser notification system that alerts users 10 minutes before a scheduled planner event starts.
- **Premium Mobile Experience**: Refined "Sheet" style navigation for mobile devices with localized headers and smooth transitions.
- **Full i18n Localization**: Every component (Missions, Reading, Calendar, etc.) is now dynamically translated between English and Vietnamese.
- **Finance Modernization**: Inline editing and clearer deletion (trash icon) for financial records.
- **Daily Workspace Bootstrap**: Planner and to-do templates now initialize automatically for each new day in Vietnam time, keeping daily views fresh without losing history.

## Project Evaluation & Missing Features
Based on the latest implementation, here is the updated direction:

### 1. Analytics & Insights (High Priority)
- [x] **Finance Trends**: Monthly bar charts implemented.
- [x] **Habit Heatmaps**: 90-day grid implemented.
- **Category Breakdown**: Pie charts for expense categories in the Finance section.
- **Goal Projection**: Estimated completion dates for Missions based on current velocity.

### 2. Connectivity & Automation
- **Third-party Integrations**: Sync with Google Calendar.
- **Automated Finance**: CSV/Excel statement import support.
- **Webhooks**: Log data from external sources (e.g., Apple Health).

### 3. User Experience (UX) Enhancements
- [x] **Global Search**: Command+K implementation completed.
- [x] **Event Notifications**: Browser push reminders implemented.
- [x] **Mobile Navigation**: Premium sidebar drawer implemented.
- [x] **Daily Reset Behavior**: Day-scoped task and planner views now bootstrap automatically from the app layer.
- **Offline Mode**: Progressive Web App (PWA) support for low-connectivity environments.

### 4. Advanced Personal Management
- **Journaling**: Dedicated "Day Review" template with mood tracking.
- **AI Integration**: Smart task suggestions and note summarization.
- **Resource Management**: Web clipper for saving research directly to the Notes section.

## Future Development Roadmap
1. **Short-term**: Category Pie Charts and CSV Export for Finance.
2. **Medium-term**: PWA support and Google Calendar sync.
3. **Long-term**: AI-powered productivity assistant and E2E encryption for notes.

## Architecture Notes
- Daily planner/task state is initialized by `lib/workspace/daily.ts` using Vietnam-local date boundaries (`Asia/Ho_Chi_Minh`) rather than one-time SQL seeding alone.

---
*Last Updated: 2026-05-02*
