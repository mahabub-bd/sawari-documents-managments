"use client";

// Bike document inventory: server-side search, filters, sorting, pagination.

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDownWideNarrow,
  Bike,
  FileText,
  Filter,
  Loader2,
  RotateCcw,
  Search,
  SearchX,
  ShieldCheck,
  SlidersHorizontal,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";

import { PaginationComponent } from "@/components/common/pagination";
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
import { backendUrl as apiUrl, brands } from "@/constants";
import { cn, type DateRangeFilterType } from "@/lib/utils";
import type { BikeDetailsType, Brand } from "@/types";
import { fetchData } from "@/utils/apiServices";
import BikeAddAction from "../modal/BikeAddAction";
import BikeItem, { BikeItemSkeleton } from "./bike-item";

type SortOption = "newest" | "oldest" | "brand";

interface ListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface DocStats {
  total: number;
  registered: number;
  unregistered: number;
  securityPending: number;
  totalPurchaseValue: number;
  addedThisWeek: number;
  addedThisMonth: number;
}

const DATE_RANGE_LABELS: Record<Exclude<DateRangeFilterType, "all">, string> = {
  today: "Today",
  thisWeek: "This week",
  lastWeek: "Last week",
  thisMonth: "This month",
  lastMonth: "Last month",
  thisYear: "This year",
  lastYear: "Last year",
  lastSixMonths: "Last 6 months",
};

const STAT_TONES = {
  sky: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
  emerald:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  amber:
    "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  rose: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
} as const;

type StatTone = keyof typeof STAT_TONES;

const ITEMS_PER_PAGE = 5;

