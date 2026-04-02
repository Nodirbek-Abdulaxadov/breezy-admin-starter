import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DocSection } from "@/components/docs/DocSection";

type Row = {
  id: number;
  customer: string;
  email: string;
  plan: "Starter" | "Business" | "Enterprise";
  status: "Active" | "Pending" | "Blocked";
};

const rows: Row[] = [
  { id: 1, customer: "Acme LLC", email: "ops@acme.com", plan: "Enterprise", status: "Active" },
  { id: 2, customer: "Globex", email: "team@globex.io", plan: "Business", status: "Pending" },
  { id: 3, customer: "Initech", email: "hello@initech.dev", plan: "Starter", status: "Blocked" },
  { id: 4, customer: "Umbrella", email: "info@umbrella.co", plan: "Business", status: "Active" },
];

const DatatablesPage = () => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return rows.filter((item) =>
      [item.customer, item.email, item.plan, item.status].join(" ").toLowerCase().includes(normalized)
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Datatables</h2>
        <p className="text-muted-foreground">Table asosida listing, filter, selection va status ko'rsatish.</p>
      </div>

      <DocSection
        title="DataTable Pattern"
        description="Qidiruv, row selection va badge holatlari bilan datatable."
        usage="Kichik va o'rta datasetlar uchun `Table` + `useMemo` filter patterni yetarli. Har bir row uchun stable `id` ishlating, selection state ni `number[]` kabi saqlang."
        typesCode={`type Row = {
  id: number;
  customer: string;
  email: string;
  plan: "Starter" | "Business" | "Enterprise";
  status: "Active" | "Pending" | "Blocked";
};`}
        code={`const filtered = rows.filter((item) =>
  [item.customer, item.email, item.plan, item.status].join(" ").toLowerCase().includes(query)
);`}
        demo={
          <div className="space-y-3">
            <Input placeholder="Search rows..." value={query} onChange={(event) => setQuery(event.target.value)} />
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.map((row) => {
                    const checked = selected.includes(row.id);
                    return (
                      <TableRow key={row.id}>
                        <TableCell>
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(value) => {
                              const enabled = value === true;
                              setSelected((prev) =>
                                enabled ? [...prev, row.id] : prev.filter((item) => item !== row.id)
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{row.customer}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.plan}</TableCell>
                        <TableCell>
                          <Badge variant={row.status === "Active" ? "default" : "secondary"}>{row.status}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default DatatablesPage;
