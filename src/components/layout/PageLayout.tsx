import type { ReactNode } from 'react';
import { Header } from './Header';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main className="mx-auto max-w-[1700px] px-5 py-6">
        {children}
      </main>
    </div>
  );
}
