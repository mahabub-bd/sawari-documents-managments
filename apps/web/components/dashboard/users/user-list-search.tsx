"use client";

import { useState } from "react";
import {
  CalendarDays,
  RotateCcw,
  Search,
  ShieldCheck,
  UserCog,
  UserRound,
  Users,
  UserX,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

import { UserAddAction } from "../modal/UserAddAction";
import UserActions from "./UserActions";

const STAT_TONES = {
  violet:
    "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  rose: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
  sky: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
  emerald:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
} as const;

type StatTone = keyof typeof STAT_TONES;

const ROLE_TONES: Record<string, string> = {
  admin:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400",
  moderator:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400",
  user: "border-border/60 bg-muted/60 text-muted-foreground",
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  moderator: "Moderator",
  user: "User",
};

function getInitials(name: string) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return initials || "U";
}

function RoleBadge({ role }: { role: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium capitalize",
        ROLE_TONES[role] ?? ROLE_TONES.user
      )}
    >
      {ROLE_LABELS[role] ?? role}
    </Badge>
  );
}

export function UserListSearch({
  users,
  error,
}: {
  users: User[];
  error?: string | null;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const query = searchQuery.trim().toLowerCase();

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      query === "" ||
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query);

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const hasActiveFilters = query !== "" || roleFilter !== "all";

  const adminCount = users.filter((user) => user.role === "admin").length;
  const moderatorCount = users.filter(
    (user) => user.role === "moderator"
  ).length;
  const memberCount = users.filter((user) => user.role === "user").length;

  const resetFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" aria-hidden="true" />
            <span>User management</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            User directory
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Manage accounts, roles, and permissions across the workspace.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <UserAddAction />
        </div>
      </header>

      {error && (
        <Card className="border-destructive/30 bg-destructive/5 shadow-none">
          <CardContent className="flex items-center gap-2 p-4 text-sm text-destructive">
            <UserX className="h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </CardContent>
        </Card>
      )}

      {/* Summary stats */}
      <section
        aria-label="User statistics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          label="Total users"
          value={users.length}
          hint="Accounts in the workspace"
          icon={Users}
          tone="violet"
        />
        <StatCard
          label="Admins"
          value={adminCount}
          hint="Full workspace access"
          icon={ShieldCheck}
          tone="rose"
        />
        <StatCard
          label="Moderators"
          value={moderatorCount}
          hint="Elevated permissions"
          icon={UserCog}
          tone="sky"
        />
        <StatCard
          label="Members"
          value={memberCount}
          hint="Standard accounts"
          icon={UserRound}
          tone="emerald"
        />
      </section>

      {/* User table */}
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold">All users</h2>
              <Badge variant="secondary" className="font-normal">
                {filteredUsers.length}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Search by name or email, or narrow the list by role.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                placeholder="Search users..."
                aria-label="Search users"
                className="pl-9 sm:w-[240px]"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="sm:w-[150px]" aria-label="Filter by role">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="min-w-[220px] font-medium">
                  User
                </TableHead>
                <TableHead className="font-medium">Role</TableHead>
                <TableHead className="font-medium">Joined</TableHead>
                <TableHead className="text-right font-medium">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user._id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 text-xs font-semibold text-violet-600 ring-1 ring-violet-500/20 dark:text-violet-400">
                          {getInitials(user.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {user.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <CalendarDays
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <UserActions id={user._id} user={user} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4} className="p-0">
                    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <UserX
                          className="h-5 w-5 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </span>
                      <p className="text-sm font-semibold">No users found</p>
                      <p className="max-w-sm text-sm text-muted-foreground">
                        {hasActiveFilters
                          ? "No accounts match your search or role filter. Try adjusting the filters."
                          : "No user accounts have been created yet."}
                      </p>
                      {hasActiveFilters && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resetFilters}
                          className="mt-2 gap-1.5"
                        >
                          <RotateCcw
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-2 border-t border-border/60 bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {filteredUsers.length}
            </span>{" "}
            of <span className="font-medium text-foreground">{users.length}</span>{" "}
            {users.length === 1 ? "user" : "users"}
          </p>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="gap-1.5 self-start sm:self-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset filters
            </Button>
          )}
        </div>
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
  value: number;
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
