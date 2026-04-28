import type { Status } from '@/types/common';

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md' | 'lg';
}

const CONFIG: Record<Status, { icon: string; label: string; className: string; pulse: string }> = {
  PASS: {
    icon: '✓',
    label: 'PASS',
    className: 'status-pass',
    pulse: 'bg-emerald-400',
  },
  FAIL: {
    icon: '✗',
    label: 'FAIL',
    className: 'status-fail',
    pulse: 'bg-red-400',
  },
  CONDITIONAL: {
    icon: '⚠',
    label: 'CONDITIONAL',
    className: 'status-conditional',
    pulse: 'bg-amber-400',
  },
};

const SIZE: Record<NonNullable<StatusBadgeProps['size']>, string> = {
  sm: 'text-[10px] px-2 py-0.5 gap-1',
  md: 'text-xs px-3 py-1 gap-1.5',
  lg: 'text-sm px-4 py-1.5 gap-2',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const cfg = CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold tracking-wide ${cfg.className} ${SIZE[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse-slow ${cfg.pulse}`} />
      {cfg.icon} {cfg.label}
    </span>
  );
}
