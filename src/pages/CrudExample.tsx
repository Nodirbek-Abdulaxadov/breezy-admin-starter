/**
 * CRUD Example — Employees
 *
 * Demonstrates the full Create / Read / Update / Delete cycle using the
 * in-memory `mockApi` service that simulates real async HTTP calls.
 *
 * Patterns shown:
 *  • useQuery  — fetch list (GET)
 *  • useMutation + queryClient.invalidateQueries — create / update / delete
 *  • Optimistic UI feedback via toast notifications
 *  • Controlled form dialog (shared for create & edit)
 *  • Confirmation dialog before delete
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "@/services/mockApi";
import type { Employee, EmployeeStatus } from "@/types/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

// ─── helpers ──────────────────────────────────────────────────────────────────

const QUERY_KEY = ["employees"];

const statusVariant: Record<EmployeeStatus, "default" | "secondary" | "outline"> = {
  Active: "default",
  "On Leave": "secondary",
  Inactive: "outline",
};

const EMPTY_FORM: Omit<Employee, "id"> = {
  name: "",
  email: "",
  role: "",
  department: "",
  status: "Active",
};

// ─── component ────────────────────────────────────────────────────────────────

const CrudExample = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ── local UI state ──────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Omit<Employee, "id">>(EMPTY_FORM);

  // ── READ ────────────────────────────────────────────────────────────────────
  const {
    data: employees = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => mockApi.employees.list(),
  });

  // ── CREATE ──────────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (data: Omit<Employee, "id">) => mockApi.employees.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({ title: "Employee created", description: `${formData.name} has been added.` });
      setFormOpen(false);
    },
    onError: () =>
      toast({ title: "Error", description: "Could not create employee.", variant: "destructive" }),
  });

  // ── UPDATE ──────────────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<Employee, "id"> }) =>
      mockApi.employees.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({ title: "Employee updated", description: `${formData.name} has been saved.` });
      setFormOpen(false);
    },
    onError: () =>
      toast({ title: "Error", description: "Could not update employee.", variant: "destructive" }),
  });

  // ── DELETE ──────────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: number) => mockApi.employees.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({ title: "Employee removed", description: `${deleteTarget?.name} has been deleted.` });
      setDeleteTarget(null);
    },
    onError: () =>
      toast({ title: "Error", description: "Could not delete employee.", variant: "destructive" }),
  });

  // ── derived data ────────────────────────────────────────────────────────────
  const filtered = employees.filter((e) => {
    const q = search.trim().toLowerCase();
    return !q || [e.name, e.email, e.role, e.department].join(" ").toLowerCase().includes(q);
  });

  // ── form helpers ────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditTarget(null);
    setFormData(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (employee: Employee) => {
    setEditTarget(employee);
    const { id: _id, ...rest } = employee;
    setFormData(rest);
    setFormOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.email.trim()) return;
    if (editTarget) {
      updateMutation.mutate({ id: editTarget.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">CRUD Example</h2>
        <p className="text-muted-foreground">
          Full Create / Read / Update / Delete demo using an in-memory mock API.
        </p>
      </div>

      {/* Info callout */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          <p>
            • <strong>Read</strong> — <code>useQuery</code> calls{" "}
            <code>mockApi.employees.list()</code> on mount.
          </p>
          <p>
            • <strong>Create / Update</strong> — <code>useMutation</code> calls{" "}
            <code>create()</code> or <code>update()</code>, then invalidates the query cache.
          </p>
          <p>
            • <strong>Delete</strong> — confirmation dialog → <code>useMutation</code> calls{" "}
            <code>delete()</code>.
          </p>
          <p>
            • Data lives in an <strong>in-memory store</strong> (
            <code>src/services/mockApi.ts</code>) and resets on hard refresh.
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Employees</CardDescription>
            <CardTitle>
              {isLoading ? <Skeleton className="h-7 w-10" /> : employees.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle>
              {isLoading ? (
                <Skeleton className="h-7 w-10" />
              ) : (
                employees.filter((e) => e.status === "Active").length
              )}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Inactive / On Leave</CardDescription>
            <CardTitle>
              {isLoading ? (
                <Skeleton className="h-7 w-10" />
              ) : (
                employees.filter((e) => e.status !== "Active").length
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Table card */}
      <Card>
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Employees</CardTitle>
              <CardDescription>Manage employee records</CardDescription>
            </div>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </div>
          <div className="relative sm:w-[260px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
          {isError && <p className="text-sm text-destructive">Failed to load employees.</p>}
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden sm:table-cell">Role</TableHead>
                  <TableHead className="hidden lg:table-cell">Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      No employees found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {employee.email}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{employee.role}</TableCell>
                      <TableCell className="hidden lg:table-cell">{employee.department}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[employee.status]}>{employee.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Row actions">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(employee)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeleteTarget(employee)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ── Create / Edit dialog ─────────────────────────────────────────────── */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit Employee" : "Add Employee"}</DialogTitle>
            <DialogDescription>
              {editTarget
                ? "Update the employee's details below."
                : "Fill in the details for the new employee."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="emp-name">Full Name *</Label>
              <Input
                id="emp-name"
                placeholder="Alice Johnson"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="emp-email">Email *</Label>
              <Input
                id="emp-email"
                type="email"
                placeholder="alice@example.com"
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="emp-role">Role</Label>
                <Input
                  id="emp-role"
                  placeholder="Frontend Dev"
                  value={formData.role}
                  onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="emp-dept">Department</Label>
                <Input
                  id="emp-dept"
                  placeholder="Engineering"
                  value={formData.department}
                  onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="emp-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val: EmployeeStatus) => setFormData((p) => ({ ...p, status: val }))}
              >
                <SelectTrigger id="emp-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.name.trim() || !formData.email.trim()}
            >
              {isSubmitting ? "Saving…" : editTarget ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation ──────────────────────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete employee?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong>{deleteTarget?.name}</strong>. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CrudExample;
