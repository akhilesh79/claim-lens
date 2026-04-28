interface SkeletonProps {
  className?: string;
  height?: string;
}

export function Skeleton({ className = '', height = 'h-4' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-white/[0.06] rounded-lg ${height} ${className}`} />
  );
}

export function SkeletonCard({ lines = 4, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`glass rounded-2xl p-5 space-y-3 ${className}`}>
      <Skeleton height="h-4" className="w-2/5" />
      <div className="space-y-2 pt-1">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            height="h-3"
            className={i === lines - 1 ? 'w-3/5' : 'w-full'}
          />
        ))}
      </div>
    </div>
  );
}

export function ClaimDashboardSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      <SkeletonCard lines={3} />
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2 space-y-4">
          <SkeletonCard lines={8} />
          <SkeletonCard lines={5} />
          <SkeletonCard lines={4} />
        </div>
        <div className="col-span-3 space-y-4">
          <SkeletonCard lines={6} />
          <SkeletonCard lines={7} />
          <SkeletonCard lines={5} />
        </div>
      </div>
      <SkeletonCard lines={2} />
    </div>
  );
}

export function ImagingDashboardSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      <SkeletonCard lines={3} />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <SkeletonCard lines={10} />
          <SkeletonCard lines={6} />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} lines={3} />
          ))}
        </div>
      </div>
    </div>
  );
}
