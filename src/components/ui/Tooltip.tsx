import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom';
  className?: string;
}

export function Tooltip({ content, children, position = 'top', className = '' }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className={cn(
            'absolute z-50 left-1/2 -translate-x-1/2',
            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
            'px-2 py-1 text-caption text-text-inverse bg-text rounded-sm whitespace-nowrap shadow-elev-2 pointer-events-none',
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
