# Breezy Starter

Bo'sh template, React + Vite + TypeScript + Tailwind + shadcn/ui. Asosiy
`breezy-admin-starter` dan demo kod tashlangan, lekin barcha shadcn/ui
komponentlari va dependency'lar joyida — copy-paste qiling, ishlaydi.

## Boshlash

```sh
npm install
cp .env.example .env
npm run dev
```

Default `http://localhost:8080`. Birinchi sahifa — **Welcome** — to'liq
foydalanish qo'llanmasi.

## Scriptlar

| Komanda            | Maqsad                       |
| ------------------ | ---------------------------- |
| `npm run dev`      | Dev server                   |
| `npm run build`    | Production build (`dist/`)   |
| `npm run preview`  | Build'ni lokal preview qilish |
| `npm run lint`     | ESLint                       |
| `npm run typecheck`| `tsc --noEmit`               |

## Performance

- Routes lazy() + Suspense
- Vite tree-shaking — ishlatilmagan shadcn komponentlari va radix
  paketlari production bundle'ga tushmaydi
- CSS code splitting
- Production'da source map yo'q

## Templatedan component ko'chirish

```sh
# misol: Sidebar
cp ../src/components/layout/Sidebar.tsx src/components/layout/Sidebar.tsx
```

`@/*` alias bir xil bo'lgani uchun import'lar avtomat ishlaydi. Yangi
dependency kerak bo'lsa (masalan service), faylni birga olib keling.

## Path alias

`@/*` → `src/*` (Vite + TypeScript ikkalasida ham sozlangan).

## Folder map

```
starter/
├── src/
│   ├── main.tsx                # root + ThemeProvider
│   ├── App.tsx                 # router + lazy pages + Toaster
│   ├── index.css               # tailwind + design tokens
│   ├── lib/utils.ts            # cn()
│   ├── hooks/                  # use-toast, use-mobile
│   ├── components/
│   │   ├── theme-provider.tsx  # light/dark/system
│   │   └── ui/                 # shadcn primitives
│   └── pages/
│       ├── Welcome.tsx
│       └── NotFound.tsx
```
