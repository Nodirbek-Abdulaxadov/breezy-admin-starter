import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const docs = [
  { title: "Buttons", to: "/components/buttons", description: "Variant, size va action tugmalar." },
  {
    title: "Forms",
    to: "/components/forms",
    description: "react-hook-form + zod validatsiya patternlari.",
  },
  {
    title: "Inputs",
    to: "/components/inputs",
    description: "Input, textarea, select, switch, checkbox, radio.",
  },
  {
    title: "Dialogs",
    to: "/components/dialogs",
    description: "Dialog va AlertDialog ishlatish usullari.",
  },
  {
    title: "Datatables",
    to: "/components/datatables",
    description: "Table, filter, row actions va selection.",
  },
  {
    title: "Misc",
    to: "/components/misc",
    description: "Badge, tabs, toast kabi qo'shimcha komponentlar.",
  },
];

const ComponentsOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Components Guide</h2>
        <p className="text-muted-foreground">
          Har bir komponent uchun alohida sahifa: usage, examples va code snippetlar bilan.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {docs.map((item) => (
          <Card key={item.to}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to={item.to}>Open docs</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ComponentsOverview;
