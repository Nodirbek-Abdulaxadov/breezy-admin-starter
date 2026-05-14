import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { dataService } from "@/services/dataService";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product, ProductStatus } from "@/types/data";
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
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE = 5;

const getStatusVariant = (status: ProductStatus) => {
  if (status === "Active") {
    return "default" as const;
  }
  if (status === "Limited") {
    return "secondary" as const;
  }
  return "outline" as const;
};

const Products = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ProductStatus>("all");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<Omit<Product, "sku">>({
    name: "",
    category: "",
    price: "",
    stock: 0,
    status: "Active",
  });

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: dataService.getProducts,
  });

  const baseProducts = localProducts.length ? localProducts : products;

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return baseProducts.filter((product) => {
      const searchMatched =
        !query ||
        [product.sku, product.name, product.category, product.status]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const statusMatched = statusFilter === "all" || product.status === statusFilter;
      return searchMatched && statusMatched;
    });
  }, [search, baseProducts, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ name: "", category: "", price: "", stock: 0, status: "Active" });
    setFormOpen(true);
  };

  const openEdit = (item: Product) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      stock: item.stock,
      status: item.status,
    });
    setFormOpen(true);
  };

  const submitForm = () => {
    if (!formData.name.trim()) {
      return;
    }
    setLocalProducts((prev) => {
      const source = prev.length ? prev : products;
      if (editingItem) {
        return source.map((item) =>
          item.sku === editingItem.sku ? { ...item, ...formData } : item,
        );
      }
      const nextSku = `PRD-${(source.length + 1001).toString()}`;
      return [{ sku: nextSku, ...formData }, ...source];
    });
    setPage(1);
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) {
      return;
    }
    setLocalProducts((prev) => {
      const source = prev.length ? prev : products;
      return source.filter((item) => item.sku !== deleteTarget.sku);
    });
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <p className="text-muted-foreground">Manage your catalog and inventory levels.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Products</CardDescription>
            <CardTitle>{isLoading ? "-" : filteredProducts.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Low Stock Items</CardDescription>
            <CardTitle>
              {isLoading
                ? "-"
                : filteredProducts.filter((item) => item.stock > 0 && item.stock < 50).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Out of Stock</CardDescription>
            <CardTitle>
              {isLoading ? "-" : filteredProducts.filter((item) => item.stock === 0).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Product Catalog</CardTitle>
              <CardDescription>Overview of available products and services</CardDescription>
            </div>
            <Button type="button" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative sm:w-[240px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value: "all" | ProductStatus) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Limited">Limited</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <TableRow key={`products-skeleton-${index}`}>
                        <TableCell colSpan={7}>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
                {isError ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-destructive">
                      Failed to load products.
                    </TableCell>
                  </TableRow>
                ) : null}
                {pagedProducts.map((product) => (
                  <TableRow key={product.sku}>
                    <TableCell className="font-medium">{product.sku}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(product.status)}>{product.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(product)}>
                            Edit product
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteTarget(product)}
                          >
                            Delete product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && !isError && pagedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No products found for your filters.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between py-4">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * PAGE_SIZE + (pagedProducts.length ? 1 : 0)}-
              {(currentPage - 1) * PAGE_SIZE + pagedProducts.length} of {filteredProducts.length}
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
            <DialogTitle>{editingItem ? "Update product" : "Create product"}</DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Edit product details and inventory."
                : "Fill details to add a new product."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={formData.category}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, category: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Price</Label>
                <Input
                  value={formData.price}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, price: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.stock}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, stock: Number(event.target.value) }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ProductStatus) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Limited">Limited</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitForm}>{editingItem ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete {deleteTarget?.name ?? "this product"}.
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

export default Products;
