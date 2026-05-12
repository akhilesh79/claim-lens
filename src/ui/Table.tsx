import type { HTMLAttributes, ReactNode, ThHTMLAttributes, TdHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface ColumnAlignProp { align?: 'left' | 'right' | 'center'; }
const align = (a?: 'left' | 'right' | 'center') =>
  a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : 'text-left';

export function Table({ className, children, ...rest }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className={cn('w-full border-collapse', className)} {...rest}>
        {children}
      </table>
    </div>
  );
}

export function THead({ className, children, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn('bg-surface-muted border-b border-border', className)} {...rest}>
      {children}
    </thead>
  );
}

export function TBody({ className, children, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className} {...rest}>{children}</tbody>;
}

export function TR({
  className,
  selected,
  flagged,
  ...rest
}: HTMLAttributes<HTMLTableRowElement> & { selected?: boolean; flagged?: 'warning' | 'danger' }) {
  return (
    <tr
      className={cn(
        'border-b border-border last:border-0',
        'hover:bg-surface-muted transition-colors duration-fast',
        selected && 'bg-brand-50',
        flagged === 'warning' && 'bg-warning-bg/40',
        flagged === 'danger'  && 'bg-danger-bg/40',
        className,
      )}
      {...rest}
    />
  );
}

export function TH({
  className,
  align: a,
  children,
  ...rest
}: ThHTMLAttributes<HTMLTableCellElement> & ColumnAlignProp) {
  return (
    <th
      className={cn(
        'h-10 px-4',
        'label-caption text-text-subtle',
        align(a),
        className,
      )}
      {...rest}
    >
      {children}
    </th>
  );
}

export function TD({
  className,
  align: a,
  mono,
  children,
  ...rest
}: TdHTMLAttributes<HTMLTableCellElement> & ColumnAlignProp & { mono?: boolean }) {
  return (
    <td
      className={cn(
        'px-4 py-2.5',
        'text-body text-text',
        align(a),
        mono && 'font-mono text-small',
        className,
      )}
      {...rest}
    >
      {children}
    </td>
  );
}

export function EmptyState({ title, description, action }: { title: ReactNode; description?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <h3 className="text-h3 text-text">{title}</h3>
      {description && <p className="text-small text-text-subtle mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
