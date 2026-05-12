import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SectionContainerProps {
  title: string;
  icon?: ReactNode;
  badge?: ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
  children: ReactNode;
  className?: string;
  headerExtra?: ReactNode;
  maxH?: string;
}

export function SectionContainer({
  title,
  icon,
  badge,
  defaultOpen = true,
  collapsible = true,
  children,
  className = '',
  headerExtra,
  maxH = 'max-h-[420px]',
}: SectionContainerProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={cn(
      'h-full flex flex-col rounded-lg bg-surface border border-border shadow-elev-1 overflow-hidden',
      className,
    )}>
      <button
        type="button"
        onClick={() => collapsible && setOpen((p) => !p)}
        className={cn(
          'w-full flex items-center justify-between px-4 h-11 flex-shrink-0',
          'transition-colors duration-fast',
          collapsible ? 'cursor-pointer hover:bg-surface-muted' : 'cursor-default',
        )}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2 min-w-0">
          {icon && <span className="text-text-subtle flex-shrink-0">{icon}</span>}
          <h3 className="text-h3 text-text truncate">{title}</h3>
          {badge && <span className="flex-shrink-0">{badge}</span>}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
          {headerExtra}
          {collapsible && (
            <ChevronDown
              size={16}
              className={cn(
                'text-text-subtle transition-transform duration-fast',
                open && 'rotate-180',
              )}
            />
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-border">
          <div className={cn('px-4 pb-4 overflow-y-auto', maxH)}>{children}</div>
        </div>
      )}

      <div className="flex-1" />
    </section>
  );
}
