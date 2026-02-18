# Alma Lead Management — Take-Home Assignment

## Context
- **Company:** Alma (tryalma.ai) — immigration services platform
- **Role:** Position discussed with CTO (Shuo), leveraging AI experience
- **Deadline:** 24 hours from start
- **Submit to:** shuo@tryalma.ai with public GitHub link

---

## 1. Assignment Breakdown

### Core Requirements
| # | Feature | Priority |
|---|---------|----------|
| 1 | Public lead form (7 fields + file upload) | Must have |
| 2 | Internal leads list with auth | Must have |
| 3 | Status management (PENDING → REACHED_OUT) | Must have |
| 4 | Form validation | Must have |
| 5 | Match the mocks closely | Must have |

### Bonus Items (from assignment)
| # | Bonus | Decision | Implementation | Phase |
|---|-------|----------|---------------|-------|
| 1 | Next.js API routes | **YES** | 3 real endpoints: `POST /api/leads`, `GET /api/leads`, `PATCH /api/leads/[id]`. In-memory store — fully functional, not mocked. | Phase 2 |
| 2 | JsonForms (config-driven) | **IF TIME — Phase 5.5** | Build form with Antd first (safe). If time remains, refactor to JsonForms with custom Antd renderers (~2 hrs). Form looks identical — difference is config-driven architecture under the hood. | Phase 5.5 (optional) |
| 3 | State management (Redux) | **SKIP** | Antd Table/Form manage UI state internally. Server state is simple fetch + useState. Redux adds boilerplate with no benefit at this scale. Documented as conscious trade-off in DESIGN.md — shows architectural judgment. | — |
| 4 | Unit tests | **YES** | 12 test cases: form rendering, validation (empty/email/URL), submit flow, table rendering, filters, status update, all 3 API endpoints. Jest + React Testing Library. | Phase 6 |
| 5 | Responsive design | **YES** | Antd responsive components + Tailwind breakpoint utilities (`md:`, `lg:`). Mobile form stacks naturally. Table horizontally scrollable on mobile. | Phase 5 |
| 6 | TypeScript | **YES** | Project scaffolded with TypeScript from start. Zod schemas infer types. `Lead` interface defined in `lib/types.ts`. | Phase 1 |
| 7 | Form validation feedback | **YES** | Antd Form built-in inline error messages per field + Zod schema for type-safe rules. Required, email format, URL format validations with real-time feedback. | Phase 3 |
| 8 | System design document | **YES** | DESIGN.md — architecture diagram, data flow, API design, trade-offs table, scaling considerations. | Phase 6 |

### Tech Requirements → Implementation Mapping

| Requirement | Implementation | Phase |
|---|---|---|
| Use Next.js | Next.js 15, App Router, TypeScript | Phase 1 |
| Mock API / Bonus: API routes | Real Next.js API routes: `POST /api/leads`, `GET /api/leads`, `PATCH /api/leads/[id]`. In-memory store — fully functional, not mocked. | Phase 2 |
| Mock authentication | NextAuth.js credentials provider. Hardcoded login (admin@tryalma.ai / admin). `/dashboard` protected via session check. Real auth pattern, mock credentials. | Phase 4 |
| File upload for resume/CV | Antd `<Upload>` component (drag-and-drop + file list UI) → Next.js API route handles multipart FormData → saves to local `uploads/` directory. | Phase 2 (API) + Phase 3 (UI) |
| Form validation | Antd Form built-in rules (required, email format, URL format) + Zod schema for type-safe validation. Inline error messages per field. | Phase 3 |
| Style with CSS or CSS-in-JS | Ant Design 5 (CSS-in-JS via design tokens) + Tailwind CSS for layout. `ConfigProvider` customizes theme to match mock's minimal aesthetic. | Phase 1 (setup) + Phase 3/4 |
| Match the mocks closely | Highest priority. Dedicated polish pass in Phase 5 for spacing, fonts, colors. Seed data matches mock exactly. | Phase 5 |

---

## 2. Mock Analysis

### Public Form (Page: `/`)

**Hero Section:**
- Dark olive/green gradient background
- 3D abstract leaf/petal decorative shapes (top-right area)
- "alma" logo in white, top-left
- "Assessment" label above logo
- Large white heading: "Get An Assessment Of Your Immigration Case"

**Form Body — 3 sections with purple/blue icons:**

