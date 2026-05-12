import { NavLink } from 'react-router-dom';
import { LayoutGrid, FileBarChart, ShieldCheck, Settings } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

interface RailItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const ITEMS: RailItem[] = [
  { to: '/cases',    label: 'Cases',    icon: <LayoutGrid size={20} /> },
  { to: '/reports',  label: 'Reports',  icon: <FileBarChart size={20} /> },
  { to: '/audit',    label: 'Audit',    icon: <ShieldCheck size={20} /> },
  { to: '/settings', label: 'Settings', icon: <Settings size={20} /> },
];

export function NavRail() {
  return (
    <nav className="w-16 border-r border-border bg-surface flex flex-col items-center py-3 gap-1 flex-shrink-0">
      {ITEMS.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          title={it.label}
          aria-label={it.label}
          className={({ isActive }) =>
            cn(
              'relative h-10 w-10 grid place-items-center rounded-md',
              'text-text-subtle hover:text-text hover:bg-surface-muted',
              'transition-colors duration-fast',
              isActive && 'text-brand-600 bg-brand-50',
              isActive && 'after:absolute after:left-0 after:top-1.5 after:bottom-1.5 after:w-0.5 after:bg-brand-500 after:rounded-r',
            )
          }
        >
          {it.icon}
        </NavLink>
      ))}
    </nav>
  );
}
