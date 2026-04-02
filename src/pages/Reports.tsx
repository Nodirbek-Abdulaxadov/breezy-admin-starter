import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

const monthlyRevenue = [
  { month: "Jan", revenue: 3800, orders: 210 },
  { month: "Feb", revenue: 4200, orders: 240 },
  { month: "Mar", revenue: 5100, orders: 275 },
  { month: "Apr", revenue: 4800, orders: 260 },
  { month: "May", revenue: 5600, orders: 298 },
  { month: "Jun", revenue: 6100, orders: 330 },
];

const trafficSources = [
  { source: "Organic", value: 42 },
  { source: "Paid", value: 24 },
  { source: "Social", value: 18 },
  { source: "Referral", value: 16 },
];

const topProducts = [
  { name: "Starter Plan", sales: 152, growth: "+12%" },
  { name: "Pro Plan", sales: 109, growth: "+7%" },
  { name: "Team Bundle", sales: 83, growth: "+15%" },
  { name: "Consulting", sales: 46, growth: "-2%" },
];

const Reports = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Analyze business metrics and performance trends.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl">$29,600</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge>+11.2% MoM</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-2xl">1,613</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge>+8.4% MoM</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg. Order Value</CardDescription>
            <CardTitle className="text-2xl">$18.35</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Stable</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Refund Rate</CardDescription>
            <CardTitle className="text-2xl">1.2%</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">-0.3% MoM</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Last 6 months revenue overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ revenue: { label: "Revenue", color: "hsl(var(--primary))" } }}
              className="h-[280px] w-full"
            >
              <LineChart data={monthlyRevenue}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Source Share</CardTitle>
            <CardDescription>Acquisition channel distribution (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ value: { label: "Share", color: "hsl(var(--primary))" } }}
              className="h-[280px] w-full"
            >
              <BarChart data={trafficSources} layout="vertical">
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="source"
                  tickLine={false}
                  axisLine={false}
                  width={72}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
          <CardDescription>Best-performing offerings this month</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {topProducts.map((product) => (
            <div
              key={product.name}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.sales} sales</p>
              </div>
              <Badge variant={product.growth.startsWith("+") ? "default" : "secondary"}>
                {product.growth}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
