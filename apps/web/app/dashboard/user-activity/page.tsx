import { Activity, History } from "lucide-react";

import { UserActivityClient } from "@/components/dashboard/user-activity/user-activity-client";
import { Badge } from "@/components/ui/badge";

export default async function UserActivity({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const { page = "1", limit = "10" } = await searchParams;
  const parsedPage = Number.parseInt(page);
  const parsedLimit = Number.parseInt(limit);
  const pageNumber = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
  const limitNumber = [10, 20, 50].includes(parsedLimit) ? parsedLimit : 10;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="h-4 w-4" aria-hidden="true" />
            <span>Audit trail</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            User activity
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Track sign-ins, document changes, and account actions across the
            workspace.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="gap-1.5 border-amber-200 bg-amber-50 py-1.5 font-normal text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400"
          >
            <History className="h-3.5 w-3.5" aria-hidden="true" />
            Workspace events
          </Badge>
        </div>
      </header>

      <UserActivityClient
        initialPage={pageNumber}
        initialLimit={limitNumber}
      />
    </div>
  );
}