**Section 1: Personal Info** (clipboard icon)
- Heading: "Want to understand your visa options?"
- Subtext: "Submit the form below and our team of experienced attorneys will review your information and send a preliminary assessment of your case based on your goals."
- Fields:
  - First Name → Antd `<Input>` | required
  - Last Name → Antd `<Input>` | required
  - Email → Antd `<Input>` | required, email format validation
  - Country of Citizenship → Antd `<Select>` with country options | required (NOTE: not in written requirements but IS in mock — including it to match mock)
  - LinkedIn / Personal Website URL → Antd `<Input>` | required, URL format validation

**Section 2: Visa Interest** (briefcase/suitcase icon)
- Heading: "Visa categories of interest?"
- → Antd `<Checkbox.Group>` | required (at least one)
- Options:
  - O-1
  - EB-1A
  - EB-2 NIW
  - I don't know

**Section 2.5: Resume Upload** (between visa interest and help message)
- → Antd `<Upload>` with drag-and-drop | required
- Accepts: .pdf, .doc, .docx
- Stored via POST to `/api/leads` as multipart FormData → saved to local `uploads/` directory
- NOTE: Not clearly visible in mock but explicitly required in assignment. Placed here as logical position.

**Section 3: Additional Info** (heart icon)
- Heading: "How can we help you?"
- → Antd `<Input.TextArea>` with large rows | required
- This is the "Open long input" from requirements

**Submit:**
- Black pill-shaped button, centered: "Submit"
- → Antd `<Button type="primary" htmlType="submit">` with theme override for pill shape (borderRadius: 9999)

**Confirmation Page (after submit — `/thank-you`):**
- Clean white page, centered
- Purple/blue checkmark icon
- "Thank You" heading (bold)
- "Your information was submitted to our team of immigration attorneys. Expect an email from hello@tryalma.ai"
- Black pill button: "Go Back to Homepage" → links to `/`

**Field-to-Requirement Mapping:**
| Assignment Requirement | Mock Label | Component | Validation |
|---|---|---|---|
| First Name | First Name | `<Input>` | required |
| Last Name | Last Name | `<Input>` | required |
| Email | Email | `<Input>` | required, email format |
| Linkedin | LinkedIn / Personal Website URL | `<Input>` | required, URL format |
| Visas that you're interested | Visa categories of interest? | `<Checkbox.Group>` | required (min 1) |
| Resume / CV (file upload) | (not in mock, add section) | `<Upload>` | required, .pdf/.doc/.docx |
| Open long input | How can we help you? | `<Input.TextArea>` | required |
| — (mock only) | Country of Citizenship | `<Select>` | required |
| Confirmation message | Thank You page | `/thank-you` route | — |

### Internal Leads List (Page: `/dashboard`)

**Sidebar (dark/black, left):**
- "Admin View" small label at top
- "alma" logo below
- Nav links:
  - "Leads" (active/current)
  - "Settings"
- Bottom of sidebar: circle avatar "A" + "Admin" text

**Main Content:**
- "Leads" heading (large, bold)
- Toolbar: Search input (with magnifying glass icon) + Status dropdown filter
- Table:
  - Columns (all with sort arrows ↓): Name, Submitted, Status, Country
  - Date format: `MM/DD/YYYY, H:MM PM`
  - Status values: "Pending" (black text) / "Reached Out" (black text)
  - Clean row separators, no zebra striping
- Pagination at bottom-right: `< 1 2 3 >`
- 8 rows visible per page

**Sample Data from Mock:**
| Name | Submitted | Status | Country |
|------|-----------|--------|---------|
| Jorge Ruiz | 02/02/2024, 2:45 PM | Pending | Mexico |
| Bahar Zamir | 02/02/2024, 2:45 PM | Pending | Mexico |
| Mary Lopez | 02/02/2024, 2:45 PM | Pending | Brazil |
| Li Zijin | 02/02/2024, 2:45 PM | Pending | South Korea |
| Mark Antonov | 02/02/2024, 2:45 PM | Pending | Russia |
| Jane Ma | 02/02/2024, 2:45 PM | Pending | Mexico |
| Anand Jain | 02/02/2024, 2:45 PM | Reached Out | Mexico |
| Anna Voronova | 02/02/2024, 2:45 PM | Pending | France |

**Requirement-to-Implementation Mapping:**

