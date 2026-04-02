
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Footer } from "./Footer";
import { ThemeProvider } from "./ThemeProvider";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="admin-theme">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:shadow"
      >
        Skip to main content
      </a>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar isOpen={sidebarOpen} isMobile={isMobile} />
        <div className="flex flex-col flex-1 w-full">
          <Topbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
          <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-6" tabIndex={-1}>
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AppLayout;
