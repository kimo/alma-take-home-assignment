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

### Login Credentials

```
Email:    admin@tryalma.ai
Password: admin
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, TypeScript) |
| UI | Ant Design 5 + Tailwind CSS |
| Auth | NextAuth.js (credentials provider, JWT sessions) |
| Validation | Zod schemas wired to Antd Form rules |
| Storage | In-memory store (Map) with seed data |
| Testing | Jest + React Testing Library |

## API Endpoints

```
POST   /api/leads          Create a new lead (multipart FormData)
GET    /api/leads           List leads (?page=1&limit=8&search=&status=)
PATCH  /api/leads/[id]      Update lead status (PENDING → REACHED_OUT)
```

## Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm run lint      # ESLint
npm test          # Run tests (13 tests across 2 suites)
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Public lead form
│   ├── thank-you/page.tsx          # Confirmation page
│   ├── login/page.tsx              # Login page
│   ├── dashboard/
│   │   ├── layout.tsx              # Sidebar + auth guard
│   │   └── page.tsx                # Leads table
│   └── api/
│       ├── leads/route.ts          # GET + POST
│       ├── leads/[id]/route.ts     # PATCH
│       └── auth/[...nextauth]/     # NextAuth handler
├── components/
│   ├── LeadForm.tsx                # Public form (3 sections + upload)
│   ├── LeadsTable.tsx              # Dashboard table
│   └── Sidebar.tsx                 # Dashboard sidebar
├── lib/
│   ├── types.ts                    # TypeScript interfaces
│   ├── schema.ts                   # Zod validation schemas
│   ├── store.ts                    # In-memory data store
│   ├── seed.ts                     # 8 mock leads matching mocks
│   ├── auth.ts                     # NextAuth config
│   └── theme.ts                    # Antd theme tokens
└── __tests__/
    └── api/
        ├── leads.test.ts           # Store CRUD tests
        └── schema.test.ts          # Validation tests
```

## Design Decisions

See [DESIGN.md](DESIGN.md) for architecture diagrams, data flow, and trade-off analysis.

See [APPROACH.md](APPROACH.md) for the full planning process, mock analysis, and implementation log.
