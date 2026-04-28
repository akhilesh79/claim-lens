import type { ReactNode } from 'react';

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

const DOT_STYLE: Record<NonNullable<TimelineEntry['variant']>, string> = {
  default: 'bg-blue-500/20 border-blue-500/40 text-blue-400',
  warning: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
  success: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
};

export function Timeline({ entries, gapMessage, className = '' }: TimelineProps) {
  return (
    <div className={`relative ${className}`}>
      {/* vertical spine */}
      <div className="absolute left-[13px] top-3 bottom-3 w-px bg-gradient-to-b from-blue-500/40 via-slate-700/40 to-transparent pointer-events-none" />

      <div className="space-y-0.5">
        {entries.map((entry) =>
          entry.isGap ? (
            <div
              key={entry.id}
              className="ml-1 my-1.5 flex items-center gap-3 px-3 py-2 rounded-lg bg-amber-500/[0.06] border border-amber-500/20"
            >
              <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0 text-amber-400 text-[9px] font-bold">
                !
              </div>
              <span className="text-xs text-amber-400">
                {gapMessage ?? `Gap detected — no records for Day ${entry.dayLabel}`}
              </span>
            </div>
          ) : (
            <div key={entry.id} className="flex gap-4 group py-1">
              <div
                className={`w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 z-10 mt-0.5 text-[10px] font-bold transition-transform group-hover:scale-110 ${DOT_STYLE[entry.variant ?? 'default']}`}
              >
                {entry.icon ?? entry.dayLabel}
              </div>
              <div className="flex-1 pb-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 leading-snug">{entry.title}</p>
                {entry.description && (
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{entry.description}</p>
                )}
                {entry.date && <p className="text-[10px] text-slate-600 mt-0.5">{entry.date}</p>}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
