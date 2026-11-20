import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileEdit,
  FilePlus,
  FileText,
  LayoutDashboard,
  Lightbulb,
  LogIn,
  LogOut,
  Mail,
  Shield,
  Sparkles,
  Trash2,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CopyButton } from "@/components/dashboard/copy-button";
import UserStatistics from "@/components/dashboard/users/user-statistics";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import type { UserActivityTypes } from "@/types";
import { fetchProtectedData } from "@/utils/apiServices";
import { formatDateTime, timeAgo } from "@/utils/helper";

type ActionInfo = {
  icon: LucideIcon;
  tone: string;
};

const getActionInfo = (action: string): ActionInfo => {
  const actionLower = action.toLowerCase();

  if (actionLower.includes("sign in") || actionLower.includes("login")) {
    return {
      icon: LogIn,
      tone: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
    };
  }

  if (actionLower.includes("sign out") || actionLower.includes("logout")) {
    return {
      icon: LogOut,
      tone: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    };
  }

  if (actionLower.includes("create") || actionLower.includes("add")) {
    return {
      icon: FilePlus,
      tone: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    };
  }

  if (actionLower.includes("update") || actionLower.includes("edit")) {
    return {
      icon: FileEdit,
      tone: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
    };
  }

  if (actionLower.includes("delete") || actionLower.includes("remove")) {
    return {
      icon: Trash2,
      tone: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    };
  }

  return {
    icon: Activity,
    tone: "bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300",
  };
};

