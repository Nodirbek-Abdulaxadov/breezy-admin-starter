import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const PRE_INSTALLED = [
  "accordion",
  "alert",
  "alert-dialog",
  "aspect-ratio",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "calendar",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "collapsible",
  "command",
  "context-menu",
  "dialog",
  "drawer",
  "dropdown-menu",
  "form",
  "hover-card",
  "input",
  "input-otp",
  "label",
  "menubar",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "sonner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toast",
  "toaster",
  "toggle",
  "toggle-group",
  "tooltip",
];

const Code = ({ children }: { children: React.ReactNode }) => (
  <pre className="overflow-x-auto rounded-md border bg-muted/40 p-3 text-xs leading-relaxed">
    <code>{children}</code>
  </pre>
);

export default function Welcome() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Breezy Starter</h1>
        <p className="mt-2 text-muted-foreground">
          Bo'sh React + Vite + TypeScript + Tailwind + shadcn/ui asosi. Sidebar, topbar, auth,
          profile sahifalar — barchasi tayyor.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stack</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-1 text-muted-foreground">
              <li>React 18 + Vite + SWC</li>
              <li>TypeScript strict</li>
              <li>Tailwind + shadcn/ui</li>
              <li>react-router-dom v6</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Auth & Layout</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-1 text-muted-foreground">
              <li>AuthProvider (mock)</li>
              <li>ProtectedRoute</li>
              <li>Sidebar + Topbar</li>
              <li>Login / Profile / Forgot</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-1 text-muted-foreground">
              <li>Route lazy() + Suspense</li>
              <li>Vite tree-shaking</li>
              <li>CSS code splitting</li>
              <li>No source map in prod</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="start" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="start">Boshlash</TabsTrigger>
          <TabsTrigger value="page">Yangi page</TabsTrigger>
          <TabsTrigger value="auth">Auth</TabsTrigger>
          <TabsTrigger value="structure">Struktura</TabsTrigger>
        </TabsList>

        <TabsContent value="start" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick start</CardTitle>
              <CardDescription>3 qadam — ishlatishga tayyor.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="mb-2 font-medium">1. Dependency'larni o'rnatish</p>
                <Code>npm install</Code>
              </div>
              <div>
                <p className="mb-2 font-medium">2. Dev serverni ishga tushirish</p>
                <Code>npm run dev</Code>
                <p className="mt-2 text-muted-foreground">
                  Default port: <code className="rounded bg-muted px-1">http://localhost:8080</code>
                </p>
              </div>
              <div>
                <p className="mb-2 font-medium">3. Login</p>
                <p className="text-muted-foreground">
                  Istalgan email/parol bilan kirish mumkin (mock auth, localStorage).
                </p>
              </div>
              <Separator />
              <div className="grid gap-2 text-muted-foreground sm:grid-cols-2">
                <div>
                  <code className="rounded bg-muted px-1">npm run build</code> — production
                </div>
                <div>
                  <code className="rounded bg-muted px-1">npm run preview</code> — build ko'rish
                </div>
                <div>
                  <code className="rounded bg-muted px-1">npm run lint</code> — ESLint
                </div>
                <div>
                  <code className="rounded bg-muted px-1">npm run typecheck</code> — tsc
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="page" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Yangi sahifa qo'shish</CardTitle>
              <CardDescription>
                Har sahifa lazy() bilan yuklanadi — chunk faqat kerak bo'lganda yuklanadi.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="mb-2 font-medium">1. Sahifa fayli</p>
                <Code>{`// src/pages/Reports.tsx
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function Reports() {
  return (
    <Card>
      <CardHeader><CardTitle>Reports</CardTitle></CardHeader>
    </Card>
  );
}`}</Code>
              </div>
              <div>
                <p className="mb-2 font-medium">2. Route + sidebar item</p>
                <Code>{`// src/App.tsx
const Reports = lazy(() => import("./pages/Reports"));
<Route path="/reports" element={<Reports />} />

// src/components/layout/Sidebar.tsx — NAV array'ga qo'shing
{ to: "/reports", icon: FileText, label: "Reports" }`}</Code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auth qatlami</CardTitle>
              <CardDescription>
                Mock implementation — istalgan email/parol qabul qilinadi. Real backend uchun{" "}
                <code className="rounded bg-muted px-1">AuthProvider.tsx</code> ichidagi
                <code className="ml-1 rounded bg-muted px-1">login()</code> ni almashtiring.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Code>{`// AuthProvider.tsx — real backend
const login = useCallback(async (email, password) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login muvaffaqiyatsiz");
  const { accessToken, user } = await res.json();
  localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  setUser(user);
}, []);`}</Code>
              <p className="text-muted-foreground">
                Token <code className="rounded bg-muted px-1">localStorage</code> da
                <code className="ml-1 rounded bg-muted px-1">auth.token</code> kalitida saqlanadi.
                ProtectedRoute avtomatik <code className="ml-1 rounded bg-muted px-1">/login</code>
                ga yo'naltiradi.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Oldindan o'rnatilgan komponentlar</CardTitle>
              <CardDescription>
                <code>src/components/ui/</code> ichida. Import qilmasangiz, bundle'ga tushmaydi
                (tree-shaking).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {PRE_INSTALLED.map((name) => (
                  <Badge key={name} variant="secondary" className="font-mono text-xs">
                    {name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Struktura</CardTitle>
              <CardDescription>Minimal, faqat zarur fayllar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Code>{`src/
├── main.tsx              # root render + ThemeProvider
├── App.tsx               # router + lazy routes + AuthProvider
├── index.css             # tailwind + tokens
├── lib/utils.ts          # cn()
├── hooks/
│   ├── use-auth.ts       # useAuth()
│   ├── use-toast.ts
│   └── use-mobile.tsx
├── context/
│   ├── auth-context.ts
│   └── AuthProvider.tsx
├── components/
│   ├── theme-provider.tsx
│   ├── auth/ProtectedRoute.tsx
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── ThemeToggle.tsx
│   └── ui/               # 47 shadcn primitives
└── pages/
    ├── Dashboard.tsx
    ├── Welcome.tsx
    ├── Profile.tsx
    ├── Login.tsx
    ├── ForgotPassword.tsx
    └── NotFound.tsx`}</Code>
              <Separator />
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Path alias.</span>{" "}
                  <code className="rounded bg-muted px-1">@/*</code> ={" "}
                  <code className="rounded bg-muted px-1">src/*</code>
                </p>
                <p>
                  <span className="font-medium text-foreground">Performance.</span> Har page alohida
                  chunk; initial bundle'da faqat React + router + AuthProvider + ThemeProvider bor.
                </p>
                <p>
                  <span className="font-medium text-foreground">Theme.</span> Topbar'dagi toggle
                  orqali light / dark / system tanlanadi, localStorage'da saqlanadi.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <footer className="text-center text-xs text-muted-foreground">
        Breezy Starter · React + Vite + Tailwind + shadcn/ui
      </footer>
      <div className="flex justify-center">
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Reload
        </Button>
      </div>
    </div>
  );
}
