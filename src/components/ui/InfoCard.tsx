import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

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
    <div className={cn(
      'flex items-start gap-3 p-3 rounded-md border bg-surface',
      accent ? 'border-brand-100 bg-brand-50' : 'border-border',
      className,
    )}>
      {icon && (
        <div className="h-8 w-8 rounded-md bg-surface-muted border border-border grid place-items-center flex-shrink-0 text-text-subtle">
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="label-caption mb-0.5">{label}</p>
        <p className={cn('text-body-strong text-text break-words', mono && 'font-mono')}>{value}</p>
      </div>
    </div>
  );
}
