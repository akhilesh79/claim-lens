import type { ReactNode } from 'react';

interface InfoCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  accent?: boolean;
  mono?: boolean;
  className?: string;
}

export function InfoCard({ label, value, icon, accent, mono, className = '' }: InfoCardProps) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl glass-sm transition-colors hover:bg-white/[0.04]
        ${accent ? 'border-blue-500/20 bg-blue-500/[0.04]' : ''}
        ${className}`}
    >
      {icon && (
        <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0 text-slate-400 text-sm">
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
        <p className={`text-sm font-semibold text-slate-100 ${mono ? 'font-mono' : ''} break-words`}>{value}</p>
      </div>
    </div>
  );
}
