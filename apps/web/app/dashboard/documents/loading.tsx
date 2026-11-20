import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-[92px] rounded-xl" />
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-[160px] rounded-md" />
      </div>

      {/* Document cards */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card
            key={index}
            className="overflow-hidden border-border/60 p-4 shadow-sm sm:p-5"
          >
            <div className="flex items-start gap-3">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-52" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((__, factIndex) => (
                <Skeleton key={factIndex} className="h-16 rounded-lg" />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
