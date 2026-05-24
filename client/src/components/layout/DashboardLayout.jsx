import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatedBackground } from '@/components/layout/AnimatedBackground';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

function getRouteLabels(pathname) {
  if (pathname === '/dashboard') return ['Dashboard', 'Command center'];
  if (pathname === '/dashboard/tools') return ['Tools', 'Tool library'];
  if (pathname.startsWith('/dashboard/tools/')) return ['Tool workspace', 'Upload and process'];
  if (pathname === '/dashboard/history') return ['History', 'Job archive'];
  if (pathname === '/dashboard/settings') return ['Settings', 'Preferences'];
  return ['Dashboard', 'Workspace'];
}

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const [title, subtitle] = getRouteLabels(location.pathname);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <AnimatedBackground />
      <div className="relative z-10 flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {sidebarOpen ? (
          <button
            type="button"
            aria-label="Close sidebar overlay"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          />
        ) : null}
        <div className="relative flex min-w-0 flex-1 flex-col">
          <Topbar
            onMenuClick={() => setSidebarOpen(true)}
            title={title}
            subtitle={subtitle}
          />
          <main className="relative flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
