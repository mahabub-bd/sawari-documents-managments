import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-[92px] rounded-xl" />
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3.5 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-[240px] rounded-md" />
            <Skeleton className="h-9 w-[150px] rounded-md" />
          </div>
        </div>

        <div className="divide-y divide-border/60">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 px-4 py-3.5">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
              <Skeleton className="hidden h-3 w-28 md:block" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
