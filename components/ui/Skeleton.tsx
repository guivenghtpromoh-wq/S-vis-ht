export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200/80 rounded-xl ${className}`} />
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="p-3.5 bg-white rounded-2xl border border-slate-100 space-y-3">
      <Skeleton className="w-full h-36 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="w-3/4 h-4" />
        <Skeleton className="w-1/2 h-3" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="w-1/3 h-4" />
        <Skeleton className="w-1/4 h-8 rounded-lg" />
      </div>
    </div>
  );
}
