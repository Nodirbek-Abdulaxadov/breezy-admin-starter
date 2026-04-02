import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Tier = "Enterprise" | "Business" | "Starter";

type CustomerItem = {
  id: number;
  name: string;
  contact: string;
  tier: Tier;
  spend: string;
  health: number;
};

const initialCustomers: CustomerItem[] = [
  { id: 1, name: "Acme Corp", contact: "ops@acme.com", tier: "Enterprise", spend: "$12,400", health: 88 },
  { id: 2, name: "Globex Ltd", contact: "team@globex.io", tier: "Business", spend: "$6,120", health: 73 },
  { id: 3, name: "Initech", contact: "procurement@initech.com", tier: "Enterprise", spend: "$9,780", health: 92 },
  { id: 4, name: "Umbrella Inc", contact: "admin@umbrella.co", tier: "Starter", spend: "$1,430", health: 54 },
];

const PAGE_SIZE = 5;

const Customers = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | Tier>("all");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CustomerItem | null>(null);
  const [formData, setFormData] = useState<Omit<CustomerItem, "id">>({
    name: "",
    contact: "",
    tier: "Starter",
    spend: "$0",
    health: 50,
  });

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return customers.filter((item) => {
      const searchMatched =
        !query || [item.name, item.contact, item.tier, item.spend].join(" ").toLowerCase().includes(query);
      const tierMatched = tierFilter === "all" || item.tier === tierFilter;
      return searchMatched && tierMatched;
    });
  }, [customers, search, tierFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedCustomers = filteredCustomers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openCreate = () => {
    setEditingCustomer(null);
    setFormData({
      name: "",
      contact: "",
      tier: "Starter",
      spend: "$0",
      health: 50,
    });
    setFormOpen(true);
  };

  const openEdit = (customer: CustomerItem) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      contact: customer.contact,
      tier: customer.tier,
      spend: customer.spend,
      health: customer.health,
    });
    setFormOpen(true);
  };

  const submitForm = () => {
    if (!formData.name.trim()) {
      return;
    }
    if (editingCustomer) {
      setCustomers((prev) => prev.map((item) => (item.id === editingCustomer.id ? { ...item, ...formData } : item)));
    } else {
      const nextId = customers.length ? Math.max(...customers.map((item) => item.id)) + 1 : 1;
      setCustomers((prev) => [{ id: nextId, ...formData }, ...prev]);
      setPage(1);
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) {
      return;
    }
    setCustomers((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <p className="text-muted-foreground">Monitor customer health and lifetime value.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Customers</CardDescription>
            <CardTitle>{filteredCustomers.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Enterprise Accounts</CardDescription>
            <CardTitle>{filteredCustomers.filter((item) => item.tier === "Enterprise").length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Churn Risk</CardDescription>
            <CardTitle>{filteredCustomers.filter((item) => item.health < 60).length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Customer Accounts</CardTitle>
              <CardDescription>Manage customer tiers and account health</CardDescription>
            </div>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative sm:w-[260px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-8"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select
              value={tierFilter}
              onValueChange={(value: "all" | Tier) => {
                setTierFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="sm:w-[180px]">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Starter">Starter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Spend</TableHead>
                  <TableHead>Health</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.contact}</TableCell>
                    <TableCell>
                      <Badge variant={customer.tier === "Enterprise" ? "default" : "secondary"}>
                        {customer.tier}
                      </Badge>
                    </TableCell>
                    <TableCell>{customer.spend}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{customer.health}%</span>
                        </div>
                        <Progress value={customer.health} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(customer)}>Edit customer</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(customer)}>
                            Delete customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {pagedCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No customers found.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between py-4">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * PAGE_SIZE + (pagedCustomers.length ? 1 : 0)}-
              {(currentPage - 1) * PAGE_SIZE + pagedCustomers.length} of {filteredCustomers.length}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setPage((prev) => prev - 1)}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setPage((prev) => prev + 1)}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCustomer ? "Update customer" : "Create customer"}</DialogTitle>
            <DialogDescription>
              {editingCustomer ? "Update customer account details." : "Fill details to add a new customer."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={formData.name} onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Contact</Label>
              <Input value={formData.contact} onChange={(event) => setFormData((prev) => ({ ...prev, contact: event.target.value }))} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tier</Label>
                <Select value={formData.tier} onValueChange={(value: Tier) => setFormData((prev) => ({ ...prev, tier: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Starter">Starter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Health (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.health}
                  onChange={(event) => setFormData((prev) => ({ ...prev, health: Number(event.target.value) }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Lifetime Spend</Label>
              <Input value={formData.spend} onChange={(event) => setFormData((prev) => ({ ...prev, spend: event.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={submitForm}>{editingCustomer ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete customer?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently remove {deleteTarget?.name ?? "this customer"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Customers;
