import { useEffect, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { AppShell } from '@/components/AppShell/AppShell';
import { EmptyState } from '@/ui';

const UploadPage     = lazy(() => import('@/pages/UploadPage'));
const CasesQueue     = lazy(() => import('@/routes/CasesQueue'));
const CaseWorkspace  = lazy(() => import('@/routes/CaseWorkspace'));

/** Reads theme from Redux and syncs it to the <html data-theme> attribute. */
function ThemeSyncer() {
  const theme = useAppSelector((s) => s.ui.theme);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'claimlens' : 'light');
  }, [theme]);
  return null;
}

function PageFallback() {
  return (
    <div className="min-h-screen grid place-items-center bg-canvas">
      <div className="h-8 w-8 rounded-full border-2 border-border border-t-brand-500 animate-spin" />
    </div>
  );
}

/** /cases/new wraps the upload flow inside the new shell. */
function NewCaseRoute() {
  return (
    <AppShell>
      <Suspense fallback={<PageFallback />}>
        <UploadPage />
      </Suspense>
    </AppShell>
  );
}

function NotFound() {
  return (
    <AppShell>
      <div className="px-6 py-16">
        <EmptyState title="Page not found" description="The route you tried doesn't exist." />
      </div>
    </AppShell>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/cases" replace />} />
        <Route path="/cases" element={<CasesQueue />} />
        <Route path="/cases/new" element={<NewCaseRoute />} />
        <Route path="/cases/:id" element={<CaseWorkspace />} />

        {/* Legacy redirects — old /claims and /imaging now live as tabs in /cases/:id */}
        <Route path="/claims"  element={<Navigate to="/cases" replace />} />
        <Route path="/imaging" element={<Navigate to="/cases" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ThemeSyncer />
      <AppRoutes />
    </HashRouter>
  );
}
