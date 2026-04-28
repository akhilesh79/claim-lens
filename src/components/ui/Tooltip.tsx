import { useState, type ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom';
  className?: string;
}

export function Tooltip({ content, children, position = 'top', className = '' }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  const posStyle =
    position === 'top'
      ? 'bottom-full mb-2'
      : 'top-full mt-2';

  return (
    <span
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          className={`absolute z-50 left-1/2 -translate-x-1/2 ${posStyle}
            px-2.5 py-1.5 text-[11px] font-medium text-white
            bg-slate-800 border border-white/10 rounded-lg
            whitespace-nowrap shadow-xl pointer-events-none animate-fade-in`}
        >
          {content}
          <span
            className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent
              ${position === 'top' ? 'top-full border-t-slate-800' : 'bottom-full border-b-slate-800'}`}
          />
        </span>
      )}
    </span>
  );
}