| Assignment Requirement | Implementation | Component |
|---|---|---|
| Internal UI guarded by authentication | NextAuth.js session check. Unauthenticated users redirected to `/login`. | Phase 4 — middleware or layout-level session guard |
| Display list of leads with **all** information | Table shows 4 summary columns (matching mock). Click row → expandable detail or drawer showing ALL fields (email, LinkedIn, visa interests, resume download, help message). | Antd `<Table expandable>` or Antd `<Drawer>` on row click |
| State starts as PENDING | Default status in seed data and API POST response. | `status: "PENDING"` in store + API |
| Manually transition PENDING → REACHED_OUT | Explicit button per row. Two options: (a) button in a 5th "Action" column, or (b) clickable status cell. Going with **(a) Action column with button** since requirement explicitly says "Include a button". | Antd `<Button size="small">` in table Action column — only visible when status is PENDING |
| Match the mock | Table: 4 visible columns + Action column for status button. Sidebar, search, filter, pagination all match mock layout. | Phase 5 polish |

**Design decision — "all the information" vs mock:**
The mock only shows 4 columns (Name, Submitted, Status, Country), but the requirement says "display a list of leads with all the information filled in by the prospect." Resolution:
- **Table view** = 4 summary columns + Action button (matches mock)
- **Expanded/detail view** = shows remaining fields (email, LinkedIn, visa interests, resume file, help message)
- This satisfies both "match the mock" AND "all the information"

**Observations:**
- Search filters by name (client-side on fetched data)
- Status dropdown filters by Pending/Reached Out/All
- Pagination: 8 rows per page, matching mock
- Action button shows "Mark as Reached Out" only for PENDING leads. Once REACHED_OUT, show disabled/greyed text or no button.

---

## 3. Architecture Decisions

### Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 15 (App Router) | Required. App Router is current standard. |
| Language | TypeScript | Bonus points + type safety |
| UI Library | Ant Design 5 (antd) | Production-grade Table, Form, Upload components. Built-in sorting, pagination, validation. Design tokens for theme customization. Prior experience = faster delivery. |
| Styling | Ant Design tokens + Tailwind CSS (utility) | Antd ConfigProvider for component theming (black buttons, minimal borders). Tailwind for layout utilities and custom sections (hero, form sections) where antd components don't apply. |
| Form handling | Ant Design Form + Zod | Antd Form has built-in validation UX, field-level error messages, and all input types needed (Input, Select, Checkbox.Group, Upload, TextArea). Zod for schema definition. |
| API | Next.js API routes | Bonus points, keeps it self-contained |
| Storage | In-memory store (Map) | Take-home scope — no need for a real DB. Data persists during server lifetime. |
| Auth | NextAuth.js with credentials provider | Real auth pattern with mock credentials (admin@tryalma.ai / admin) |
| Testing | Jest + React Testing Library | Standard for Next.js |
| File upload | Antd Upload + Next.js API route + local filesystem | Antd Upload gives drag-and-drop + file list UI. API route saves to local fs. |

### Why these choices:

**Ant Design 5 over raw Tailwind/styled-components:**
- `<Table>` component solves 60% of the dashboard: sorting, pagination, column config, search — all built-in and matching the mock's table pattern
- `<Form>` component handles validation UX (error messages, required fields, field-level feedback) without manual wiring
- `<Upload>` component provides file upload with progress and file list display
- Design tokens via `ConfigProvider` allow customizing to match Alma's minimal aesthetic (black buttons, clean borders) without fighting the library
- Prior hands-on experience with antd5 = faster delivery within 24hr deadline
- Relevant to Alma's domain: immigration platforms need many form types at scale — a component library with built-in form patterns is the right production choice

**Tailwind CSS as complement (not replacement):**
- Used for the hero section, form section layouts with icons, and custom spacing — areas where antd components don't apply
- Responsive utilities (`md:`, `lg:`) for mobile adaptation
- Co-exists cleanly with antd via `tailwind-antd` prefix config to avoid class conflicts

### Why NOT these alternatives:
- **SQLite/Prisma** — overkill for a take-home, adds setup complexity for the reviewer
- **Redux** — the assignment suggests it, but this app has simple server state. Antd Table + Form manage their own UI state internally. Server state is simple enough for fetch + useState. Would mention in design doc as a conscious trade-off.
- **JsonForms** — config-driven form rendering. No official Antd renderer set — requires writing custom renderers mapping JsonForms controls to Antd components. Planned as optional Phase 5.5 refactor if time allows. In production, eliminates dev cycles for form changes (non-engineers edit JSON config instead of React code). Highly relevant for Alma's domain where different visa types need different forms and immigration law changes frequently.
- **styled-components** — Antd5 already provides component-level theming via design tokens. Adding styled-components on top would be redundant. Tailwind handles the remaining layout needs.
- **Raw Tailwind only** — would require building Table (sorting, pagination), Form (validation, error states), Upload (file handling) from scratch. Antd provides these production-ready.

