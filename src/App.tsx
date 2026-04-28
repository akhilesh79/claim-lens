import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { PageLayout } from '@/components/layout/PageLayout';
import ClaimDashboard from '@/pages/ClaimDashboard';
import ImagingDashboard from '@/pages/ImagingDashboard';

function ThemeSyncer() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'claimlens');
  }, []);
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
        <ThemeSyncer />
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}