const getActivityDescription = (path: string, action: string) => {
  const pathParts = path.replace(/^\//, "").split("/");

  if (pathParts[0] === "auth") {
    if (
      action.toLowerCase().includes("signin") ||
      action.toLowerCase().includes("sign in")
    ) {
      return "Signed in to the workspace";
    }
    if (
      action.toLowerCase().includes("signout") ||
      action.toLowerCase().includes("sign out")
    ) {
      return "Signed out of the workspace";
    }
    return `Authentication action: ${action}`;
  }

  if (pathParts[0] === "api") {
    const resource = pathParts[1] || "resource";
    return `${action} on ${resource.replace(/-/g, " ")}`;
  }

  return `${action} at ${path}`;
};

const relativeTime = (value?: string) => {
  if (!value) return "Unknown time";
  try {
    return timeAgo(value);
  } catch {
    return "Unknown time";
  }
};

const AdminDashboard = async () => {
  const session = await getSession();

  const getInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const userName = session?.user?.name || "User Name";
  const userRole = session?.user?.role || "User";
  const userEmail = session?.user?.email || "Email not provided";
  const userId = session?.user?.id || "ID not available";
  const firstName = userName.split(" ")[0] || userName;

  const isPrivileged = userRole === "admin" || userRole === "moderator";

  // Fetch the user's recent activity
  let userActivity: UserActivityTypes[] = [];
  let activityError: string | null = null;

  if (userId !== "ID not available" && session?.user?.id) {
    try {
      const responseData = await fetchProtectedData(
        `user-activity/${userId}/recent`
      );

      if (Array.isArray(responseData)) {
        userActivity = responseData;
      } else if (responseData && typeof responseData === "object") {
        if (Array.isArray(responseData.data)) {
          userActivity = responseData.data;
        } else if (Array.isArray(responseData.activities)) {
          userActivity = responseData.activities;
        } else if (responseData._id) {
          userActivity = [responseData];
        } else {
          throw new Error("Unexpected API response format");
        }
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Error fetching user activity:", error);
      activityError =
        error instanceof Error ? error.message : "Failed to load activity data";
    }
  } else {
    activityError = "User ID not available. Please log in again.";
  }

  const lastActivity = userActivity[0];
  const lastSignIn = userActivity.find((activity) =>
    /sign in|login/i.test(activity?.action || "")
  )?.createdAt;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Dhaka",
  });

  const quickActions: {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    external?: boolean;
  }[] = [
    {
      title: "Documents",
      description: "Browse and manage bike documents",
      href: "/dashboard/documents",
      icon: FileText,
    },
    ...(isPrivileged
      ? [
          {
            title: "User directory",
            description: "Review accounts and permissions",
            href: "/dashboard/users",
            icon: Users,
          },
          {
            title: "Activity log",
            description: "Audit actions across the workspace",
            href: "/dashboard/user-activity",
            icon: Activity,
          },
        ]
      : []),
    {
      title: "Contact support",
      description: "Get help from the admin team",
      href: "mailto:contact@mahabub.me",
      icon: Mail,
      external: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero header — compact */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#00a2ed] to-[#0077b5] px-4 py-4 text-white shadow-sm sm:px-5">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/10 blur-2xl"
        />

        <div className="relative flex flex-wrap items-center gap-x-4 gap-y-3">
          <Avatar className="h-10 w-10 shrink-0 border border-white/40">
            <AvatarImage src={session?.user?.image || ""} alt={userName} />
            <AvatarFallback className="bg-white/20 text-sm font-semibold text-white">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 basis-56">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-base font-bold tracking-tight">
                Welcome back, {firstName}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-medium capitalize">
                <Shield className="h-3 w-3" aria-hidden="true" />
                {userRole}
              </span>
              <span className="hidden items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium md:inline-flex">
                <CalendarDays className="h-3 w-3" aria-hidden="true" />
                {today}
              </span>
            </div>
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-white/75">
              <Mail className="h-3 w-3 shrink-0" aria-hidden="true" />
              {userEmail}
              <span className="hidden font-mono text-white/60 md:inline">
                · {userId.slice(0, 10)}…
                <CopyButton
                  textToCopy={userId}
                  className="h-4 w-4 text-white/60 hover:bg-white/15 hover:text-white"
                />
              </span>
            </p>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <span className="hidden items-center gap-1 text-xs text-white/70 lg:flex">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {lastSignIn ? formatDateTime(lastSignIn) : "No recent sign-in"}
            </span>
            <Button
              asChild
              size="sm"
              className="h-8 bg-white px-3 text-xs font-medium text-sky-700 hover:bg-white/90"
            >
              <Link href="/dashboard/documents">
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                Documents
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics */}
      {userRole === "admin" &&
      session?.user?.id &&
      session.user.id !== "ID not available" ? (
        <UserStatistics userId={session.user.id} />
      ) : (
        <section
          aria-label="Account summary"
          className="grid gap-4 sm:grid-cols-3"
        >
          <MiniStat
            icon={Activity}
            label="Recent actions"
            value={userActivity.length}
            hint="Latest recorded events"
          />
          <MiniStat
            icon={Clock}
            label="Last active"
            value={
              lastActivity?.createdAt
                ? relativeTime(lastActivity.createdAt)
                : "—"
            }
            hint={
              lastActivity?.createdAt
                ? formatDateTime(lastActivity.createdAt)
                : "No activity yet"
            }
          />
          <MiniStat
            icon={Shield}
            label="Access level"
            value={userRole}
            hint="Current account role"
            capitalize
          />
        </section>
      )}

      {/* Activity + quick actions */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="border-border/60 shadow-sm xl:col-span-2">
          <CardHeader className="flex-row items-start justify-between space-y-0 p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Activity className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="space-y-1">
                <CardTitle className="text-base">Recent activity</CardTitle>
                <CardDescription>
                  Your latest actions across the workspace
                </CardDescription>
              </div>
            </div>
            {userActivity.length > 0 && (
              <Badge variant="secondary" className="font-normal">
                {userActivity.length}
              </Badge>
            )}
          </CardHeader>

          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            {activityError ? (
              <EmptyState
                icon={AlertCircle}
                tone="text-destructive"
                title="Could not load activity"
                description={activityError}
              />
            ) : userActivity.length === 0 ? (
              <EmptyState
                icon={Activity}
                tone="text-muted-foreground"
                title="No recent activity"
                description="Actions you take in the workspace will show up here."
              />
            ) : (
              <ol className="max-h-[420px] space-y-0 overflow-y-auto pr-1">
                {userActivity.map((activity, index) => {
                  if (!activity || typeof activity !== "object") return null;

                  const action = activity.action || "Unknown";
                  const { icon: Icon, tone } = getActionInfo(action);

                  return (
                    <li
                      key={
                        activity._id ||
                        `${action}-${activity.createdAt ?? index}`
                      }
                      className="relative flex items-center gap-3 pb-3.5 last:pb-0"
                    >
                      {index < userActivity.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="absolute left-4 top-8 h-[calc(100%-1.25rem)] w-px bg-border"
                        />
                      )}

                      <span
                        className={cn(
                          "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-card",
                          tone
                        )}
                        title={
                          activity.createdAt
                            ? formatDateTime(activity.createdAt)
                            : undefined
                        }
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>

                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                            tone
                          )}
                        >
                          {action}
                        </span>

                        <span className="truncate text-sm text-foreground/90">
                          {activity.path
                            ? getActivityDescription(activity.path, action)
                            : "Unknown activity"}
                        </span>

                        <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {relativeTime(activity.createdAt)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </CardContent>

          <CardFooter className="border-t border-border/60 p-3 sm:px-4">
            {isPrivileged ? (
              <Button asChild variant="ghost" size="sm" className="w-full">
                <Link href="/dashboard/user-activity">
                  View full activity log
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : (
              <p className="w-full py-1 text-center text-xs text-muted-foreground">
                Showing your most recent actions
              </p>
            )}
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles
                  className="h-4 w-4 text-primary"
                  aria-hidden="true"
                />
                Quick actions
              </CardTitle>
              <CardDescription>
                Jump straight to the tools you use most.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-1 p-4 pt-0 sm:p-6 sm:pt-0">
              {quickActions.map((action) => (
                <QuickAction key={action.title} {...action} />
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5 shadow-none">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Lightbulb
                  className="h-4 w-4 text-primary"
                  aria-hidden="true"
                />
                Workspace tips
              </div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <CheckCircle2
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500"
                    aria-hidden="true"
                  />
                  Keep vehicle documents up to date after every sale.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500"
                    aria-hidden="true"
                  />
                  Review recent activity for unexpected changes.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500"
                    aria-hidden="true"
                  />
                  Contact an administrator to request access changes.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

function MiniStat({
  icon: Icon,
  label,
  value,
  hint,
  capitalize,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint: string;
  capitalize?: boolean;
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
              "truncate text-lg font-semibold leading-tight",
              capitalize && "capitalize"
            )}
          >
            {value}
          </p>
          <p className="truncate text-xs text-muted-foreground">{hint}</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  );
}

function QuickAction({
  title,
  description,
  href,
  icon: Icon,
  external,
}: {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
}) {
  const className =
    "group flex items-start gap-3 rounded-lg border border-transparent p-3 transition-colors hover:border-border/60 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{title}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {description}
        </span>
      </span>
      <ArrowUpRight
        className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />
    </>
  );

  if (external) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

function EmptyState({
  icon: Icon,
  tone,
  title,
  description,
}: {
  icon: LucideIcon;
  tone: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 px-6 py-10 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
        <Icon className={cn("h-5 w-5", tone)} aria-hidden="true" />
      </span>
      <p className="text-sm font-medium">{title}</p>
      <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default AdminDashboard;