### Project Structure

```
alma-take-home-assignment/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Public lead form
│   │   ├── thank-you/page.tsx          # Confirmation after submit
│   │   ├── dashboard/
│   │   │   ├── layout.tsx              # Sidebar + auth guard
│   │   │   └── page.tsx               # Leads table
│   │   ├── api/
│   │   │   ├── leads/
│   │   │   │   ├── route.ts           # GET (list) + POST (create)
│   │   │   │   └── [id]/route.ts      # PATCH (update status)
│   │   │   └── auth/[...nextauth]/
│   │   │       └── route.ts           # NextAuth handler
│   │   └── layout.tsx                  # Root layout
│   ├── components/
│   │   ├── LeadForm.tsx               # Public form component
│   │   ├── LeadsTable.tsx             # Admin table component
│   │   ├── Sidebar.tsx                # Dashboard sidebar
│   │   ├── Pagination.tsx             # Table pagination
│   │   └── ui/                        # Small reusable UI pieces
│   ├── lib/
│   │   ├── store.ts                   # In-memory leads store
│   │   ├── schema.ts                  # Zod validation schemas
│   │   ├── types.ts                   # TypeScript interfaces
│   │   └── seed.ts                    # Seed data matching mock
│   └── __tests__/
│       ├── LeadForm.test.tsx
│       └── LeadsTable.test.tsx
├── public/
│   └── file-uploads/                  # Uploaded resumes (gitignored)
├── APPROACH.md                        # This file — full approach notes
├── DESIGN.md                          # System design document (for submission)
├── README.md                          # How to run locally
├── .env.example                       # Environment variables template
└── package.json
```

### API Design

```
POST   /api/leads          — Create a new lead (from public form)
  Body: FormData (multipart — includes file upload)
  Returns: { id, status: "PENDING" }

GET    /api/leads           — List all leads (auth required)
  Query: ?page=1&limit=8&search=&status=
  Returns: { leads: [...], total, page, totalPages }

PATCH  /api/leads/[id]      — Update lead status (auth required)
  Body: { status: "REACHED_OUT" }
  Returns: { id, status }
```

### Data Model

```typescript
interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  linkedIn: string;
  visaInterests: string[];         // ["O-1", "EB-1A", "EB-2 NIW", "I don't know"]
  resumePath: string | null;       // file path on server
  resumeFileName: string | null;   // original file name
  helpMessage: string;             // "How can we help you?"
  status: "PENDING" | "REACHED_OUT";
  submittedAt: Date;
}
```

### Seed Data
Pre-populate with the 8 leads from the mock (Jorge Ruiz, Bahar Zamir, etc.) so the dashboard looks correct on first load. Anand Jain gets status "REACHED_OUT", rest are "PENDING".

---

## 4. Implementation Plan

### Phase 1: Project Setup (~15 min)
- [ ] `npx create-next-app` with TypeScript + Tailwind + App Router
- [ ] Install antd, @ant-design/icons
- [ ] Configure antd ConfigProvider with custom theme tokens (black primary, minimal borders)
- [ ] Set up project structure (folders, types, schema)
- [ ] Initialize git repo
- [ ] Add seed data

### Phase 2: API Routes (~30 min)
- [ ] In-memory store with seed data
- [ ] POST /api/leads (create, handle file upload)
- [ ] GET /api/leads (list with pagination, search, status filter)
- [ ] PATCH /api/leads/[id] (status update)

### Phase 3: Public Lead Form (~1.5 hr)
- [ ] Hero section (olive/green gradient + heading — Tailwind for layout)
- [ ] Form sections with purple icons and headings
- [ ] Antd Form: Input (name, email, LinkedIn), Select (country), Checkbox.Group (visas), Upload (resume), TextArea (help)
- [ ] Zod schema wired to Antd Form rules for validation feedback
- [ ] Submit → POST to API → redirect to thank-you page
- [ ] Thank-you confirmation page
- [ ] Theme overrides: pill-shaped button, thin input borders to match mock

