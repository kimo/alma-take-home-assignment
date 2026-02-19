# Alma Lead Management

A Next.js application for managing immigration visa leads. Public prospects submit their information via a form, and internal admins manage leads through an authenticated dashboard.

## Quick Start

```bash
git clone https://github.com/kimo/alma-take-home-assignment.git
cd alma-take-home-assignment
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — no `.env` setup required.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Public lead form — prospects submit visa assessment requests |
| `/thank-you` | Confirmation page after form submission |
| `/login` | Admin login page |
| `/dashboard` | Authenticated leads management table |
| `/dashboard/settings` | Form configuration (JSON Schema editor) |

### Login Credentials

```
Email:    admin@tryalma.ai
Password: admin
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, TypeScript) |
| UI | AntD + Tailwind CSS |
| Auth | NextAuth.js (credentials provider, JWT sessions) |
| Validation | Zod schemas wired to Antd Form rules |
| Storage | In-memory store (Map) with seed data |
| Testing | Jest + React Testing Library |

## API Endpoints

```
POST   /api/leads          Create a new lead (multipart FormData)
GET    /api/leads           List leads (?page=1&limit=8&search=&status=)
PATCH  /api/leads/[id]      Update lead status (PENDING → REACHED_OUT)
GET    /api/form-config     Get current form JSON Schema (public)
PUT    /api/form-config     Update form JSON Schema (auth required)
```

## Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm run lint      # ESLint
npm test          # Run all tests (40 tests across 5 suites)
```

### Running Tests

```bash
npm test                    # Run all tests
npm test -- --verbose       # Verbose output with test names
npm test -- --coverage      # Generate coverage report
npm test -- --watch         # Watch mode for development
```

Tests cover:
- **Store** — CRUD operations, sorting, seed data integrity (11 tests)
- **Schema** — Zod validation for lead form and status update (7 tests)
- **Form Config** — JSON Schema store, cloning, updates (6 tests)
- **LeadForm** — Form rendering, fields, checkboxes, upload area (7 tests)
- **LeadsTable** — Table rendering, fetch, filters, pagination (9 tests)

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Public lead form
│   ├── thank-you/page.tsx          # Confirmation page
│   ├── login/page.tsx              # Login page
│   ├── dashboard/
│   │   ├── layout.tsx              # Sidebar + auth guard + theme provider
│   │   ├── page.tsx                # Leads table
│   │   └── settings/page.tsx       # Form config (JSON Schema editor)
│   └── api/
│       ├── leads/route.ts          # GET (auth) + POST (public)
│       ├── leads/[id]/route.ts     # PATCH (auth)
│       ├── form-config/route.ts    # GET (public) + PUT (auth)
│       └── auth/[...nextauth]/     # NextAuth handler
├── components/
│   ├── LeadForm.tsx                # Public form (3 sections + upload)
│   ├── LeadsTable.tsx              # Dashboard table + mobile cards
│   └── Sidebar.tsx                 # Dashboard sidebar + theme toggle
├── lib/
│   ├── types.ts                    # TypeScript interfaces
│   ├── schema.ts                   # Zod validation schemas
│   ├── store.ts                    # In-memory data store
│   ├── seed.ts                     # 20 seed leads
│   ├── auth.ts                     # NextAuth config
│   ├── theme.ts                    # AntD theme tokens (light + dark)
│   └── formConfigStore.ts         # JSON Schema config store
└── __tests__/
    ├── api/
    │   ├── leads.test.ts           # Store CRUD tests
    │   ├── schema.test.ts          # Validation tests
    │   └── formConfig.test.ts      # Form config store tests
    └── components/
        ├── LeadForm.test.tsx       # Form rendering tests
        └── LeadsTable.test.tsx     # Table rendering tests
```

## Design Decisions

See [DESIGN.md](DESIGN.md) for architecture diagrams, data flow, and trade-off analysis.

See [APPROACH.md](APPROACH.md) for the full planning process, mock analysis, and implementation log.
