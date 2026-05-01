import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { PageLayout } from '@/components/layout/PageLayout';
import ClaimDashboard from '@/pages/ClaimDashboard';
import ImagingDashboard from '@/pages/ImagingDashboard';
import UploadPage from '@/pages/UploadPage';

/** Reads theme from Redux and syncs it to the <html data-theme> attribute. */
function ThemeSyncer() {
  const theme = useAppSelector((s) => s.ui.theme);

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      theme === 'dark' ? 'claimlens' : 'light',
    );
  }, [theme]);

  return null;
}

/**
 * Redirects to the upload page when neither dashboard has data yet.
 * Once at least one API result exists (data or error), the guard lets through.
 */
function RequireData({ children }: { children: React.ReactNode }) {
  const claimsData   = useAppSelector((s) => s.claims.apiData);
  const claimsError  = useAppSelector((s) => s.claims.apiError);
  const imagingData  = useAppSelector((s) => s.imaging.apiData);
  const imagingError = useAppSelector((s) => s.imaging.apiError);
  const forgeryResults = useAppSelector((s) => s.forgery.results);
  const forgeryError = useAppSelector((s) => s.forgery.apiError);

  const hasAnyResult =
    claimsData !== null  || claimsError  !== null ||
    imagingData !== null || imagingError !== null  ||
    forgeryResults.length > 0 || forgeryError !== null;

  if (!hasAnyResult) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route
        path="/claims"
        element={
          <RequireData>
            <PageLayout>
              <ClaimDashboard />
            </PageLayout>
          </RequireData>
        }
      />
      <Route
        path="/imaging"
        element={
          <RequireData>
            <PageLayout>
              <ImagingDashboard />
            </PageLayout>
          </RequireData>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeSyncer />
      <AppRoutes />
    </BrowserRouter>
  );
}