### Phase 4: Dashboard (~1.5 hr)
- [ ] NextAuth setup with mock credentials (admin@tryalma.ai / admin)
- [ ] Login page (`/login`)
- [ ] Auth guard: unauthenticated users redirected to `/login`
- [ ] Sidebar component (nav + user — Tailwind layout, dark bg)
- [ ] Antd Table: columns Name, Submitted, Status, Country with built-in sorters
- [ ] Action column: "Mark as Reached Out" `<Button>` per row (only shown for PENDING leads) — satisfies "Include a button to change the state"
- [ ] Row expand or Drawer on row click → shows ALL lead info (email, LinkedIn, visa interests, resume download link, help message) — satisfies "display all the information"
- [ ] Antd Input.Search for name filtering
- [ ] Antd Select for status filter dropdown (All / Pending / Reached Out)
- [ ] Antd Table pagination (8 per page)
- [ ] PATCH `/api/leads/[id]` call on button click → update status → refresh table

### Phase 5: Polish (~1 hr)
- [ ] Responsive design check (mobile form, mobile table)
- [ ] Loading states
- [ ] Error handling
- [ ] Match mock styling precisely (spacing, fonts, colors)

### Phase 5.5: JsonForms Refactor — OPTIONAL (~2 hr, only if ahead of schedule)
**Strategy:** Form already works with Antd. This phase refactors the form definition from JSX to JSON config while keeping the exact same UI.
- [ ] Install `@jsonforms/core`, `@jsonforms/react`
- [ ] Extract lead form data shape into JSON Schema (`schemas/lead-form.schema.json`)
- [ ] Define UI Schema for section layout (`schemas/lead-form.uischema.json`)
- [ ] Write custom Antd renderers (wrap existing Antd components):
  - [ ] TextInputRenderer → `<Input>`
  - [ ] EmailRenderer → `<Input>` with email rules
  - [ ] SelectRenderer → `<Select>` (country dropdown)
  - [ ] CheckboxGroupRenderer → `<Checkbox.Group>` (visa interests)
  - [ ] FileUploadRenderer → `<Upload>` (resume)
  - [ ] TextAreaRenderer → `<Input.TextArea>` (help message)
- [ ] Register renderers with JsonForms `<JsonForms>` component
- [ ] Verify form looks identical to Antd-only version
- [ ] Add note in DESIGN.md explaining config-driven architecture value for Alma's domain

**Why this order works:** If anything goes wrong, revert to the working Antd form. Zero risk to the submission.

### Phase 6: Documentation + Tests (~1 hr)
- [ ] Unit tests for form validation + leads table
- [ ] DESIGN.md (system design document)
- [ ] README.md (setup instructions)
- [ ] Final review of APPROACH.md

### Phase 7: Submit (~15 min)
- [ ] Push to public GitHub repo
- [ ] Verify clone + run works from scratch
- [ ] Email shuo@tryalma.ai

---

## 5. Development Workflow

### Git Strategy
- **Single branch:** `main` — no feature branches for a solo 24-hour sprint
- **Frequent commits:** commit after each phase completion (verifiable progress)
- **Commit message format:** `Phase X: description` (e.g., `Phase 1: project setup with antd5 + tailwind`)
- **No force pushes** — clean linear history

### Development Order & Dependencies

```
Phase 1 (Setup) → Phase 2 (API) → Phase 3 (Form) → Phase 4 (Dashboard)
                                                          ↓
                                              Phase 5 (Polish)
                                                  ↓            ↘
                                        Phase 5.5 (JsonForms)   Phase 6 (Tests + Docs)
                                          [OPTIONAL]                  ↓
                                                              Phase 7 (Submit)
```

- **Phase 1 → 2:** API before UI — form and dashboard need endpoints to hit
- **Phase 3 and 4 are independent** of each other (both consume API), but doing form first because it's the public-facing page and simpler
- **Phase 5 (Polish) after both screens work** — easier to tune spacing/colors when layout is stable
- **Phase 5.5 (JsonForms) only if Phase 5 finishes early** — safe refactor since Antd form already works
- **Phase 6 (Tests + Docs) after polish** — tests lock down final behavior, docs reflect final state

### Dev Server Workflow
- `npm run dev` running throughout
- Browser open with both `/` (form) and `/dashboard` (leads table)
- Manual verification after each phase before committing

