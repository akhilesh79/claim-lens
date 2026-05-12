import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface FieldShellProps {
  label?: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  htmlFor: string;
  children: ReactNode;
  className?: string;
}

function FieldShell({ label, required, hint, error, htmlFor, children, className }: FieldShellProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={htmlFor} className="label-caption text-text-muted">
          {label}
          {required && <span className="text-danger-fg ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <span className="text-small text-danger-fg">{error}</span>
      ) : hint ? (
        <span className="text-small text-text-subtle">{hint}</span>
      ) : null}
    </div>
  );
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, hint, error, leadingIcon, trailingIcon, required, className, ...rest },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const hasError = Boolean(error);

  return (
    <FieldShell label={label} hint={hint} error={error} required={required} htmlFor={inputId}>
      <div
        className={cn(
          'flex items-center gap-2',
          'h-9 px-3 rounded-md',
          'bg-surface border',
          hasError ? 'border-danger-border' : 'border-border',
          'focus-within:border-brand-500 focus-within:shadow-[0_0_0_3px_rgb(var(--color-brand-100))]',
          'transition-colors duration-fast',
        )}
      >
        {leadingIcon && <span className="text-text-subtle flex-shrink-0">{leadingIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          required={required}
          className={cn(
            'flex-1 min-w-0 bg-transparent outline-none',
            'text-body text-text placeholder:text-text-subtle',
            'disabled:cursor-not-allowed',
            className,
          )}
          {...rest}
        />
        {trailingIcon && <span className="text-text-subtle flex-shrink-0">{trailingIcon}</span>}
      </div>
    </FieldShell>
  );
});
