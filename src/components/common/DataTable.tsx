import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  accessor: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number | Date | null;
  className?: string;
  align?: "left" | "right" | "center";
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  rowKey: (row: T) => string | number;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchAccessor?: (row: T) => string;
  pageSize?: number;
  isLoading?: boolean;
  emptyMessage?: React.ReactNode;
  actions?: (row: T) => React.ReactNode;
  className?: string;
}

type SortDirection = "asc" | "desc" | null;

interface SortState {
  key: string;
  direction: Exclude<SortDirection, null>;
}

const alignClass = (align?: "left" | "right" | "center"): string => {
  switch (align) {
    case "right":
      return "text-right";
    case "center":
      return "text-center";
    default:
      return "text-left";
  }
};

function defaultStringify<T>(row: T, columns: DataTableColumn<T>[]): string {
  return columns
    .map((col) => {
      try {
        const value = col.accessor(row);
        if (value == null) return "";
        if (typeof value === "string" || typeof value === "number") {
          return String(value);
        }
        // React nodes — best effort: skip.
        return "";
      } catch {
        return "";
      }
    })
    .join(" ")
    .toLowerCase();
}

function compareValues(a: string | number | Date | null, b: string | number | Date | null): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

export function DataTable<T>({
  data,
  columns,
  rowKey,
  searchable = false,
  searchPlaceholder = "Search...",
  searchAccessor,
  pageSize = 10,
  isLoading = false,
  emptyMessage = "No results.",
  actions,
  className,
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState<SortState | null>(null);
  const [page, setPage] = React.useState(1);

  // Reset to page 1 whenever search or sort changes.
  React.useEffect(() => {
    setPage(1);
  }, [search, sort]);

  const filtered = React.useMemo(() => {
    if (!searchable || !search.trim()) return data;
    const term = search.trim().toLowerCase();
    return data.filter((row) => {
      const haystack = searchAccessor
        ? searchAccessor(row).toLowerCase()
        : defaultStringify(row, columns);
      return haystack.includes(term);
    });
  }, [data, search, searchable, searchAccessor, columns]);

  const sorted = React.useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col || !col.sortValue) return filtered;
    const copy = [...filtered];
    const dir = sort.direction === "asc" ? 1 : -1;
    copy.sort((a, b) => compareValues(col.sortValue!(a), col.sortValue!(b)) * dir);
    return copy;
  }, [filtered, sort, columns]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const pageRows = sorted.slice(startIdx, endIdx);

  const handleHeaderClick = (col: DataTableColumn<T>) => {
    if (!col.sortValue) return;
    setSort((prev) => {
      if (!prev || prev.key !== col.key) return { key: col.key, direction: "asc" };
      if (prev.direction === "asc") return { key: col.key, direction: "desc" };
      return null; // desc → none
    });
  };

  const renderSortIcon = (col: DataTableColumn<T>) => {
    if (!col.sortValue) return null;
    if (!sort || sort.key !== col.key) {
      return <ChevronsUpDown className="ml-1 inline h-3.5 w-3.5 opacity-60" aria-hidden="true" />;
    }
    return sort.direction === "asc" ? (
      <ChevronUp className="ml-1 inline h-3.5 w-3.5" aria-hidden="true" />
    ) : (
      <ChevronDown className="ml-1 inline h-3.5 w-3.5" aria-hidden="true" />
    );
  };

  const colCount = columns.length + (actions ? 1 : 0);

  const pageNumbers = React.useMemo(() => {
    const max = 5;
    if (totalPages <= max) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const half = Math.floor(max / 2);
    let start = Math.max(1, currentPage - half);
    let end = start + max - 1;
    if (end > totalPages) {
      end = totalPages;
      start = end - max + 1;
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  const showPagination = total > pageSize;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {searchable ? (
        <div className="flex items-center gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="max-w-sm"
          />
        </div>
      ) : null}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => {
                const sortable = !!col.sortValue;
                return (
                  <TableHead
                    key={col.key}
                    className={cn(
                      alignClass(col.align),
                      sortable && "cursor-pointer select-none",
                      col.className,
                    )}
                    onClick={sortable ? () => handleHeaderClick(col) : undefined}
                    aria-sort={
                      sort && sort.key === col.key
                        ? sort.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : sortable
                          ? "none"
                          : undefined
                    }
                  >
                    <span className="inline-flex items-center">
                      {col.header}
                      {renderSortIcon(col)}
                    </span>
                  </TableHead>
                );
              })}
              {actions ? (
                <TableHead className="w-[1%] whitespace-nowrap text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rowIdx) => (
                <TableRow key={`skeleton-${rowIdx}`}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={cn(alignClass(col.align), col.className)}>
                      <div className="h-4 animate-pulse rounded bg-muted" />
                    </TableCell>
                  ))}
                  {actions ? (
                    <TableCell className="text-right">
                      <div className="ml-auto h-4 w-16 animate-pulse rounded bg-muted" />
                    </TableCell>
                  ) : null}
                </TableRow>
              ))
            ) : pageRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={colCount}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row) => (
                <TableRow key={rowKey(row)}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={cn(alignClass(col.align), col.className)}>
                      {col.accessor(row)}
                    </TableCell>
                  ))}
                  {actions ? <TableCell className="text-right">{actions(row)}</TableCell> : null}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          {total === 0 ? "Showing 0 of 0" : `Showing ${startIdx + 1}-${endIdx} of ${total}`}
        </div>

        {showPagination ? (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Previous</span>
            </Button>

            {pageNumbers.map((n) => (
              <Button
                key={n}
                variant={n === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(n)}
                aria-current={n === currentPage ? "page" : undefined}
                className="min-w-9"
              >
                {n}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
            >
              <span className="mr-1 hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default DataTable;