### Environment Variables
- **Zero-config approach:** NextAuth secret has a hardcoded fallback in code (`"alma-take-home-demo-secret"`), so the reviewer never needs to touch env files
- `.env.example` shipped for documentation only — not required to run
- `NEXTAUTH_URL` defaults to `http://localhost:3000` in dev mode (Next.js auto-detects)

```typescript
// src/lib/auth.ts
secret: process.env.NEXTAUTH_SECRET || "alma-take-home-demo-secret"
```

### Reviewer Experience
```bash
git clone https://github.com/kimo/alma-take-home-assignment.git
cd alma-take-home-assignment
npm install
npm run dev
```
- **Zero config.** No `.env` setup, no database, no Docker.
- Open `http://localhost:3000` → public lead form
- Go to `/dashboard` → redirected to login
- Login: `admin@tryalma.ai` / `admin`
- Dashboard pre-loaded with 8 seed leads matching the mock

---

## 6. Testing Strategy

### What We Test (and Why)

| Test | Type | What It Verifies | Priority |
|------|------|-----------------|----------|
| Lead form renders all fields | Component | All 7+ fields present and correct types | High |
| Form validation — empty submit | Component | Error messages appear for all required fields | High |
| Form validation — invalid email | Component | Email format validation triggers | High |
| Form validation — invalid URL | Component | LinkedIn URL format validation triggers | Medium |
| Form submit → API call | Integration | FormData posted correctly to /api/leads | High |
| Leads table renders seed data | Component | All 8 mock rows display correctly | High |
| Status filter works | Component | Filtering by Pending/Reached Out updates table | Medium |
| Search filter works | Component | Name search filters table rows | Medium |
| "Mark as Reached Out" button | Integration | PATCH call + table updates status | High |
| API: POST /api/leads | Unit | Creates lead, returns id + PENDING status | High |
| API: GET /api/leads | Unit | Returns paginated leads with filters | Medium |
| API: PATCH /api/leads/[id] | Unit | Updates status correctly | High |

### What We Don't Test (conscious trade-off for 24hr deadline)
- **Auth flow** — NextAuth is well-tested library, mock credentials are simple
- **File upload end-to-end** — would need mocking filesystem; manual verification sufficient
- **CSS/visual regression** — no snapshot testing, manual visual check against mocks
- **Accessibility** — Antd components have built-in a11y; no additional a11y testing

### Test Stack
- **Jest** — test runner (ships with create-next-app)
- **React Testing Library** — component rendering + user interaction
- **@testing-library/user-event** — realistic user events (typing, clicking)
- **jest-environment-jsdom** — DOM environment for component tests

### Test File Structure
```
src/__tests__/
├── components/
│   ├── LeadForm.test.tsx         # Form rendering + validation
│   └── LeadsTable.test.tsx       # Table rendering + filters + actions
└── api/
    ├── leads.test.ts             # POST + GET endpoints
    └── leads-id.test.ts          # PATCH endpoint
```

### Running Tests
```bash
npm test                  # run all tests
npm test -- --coverage    # with coverage report
npm test -- --watch       # watch mode during development
```

### Coverage Target
- Aim for **meaningful coverage** of core paths, not a percentage target
- All form fields validated, all API endpoints covered, table interactions tested
- Skip covering boilerplate (layout, providers, config)

---

## 7. Release Plan

### Pre-Submission Checklist

**Functional Verification:**
- [ ] Fresh `git clone` → `npm install` → `npm run dev` works on first try
- [ ] Public form at `/` — all fields render, validation works, submit creates lead
- [ ] Thank-you page at `/thank-you` — shows confirmation, "Go Back" works
- [ ] Login at `/login` — admin@tryalma.ai / admin credentials work
- [ ] Dashboard at `/dashboard` — table shows seed data, all 4 columns sort
- [ ] Search by name filters correctly
- [ ] Status dropdown filter works (All / Pending / Reached Out)
- [ ] "Mark as Reached Out" button updates status
- [ ] Row expand/drawer shows all lead info (email, LinkedIn, visas, resume, help message)
- [ ] Pagination works (8 per page)
- [ ] File upload accepts .pdf/.doc/.docx
- [ ] Unauthenticated access to `/dashboard` redirects to login
- [ ] `npm test` passes with no failures
- [ ] `npm run build` succeeds with no errors

