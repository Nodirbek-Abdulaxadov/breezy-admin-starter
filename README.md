# Breezy Admin

A production-ready React admin dashboard starter built with Vite, TypeScript, shadcn/ui, and Tailwind CSS.

---

## Features

- Vite + React 18 + TypeScript
- shadcn/ui component library on top of Radix primitives
- Tailwind CSS with design tokens and `tailwindcss-animate`
- React Router v6 with nested layouts
- TanStack Query v5 for async state and caching
- React Hook Form + Zod for type-safe forms and validation
- Type-safe API client with a single source of truth for endpoints
- Mock-API toggle (`VITE_USE_MOCK_API`) for local prototyping without a backend
- i18n with English and Uzbek locales
- Dark mode via `next-themes`
- Mobile-first responsive layout (collapsible sidebar, adaptive topbar)
- Generic `DataTable` with sorting, pagination, and column controls
- `ProtectedRoute` guard backed by `AuthContext`
- Global `ErrorBoundary` with graceful fallback UI
- Prettier + Husky + lint-staged pre-commit pipeline

---

## Quick Start

```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>

# 2. Enter the project directory
cd breezy-admin-starter

# 3. Install dependencies (Node.js >= 18)
npm install        # or: bun install

# 4. Configure environment
cp .env.example .env

# 5. Start the development server
npm run dev        # or: bun dev
```

Open http://localhost:8080 in your browser.

---

## Environment Variables

| Variable             | Required | Default                       | Description                                                                 |
| -------------------- | -------- | ----------------------------- | --------------------------------------------------------------------------- |
| `VITE_API_URL`       | yes      | `http://localhost:5000/api`   | Backend API base URL (no trailing slash).                                   |
| `VITE_USE_MOCK_API`  | no       | `true`                        | When `true`, services use the in-memory mock API instead of `VITE_API_URL`. |
| `VITE_APP_NAME`      | no       | `Breezy Admin`                | Application name shown in the topbar and document title.                    |

---

## Folder Structure

```
src/
├── components/
│   ├── auth/          # ProtectedRoute wrapper
│   ├── layout/        # AppLayout, Sidebar, Topbar, Footer, ThemeProvider
│   ├── shared/        # DataTable, ErrorBoundary, reusable widgets
│   └── ui/            # shadcn/ui primitives (button, dialog, table, ...)
├── context/           # AuthContext and other React contexts
├── hooks/             # Reusable hooks (use-mobile, use-toast, ...)
├── i18n/              # Translation resources (en, uz)
├── lib/               # Utilities (cn helper, formatters, validators)
├── pages/             # One file per route
│   └── components/    # UI component showcase pages
├── services/          # API client, mockApi, domain services
└── types/             # Shared TypeScript interfaces
```

---

## Routing

| Route              | Page              | Description                                  |
| ------------------ | ----------------- | -------------------------------------------- |
| `/`                | Dashboard         | KPI cards, charts, activity feed             |
| `/users`           | Users             | User management                              |
| `/products`        | Products          | Product catalog                              |
| `/orders`          | Orders            | Order management                             |
| `/customers`       | Customers         | Customer records                             |
| `/reports`         | Reports           | Analytics and reports                        |
| `/calendar`        | Calendar          | Event calendar                               |
| `/messages`        | Messages          | Inbox                                        |
| `/notifications`   | Notifications     | Notification center                          |
| `/crud-example`    | CRUD Example      | Full create / read / update / delete demo    |
| `/components/*`    | Components        | UI component showcase                        |
| `/settings`        | Settings          | Application settings                         |
| `/profile`         | Profile           | User profile                                 |
| `/login`           | Login             | Authentication page                          |

---

## Mock vs Real API

The data layer reads `VITE_USE_MOCK_API` at boot:

- `VITE_USE_MOCK_API=true` — every service call is routed to `src/services/mockApi.ts`, an in-memory store with simulated latency. Useful for local development and UI work before a backend exists.
- `VITE_USE_MOCK_API=false` — services use the typed API client and hit `VITE_API_URL`. Endpoints, request shapes, and response types stay identical, so toggling the flag does not require changes to pages, hooks, or components.

This keeps prototyping and production code paths in sync and avoids parallel implementations.

---

## Available Scripts

| Command             | Description                                    |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start the Vite dev server                      |
| `npm run build`     | Production build to `dist/`                    |
| `npm run preview`   | Preview the production build locally           |
| `npm run lint`      | Run ESLint across the project                  |
| `npm run format`    | Format `src/` with Prettier                    |
| `npm run typecheck` | Run `tsc --noEmit` for a strict type check     |

---

## Deployment

1. Set the required environment variables on the target platform.
2. Run `npm run build` to produce the `dist/` directory.
3. Serve `dist/` from any static host (Vercel, Netlify, Cloudflare Pages, S3 + CloudFront, Nginx, etc.).

For SPA routing, ensure the host rewrites unknown paths to `index.html`.

---

## License

TBD.
