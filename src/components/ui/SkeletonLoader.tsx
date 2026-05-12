import { cn } from '@/lib/cn';

interface SkeletonProps {
  className?: string;
  height?: string;
}

export function Skeleton({ className = '', height = 'h-4' }: SkeletonProps) {
  return <div className={cn('animate-pulse bg-surface-muted rounded-sm', height, className)} />;
}

export function SkeletonCard({ lines = 4, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={cn('rounded-lg border border-border bg-surface p-5 space-y-3', className)}>
      <Skeleton height="h-4" className="w-2/5" />
      <div className="space-y-2 pt-1">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} height="h-3" className={i === lines - 1 ? 'w-3/5' : 'w-full'} />
        ))}
      </div>
    </div>
  );
}

function SkeletonZoneLabel() {
  return (
    <div className="flex items-center gap-3 mb-3">
      <Skeleton height="h-2" className="w-28" />
      <span className="flex-1 h-px bg-border" />
    </div>
  );
}

export function ClaimDashboardSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      <SkeletonCard lines={2} />
      <SkeletonCard lines={2} className="w-full" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <SkeletonCard lines={6} className="lg:col-span-2" />
        <SkeletonCard lines={8} className="lg:col-span-3" />
        <SkeletonCard lines={6} className="lg:col-span-2" />
        <SkeletonCard lines={7} className="lg:col-span-3" />
        <SkeletonCard lines={5} className="lg:col-span-2" />
        <SkeletonCard lines={6} className="lg:col-span-3" />
      </div>
    </div>
  );
}

export function ImagingDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <SkeletonCard lines={3} />
      <div>
        <SkeletonZoneLabel />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => <SkeletonCard key={i} lines={6} />)}
        </div>
      </div>
      <div>
        <SkeletonZoneLabel />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => <SkeletonCard key={i} lines={8} />)}
        </div>
      </div>
      <div>
        <SkeletonZoneLabel />
        <SkeletonCard lines={4} />
      </div>
      <div>
        <SkeletonZoneLabel />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SkeletonCard lines={7} />
          <SkeletonCard lines={7} />
        </div>
      </div>
      <div>
        <SkeletonZoneLabel />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SkeletonCard lines={5} />
        </div>
      </div>
    </div>
  );
}
