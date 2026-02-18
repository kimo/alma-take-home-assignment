# Implementation Gaps (v1.0.0)

Gaps identified by cross-referencing APPROACH.md plan against actual codebase.

## Functional Gaps

### 1. API Auth Protection Missing
- **Severity:** Medium
- **Details:** `GET /api/leads` and `PATCH /api/leads/[id]` don't verify NextAuth session server-side. The dashboard layout guards the UI, but the API endpoints are open to direct requests (e.g. curl).
- **Plan said:** "auth required" for both endpoints
- **Fix:** Add `getServerSession(authOptions)` check at the top of each handler, return 401 if unauthenticated.

### 2. Settings Page 404
- **Severity:** Low
- **Details:** Sidebar links to `/dashboard/settings` but the route doesn't exist. Clicking "Settings" would show a 404.
- **Fix:** Either create a placeholder `src/app/dashboard/settings/page.tsx` or remove the link from Sidebar.

## Documentation Gaps

### 3. Project Structure Outdated
- **Severity:** Low
- **Details:** APPROACH.md section 3 lists `components/Pagination.tsx` and `components/ui/` directory that were never created (Antd Table handles pagination internally).
- **Fix:** Update the project structure tree in APPROACH.md to match actual files.

## Test Coverage Gaps

### 4. No Component/Integration Tests
- **Severity:** Medium
- **Details:** APPROACH.md section 6 planned component tests for LeadForm (rendering, validation, submit flow) and LeadsTable (rendering, filters, status update). Only store CRUD and Zod schema tests were implemented.
- **Current:** 13 tests — store (6) + schema (7)
- **Missing:** LeadForm.test.tsx, LeadsTable.test.tsx, API route handler tests
- **Fix:** Add component tests with React Testing Library + mock fetch.
