import * as React from "react";

import { cn } from "@/lib/utils";
import { Breadcrumbs, type BreadcrumbItem } from "./Breadcrumbs";

export type { BreadcrumbItem };

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-4 flex flex-col gap-1 border-b pb-4 md:mb-6 md:pb-6", className)}>
      {breadcrumbs && breadcrumbs.length > 0 ? <Breadcrumbs items={breadcrumbs} /> : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>

        {actions ? (
          <div className="flex flex-wrap items-center gap-2 sm:shrink-0">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}

export default PageHeader;
