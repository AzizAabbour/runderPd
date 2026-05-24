import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ToolsPage } from '@/pages/ToolsPage';
import { ToolWorkspacePage } from '@/pages/ToolWorkspacePage';
import { HistoryPage } from '@/pages/HistoryPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function PageFrame({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

function ProtectedRoute() {
  const { isAuthenticated, loading, initialized } = useAuth();

  if (!initialized || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-300 backdrop-blur-xl">
          Loading workspace...
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
}

function GuestRoute() {
  const { isAuthenticated, loading, initialized } = useAuth();

  if (!initialized || loading) {
    return null;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

export default function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageFrame>
              <LandingPage />
            </PageFrame>
          }
        />
        <Route element={<GuestRoute />}>
          <Route
            path="/auth/login"
            element={
              <PageFrame>
                <LoginPage />
              </PageFrame>
            }
          />
          <Route
            path="/auth/register"
            element={
              <PageFrame>
                <RegisterPage />
              </PageFrame>
            }
          />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<DashboardLayout />}
          >
            <Route
              index
              element={
                <PageFrame>
                  <DashboardPage />
                </PageFrame>
              }
            />
            <Route
              path="tools"
              element={
                <PageFrame>
                  <ToolsPage />
                </PageFrame>
              }
            />
            <Route
              path="tools/:toolId"
              element={
                <PageFrame>
                  <ToolWorkspacePage />
                </PageFrame>
              }
            />
            <Route
              path="history"
              element={
                <PageFrame>
                  <HistoryPage />
                </PageFrame>
              }
            />
            <Route
              path="settings"
              element={
                <PageFrame>
                  <SettingsPage />
                </PageFrame>
              }
            />
          </Route>
        </Route>
        <Route
          path="*"
          element={
            <PageFrame>
              <NotFoundPage />
            </PageFrame>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

