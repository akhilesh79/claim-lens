import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const surface = cva(
  ['bg-surface border border-border', 'transition-shadow duration-fast'],
  {
    variants: {
      elevation: {
        0: 'shadow-none',
        1: 'shadow-elev-1',
        2: 'shadow-elev-2',
      },
      padding: {
        none:        'p-0',
        compact:     'p-4',
        default:     'p-5',
        comfortable: 'p-6',
      },
      radius: {
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-elev-2',
        false: '',
      },
    },
    defaultVariants: { elevation: 0, padding: 'default', radius: 'lg', interactive: false },
  },
);

export interface SurfaceProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof surface> {
  asChild?: boolean;
}

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(function Surface(
  { className, elevation, padding, radius, interactive, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(surface({ elevation, padding, radius, interactive }), className)}
      {...rest}
    >
      {children}
    </div>
  );
});

interface SurfaceHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}
export function SurfaceHeader({ title, description, action, className, ...rest }: SurfaceHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-4', className)} {...rest}>
      <div className="min-w-0">
        <h3 className="text-h3 text-text">{title}</h3>
        {description && <p className="text-small text-text-subtle mt-1">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
