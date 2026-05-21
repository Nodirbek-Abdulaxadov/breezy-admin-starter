import { NavLink } from "react-router-dom";
import { LayoutDashboard, UserRound, Settings, BookOpen, type LucideIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

type NavItem = { to: string; icon: LucideIcon; label: string; end?: boolean };

const NAV: NavItem[] = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/profile", icon: UserRound, label: "Profile" },
  { to: "/welcome", icon: BookOpen, label: "Welcome guide" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
}

export function Sidebar({ isOpen, isMobile }: SidebarProps) {
  const { user } = useAuth();
  const expanded = isOpen || isMobile;
  const initials =
    user?.name
      ?.split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  return (
    <aside
      className={cn(
        "z-30 flex h-full flex-col border-r border-border bg-card text-card-foreground transition-[width] duration-200",
        isMobile ? "w-64" : expanded ? "w-64" : "w-16",
      )}
    >
      <div
        className={cn("flex h-14 items-center px-4", expanded ? "justify-start" : "justify-center")}
      >
        {expanded ? (
          <span className="truncate text-base font-semibold">Breezy</span>
        ) : (
          <span className="text-base font-semibold">B</span>
        )}
      </div>
      <Separator />

      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Main">
        <ul className="space-y-1">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-muted-foreground",
                    !expanded && "justify-center",
                  )
                }
              >
                <Icon className={cn("h-4 w-4 shrink-0", expanded && "mr-2.5")} aria-hidden />
                {expanded ? (
                  <span className="truncate">{label}</span>
                ) : (
                  <span className="sr-only">{label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <Separator />
      <div className={cn("p-3", expanded ? "flex items-center gap-2.5" : "flex justify-center")}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
          {initials}
        </div>
        {expanded && (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user?.name ?? "Guest"}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email ?? "—"}</p>
          </div>
        )}
      </div>
    </aside>
  );
}
