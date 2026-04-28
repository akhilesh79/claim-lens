import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'xs' | 'sm' | 'md';
  color?: 'blue' | 'green' | 'amber' | 'red' | 'auto';
  className?: string;
  delay?: number;
}

function resolveColor(color: ProgressBarProps['color'], value: number): string {
  if (color === 'auto') {
    if (value >= 80) return 'from-emerald-500 to-emerald-400';
    if (value >= 60) return 'from-amber-500 to-amber-400';
    return 'from-red-500 to-red-400';
  }
  const MAP: Record<NonNullable<Exclude<ProgressBarProps['color'], 'auto'>>, string> = {
    blue: 'from-blue-500 to-blue-400',
    green: 'from-emerald-500 to-emerald-400',
    amber: 'from-amber-500 to-amber-400',
    red: 'from-red-500 to-red-400',
  };
  return MAP[color ?? 'blue'];
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
  delay = 0.2,
}: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  const gradient = resolveColor(color, pct);

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs text-slate-400">{label}</span>}
          {showValue && <span className="text-xs font-semibold text-slate-300 tabular-nums">{value}%</span>}
        </div>
      )}
      <div className={`w-full bg-white/[0.06] rounded-full overflow-hidden ${HEIGHT[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.1, ease: 'easeOut', delay }}
          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
        />
      </div>
    </div>
  );
}
