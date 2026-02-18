# Implementation Gaps & Progress

Gaps identified by cross-referencing APPROACH.md plan against actual codebase.

## Resolved (v1.0.4 — UI Polish)

### Icons — 3D form section icons
- Replaced simple stroke SVGs with 3D filled icons: file-with-"i", dice, heart
- Each has 4-stop purple gradient, `perspective(150px) rotateY(30deg)`, drop-shadow
- Heart also has `rotateX(-5deg)` and reversed gradient for asymmetric depth
- Thank-you page uses same file icon at 64x64

### Hero banner — matches mock
- Light sage green background (`#c8d9a3`) replacing dark gradient
- 3D stacked disc shapes on the left (perspective + rotateX)
- Black text + official Alma SVG logo (`public/alma-logo.svg`)
- Logo uses `currentColor` — inherits parent text color

### Button rounding
- Submit button and Thank You button: `rounded-full` → `rounded-lg`

### Alma logo
- Saved official SVG to `public/alma-logo.svg`
- Used on hero section (replaces plain "alma" text)

## Open Gaps

### 1. API Auth Protection Missing
- **Severity:** Medium
- **Details:** `GET /api/leads` and `PATCH /api/leads/[id]` don't verify NextAuth session server-side. The dashboard layout guards the UI, but the API endpoints are open to direct requests (e.g. curl).
- **Plan said:** "auth required" for both endpoints
- **Fix:** Add `getServerSession(authOptions)` check at the top of each handler, return 401 if unauthenticated.

### 2. Settings Page 404
- **Severity:** Low
- **Details:** Sidebar links to `/dashboard/settings` but the route doesn't exist. Clicking "Settings" would show a 404.
- **Fix:** Either create a placeholder `src/app/dashboard/settings/page.tsx` or remove the link from Sidebar.

### 3. Project Structure Outdated
- **Severity:** Low
- **Details:** APPROACH.md section 3 lists `components/Pagination.tsx` and `components/ui/` directory that were never created (Antd Table handles pagination internally).
- **Fix:** Update the project structure tree in APPROACH.md to match actual files.

### 4. No Component/Integration Tests
- **Severity:** Medium
- **Details:** APPROACH.md section 6 planned component tests for LeadForm (rendering, validation, submit flow) and LeadsTable (rendering, filters, status update). Only store CRUD and Zod schema tests were implemented.
- **Current:** 13 tests — store (6) + schema (7)
- **Missing:** LeadForm.test.tsx, LeadsTable.test.tsx, API route handler tests
- **Fix:** Add component tests with React Testing Library + mock fetch.

## Version History
- **v1.0.0** — Initial release (Phases 1-6)
- **v1.0.1** — UI fixes (hero alignment, form sections, dashboard)
- **v1.0.2** — Form centering fix (flex wrapper for Antd Form)
- **v1.0.3** — Mock matching (textarea placeholder, FileText icon, upload position, seed data)
- **v1.0.4** — (pending commit) 3D icons, hero banner redesign, Alma logo, button rounding
