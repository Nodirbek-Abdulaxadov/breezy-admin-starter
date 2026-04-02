
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Users = lazy(() => import("./pages/Users"));
const Settings = lazy(() => import("./pages/Settings"));
const Reports = lazy(() => import("./pages/Reports"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const Messages = lazy(() => import("./pages/Messages"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Products = lazy(() => import("./pages/Products"));
const Orders = lazy(() => import("./pages/Orders"));
const Customers = lazy(() => import("./pages/Customers"));
const ComponentsOverview = lazy(() => import("./pages/components/ComponentsOverview"));
const ButtonsPage = lazy(() => import("./pages/components/ButtonsPage"));
const FormsPage = lazy(() => import("./pages/components/FormsPage"));
const InputsPage = lazy(() => import("./pages/components/InputsPage"));
const DialogsPage = lazy(() => import("./pages/components/DialogsPage"));
const DatatablesPage = lazy(() => import("./pages/components/DatatablesPage"));
const MiscComponentsPage = lazy(() => import("./pages/components/MiscComponentsPage"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Loading...</div>}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/components" element={<ComponentsOverview />} />
                <Route path="/components/buttons" element={<ButtonsPage />} />
                <Route path="/components/forms" element={<FormsPage />} />
                <Route path="/components/inputs" element={<InputsPage />} />
                <Route path="/components/dialogs" element={<DialogsPage />} />
                <Route path="/components/datatables" element={<DatatablesPage />} />
                <Route path="/components/misc" element={<MiscComponentsPage />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
