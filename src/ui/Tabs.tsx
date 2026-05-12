import {
  createContext,
  useContext,
  useId,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';

interface TabsCtx {
  value: string;
  onValueChange: (v: string) => void;
  baseId: string;
}
const Ctx = createContext<TabsCtx | null>(null);
const useTabs = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('Tabs.* must be used inside <Tabs>');
  return c;
};

interface TabsProps {
  value: string;
  onValueChange: (v: string) => void;
  children: ReactNode;
  className?: string;
}
export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  const baseId = useId();
  return (
    <Ctx.Provider value={{ value, onValueChange, baseId }}>
      <div className={className}>{children}</div>
    </Ctx.Provider>
  );
}

export function TabsList({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-1 border-b border-border h-11',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'> {
  value: string;
  count?: number;
}
export function TabsTrigger({ value, count, className, children, ...rest }: TabsTriggerProps) {
  const ctx = useTabs();
  const active = ctx.value === value;
  return (
    <button
      role="tab"
      type="button"
      aria-selected={active}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      id={`${ctx.baseId}-tab-${value}`}
      tabIndex={active ? 0 : -1}
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        'h-11 px-4 -mb-px',
        'inline-flex items-center gap-2',
        'text-body-strong text-text-muted',
        'border-b-2 border-transparent',
        'transition-colors duration-fast',
        'hover:text-text',
        active && 'text-text border-brand-500',
        className,
      )}
      {...rest}
    >
      {children}
      {typeof count === 'number' && (
        <span className="text-caption text-text-subtle bg-surface-muted rounded-sm px-1.5 py-0.5">
          {count}
        </span>
      )}
    </button>
  );
}

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}
export function TabsContent({ value, className, children, ...rest }: TabsContentProps) {
  const ctx = useTabs();
  if (ctx.value !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      className={cn('animate-fade-in', className)}
      {...rest}
    >
      {children}
    </div>
  );
}
