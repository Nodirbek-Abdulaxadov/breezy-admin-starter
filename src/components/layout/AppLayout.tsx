import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Footer } from "./Footer";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const SIDEBAR_BREAKPOINT = 1024; // lg
const SIDEBAR_STATE_KEY = "ui.sidebarOpen";

const AppLayout = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < SIDEBAR_BREAKPOINT : false,
  );
  const [desktopOpen, setDesktopOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem(SIDEBAR_STATE_KEY);
    return saved === null ? true : saved === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < SIDEBAR_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isMobile) localStorage.setItem(SIDEBAR_STATE_KEY, String(desktopOpen));
  }, [desktopOpen, isMobile]);

  // Close mobile drawer whenever switching to desktop.
  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const toggleSidebar = () => {
    if (isMobile) setMobileOpen((v) => !v);
    else setDesktopOpen((v) => !v);
  };

  const sidebarOpen = isMobile ? mobileOpen : desktopOpen;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:shadow"
      >
        Skip to main content
      </a>
      <div className="flex h-screen bg-background text-foreground">
        {!isMobile && <Sidebar isOpen={desktopOpen} isMobile={false} />}

        {isMobile && (
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetContent side="left" className="w-64 max-w-[80vw] p-0">
              <Sidebar isOpen={true} isMobile={true} />
            </SheetContent>
          </Sheet>
        )}

        <div className="flex w-full min-w-0 flex-1 flex-col">
          <Topbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
          <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-6" tabIndex={-1}>
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default AppLayout;
