import type { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const badge = cva(
  [
    'inline-flex items-center gap-1.5',
    'h-6 px-2 rounded-sm border',
    'text-caption',
  ],
  {
    variants: {
      tone: {
        neutral: 'bg-surface-muted text-text-muted border-border',
        brand:   'bg-brand-50    text-brand-700  border-brand-100',
        success: 'bg-success-bg  text-success-fg border-success-border',
        warning: 'bg-warning-bg  text-warning-fg border-warning-border',
        danger:  'bg-danger-bg   text-danger-fg  border-danger-border',
        info:    'bg-info-bg     text-info-fg    border-info-border',
      },
      withDot: {
        true: '',
        false: '',
      },
    },
    defaultVariants: { tone: 'neutral', withDot: false },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge> {
  leadingIcon?: ReactNode;
}

export function Badge({ tone, withDot, leadingIcon, className, children, ...rest }: BadgeProps) {
  return (
    <span className={cn(badge({ tone, withDot }), className)} {...rest}>
      {withDot && (
        <span
          aria-hidden
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            tone === 'success' && 'bg-success-fg',
            tone === 'warning' && 'bg-warning-fg',
            tone === 'danger'  && 'bg-danger-fg',
            tone === 'info'    && 'bg-info-fg',
            tone === 'brand'   && 'bg-brand-500',
            (!tone || tone === 'neutral') && 'bg-text-subtle',
          )}
        />
      )}
      {leadingIcon}
      {children}
    </span>
  );
}

/** Convenience: maps domain Status enum to Badge tone + label. */
import type { Status } from '@/types/common';
const STATUS_TONE: Record<Status, { tone: BadgeProps['tone']; label: string }> = {
  APPROVED:    { tone: 'success', label: 'Approved' },
  REJECTED:    { tone: 'danger',  label: 'Rejected' },
  CONDITIONAL: { tone: 'warning', label: 'Conditional' },
};

export function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_TONE[status];
  return <Badge tone={cfg.tone} withDot>{cfg.label}</Badge>;
}
