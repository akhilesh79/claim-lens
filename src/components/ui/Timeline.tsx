import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface TimelineEntry {
  id: string | number;
  dayLabel: string | number;
  title: string;
  description?: string;
  date?: string;
  isGap?: boolean;
  variant?: 'default' | 'warning' | 'success';
  icon?: ReactNode;
}

interface TimelineProps {
  entries: TimelineEntry[];
  gapMessage?: string;
  className?: string;
}

const DOT: Record<NonNullable<TimelineEntry['variant']>, string> = {
  default: 'bg-brand-50    text-brand-700  border-brand-100',
  warning: 'bg-warning-bg  text-warning-fg border-warning-border',
  success: 'bg-success-bg  text-success-fg border-success-border',
};

export function Timeline({ entries, gapMessage, className = '' }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute left-[13px] top-4 bottom-4 w-px bg-border pointer-events-none" />

      <div className="space-y-1">
        {entries.map((entry) =>
          entry.isGap ? (
            <div
              key={entry.id}
              className="ml-1 my-1.5 flex items-center gap-2 px-3 py-2 rounded-md bg-warning-bg border border-warning-border text-warning-fg"
            >
              <AlertTriangle size={14} />
              <span className="text-small">
                {gapMessage ?? `Gap detected — no records for Day ${entry.dayLabel}`}
              </span>
            </div>
          ) : (
            <div key={entry.id} className="flex gap-3 py-1">
              <div className={cn(
                'h-7 w-7 rounded-full border grid place-items-center flex-shrink-0 z-10 mt-0.5 text-caption font-semibold',
                DOT[entry.variant ?? 'default'],
              )}>
                {entry.icon ?? entry.dayLabel}
              </div>
              <div className="flex-1 pb-1 min-w-0">
                <p className="text-body-strong text-text">{entry.title}</p>
                {entry.description && <p className="text-small text-text-subtle mt-0.5">{entry.description}</p>}
                {entry.date && <p className="text-caption text-text-subtle mt-0.5">{entry.date}</p>}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
