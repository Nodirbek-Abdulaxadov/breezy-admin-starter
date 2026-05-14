import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Plus } from "lucide-react";
import { dataService } from "@/services/dataService";
import { Skeleton } from "@/components/ui/skeleton";
import type { Order, PaymentStatus } from "@/types/data";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE = 5;

const getPaymentBadgeVariant = (payment: PaymentStatus) => {
  if (payment === "Paid") {
    return "default" as const;
  }
  if (payment === "Pending") {
    return "secondary" as const;
  }
  return "outline" as const;
};

const Orders = () => {
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<"all" | PaymentStatus>("all");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  const [formData, setFormData] = useState<Omit<Order, "id">>({
    customer: "",
    total: "",
    payment: "Pending",
    fulfillment: "Processing",
    date: "2026-04-02",
  });

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: dataService.getOrders,
  });

  const baseOrders = localOrders.length ? localOrders : orders;

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return baseOrders.filter((order) => {
      const searchMatched =
        !query ||
        [order.id, order.customer, order.payment, order.fulfillment, order.date]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const paymentMatched = paymentFilter === "all" || order.payment === paymentFilter;
      return searchMatched && paymentMatched;
    });
  }, [search, baseOrders, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedOrders = filteredOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openCreate = () => {
    setEditingOrder(null);
    setFormData({
      customer: "",
      total: "",
      payment: "Pending",
      fulfillment: "Processing",
      date: "2026-04-02",
    });
    setFormOpen(true);
  };

  const openEdit = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      customer: order.customer,
      total: order.total,
      payment: order.payment,
      fulfillment: order.fulfillment,
      date: order.date,
    });
    setFormOpen(true);
  };

  const submitForm = () => {
    if (!formData.customer.trim()) {
      return;
    }

    setLocalOrders((prev) => {
      const source = prev.length ? prev : orders;
      if (editingOrder) {
        return source.map((item) =>
          item.id === editingOrder.id ? { ...item, ...formData } : item,
        );
      }

      const nextId = `#ORD-${(9000 + source.length + 1).toString()}`;
      return [{ id: nextId, ...formData }, ...source];
    });
    setPage(1);
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) {
      return;
    }

    setLocalOrders((prev) => {
      const source = prev.length ? prev : orders;
      return source.filter((item) => item.id !== deleteTarget.id);
    });
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">Track order lifecycle and payment status.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Orders</CardDescription>
            <CardTitle>{isLoading ? "-" : filteredOrders.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Fulfillment</CardDescription>
            <CardTitle>
              {isLoading
                ? "-"
                : filteredOrders.filter((item) => item.fulfillment === "Processing").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Paid Orders</CardDescription>
            <CardTitle>
              {isLoading ? "-" : filteredOrders.filter((item) => item.payment === "Paid").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Refund Requests</CardDescription>
            <CardTitle>
              {isLoading
                ? "-"
                : filteredOrders.filter((item) => item.payment === "Refunded").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest transactions and fulfillment state</CardDescription>
            </div>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Create Order
            </Button>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative sm:w-[240px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-8"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select
              value={paymentFilter}
              onValueChange={(value: "all" | PaymentStatus) => {
                setPaymentFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="sm:w-[180px]">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Fulfillment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <TableRow key={`orders-skeleton-${index}`}>
                        <TableCell colSpan={7}>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
                {isError ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-destructive">
                      Failed to load orders.
                    </TableCell>
                  </TableRow>
                ) : null}
                {pagedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell>
                      <Badge variant={getPaymentBadgeVariant(order.payment)}>{order.payment}</Badge>
                    </TableCell>
                    <TableCell>{order.fulfillment}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(order)}>
                            Edit order
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteTarget(order)}
                          >
                            Delete order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && !isError && pagedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No orders found for your filters.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between py-4">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * PAGE_SIZE + (pagedOrders.length ? 1 : 0)}-
              {(currentPage - 1) * PAGE_SIZE + pagedOrders.length} of {filteredOrders.length}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingOrder ? "Update order" : "Create order"}</DialogTitle>
            <DialogDescription>
              {editingOrder ? "Update order details." : "Fill details to create a new order."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Customer</Label>
              <Input
                value={formData.customer}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, customer: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Total</Label>
              <Input
                value={formData.total}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, total: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Payment</Label>
                <Select
                  value={formData.payment}
                  onValueChange={(value: PaymentStatus) =>
                    setFormData((prev) => ({ ...prev, payment: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fulfillment</Label>
                <Input
                  value={formData.fulfillment}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, fulfillment: event.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(event) => setFormData((prev) => ({ ...prev, date: event.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitForm}>{editingOrder ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete order?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete {deleteTarget?.id ?? "this order"}.
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

export default Orders;
