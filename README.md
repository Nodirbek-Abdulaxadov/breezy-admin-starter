# Breezy Admin Starter

A production-ready React admin dashboard starter template built with Vite, TypeScript, shadcn/ui, and Tailwind CSS.

---

## Quick Start

```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>

# 2. Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# 3. Install dependencies (Node.js ≥ 18 required)
npm install        # or: bun install

# 4. Start the development server
npm run dev        # or: bun dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Default credentials** — any email / any password (auth is mocked).

---

## Project Structure

```
src/
├── components/
│   ├── auth/          # ProtectedRoute wrapper
│   ├── layout/        # AppLayout, Sidebar, Topbar, Footer, ThemeProvider
│   └── ui/            # shadcn/ui primitives (button, dialog, table …)
├── context/           # AuthContext
├── hooks/             # use-mobile, use-toast
├── lib/               # utils (cn helper)
├── pages/             # One file per route
│   └── components/    # UI component showcase pages
├── services/
│   ├── dataService.ts # Read-only mock data for Products & Orders
│   └── mockApi.ts     # In-memory CRUD mock API (see below)
└── types/
    └── data.ts        # Shared TypeScript interfaces
```

---

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | KPI cards, charts, activity feed |
| `/users` | Users | User list |
| `/products` | Products | Product catalog with CRUD |
| `/orders` | Orders | Order management |
| `/customers` | Customers | Customer records |
| `/reports` | Reports | Analytics & reports |
| `/calendar` | Calendar | Event calendar |
| `/messages` | Messages | Inbox |
| `/notifications` | Notifications | Notification center |
| `/crud-example` | **CRUD Example** | Full Create/Read/Update/Delete demo |
| `/components/*` | Components | UI component showcase |
| `/settings` | Settings | App settings |
| `/profile` | Profile | User profile |
| `/login` | Login | Auth page |

---

## CRUD Example (Mock API)

The **CRUD Example** page (`/crud-example`) demonstrates how to wire up full Create / Read / Update / Delete operations against a simulated REST back-end.

### Mock API — `src/services/mockApi.ts`

The mock API maintains an **in-memory store** that survives navigation but resets on hard refresh — ideal for prototyping before connecting a real back-end.

```ts
import { mockApi } from "@/services/mockApi";

// READ — GET /employees
const employees = await mockApi.employees.list();

// CREATE — POST /employees
const created = await mockApi.employees.create({
  name: "Jane Doe",
  email: "jane@example.com",
  role: "Designer",
  department: "Design",
  status: "Active",
});

// UPDATE — PUT /employees/:id
const updated = await mockApi.employees.update(created.id, {
  ...created,
  role: "Senior Designer",
});

// DELETE — DELETE /employees/:id
await mockApi.employees.delete(created.id);
```

Each method adds a small artificial delay (400 ms) to simulate real network latency.

### React Query integration

The CRUD page uses `@tanstack/react-query` for data fetching and cache management:

```tsx
// Fetch list
const { data: employees, isLoading } = useQuery({
  queryKey: ["employees"],
  queryFn: () => mockApi.employees.list(),
});

// Mutate + invalidate cache
const createMutation = useMutation({
  mutationFn: (data) => mockApi.employees.create(data),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
});
```

### Replacing with a real API

Swap the `mockApi` calls in `src/services/mockApi.ts` with `fetch` / `axios` calls pointing at your real endpoints. The page component and React Query hooks require **no changes**.

---

## Technologies

| Tool | Purpose |
|------|---------|
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [React 18](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [shadcn/ui](https://ui.shadcn.com/) | Accessible UI components |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [React Router v6](https://reactrouter.com/) | Client-side routing |
| [TanStack Query v5](https://tanstack.com/query) | Async state & cache |
| [Lucide React](https://lucide.dev/) | Icon set |

---

## Available Scripts

```sh
npm run dev      # Start development server
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
npm run lint     # ESLint
```

---

## Deployment

Build the project with `npm run build` and deploy the `dist/` folder to any static host (Vercel, Netlify, GitHub Pages, etc.).

For Lovable users: open the [Lovable Project](https://lovable.dev/projects/29346176-0020-48eb-aca2-ff3a34991216) and click **Share → Publish**.
