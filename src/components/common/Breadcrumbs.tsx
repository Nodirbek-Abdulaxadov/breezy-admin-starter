import * as React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("text-xs", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-muted-foreground">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-1">
              {idx > 0 ? (
                <ChevronRight
                  className="h-3 w-3 shrink-0 text-muted-foreground/60"
                  aria-hidden="true"
                />
              ) : null}
              {isLast ? (
                <span aria-current="page" className="text-muted-foreground">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link to={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
