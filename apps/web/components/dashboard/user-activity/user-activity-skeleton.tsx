import { Skeleton } from "@/components/ui/skeleton";

const UserActivitySkeleton = () => {
  return (
    <div className="divide-y divide-border/60">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 px-4 py-3.5">
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />

          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-56 max-w-full" />
          </div>

          <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
          <Skeleton className="hidden h-6 w-24 rounded-full md:block" />
          <Skeleton className="hidden h-3 w-28 lg:block" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
};

export default UserActivitySkeleton;
