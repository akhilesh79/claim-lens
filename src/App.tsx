import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { useAppSelector } from '@/app/hooks';
import { PageLayout } from '@/components/layout/PageLayout';
import ClaimDashboard from '@/pages/ClaimDashboard';
import ImagingDashboard from '@/pages/ImagingDashboard';

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

function AppRoutes() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/claims" replace />} />
        <Route path="/claims" element={<ClaimDashboard />} />
        <Route path="/imaging" element={<ImagingDashboard />} />
        <Route path="*" element={<Navigate to="/claims" replace />} />
      </Routes>
    </PageLayout>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {/* ThemeSyncer is inside Provider so it can read from the Redux store */}
        <ThemeSyncer />
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}
