import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const button = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'font-medium whitespace-nowrap select-none',
    'border transition-colors duration-fast',
    'disabled:opacity-50 disabled:pointer-events-none',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
  ],
  {
    variants: {
      variant: {
        primary:   'bg-brand-500 text-text-inverse border-brand-500 hover:bg-brand-600 hover:border-brand-600 active:bg-brand-700 active:border-brand-700',
        secondary: 'bg-surface text-text border-border hover:bg-surface-muted active:bg-surface-sunk',
        ghost:     'bg-transparent text-text border-transparent hover:bg-surface-muted active:bg-surface-sunk',
        danger:    'bg-danger-fg text-text-inverse border-danger-fg hover:opacity-90 active:opacity-80',
        link:      'bg-transparent text-brand-600 border-transparent hover:underline px-0 h-auto',
      },
      size: {
        sm: 'h-7 px-3 text-small rounded-md',
        md: 'h-9 px-3.5 text-body rounded-md',
        lg: 'h-11 px-4 text-body-strong rounded-lg',
        icon: 'h-9 w-9 p-0 rounded-md',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, leadingIcon, trailingIcon, children, ...rest },
  ref,
) {
  return (
    <button ref={ref} className={cn(button({ variant, size }), className)} {...rest}>
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
});
