
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

const NavItem = ({ icon: Icon, label, to, isOpen, end = false, className }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
          isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground",
          !isOpen && "justify-center p-2",
          className
        )
      }
    >
      <Icon className={cn("h-5 w-5", isOpen && "mr-3")} aria-hidden="true" />
      {isOpen && <span>{label}</span>}
      {!isOpen && <span className="sr-only">{label}</span>}
    </NavLink>
  );
};

// Main navigation items
const mainNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: Users, label: "Users", to: "/users" },
  { icon: ShoppingBag, label: "Products", to: "/products" },
  { icon: ClipboardList, label: "Orders", to: "/orders" },
  { icon: UserRound, label: "Customers", to: "/customers" },
  { icon: FileText, label: "Reports", to: "/reports" },
  { icon: Calendar, label: "Calendar", to: "/calendar" },
  { icon: MessageSquare, label: "Messages", to: "/messages" },
];

// Secondary navigation items
const secondaryNavItems = [
  { icon: Bell, label: "Notifications", to: "/notifications" },
  { icon: Settings, label: "Settings", to: "/settings" },
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

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, isMobile }) => {
  const { pathname } = useLocation();
  const componentsGroupActive = pathname.startsWith("/components");
  const [componentsExpanded, setComponentsExpanded] = useState(componentsGroupActive);

  useEffect(() => {
    if (componentsGroupActive) {
      setComponentsExpanded(true);
    }
  }, [componentsGroupActive]);

  return (
    <aside
      className={cn(
        "bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col z-30",
        isOpen ? "w-64" : "w-16",
        isMobile && !isOpen && "absolute -left-16",
        isMobile && isOpen && "absolute inset-y-0 left-0"
      )}
    >
      <div className={cn("p-4 flex", isOpen ? "justify-between" : "justify-center")}>
        {isOpen ? (
          <h1 className="font-bold text-lg">Admin<span className="text-primary">Panel</span></h1>
        ) : (
          <span className="font-bold text-lg">A</span>
        )}
      </div>
      
      <Separator />
      
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <nav className="space-y-1" aria-label="Main navigation">
          {mainNavItems.map((item) => (
            <NavItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              isOpen={isOpen}
            />
          ))}
        </nav>
        
        <Separator className="my-4" />

        <div className="space-y-1" role="group" aria-label="Components navigation">
          {isOpen ? (
            <button
              type="button"
              onClick={() => setComponentsExpanded((prev) => !prev)}
              aria-expanded={componentsExpanded}
              aria-controls="components-nav-links"
              className={cn(
                "w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                componentsGroupActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <span className="flex items-center">
                <Blocks className="h-4 w-4 mr-2" aria-hidden="true" />
                Components
              </span>
              {componentsExpanded ? (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          ) : (
            <NavItem icon={Blocks} label="Components" to="/components" isOpen={isOpen} />
          )}
          {isOpen ? (
            <div id="components-nav-links">
              {componentsExpanded
                ? componentNavItems.map((item) => (
                    <NavItem
                      key={item.to}
                      icon={item.icon}
                      label={item.label}
                      to={item.to}
                      isOpen={isOpen}
                      end={item.end}
                      className="ml-5"
                    />
                  ))
                : null}
            </div>
          ) : null}
        </div>

        <Separator className="my-4" />

        <nav className="space-y-1" aria-label="Secondary navigation">
          {secondaryNavItems.map((item) => (
            <NavItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              isOpen={isOpen}
            />
          ))}
        </nav>
      </div>
      
      <Separator />
      
      <div className="p-4">
        {isOpen ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <span className="text-sm font-medium">JD</span>
            </div>
            <div className="truncate">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">admin@example.com</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <span className="text-sm font-medium">JD</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
