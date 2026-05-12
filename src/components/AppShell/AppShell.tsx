import type { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { NavRail } from './NavRail';

interface AppShellProps {
  children: ReactNode;
  rightRail?: ReactNode;
}

export function AppShell({ children, rightRail }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-text">
      <TopBar />
      <div className="flex-1 flex min-h-0">
        <NavRail />
        <main className="flex-1 min-w-0 overflow-x-hidden">
          {children}
        </main>
        {rightRail && (
          <aside className="hidden xl:block w-80 border-l border-border bg-surface overflow-y-auto">
            {rightRail}
          </aside>
        )}
      </div>
    </div>
  );
}
