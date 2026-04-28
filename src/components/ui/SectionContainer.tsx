import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SectionContainerProps {
  title: string;
  icon?: ReactNode;
  badge?: ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
  children: ReactNode;
  className?: string;
  headerExtra?: ReactNode;
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
}: SectionContainerProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`glass rounded-2xl overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => collapsible && setOpen((p) => !p)}
        className={`w-full flex items-center justify-between px-5 py-3.5 transition-colors ${
          collapsible ? 'cursor-pointer hover:bg-white/[0.025]' : 'cursor-default'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && <span className="text-blue-400 flex-shrink-0 text-base">{icon}</span>}
          <h3 className="text-sm font-semibold text-slate-200 truncate">{title}</h3>
          {badge && <span className="flex-shrink-0">{badge}</span>}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
          {headerExtra}
          {collapsible && (
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-slate-500 text-[10px] leading-none"
            >
              ▼
            </motion.span>
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/[0.05]">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
