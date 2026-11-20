import {
  AlertCircle,
  CalendarClock,
  Clock3,
  LogIn,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import type { User } from "@/types";
import { fetchData } from "@/utils/apiServices";
import { formatDate, formatDateTime } from "@/utils/helper";

export default async function UserStatistics({ userId }: { userId: string }) {
  // Verify session first
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized - Please log in");
  }

  try {
    const [activityResponse, userResponse] = await Promise.all([
      fetchData(`user-activity/${userId || null}`),
      fetch(`https://api.sawaribd.com/users/${userId}`),
    ]);

    if (!activityResponse || !userResponse.ok) {
      throw new Error("Failed to fetch user data");
    }

    const [rawActivity, userInfo]: [unknown, User] = await Promise.all([
      activityResponse,
      userResponse.json(),
    ]);

    const activity: any[] = Array.isArray(rawActivity)
      ? rawActivity
      : Array.isArray((rawActivity as any)?.data)
        ? (rawActivity as any).data
        : [];

    const today = new Date().toISOString().split("T")[0];

    const actionToday = activity.filter(
      (item) =>
        typeof item?.createdAt === "string" &&
        item.createdAt.startsWith(today)
    );

    const totalSignIn = activity.reduce(
      (count, item) => (item?.action === "Sign In" ? count + 1 : count),
      0
    );

    const lastActive = [...activity]
      .filter((item) => item?.createdAt)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0]?.createdAt;

    return (
      <section
        aria-label="Account statistics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          label="Total logins"
          value={totalSignIn}
          hint="All time sign-ins"
          icon={LogIn}
          tone="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
        />
        <StatCard
          label="Actions today"
          value={actionToday.length}
          hint="Recorded since midnight"
          icon={Sparkles}
          tone="bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400"
        />
        <StatCard
          label="Last active"
          value={lastActive ? formatDateTime(lastActive) : "No activity"}
          hint="Most recent action"
          icon={Clock3}
          tone="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
          compact
        />
        <StatCard
          label="Account created"
          value={
            userInfo?.createdAt ? formatDate(userInfo.createdAt) : "Unknown"
          }
          hint="Member since"
          icon={CalendarClock}
          tone="bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
          compact
        />
      </section>
    );
  } catch (error) {
    console.error("Error in UserStatistics:", error);
    return (
      <Card className="border-destructive/30 bg-destructive/5 shadow-none">
        <CardContent className="flex items-center gap-2 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          Could not load account statistics right now. Please try again later.
        </CardContent>
      </Card>
    );
  }
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
  compact,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: LucideIcon;
  tone: string;
  compact?: boolean;
}) {
  return (
    <Card className="border-border/60 shadow-sm transition-colors hover:border-primary/30">
      <CardContent className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p
            className={cn(
              "font-semibold leading-snug",
              compact ? "text-sm" : "text-2xl"
            )}
          >
            {value}
          </p>
          <p className="truncate text-xs text-muted-foreground">{hint}</p>
        </div>
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            tone
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  );
}
