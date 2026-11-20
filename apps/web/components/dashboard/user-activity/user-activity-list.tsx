import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { UserActivityTypes } from "@/types";
import { formatDateTime, timeAgo } from "@/utils/helper";

const ROLE_TONES: Record<string, string> = {
  admin:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400",
  moderator:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400",
  user: "border-border/60 bg-muted/60 text-muted-foreground",
};

const getInitials = (name: string) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return initials || "U";
};

const getRelativeTime = (value: string) => {
  try {
    return timeAgo(value);
  } catch {
    return "";
  }
};

export default function UserActivityList({
  userId,
  action,
  createdAt,
  path,
  actionIcon,
  actionTone,
}: UserActivityTypes & { actionTone?: string }) {
  const role = userId?.role ?? "user";
  const relative = getRelativeTime(createdAt);

  return (
    <TableRow className="transition-colors hover:bg-muted/30">
      <TableCell>
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/15 to-orange-500/10 text-xs font-semibold text-amber-600 ring-1 ring-amber-500/20 dark:text-amber-400">
            {getInitials(userId?.name ?? "")}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {userId?.name ?? "Unknown user"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {userId?.email ?? "—"}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
            ROLE_TONES[role] ?? ROLE_TONES.user
          )}
        >
          {role}
        </span>
      </TableCell>

      <TableCell>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
            actionTone ??
              "border-border/60 bg-muted/60 text-muted-foreground"
          )}
        >
          {actionIcon}
          {action}
        </span>
      </TableCell>

      <TableCell>
        <span
          className="inline-block max-w-[260px] truncate rounded-md bg-muted/60 px-2 py-1 font-mono text-xs text-muted-foreground"
          title={path || undefined}
        >
          {path || "—"}
        </span>
      </TableCell>

      <TableCell className="text-right">
        <p className="text-sm">{relative || "—"}</p>
        <p className="text-xs text-muted-foreground">
          {formatDateTime(createdAt)}
        </p>
      </TableCell>
    </TableRow>
  );
}
