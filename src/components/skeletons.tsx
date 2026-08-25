import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-surface-200 dark:bg-surface-800",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="group rounded-2xl overflow-hidden border border-surface-200 dark:border-surface-800">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-20 rounded-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-3 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="relative rounded-3xl overflow-hidden">
      <Skeleton className="aspect-[21/9] w-full rounded-none" />
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 space-y-4">
        <Skeleton className="h-4 w-32 rounded-full bg-white/20" />
        <Skeleton className="h-8 w-3/4 bg-white/20" />
        <Skeleton className="h-8 w-1/2 bg-white/20" />
        <Skeleton className="h-4 w-48 rounded-full bg-white/20" />
      </div>
    </div>
  );
}

export function SkeletonTrendingItem() {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl">
      <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
