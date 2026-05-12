import { cn } from '@/lib/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'xs' | 'sm' | 'md';
  color?: 'brand' | 'success' | 'warning' | 'danger' | 'auto';
  className?: string;
}

function resolveColor(color: ProgressBarProps['color'], pct: number): string {
  if (color === 'auto') {
    if (pct >= 80) return 'bg-success-fg';
    if (pct >= 60) return 'bg-warning-fg';
    return 'bg-danger-fg';
  }
  return {
    brand:   'bg-brand-500',
    success: 'bg-success-fg',
    warning: 'bg-warning-fg',
    danger:  'bg-danger-fg',
  }[color ?? 'brand'];
}

const HEIGHT: Record<NonNullable<ProgressBarProps['size']>, string> = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  size = 'sm',
  color = 'auto',
  className = '',
}: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  const fill = resolveColor(color, pct);

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1">
          {label && <span className="text-small text-text-muted">{label}</span>}
          {showValue && <span className="num text-text">{value}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-surface-muted rounded-full overflow-hidden', HEIGHT[size])}>
        <div
          className={cn('h-full rounded-full transition-[width] duration-500', fill)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
