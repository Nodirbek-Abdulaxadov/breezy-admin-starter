
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, Users, DollarSign, ArrowDownRight, BarChart, LineChart, PieChart } from "lucide-react";

const stats = [
  { 
    title: "Total Users", 
    value: "12,345", 
    change: "+12%", 
    trend: "up",
    description: "vs. previous month", 
    icon: Users 
  },
  { 
    title: "Revenue", 
    value: "$45,231", 
    change: "+8.2%", 
    trend: "up",
    description: "vs. previous month", 
    icon: DollarSign 
  },
  { 
    title: "Active Sessions", 
    value: "1,234", 
    change: "-4.5%", 
    trend: "down",
    description: "vs. previous month", 
    icon: BarChart 
  },
  { 
    title: "Conversion Rate", 
    value: "2.5%", 
    change: "+3.2%", 
    trend: "up",
    description: "vs. previous month", 
    icon: LineChart 
  }
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your analytics and performance.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center pt-1 text-xs">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3 text-rose-500" />
                )}
                <span className={stat.trend === "up" ? "text-emerald-500" : "text-rose-500"}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
            <CardDescription>Sales performance for the past week</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t pt-4">
            <div className="text-center">
              <LineChart className="h-16 w-16 text-muted-foreground/60 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Chart data visualization would go here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors are coming from</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t pt-4">
            <div className="text-center">
              <PieChart className="h-16 w-16 text-muted-foreground/60 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Chart data visualization would go here</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user actions and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">U{i}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">User {i} performed an action</p>
                    <p className="text-xs text-muted-foreground">{i * 10} minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Current progress on active projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Website Redesign", progress: 75 },
                { name: "Mobile App", progress: 45 },
                { name: "Database Migration", progress: 90 },
                { name: "Marketing Campaign", progress: 30 },
              ].map((project, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{project.name}</span>
                    <span className="text-sm text-muted-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
