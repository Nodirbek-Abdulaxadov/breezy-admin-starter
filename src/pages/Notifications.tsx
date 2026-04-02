import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, AlertTriangle, CheckCircle2, Info, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const notifications = [
  {
    id: 1,
    title: "New user registration spike",
    description: "Registrations increased by 24% in the last 24 hours.",
    time: "5 min ago",
    type: "info",
  },
  {
    id: 2,
    title: "Payment gateway latency warning",
    description: "Average API response time exceeded 800ms.",
    time: "19 min ago",
    type: "warning",
  },
  {
    id: 3,
    title: "Backup completed successfully",
    description: "Nightly database backup finished without errors.",
    time: "1 hour ago",
    type: "success",
  },
  {
    id: 4,
    title: "Security update available",
    description: "A critical dependency patch is ready to install.",
    time: "3 hours ago",
    type: "warning",
  },
];

const getTypeMeta = (type: string) => {
  if (type === "warning") {
    return {
      icon: AlertTriangle,
      badge: "Warning",
      badgeVariant: "secondary" as const,
    };
  }
  if (type === "success") {
    return {
      icon: CheckCircle2,
      badge: "Success",
      badgeVariant: "default" as const,
    };
  }
  return {
    icon: Info,
    badge: "Info",
    badgeVariant: "outline" as const,
  };
};

const Notifications = () => {
  const [search, setSearch] = useState("");
  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return notifications;
    }

    return notifications.filter((item) =>
      [item.title, item.description, item.type].join(" ").toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground">
          Stay updated on important events and system alerts.
        </p>
      </div>

      <Card className="border-border/80 shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Inbox
            </CardTitle>
            <CardDescription>Latest activity across your workspace</CardDescription>
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-[260px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                className="pl-8"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <Button variant="outline" type="button">
              Mark all as read
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredNotifications.map((notification, idx) => {
            const meta = getTypeMeta(notification.type);
            const Icon = meta.icon;

            return (
              <div key={notification.id} className="rounded-lg border p-4 transition-colors hover:bg-accent/20">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3 min-w-0">
                    <div className="rounded-md border bg-background p-2 shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className="font-medium leading-tight">{notification.title}</p>
                      <p className="text-sm text-muted-foreground break-words">{notification.description}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                  <Badge variant={meta.badgeVariant} className="w-fit">{meta.badge}</Badge>
                </div>
                {idx < filteredNotifications.length - 1 && <Separator className="mt-4" />}
              </div>
            );
          })}
          {filteredNotifications.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="font-medium">No notifications found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try a different search keyword.
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
