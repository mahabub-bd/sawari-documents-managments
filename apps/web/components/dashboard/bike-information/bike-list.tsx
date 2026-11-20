"use client";

// Bike document inventory with search, filters, sorting, and pagination.

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowDownWideNarrow,
  Bike,
  FileText,
  Filter,
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
import { brands } from "@/constants";
import { cn, getDateFilterRange, type DateRangeFilterType } from "@/lib/utils";
import type { BikeDetailsType, Brand } from "@/types";
import BikeAddAction from "../modal/BikeAddAction";
import BikeItem from "./bike-item";

interface BikeProps {
  bikedatas: BikeDetailsType[];
  error?: string | null;
}

type SortOption = "newest" | "oldest" | "brand";

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
    "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
  amber:
    "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  rose: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
} as const;

type StatTone = keyof typeof STAT_TONES;

export default function BikeList({ bikedatas, error }: BikeProps) {
  const data = Array.isArray(bikedatas) ? bikedatas : [];

  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateRangeFilter, setDateRangeFilter] =
    useState<DateRangeFilterType>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const currentYear = new Date().getFullYear();
  const lastEightYears = Array.from({ length: 8 }, (_, i) => currentYear - i);

  const filteredData = data.filter((bike) => {
    const brandMatch =
      brandFilter && brandFilter !== "all"
        ? bike.bikeBrand === brandFilter
        : true;

    const yearMatch = yearFilter ? bike.manufacturingYear === yearFilter : true;

    const query = searchQuery.trim().toLowerCase();
    const searchMatch = query
      ? [
          bike.engineNumber,
          bike.chassisNumber,
          bike.registrationNumber,
          bike.bikeModel,
          bike.name,
        ].some((value) => value?.toLowerCase().includes(query))
      : true;

    const dateFilterMatch = (() => {
      if (dateRangeFilter === "all") return true;

      const range = getDateFilterRange(dateRangeFilter);
      if (!range || !bike.createdAt) return true;

      const createdAt = new Date(bike.createdAt);
      return createdAt >= range[0] && createdAt <= range[1];
    })();

    return brandMatch && yearMatch && searchMatch && dateFilterMatch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === "oldest") {
      return (
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
    if (sortBy === "brand") {
      return `${a.bikeBrand} ${a.bikeModel}`.localeCompare(
        `${b.bikeBrand} ${b.bikeModel}`
      );
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const indexOfLastItem = safePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const hasActiveFilters =
    brandFilter !== "all" ||
    yearFilter !== null ||
    searchQuery.trim() !== "" ||
    dateRangeFilter !== "all";

  const activeFilterCount = [
    brandFilter !== "all",
    yearFilter !== null,
    searchQuery.trim() !== "",
    dateRangeFilter !== "all",
  ].filter(Boolean).length;

  const registeredCount = data.filter(
    (bike) => bike.registrationStatus === "Registered"
  ).length;
  const pendingRegistrationCount = data.length - registeredCount;
  const pendingSecurityCount = data.filter(
    (bike) => bike.securityAmount > 0 && !bike.securityMoneyReturned
  ).length;

  const selectedBrandName = brands.find(
    (brand) => brand.id === brandFilter
  )?.name;

  useEffect(() => {
    setCurrentPage(1);
  }, [brandFilter, yearFilter, searchQuery, dateRangeFilter, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setBrandFilter("all");
    setYearFilter(null);
    setSearchQuery("");
    setDateRangeFilter("all");
    setCurrentPage(1);
  };

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
          <BikeAddAction />
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
          value={data.length}
          hint="Bike records on file"
          icon={Bike}
          tone="sky"
        />
        <StatCard
          label="Registered"
          value={registeredCount}
          hint="Fully registered bikes"
          icon={ShieldCheck}
          tone="emerald"
        />
        <StatCard
          label="Pending registration"
          value={pendingRegistrationCount}
          hint="On test / unregistered"
          icon={FileText}
          tone="amber"
        />
        <StatCard
          label="Security pending"
          value={pendingSecurityCount}
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
            <Badge variant="secondary" className="font-normal">
              {sortedData.length}{" "}
              {sortedData.length === 1 ? "document" : "documents"}
            </Badge>
            {hasActiveFilters && (
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

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {searchQuery.trim() !== "" && (
              <FilterChip
                label={`Search: ${searchQuery.trim()}`}
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
        {currentItems.length > 0 ? (
          currentItems.map((bike) => <BikeItem {...bike} key={bike._id} />)
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
                <BikeAddAction />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {sortedData.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, sortedData.length)}
            </span>{" "}
            of <span className="font-medium text-foreground">{sortedData.length}</span>{" "}
            documents
          </p>
          <PaginationComponent
            currentPage={safePage}
            totalPages={totalPages}
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