export default function BikeList() {
  // Server-driven data
  const [pageItems, setPageItems] = useState<BikeDetailsType[]>([]);
  const [meta, setMeta] = useState<ListMeta>({
    total: 0,
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalPages: 1,
  });
  const [stats, setStats] = useState<DocStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [dateRangeFilter, setDateRangeFilter] =
    useState<DateRangeFilterType>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const currentYear = new Date().getFullYear();
  const lastEightYears = Array.from({ length: 8 }, (_, i) => currentYear - i);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(searchQuery.trim()),
      400
    );
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to first page whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, brandFilter, yearFilter, dateRangeFilter, sortBy]);

  // Fetch one page from the server
  useEffect(() => {
    const controller = new AbortController();

    const loadDocuments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(ITEMS_PER_PAGE),
          sort: sortBy,
        });
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (brandFilter !== "all") params.set("brand", brandFilter);
        if (yearFilter !== null) params.set("year", String(yearFilter));
        if (dateRangeFilter !== "all") params.set("range", dateRangeFilter);

        const response = await fetch(
          `${apiUrl}/bike-information?${params.toString()}`,
          { signal: controller.signal, cache: "no-store" }
        );
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }
        const payload = await response.json();
        setPageItems(Array.isArray(payload.data) ? payload.data : []);
        setMeta(
          payload.meta ?? {
            total: Array.isArray(payload.data) ? payload.data.length : 0,
            page: 1,
            limit: ITEMS_PER_PAGE,
            totalPages: 1,
          }
        );
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError")
          return;
        console.error("Error loading bike documents:", fetchError);
        setError(
          "Could not load bike documents right now. Please refresh the page or try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
    return () => controller.abort();
  }, [reloadKey, currentPage, debouncedSearch, brandFilter, yearFilter, dateRangeFilter, sortBy]);

  // Fetch stats once (computed in the database)
  useEffect(() => {
    const loadStats = async () => {
      try {
        const s = await fetchData("bike-information/stats");
        setStats(s);
      } catch (statsError) {
        console.error("Error loading stats:", statsError);
      }
    };
    loadStats();
  }, []);

  const refreshData = () => setReloadKey((key) => key + 1);

  const hasActiveFilters =
    brandFilter !== "all" ||
    yearFilter !== null ||
    debouncedSearch !== "" ||
    dateRangeFilter !== "all";

  const activeFilterCount = [
    brandFilter !== "all",
    yearFilter !== null,
    debouncedSearch !== "",
    dateRangeFilter !== "all",
  ].filter(Boolean).length;

  const selectedBrandName = useMemo(
    () => brands.find((brand) => brand.id === brandFilter)?.name,
    [brandFilter]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setBrandFilter("all");
    setYearFilter(null);
    setSearchQuery("");
    setDebouncedSearch("");
    setDateRangeFilter("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const safePage = Math.min(currentPage, meta.totalPages);
  const rangeStart = meta.total === 0 ? 0 : (safePage - 1) * meta.limit + 1;
  const rangeEnd = Math.min(safePage * meta.limit, meta.total);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" aria-hidden="true" />
            <span>Documents</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Bike documents
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Manage bike records, ownership documents, and transaction details in
            one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters((value) => !value)}
            aria-expanded={showFilters}
            aria-controls="bike-filters"
            className="gap-2"
          >
            <Filter className="h-4 w-4" aria-hidden="true" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1.5 text-[11px] font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
          <BikeAddAction onCreated={refreshData} />
        </div>
      </header>

      {error && (
        <Card className="border-destructive/30 bg-destructive/5 shadow-none">
          <CardContent className="flex items-center gap-2 p-4 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </CardContent>
        </Card>
      )}

      {/* Summary stats */}
      <section
        aria-label="Document statistics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          label="Total documents"
          value={stats?.total ?? 0}
          hint="Bike records on file"
          icon={Bike}
          tone="sky"
        />
        <StatCard
          label="Registered"
          value={stats?.registered ?? 0}
          hint="Fully registered bikes"
          icon={ShieldCheck}
          tone="emerald"
        />
        <StatCard
          label="Pending registration"
          value={stats?.unregistered ?? 0}
          hint="On test / unregistered"
          icon={FileText}
          tone="amber"
        />
        <StatCard
          label="Security pending"
          value={stats?.securityPending ?? 0}
          hint="Deposits not returned"
          icon={Wallet}
          tone="rose"
        />
      </section>

      {/* Filters */}
      {showFilters && (
        <Card
          id="bike-filters"
          className="border-border/60 shadow-sm animate-in fade-in-0 slide-in-from-top-1 duration-200"
        >
          <CardContent className="p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <SlidersHorizontal
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                Refine results
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                disabled={!hasActiveFilters}
                className="gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset all
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="bike-search"
                  className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  Search
                </label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="bike-search"
                    type="text"
                    placeholder="Model, engine, chassis, reg..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Brand
                </label>
                <Select value={brandFilter} onValueChange={setBrandFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All brands</SelectItem>
                    {brands.map((brand: Brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Year
                </label>
                <Select
                  value={yearFilter ? yearFilter.toString() : "all"}
                  onValueChange={(value) =>
                    setYearFilter(
                      value !== "all" ? Number.parseInt(value) : null
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All years</SelectItem>
                    {lastEightYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Date added
                </label>
                <Select
                  value={dateRangeFilter}
                  onValueChange={(value) =>
                    setDateRangeFilter(value as DateRangeFilterType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="thisWeek">This week</SelectItem>
                    <SelectItem value="lastWeek">Last week</SelectItem>
                    <SelectItem value="thisMonth">This month</SelectItem>
                    <SelectItem value="lastMonth">Last month</SelectItem>
                    <SelectItem value="thisYear">This year</SelectItem>
                    <SelectItem value="lastYear">Last year</SelectItem>
                    <SelectItem value="lastSixMonths">Last 6 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">Results</h2>
            {isLoading ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                Loading…
              </span>
            ) : (
              <Badge variant="secondary" className="font-normal">
                {meta.total} {meta.total === 1 ? "document" : "documents"}
              </Badge>
            )}
            {hasActiveFilters && !isLoading && (
              <Badge
                variant="outline"
                className="border-sky-200 bg-sky-50 font-normal text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400"
              >
                Filtered
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ArrowDownWideNarrow
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="h-9 w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="brand">Brand A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && !isLoading && (
          <div className="flex flex-wrap items-center gap-2">
            {debouncedSearch !== "" && (
              <FilterChip
                label={`Search: ${debouncedSearch}`}
                onRemove={() => setSearchQuery("")}
              />
            )}
            {brandFilter !== "all" && (
              <FilterChip
                label={`Brand: ${selectedBrandName ?? brandFilter}`}
                onRemove={() => setBrandFilter("all")}
              />
            )}
            {yearFilter !== null && (
              <FilterChip
                label={`Year: ${yearFilter}`}
                onRemove={() => setYearFilter(null)}
              />
            )}
            {dateRangeFilter !== "all" && (
              <FilterChip
                label={`Added: ${DATE_RANGE_LABELS[dateRangeFilter]}`}
                onRemove={() => setDateRangeFilter("all")}
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-7 gap-1 px-2 text-xs"
            >
              Clear all
              <X className="h-3 w-3" aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>

      {/* Documents */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <BikeItemSkeleton key={`skeleton-${index}`} />
          ))
        ) : pageItems.length > 0 ? (
          pageItems.map((bike) => <BikeItem {...bike} key={bike._id} />)
        ) : (
          <div className="rounded-xl border border-dashed border-border/60 bg-card/50 px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <SearchX
                className="h-5 w-5 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <h3 className="mt-3 text-sm font-semibold">No documents found</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              {hasActiveFilters
                ? "No bikes match the selected filters. Try adjusting your search or clearing the filters."
                : "No bike documents have been added yet."}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {hasActiveFilters ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Clear filters
                </Button>
              ) : (
                <BikeAddAction onCreated={refreshData} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta.total > 0 && !isLoading && (
        <div className="flex flex-col items-center justify-between gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground sm:flex-row">
          <p className="shrink-0 whitespace-nowrap">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {rangeStart}–{rangeEnd}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">{meta.total}</span>{" "}
            documents · page {safePage} of {meta.totalPages}
          </p>
          <PaginationComponent
            currentPage={safePage}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
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

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="rounded-full p-0.5 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="h-3 w-3" aria-hidden="true" />
      </button>
    </span>
  );
}
