import type { RiskLevel } from '@/types/common';

interface RiskIndicatorProps {
  level: RiskLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const RISK_CONFIG: Record<RiskLevel, { bars: number; color: string; bg: string; border: string }> = {
  Low: { bars: 1, color: 'bg-emerald-400 text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25' },
  Medium: { bars: 2, color: 'bg-amber-400 text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25' },
  High: { bars: 3, color: 'bg-orange-400 text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/25' },
  Critical: { bars: 4, color: 'bg-red-400 text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/25' },
};

export function RiskIndicator({ level, showLabel = true, size = 'md' }: RiskIndicatorProps) {
  const cfg = RISK_CONFIG[level];
  const textColor = cfg.color.split(' ')[1];
  const barColor = cfg.color.split(' ')[0];
  const barH = size === 'sm' ? 'h-2' : 'h-3';
  const px = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${cfg.bg} ${cfg.border} ${textColor} ${px}`}
    >
      <span className="flex items-end gap-px">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            style={{ height: `${6 + i * 2}px` }}
            className={`w-[3px] rounded-sm transition-all ${i <= cfg.bars ? barColor : 'bg-white/10'}`}
          />
        ))}
      </span>
      {showLabel && level}
    </span>
  );
}