**Visual Verification (vs mocks):**
- [ ] Hero section: green gradient, heading text, decorative elements
- [ ] Form: 3 sections with icons, proper field layout
- [ ] Submit button: black, pill-shaped, centered
- [ ] Dashboard sidebar: dark bg, "alma" logo, nav items, avatar
- [ ] Table: clean rows, sort arrows, date format matches
- [ ] Pagination style matches mock
- [ ] Thank-you page: checkmark icon, text, button

**Code Quality:**
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] No hardcoded secrets (only in .env.local, not committed)
- [ ] .env.example committed with placeholder values
- [ ] No `console.log` left in production code
- [ ] File uploads directory gitignored

**Documentation:**
- [ ] README.md — clear setup instructions (3 commands: clone, install, run)
- [ ] README.md — login credentials documented
- [ ] README.md — tech stack and key decisions summarized
- [ ] DESIGN.md — system design document (architecture diagram, data flow, trade-offs)
- [ ] APPROACH.md — this file, clean and complete

### Submission Steps
1. **Make repo public:** `gh repo edit kimo/alma-take-home-assignment --visibility public`
2. **Verify public access:** open `https://github.com/kimo/alma-take-home-assignment` in incognito
3. **Final local test:** clone into temp dir, install, run, verify everything works
4. **Email to shuo@tryalma.ai:**
   - Subject: `Take-Home Assignment — [Your Name]`
   - Body: link to public GitHub repo
   - Mention: APPROACH.md for how you thought through the problem, DESIGN.md for system design, README.md for setup
5. **Keep repo public** until hearing back

### Timeline Budget (24 hours)

| Phase | Estimated | Cumulative | Deliverable |
|-------|-----------|-----------|-------------|
| 1. Setup | 15 min | 0:15 | Project scaffolded, antd + tailwind configured |
| 2. API Routes | 30 min | 0:45 | All 3 endpoints working (test via curl) |
| 3. Public Form | 1.5 hr | 2:15 | Form submits, validation works, thank-you page |
| 4. Dashboard | 1.5 hr | 3:45 | Table, search, filter, pagination, status button, detail view |
| 5. Polish | 1 hr | 4:45 | Pixel-perfect match to mocks, responsive |
| 5.5. JsonForms | 2 hr | 6:45 | OPTIONAL — only if ahead of schedule |
| 6. Tests + Docs | 1 hr | 5:45 (or 7:45) | Tests pass, README, DESIGN.md complete |
| 7. Submit | 15 min | 6:00 (or 8:00) | Public repo, email sent |

**Total core:** ~6 hours. **With JsonForms:** ~8 hours. Plenty of buffer within 24hr deadline.

**Risk mitigation:** If any phase takes longer than estimated, skip Phase 5.5 (JsonForms) first, then reduce test coverage. Core functionality + mock match + documentation are non-negotiable.

---

## 8. Progress Log

_Will be updated as we build._

### Planning Phase (Pre-implementation)
- Analyzed assignment requirements thoroughly
- Analyzed both mockups in detail (field-by-field)
- Created field-to-requirement mapping for both screens
- Identified gap: "all information" requirement vs 4-column mock → resolved with expandable row/drawer
- Made architecture decisions (antd5, Tailwind, NextAuth, Zod, in-memory store)
- Evaluated and documented trade-offs (Redux: skip, JsonForms: optional Phase 5.5, styled-components: redundant with antd tokens)
- Defined development workflow, testing strategy, and release plan
- **Status: PLANNING COMPLETE — ready to implement on user's go**

---

## 9. Architecture Diagrams (for DESIGN.md)

### System Component Diagram

```mermaid
graph TB
    subgraph Browser
        PF["/ — Public Lead Form<br/>(Antd Form + Zod)"]
        TY["/thank-you — Confirmation"]
        LG["/login — Auth Page"]
        DB["/dashboard — Leads Table<br/>(Antd Table + Search + Filter)"]
    end

    subgraph "Next.js Server (App Router)"
        subgraph "API Routes"
            POST["POST /api/leads<br/>Create lead + save file"]
            GET["GET /api/leads<br/>?page&search&status"]
            PATCH["PATCH /api/leads/[id]<br/>Update status"]
            AUTH["POST /api/auth/[...nextauth]<br/>Credentials login"]
        end

        subgraph "Data Layer"
            STORE["In-Memory Store<br/>(Map&lt;string, Lead&gt;)"]
            SEED["Seed Data<br/>(8 mock leads)"]
            FS["Local Filesystem<br/>(uploads/)"]
        end

        MW["NextAuth Session<br/>Middleware"]
    end

    PF -->|"FormData (multipart)"| POST
    POST -->|"save lead"| STORE
    POST -->|"save resume"| FS
    POST -->|"redirect"| TY

    LG -->|"credentials"| AUTH
    AUTH -->|"JWT session"| MW

    DB -->|"fetch leads"| GET
    DB -->|"update status"| PATCH
    GET -->|"query"| STORE
    PATCH -->|"mutate"| STORE

    MW -.->|"protects"| GET
    MW -.->|"protects"| PATCH
    MW -.->|"guards"| DB

    SEED -->|"init"| STORE

    style PF fill:#e8f5e9,stroke:#2e7d32
    style DB fill:#e3f2fd,stroke:#1565c0
    style STORE fill:#fff3e0,stroke:#e65100
    style MW fill:#fce4ec,stroke:#c62828
```

