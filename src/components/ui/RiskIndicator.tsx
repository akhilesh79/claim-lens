import { cn } from '@/lib/cn';
import type { RiskLevel } from '@/types/common';

interface RiskIndicatorProps {
  level: RiskLevel;
  showLabel?: boolean;
}

const CONFIG: Record<RiskLevel, { bars: number; bar: string; chip: string }> = {
  Low:      { bars: 1, bar: 'bg-success-fg', chip: 'bg-success-bg text-success-fg border-success-border' },
  Medium:   { bars: 2, bar: 'bg-warning-fg', chip: 'bg-warning-bg text-warning-fg border-warning-border' },
  High:     { bars: 3, bar: 'bg-danger-fg',  chip: 'bg-danger-bg  text-danger-fg  border-danger-border'  },
  Critical: { bars: 4, bar: 'bg-danger-fg',  chip: 'bg-danger-bg  text-danger-fg  border-danger-border'  },
};

export function RiskIndicator({ level, showLabel = true }: RiskIndicatorProps) {
  const c = CONFIG[level];
  return (
    <span className={cn('inline-flex items-center gap-1.5 h-6 px-2 rounded-sm border text-caption', c.chip)}>
      <span className="flex items-end gap-px h-3.5">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            style={{ height: `${5 + i * 2}px` }}
            className={cn('w-[3px] rounded-sm', i <= c.bars ? c.bar : 'bg-border')}
          />
        ))}
      </span>
      {showLabel && level}
    </span>
  );
}
