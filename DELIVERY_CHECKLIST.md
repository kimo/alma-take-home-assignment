# Delivery Checklist

## 1. Functional Requirements

### 1.1 Public Lead Form (`/`)

| # | Requirement | Status | Where |
|---|-------------|--------|-------|
| 1 | First Name input | Done | `LeadForm.tsx` — Antd `<Input>` |
| 2 | Last Name input | Done | `LeadForm.tsx` — Antd `<Input>` |
| 3 | Email input | Done | `LeadForm.tsx` — Antd `<Input>` |
| 4 | Country of Citizenship dropdown | Done | `LeadForm.tsx` — Antd `<Select>` with 100+ countries |
| 5 | LinkedIn / Website URL input | Done | `LeadForm.tsx` — Antd `<Input>` |
| 6 | Visa categories of interest (checkboxes) | Done | `LeadForm.tsx` — Antd `<Checkbox.Group>` (O-1, EB-1A, EB-2 NIW, I don't know) |
| 7 | Open long input ("How can we help you?") | Done | `LeadForm.tsx` — Antd `<TextArea>` |
| 8 | Resume / CV file upload | Done | `LeadForm.tsx` — Antd `<Upload.Dragger>` (.pdf, .doc, .docx) |
| 9 | Form validation with inline error messages | Done | Antd Form rules + Zod schema (required, email format, URL format) |
| 10 | Submit button | Done | Black pill-shaped button, centered |
| 11 | Match the mock (hero section, 3 form sections with icons) | Done | Green gradient hero, purple/blue 3D icons per section |

### 1.2 Thank You Page (`/thank-you`)

| # | Requirement | Status | Where |
|---|-------------|--------|-------|
| 1 | Confirmation message after form submission | Done | `thank-you/page.tsx` |
| 2 | "Go Back to Homepage" button | Done | Links to `/` |
| 3 | Match the mock (checkmark icon, text) | Done | Purple/blue checkmark, confirmation text |

### 1.3 Login Page (`/login`)

| # | Requirement | Status | Where |
|---|-------------|--------|-------|
| 1 | Login form with email and password | Done | `login/page.tsx` — Antd `<Form>` |
| 2 | Alma logo | Done | `next/image` with `/alma-logo.svg` |
| 3 | Redirects to dashboard on success | Done | `signIn()` + `router.push("/dashboard")` |
| 4 | Error message on invalid credentials | Done | `message.error("Invalid credentials")` |

### 1.4 Internal Leads List UI (`/dashboard`)

| # | Requirement | Status | Where |
|---|-------------|--------|-------|
| 1 | Internal UI guarded by authentication | Done | NextAuth session check, redirects to `/login` |
| 2 | Display list of leads with all information | Done | Table (4 summary columns) + expandable row (email, LinkedIn, visas, resume, message) |
| 3 | Status starts as PENDING | Done | Default status in store + API |
| 4 | Button to transition PENDING → REACHED_OUT | Done | "Mark as Reached Out" button in Action column |
| 5 | Search by name | Done | Search input filters leads by name |
| 6 | Status filter dropdown | Done | All / Pending / Reached Out |
| 7 | Sortable columns | Done | Name, Submitted, Status, Country — all sortable |
| 8 | Pagination | Done | 13 rows per page |
| 9 | Sidebar with navigation | Done | Leads + Settings nav, logo, user avatar, theme toggle, logout |
| 10 | Match the mock (table layout, sidebar) | Done | Matches mock closely |

---

## 2. Tech Requirements

| # | Requirement | Status | Implementation |
|---|-------------|--------|----------------|
| 1 | Use Next.js | Done | Next.js 15, App Router |
| 2 | TypeScript | Done | Full TypeScript, Zod infers types, `Lead` interface in `lib/types.ts` |
| 3 | Style with CSS or CSS-in-JS | Done | AntD CSS-in-JS (`@ant-design/cssinjs` design tokens) + Tailwind CSS for layout |
| 4 | Mock API or use Next.js API routes | Done | 5 real API routes (not mocked) — see API table below |
| 5 | Mock authentication | Done | NextAuth.js credentials provider (`admin@tryalma.ai` / `admin`) |
| 6 | File upload for resume/CV | Done | Multipart FormData → local filesystem (`uploads/`) |
| 7 | Form validation | Done | Antd Form rules + Zod schema, inline error messages |

### API Routes

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `POST` | `/api/leads` | Public | Create lead (multipart FormData with file) |
| `GET` | `/api/leads` | Required | List leads with pagination, search, status filter |
| `PATCH` | `/api/leads/[id]` | Required | Update lead status (PENDING → REACHED_OUT) |
| `GET` | `/api/form-config` | Public | Get current form JSON Schema |
| `PUT` | `/api/form-config` | Required | Update form JSON Schema |

---

## 3. Submission Guidance

| # | Item | Status |
|---|------|--------|
| 1 | Public GitHub repo | Done — `github.com/kimo/alma-take-home-assignment` |
| 2 | README with setup instructions | Done — 3 commands: clone, install, run |
| 3 | Zero config (no `.env` needed) | Done — NextAuth secret has hardcoded fallback |
| 4 | System design document | Done — `DESIGN.md` |
| 5 | `npm run lint` — 0 errors | Done |
| 6 | `npm test` — 40 tests pass | Done — 5 suites, 40 tests |
| 7 | `npm run build` — clean build | Done |

---

## 4. Bonus Points

| # | Bonus | Status | Implementation |
|---|-------|--------|----------------|
| 1 | Next.js API routes | Done | 5 real endpoints with in-memory store |
| 2 | JsonForms (config-driven) | Done | JSON Schema (draft-07), Settings editor, dynamic country dropdown |
| 3 | Unit tests | Done | 40 tests — Jest + React Testing Library (5 suites) |
| 4 | Responsive design | Done | Mobile card view for leads, responsive form, Tailwind breakpoints |
| 5 | TypeScript | Done | Full TypeScript, Zod type inference |
| 6 | Form validation feedback | Done | Inline error messages per field (required, email, URL) |
| 7 | System design document | Done | `DESIGN.md` — architecture diagrams, data flow, trade-offs, scaling |
| 8 | Resume / CV file upload | Done | Antd `<Upload.Dragger>` + multipart FormData + local filesystem storage |
| 9 | State management (Redux) | Done | Redux Toolkit — `createSlice`, `configureStore`, typed hooks |
| 10 | Server state (React Query) | Done | TanStack React Query — `useQuery`, `useMutation`, caching, cache invalidation |
| 11 | Dark mode | Done | AntD `ConfigProvider` theme tokens + conditional Tailwind classes, toggle in sidebar |
