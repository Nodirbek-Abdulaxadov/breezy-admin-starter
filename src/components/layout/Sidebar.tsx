import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  Users,
  Settings,
  LayoutDashboard,
  FileText,
  Bell,
  Calendar,
  MessageSquare,
  ShoppingBag,
  ClipboardList,
  UserRound,
  Blocks,
  ChevronDown,
  ChevronRight,
  DatabaseZap,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isOpen: boolean;
  end?: boolean;
  className?: string;
}

const NavItem = ({ icon: Icon, label, to, isOpen, end = false, className }: NavItemProps) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      cn(
        "flex items-center rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
        isActive ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground",
        !isOpen && "justify-center p-2",
        className,
      )
    }
  >
    <Icon className={cn("h-5 w-5", isOpen && "mr-3")} aria-hidden="true" />
    {isOpen && <span>{label}</span>}
    {!isOpen && <span className="sr-only">{label}</span>}
  </NavLink>
);

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, isMobile }) => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const componentsGroupActive = pathname.startsWith("/components");
  const [componentsExpanded, setComponentsExpanded] = useState(componentsGroupActive);

  useEffect(() => {
    if (componentsGroupActive) setComponentsExpanded(true);
  }, [componentsGroupActive]);

  const mainNavItems = [
    { icon: LayoutDashboard, label: t("nav.dashboard"), to: "/" },
    { icon: Users, label: t("nav.users"), to: "/users" },
    { icon: ShoppingBag, label: t("nav.products"), to: "/products" },
    { icon: ClipboardList, label: t("nav.orders"), to: "/orders" },
    { icon: UserRound, label: t("nav.customers"), to: "/customers" },
    { icon: FileText, label: t("nav.reports"), to: "/reports" },
    { icon: Calendar, label: t("nav.calendar"), to: "/calendar" },
    { icon: MessageSquare, label: t("nav.messages"), to: "/messages" },
    { icon: DatabaseZap, label: t("nav.crud_example"), to: "/crud-example" },
  ];

  const secondaryNavItems = [
    { icon: Bell, label: t("nav.notifications"), to: "/notifications" },
    { icon: Settings, label: t("nav.settings"), to: "/settings" },
  ];

  const componentNavItems = [
    { icon: Blocks, label: "Overview", to: "/components", end: true },
    { icon: Blocks, label: "Buttons", to: "/components/buttons" },
    { icon: Blocks, label: "Forms", to: "/components/forms" },
    { icon: Blocks, label: "Inputs", to: "/components/inputs" },
    { icon: Blocks, label: "Dialogs", to: "/components/dialogs" },
    { icon: Blocks, label: "Datatables", to: "/components/datatables" },
    { icon: Blocks, label: "Misc", to: "/components/misc" },
  ];

  const appName = import.meta.env.VITE_APP_NAME || "Breezy Admin";

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <aside
      className={cn(
        "z-30 flex h-full flex-col border-r border-border bg-card transition-all duration-300 ease-in-out",
        // On mobile the parent Sheet handles slide-in; full width inside the sheet
        isMobile ? "w-64" : isOpen ? "w-64" : "w-16",
      )}
    >
      <div
        className={cn(
          "flex items-center p-4",
          isOpen || isMobile ? "justify-between" : "justify-center",
        )}
      >
        {isOpen || isMobile ? (
          <h1 className="truncate text-lg font-bold">{appName}</h1>
        ) : (
          <span className="text-lg font-bold">{appName.charAt(0)}</span>
        )}
      </div>

      <Separator />

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-1" aria-label="Main navigation">
          {mainNavItems.map((item) => (
            <NavItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              isOpen={isOpen || isMobile}
            />
          ))}
        </nav>

        <Separator className="my-4" />

        <div className="space-y-1" role="group" aria-label="Components navigation">
          {isOpen || isMobile ? (
            <button
              type="button"
              onClick={() => setComponentsExpanded((prev) => !prev)}
              aria-expanded={componentsExpanded}
              aria-controls="components-nav-links"
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                componentsGroupActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <span className="flex items-center">
                <Blocks className="mr-2 h-4 w-4" aria-hidden="true" />
                {t("nav.components")}
              </span>
              {componentsExpanded ? (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          ) : (
            <NavItem icon={Blocks} label={t("nav.components")} to="/components" isOpen={false} />
          )}
          {(isOpen || isMobile) && componentsExpanded && (
            <div id="components-nav-links">
              {componentNavItems.map((item) => (
                <NavItem
                  key={item.to}
                  icon={item.icon}
                  label={item.label}
                  to={item.to}
                  isOpen={true}
                  end={item.end}
                  className="ml-5"
                />
              ))}
            </div>
          )}
        </div>

        <Separator className="my-4" />

        <nav className="space-y-1" aria-label="Secondary navigation">
          {secondaryNavItems.map((item) => (
            <NavItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              isOpen={isOpen || isMobile}
            />
          ))}
        </nav>
      </div>

      <Separator />

      <div className="p-4">
        {isOpen || isMobile ? (
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">{userInitials}</span>
            </div>
            <div className="min-w-0 truncate">
              <p className="truncate text-sm font-medium">{user?.name ?? "Guest"}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email ?? "—"}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">{userInitials}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
