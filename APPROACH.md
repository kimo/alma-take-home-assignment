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
| # | Bonus | Decision | Rationale |
|---|-------|----------|-----------|
| 1 | Next.js API routes | YES | Trivial to add, shows full-stack |
| 2 | JsonForms (config-driven) | SKIP | High learning curve, risky for 24hr timeline |
| 3 | State management (Redux) | SKIP — use React Query | Redux is overkill here, React Query is more appropriate for server state |
| 4 | Unit tests | YES | Key components only — form + leads table |
| 5 | Responsive design | YES | Tailwind makes this easy |
| 6 | TypeScript | YES | Free win, already standard |
| 7 | Form validation feedback | YES | Zod + react-hook-form |
| 8 | System design document | YES | Required anyway, make it thorough |

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
  - First Name (text input, placeholder style)
  - Last Name (text input)
  - Email (text input)
  - Country of Citizenship (dropdown with chevron — NOTE: not in written requirements but IS in mock)
  - LinkedIn / Personal Website URL (text input)

**Section 2: Visa Interest** (briefcase/suitcase icon)
- Heading: "Visa categories of interest?"
- Checkboxes (multi-select):
  - O-1
  - EB-1A
  - EB-2 NIW
  - I don't know

**Section 3: Additional Info** (heart icon)
- Heading: "How can we help you?"
- Large textarea with placeholder text
- Resume/CV upload (in requirements, not clearly visible in mock — add between sections 2 and 3 or after textarea)

**Submit:**
- Black pill-shaped button, centered: "Submit"

**Confirmation Page (after submit):**
- Clean white page, centered
- Purple/blue checkmark icon
- "Thank You" heading (bold)
- "Your information was submitted to our team of immigration attorneys. Expect an email from hello@tryalma.ai"
- Black pill button: "Go Back to Homepage"

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

**Observations:**
- Table only shows 4 columns, not all form fields — detail view needed for full info
- No visible "change status" button — likely clicking status or row opens detail/action
- Search likely filters by name
- Status dropdown filters by Pending/Reached Out

---

## 3. Architecture Decisions

### Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 15 (App Router) | Required. App Router is current standard. |
| Language | TypeScript | Bonus points + type safety |
| Styling | Tailwind CSS | Fast to implement, responsive out of box, clean output |
| Form handling | react-hook-form + Zod | Industry standard, great validation UX |
| API | Next.js API routes | Bonus points, keeps it self-contained |
| Storage | In-memory store (Map) | Take-home scope — no need for a real DB. Data persists during server lifetime. |
| Auth | NextAuth.js with credentials provider | Real auth pattern with mock credentials (admin@tryalma.ai / admin) |
| Testing | Jest + React Testing Library | Standard for Next.js |
| File upload | Next.js API route + local filesystem | Simple, works for demo |

### Why NOT these alternatives:
- **SQLite/Prisma** — overkill for a take-home, adds setup complexity for the reviewer
- **Redux** — the assignment suggests it, but this app has simple server state. React Query or even server components + fetch is cleaner. Would mention in design doc as a conscious trade-off.
- **JsonForms** — learning curve too high for 24hr timeline, risk of burning time
- **styled-components** — Tailwind is faster to ship and matches the clean mock aesthetic

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
- [ ] Set up project structure (folders, types, schema)
- [ ] Initialize git repo
- [ ] Add seed data

### Phase 2: API Routes (~30 min)
- [ ] In-memory store with seed data
- [ ] POST /api/leads (create, handle file upload)
- [ ] GET /api/leads (list with pagination, search, status filter)
- [ ] PATCH /api/leads/[id] (status update)

### Phase 3: Public Lead Form (~1.5 hr)
- [ ] Hero section (green gradient + heading)
- [ ] Form sections with icons and headings
- [ ] All 7+ fields with proper types (dropdown, checkboxes, textarea, file)
- [ ] Zod validation + error messages
- [ ] Submit → POST to API → redirect to thank-you page
- [ ] Thank-you confirmation page

### Phase 4: Dashboard (~1.5 hr)
- [ ] NextAuth setup with mock credentials
- [ ] Login page
- [ ] Sidebar component (nav + user)
- [ ] Leads table with columns matching mock
- [ ] Search functionality
- [ ] Status filter dropdown
- [ ] Pagination (8 per page)
- [ ] Status toggle (PENDING → REACHED_OUT)

### Phase 5: Polish (~1 hr)
- [ ] Responsive design check (mobile form, mobile table)
- [ ] Loading states
- [ ] Error handling
- [ ] Match mock styling precisely (spacing, fonts, colors)

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

## 5. Progress Log

_Will be updated as we build._

### Session Start
- Analyzed assignment requirements
- Analyzed both mockups in detail
- Made architecture decisions
- Created implementation plan
- **Decision:** Skip JsonForms and Redux in favor of shipping a polished, well-tested core

---

## 6. Design Trade-offs (for DESIGN.md later)

| Decision | Chose | Over | Why |
|----------|-------|------|-----|
| App Router | Next.js App Router | Pages Router | Modern standard, better server components |
| Storage | In-memory Map | SQLite/Prisma | Zero setup for reviewer, sufficient for demo |
| Auth | NextAuth credentials | Custom JWT | Real auth library, production pattern |
| Styling | Tailwind CSS | styled-components | Faster to ship, better responsive utilities |
| State | Server components + fetch | Redux | Simpler for this scope, less boilerplate |
| Validation | Zod + react-hook-form | Manual validation | Type-safe schemas, great error UX |
| File upload | Local filesystem | S3/cloud | Demo scope, no external dependencies |
