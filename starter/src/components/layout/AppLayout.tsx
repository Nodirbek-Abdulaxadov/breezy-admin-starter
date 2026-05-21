import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const BREAKPOINT = 1024;
const STORAGE_KEY = "ui.sidebarOpen";

export default function AppLayout() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < BREAKPOINT);
  const [desktopOpen, setDesktopOpen] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === null ? true : saved === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isMobile) localStorage.setItem(STORAGE_KEY, String(desktopOpen));
  }, [desktopOpen, isMobile]);

  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const toggleSidebar = () => {
    if (isMobile) setMobileOpen((v) => !v);
    else setDesktopOpen((v) => !v);
  };

  const sidebarOpen = isMobile ? mobileOpen : desktopOpen;

  return (
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
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
