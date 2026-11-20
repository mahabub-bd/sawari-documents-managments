"use client";

import {
  Activity,
  AlertCircle,
  FileEdit,
  FilePlus,
  LogIn,
  LogOut,
  RefreshCw,
  Settings,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { PaginationComponent } from "@/components/common/pagination";
import UserActivityList from "@/components/dashboard/user-activity/user-activity-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { UserActivityTypes } from "@/types";
import { fetchProtectedData } from "@/utils/apiServices";

import UserActivitySkeleton from "./user-activity-skeleton";

interface UserActivityClientProps {
  initialPage: number;
  initialLimit: number;
}

interface ApiResponse {
  message: string;
  statusCode: number;
  data: UserActivityTypes[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const STAT_TONES = {
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  emerald:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  sky: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
  rose: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
} as const;

type StatTone = keyof typeof STAT_TONES;

const ACTION_TONES = {
  signIn:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400",
  signOut:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400",
  create:
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400",
  update:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400",
  delete:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400",
  system:
    "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-400",
  default: "border-border/60 bg-muted/60 text-muted-foreground",
} as const;

// Map an action to its icon and colour treatment
const getActionMeta = (action: string): { Icon: LucideIcon; tone: string } => {
  const actionLower = action.toLowerCase();

  if (actionLower.includes("sign in") || actionLower.includes("login")) {
    return { Icon: LogIn, tone: ACTION_TONES.signIn };
  }
  if (actionLower.includes("sign out") || actionLower.includes("logout")) {
    return { Icon: LogOut, tone: ACTION_TONES.signOut };
  }
  if (actionLower.includes("delete") || actionLower.includes("remove")) {
    return { Icon: Trash2, tone: ACTION_TONES.delete };
  }
  if (actionLower.includes("create") || actionLower.includes("add")) {
    return { Icon: FilePlus, tone: ACTION_TONES.create };
  }
  if (actionLower.includes("update") || actionLower.includes("edit")) {
    return { Icon: FileEdit, tone: ACTION_TONES.update };
  }
  if (actionLower.includes("system") || actionLower.includes("config")) {
    return { Icon: Settings, tone: ACTION_TONES.system };
  }

  return { Icon: Activity, tone: ACTION_TONES.default };
};

// Standardize action names for display
const formatActionName = (action: string): string => {
  const actionLower = action.toLowerCase();

  if (actionLower.includes("login") || actionLower.includes("signin")) {
    return "Sign In";
  }
  if (actionLower.includes("logout") || actionLower.includes("signout")) {
    return "Sign Out";
  }

  return action.charAt(0).toUpperCase() + action.slice(1);
};

export function UserActivityClient({
  initialPage,
  initialLimit,
}: UserActivityClientProps) {
  const [currentPage, setCurrentPage] = useState(Math.max(1, initialPage));
  const [limit, setLimit] = useState(initialLimit);
  const [activities, setActivities] = useState<UserActivityTypes[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchActivities = useCallback(
    async (page: number, pageLimit: number) => {
      try {
        setLoading(true);
        setError(null);

        const response: ApiResponse = await fetchProtectedData(
          `user-activity?page=${page}&limit=${pageLimit}`
        );

        if (response && Array.isArray(response.data)) {
          const processedActivities = response.data.map(
            (activity: UserActivityTypes) => ({
              ...activity,
              action: formatActionName(activity.action),
            })
          );

          setActivities(processedActivities);
          setTotalPages(response.totalPages ?? 0);
          setTotal(response.total ?? 0);
        } else {
          setActivities([]);
          setTotalPages(0);
          setTotal(0);
          setError("No activity records were returned.");
        }
      } catch (err) {
        console.error("Error fetching activities:", err);
        setActivities([]);
        setError("Failed to load activity. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchActivities(currentPage, limit);
  }, [fetchActivities, currentPage, limit]);

  const syncUrl = (page: number, pageLimit: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("limit", pageLimit.toString());
    router.replace(url.pathname + url.search, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    syncUrl(page, limit);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLimitChange = (value: string) => {
    const nextLimit = Number.parseInt(value) || 10;
    setLimit(nextLimit);
    setCurrentPage(1);
    syncUrl(1, nextLimit);
  };

  const handleRefresh = () => fetchActivities(currentPage, limit);

  const signInCount = activities.filter((activity) =>
    /sign in|login/i.test(activity.action)
  ).length;
  const changeCount = activities.filter((activity) =>
    /create|add|update|edit/i.test(activity.action)
  ).length;
  const deleteCount = activities.filter((activity) =>
    /delete|remove/i.test(activity.action)
  ).length;

  const startIndex = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endIndex = Math.min(currentPage * limit, total);
  const hasActivities = activities.length > 0;
  const statsLoading = loading && activities.length === 0;

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <section
        aria-label="Activity statistics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          label="Total events"
          value={statsLoading ? "—" : total}
          hint="All recorded activity"
          icon={Activity}
          tone="amber"
        />
        <StatCard
          label="Sign-ins"
          value={statsLoading ? "—" : signInCount}
          hint="On this page"
          icon={LogIn}
          tone="emerald"
        />
        <StatCard
          label="Changes"
          value={statsLoading ? "—" : changeCount}
          hint="Creates and updates"
          icon={FileEdit}
          tone="sky"
        />
        <StatCard
          label="Deletions"
          value={statsLoading ? "—" : deleteCount}
          hint="On this page"
          icon={Trash2}
          tone="rose"
        />
      </section>

      {/* Activity table */}
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold">Activity log</h2>
              <Badge variant="secondary" className="font-normal">
                {total}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Every sign-in and workspace change, newest first.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Rows</span>
              <Select value={limit.toString()} onValueChange={handleLimitChange}>
                <SelectTrigger
                  className="h-9 w-[80px]"
                  aria-label="Rows per page"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="gap-1.5"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", loading && "animate-spin")}
                aria-hidden="true"
              />
              Refresh
            </Button>
          </div>
        </div>

        {loading ? (
          <UserActivitySkeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle
                className="h-5 w-5 text-destructive"
                aria-hidden="true"
              />
            </span>
            <p className="text-sm font-semibold">Could not load activity</p>
            <p className="max-w-sm text-sm text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="mt-2 gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Try again
            </Button>
          </div>
        ) : !hasActivities ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Activity
                className="h-5 w-5 text-muted-foreground"
                aria-hidden="true"
              />
            </span>
            <p className="text-sm font-semibold">No activity yet</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Actions taken across the workspace will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="min-w-[220px] font-medium">
                    User
                  </TableHead>
                  <TableHead className="font-medium">Role</TableHead>
                  <TableHead className="font-medium">Action</TableHead>
                  <TableHead className="min-w-[200px] font-medium">
                    Path
                  </TableHead>
                  <TableHead className="text-right font-medium">
                    Date &amp; time
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {activities.map((activity) => {
                  const { Icon, tone } = getActionMeta(activity.action);

                  return (
                    <UserActivityList
                      key={activity._id}
                      {...activity}
                      actionTone={tone}
                      actionIcon={
                        <Icon
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                      }
                    />
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {!loading && !error && hasActivities && (
          <div className="flex flex-col gap-3 border-t border-border/60 bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">{startIndex}</span>–
              <span className="font-medium text-foreground">{endIndex}</span> of{" "}
              <span className="font-medium text-foreground">{total}</span>{" "}
              activities
            </p>

            {totalPages > 1 && (
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: LucideIcon;
  tone: StatTone;
}) {
  return (
    <Card className="border-border/60 shadow-sm transition-colors hover:border-primary/30">
      <CardContent className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="text-2xl font-semibold leading-none">{value}</p>
          <p className="truncate text-xs text-muted-foreground">{hint}</p>
        </div>
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            STAT_TONES[tone]
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  );
}
