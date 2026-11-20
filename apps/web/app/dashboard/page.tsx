import Link from "next/link";
import {
  ArrowUpRight,
  Bike,
  CalendarDays,
  FileText,
  AlertTriangle,
  Gauge,
  LayoutDashboard,
  Mail,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BrandLogo from "@/components/dashboard/brand-logo";
import { CopyButton } from "@/components/dashboard/copy-button";
import HeroSearch from "@/components/dashboard/hero-search";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import type { BikeDetailsType } from "@/types";
import { fetchData } from "@/utils/apiServices";
import { formatCurrency, formatDateTime } from "@/utils/helper";

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

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Dhaka",
  });

  // Server-computed aggregates + recent documents (avoids loading all docs)
  interface BikeStats {
    total: number;
    registered: number;
    unregistered: number;
    securityPending: number;
    totalPurchaseValue: number;
    addedThisWeek: number;
    addedThisMonth: number;
    recent: BikeDetailsType[];
    unregisteredList: { _id: string; bikeBrand: string; bikeModel: string }[];
    securityAging: (BikeDetailsType & { daysPending: number })[];
  }

  let stats: BikeStats | null = null;
  let documentsError: string | null = null;

  try {
    stats = await fetchData("bike-information/stats");
  } catch (fetchError) {
    console.error("Error loading bike stats:", fetchError);
    documentsError = "Could not load bike document stats right now.";
  }

  const documents = stats?.recent ?? [];
  const registeredCount = stats?.registered ?? 0;
  const pendingRegistrationCount = stats?.unregistered ?? 0;
  const securityPendingCount = stats?.securityPending ?? 0;
  const totalPurchaseValue = stats?.totalPurchaseValue ?? 0;
  const addedThisWeek = stats?.addedThisWeek ?? 0;
  const addedThisMonth = stats?.addedThisMonth ?? 0;

  const unregisteredBikes = stats?.unregisteredList ?? [];
  const pendingSecurityDocs = stats?.securityAging ?? [];

  return (
    <div className="space-y-6">
      {/* Hero header — compact */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#00a2ed] to-[#0077b5] px-4 py-4 text-white shadow-sm sm:px-5">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/10 blur-2xl"
        />

        <div className="relative flex flex-wrap items-center gap-x-4 gap-y-3">
          <AvatarFallbackWrapper
            initials={getInitials(userName)}
            image={session?.user?.image || ""}
            name={userName}
          />

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
            <HeroSearch />
            <Button
              asChild
              size="sm"
              className="h-8 bg-white px-3 text-xs font-medium text-sky-700 hover:bg-white/90"
            >
              <Link href="/dashboard/documents">
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                All documents
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Unregistered bikes alert */}
      {unregisteredBikes.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
              {unregisteredBikes.length} bike
              {unregisteredBikes.length > 1 ? "s" : ""} still not registered
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              {unregisteredBikes.slice(0, 3).map((bike) => (
                <Link
                  key={bike._id}
                  href={`/dashboard/documents/${bike._id}`}
                  className="inline-flex max-w-[220px] items-center gap-1.5 rounded-full border border-amber-300 bg-white/60 px-2.5 py-1 text-xs text-amber-800 transition-colors hover:bg-white dark:border-amber-500/40 dark:bg-transparent dark:text-amber-300 dark:hover:bg-amber-500/20"
                >
                  <Bike className="h-3 w-3 shrink-0" aria-hidden="true" />
                  <span className="truncate capitalize">
                    {bike.bikeBrand} {bike.bikeModel}
                  </span>
                </Link>
              ))}
              {unregisteredBikes.length > 3 && (
                <Link
                  href="/dashboard/documents"
                  className="text-xs font-medium text-amber-700 underline-offset-2 hover:underline dark:text-amber-400"
                >
                  +{unregisteredBikes.length - 3} more
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Document statistics */}
      <section
        aria-label="Document statistics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <DocStat
          icon={FileText}
          label="Total documents"
          value={documents.length}
          hint={
            addedThisWeek > 0
              ? `+${addedThisWeek} this week · +${addedThisMonth} this month`
              : "Bike records on file"
          }
          tone={
            addedThisWeek > 0 ? "text-sky-600 dark:text-sky-400" : undefined
          }
        />
        <DocStat
          icon={Bike}
          label="Registered bikes"
          value={registeredCount}
          hint={`${pendingRegistrationCount} pending registration`}
          tone={
            pendingRegistrationCount > 0
              ? "text-amber-600 dark:text-amber-400"
              : undefined
          }
        />
        <DocStat
          icon={ShieldAlert}
          label="Security pending"
          value={securityPendingCount}
          hint="Deposits not yet returned"
          tone={
            securityPendingCount > 0
              ? "text-amber-600 dark:text-amber-400"
              : undefined
          }
        />
        <DocStat
          icon={Wallet}
          label="Total purchase value"
          value={formatCurrency(totalPurchaseValue)}
          hint="Across all recorded deals"
        />
      </section>

      {/* Recent documents + security aging */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="border-border/60 shadow-sm xl:col-span-2">
        <CardHeader className="flex-row items-start justify-between space-y-0 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bike className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <CardTitle className="text-base">Recent documents</CardTitle>
              <CardDescription>
                The latest bike records added to the vault
              </CardDescription>
            </div>
          </div>

          {documents.length > 0 && (
            <Badge variant="secondary" className="font-normal">
              {documents.length}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          {documentsError ? (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              {documentsError}
            </p>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 px-6 py-10 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                <FileText
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </span>
              <p className="text-sm font-medium">No documents yet</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Bike records you add will appear here.
              </p>
            </div>
          ) : (
            <ol className="space-y-1.5">
              {documents.map((doc) => {
                const isRegistered = doc.registrationStatus === "Registered";

                return (
                  <li key={doc._id}>
                    <Link
                      href={`/dashboard/documents/${doc._id}`}
                      className="group flex items-center gap-3 rounded-lg border border-transparent p-2.5 transition-colors hover:border-border/60 hover:bg-muted/60"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <BrandLogo brand={doc.bikeBrand} className="h-5 w-5" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium capitalize">
                          {doc.bikeBrand} {doc.bikeModel}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {doc.registrationNumber || "Not registered"} ·{" "}
                          {doc.name}
                        </p>
                      </div>

                      <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                        <Gauge className="h-3 w-3" aria-hidden="true" />
                        {(doc.odo ?? 0).toLocaleString()} km
                      </span>

                      <span className="hidden text-xs text-muted-foreground md:block">
                        {formatDateTime(doc.createdAt)}
                      </span>

                      <Badge
                        variant="outline"
                        className={cn(
                          "shrink-0",
                          isRegistered
                            ? "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400"
                            : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400"
                        )}
                      >
                        {doc.registrationStatus}
                      </Badge>

                      <ArrowUpRight
                        className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </CardContent>

          <div className="border-t border-border/60 p-3 sm:px-4">
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link href="/dashboard/documents">
                View all documents
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Card>

        {/* Security money aging */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="p-4 sm:p-6 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="h-4 w-4 text-primary" aria-hidden="true" />
              Security deposits
            </CardTitle>
            <CardDescription>
              Pending returns, oldest first
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            {pendingSecurityDocs.length === 0 ? (
              <p className="flex items-center gap-2 rounded-lg border border-dashed border-border/60 px-3 py-6 text-center text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-sky-500" aria-hidden="true" />
                All security deposits have been returned.
              </p>
            ) : (
              <ol className="max-h-[336px] space-y-1.5 overflow-y-auto pr-1">
                {pendingSecurityDocs.map((doc) => {
                  const isOld = doc.daysPending > 30;

                  return (
                    <li key={doc._id}>
                      <Link
                        href={`/dashboard/documents/${doc._id}`}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg border p-2.5 transition-colors",
                          isOld
                            ? "border-amber-200 bg-amber-50 hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:hover:bg-amber-500/20"
                            : "border-border/60 hover:bg-muted/60"
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium capitalize">
                            {doc.bikeBrand} {doc.bikeModel}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {doc.name} ·{" "}
                            {formatCurrency(doc.securityAmount)}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
                            isOld
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {doc.daysPending}d
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="border-primary/20 bg-primary/5 shadow-none">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            Document management tips
          </div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <CheckIcon />
              Keep registration and tax documents up to date after every sale.
            </li>
            <li className="flex gap-2">
              <CheckIcon />
              Mark security deposits as returned once settled.
            </li>
            <li className="flex gap-2">
              <CheckIcon />
              Double-check engine and chassis numbers before printing deal PDFs.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function AvatarFallbackWrapper({
  initials,
  image,
  name,
}: {
  initials: string;
  image: string;
  name: string;
}) {
  return (
    <Avatar className="h-10 w-10 shrink-0 border border-white/40">
      <AvatarImage src={image} alt={name} />
      <AvatarFallback className="bg-white/20 text-sm font-semibold text-white">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

function DocStat({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint: string;
  tone?: string;
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
              tone
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

export default AdminDashboard;
