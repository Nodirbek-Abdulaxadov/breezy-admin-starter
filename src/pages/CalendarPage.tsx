import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const events = [
  {
    id: 1,
    title: "Product Planning Sync",
    time: "09:30",
    date: "2026-04-03",
    type: "Meeting",
  },
  {
    id: 2,
    title: "Design Review",
    time: "13:00",
    date: "2026-04-04",
    type: "Review",
  },
  {
    id: 3,
    title: "Monthly Metrics Presentation",
    time: "16:00",
    date: "2026-04-07",
    type: "Presentation",
  },
  {
    id: 4,
    title: "Engineering Retrospective",
    time: "11:00",
    date: "2026-04-08",
    type: "Team",
  },
];

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
        <p className="text-muted-foreground">
          Track meetings, milestones, and upcoming events.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
            <CardDescription>Select a date to focus your agenda</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Planned activities for this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {events.map((event, idx) => (
              <div key={event.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.date} at {event.time}
                    </p>
                  </div>
                  <Badge variant="outline">{event.type}</Badge>
                </div>
                {idx < events.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;