### Data Flow — Lead Submission

```mermaid
sequenceDiagram
    actor User
    participant Form as Public Form (/)
    participant API as POST /api/leads
    participant Store as In-Memory Store
    participant FS as Local Filesystem
    participant TY as Thank You Page

    User->>Form: Fill out form fields
    Form->>Form: Antd Form + Zod validation
    alt Validation fails
        Form-->>User: Inline error messages
    end
    User->>Form: Click Submit
    Form->>API: POST FormData (fields + resume file)
    API->>Store: store.set(id, lead) — status: PENDING
    API->>FS: Save resume to uploads/{id}-{filename}
    API-->>Form: 201 { id, status: "PENDING" }
    Form->>TY: router.push("/thank-you")
    TY-->>User: "Thank You" confirmation
```

### Data Flow — Dashboard Status Update

```mermaid
sequenceDiagram
    actor Admin
    participant Login as Login Page
    participant Auth as NextAuth
    participant Dash as Dashboard
    participant GET as GET /api/leads
    participant PATCH as PATCH /api/leads/[id]
    participant Store as In-Memory Store

    Admin->>Login: admin@tryalma.ai / admin
    Login->>Auth: Authenticate
    Auth-->>Admin: JWT session cookie

    Admin->>Dash: Navigate to /dashboard
    Dash->>GET: Fetch leads (?page=1&limit=8)
    GET->>Store: Query all leads
    Store-->>GET: Lead[]
    GET-->>Dash: { leads, total, page, totalPages }
    Dash-->>Admin: Render table (8 rows)

    Admin->>Dash: Click "Mark as Reached Out"
    Dash->>PATCH: PATCH /api/leads/{id} { status: "REACHED_OUT" }
    PATCH->>Store: Update lead status
    Store-->>PATCH: Updated lead
    PATCH-->>Dash: { id, status: "REACHED_OUT" }
    Dash->>GET: Re-fetch leads
    GET-->>Dash: Updated list
    Dash-->>Admin: Table refreshed — status changed
```

---

## 10. Design Trade-offs (for DESIGN.md later)

| Decision | Chose | Over | Why |
|----------|-------|------|-----|
| App Router | Next.js App Router | Pages Router | Modern standard, better server components |
| UI Library | Ant Design 5 | Raw components | Production-grade Table, Form, Upload — solves both screens with built-in sorting, pagination, validation. Prior experience. Relevant to Alma's form-heavy domain. |
| Styling | Antd tokens + Tailwind | styled-components / Tailwind-only | Antd tokens for component theming, Tailwind for layout and custom sections (hero). Best of both. |
| Storage | In-memory Map | SQLite/Prisma | Zero setup for reviewer, sufficient for demo |
| Auth | NextAuth credentials | Custom JWT | Real auth library, production pattern |
| State | Antd internal + fetch | Redux | Antd Table/Form manage their own UI state. Server state is simple fetch. Redux would add boilerplate with no benefit at this scale. |
| Validation | Antd Form rules + Zod | react-hook-form | Antd Form has native validation UX (inline errors, required marks). Zod defines the schema. No need for a third form library. |
| File upload | Antd Upload + local fs | Custom dropzone + S3 | Antd Upload gives drag-and-drop + file list UI. Local fs for demo scope. |
| Testing | Component + API tests | E2E (Cypress/Playwright) | Component tests give fast feedback. E2E adds setup overhead for a 24hr take-home with 2 screens. |
| Detail view | Expandable rows | Separate detail page | Keeps user in table context, less navigation. Satisfies "all information" requirement without leaving the mock's layout. |
