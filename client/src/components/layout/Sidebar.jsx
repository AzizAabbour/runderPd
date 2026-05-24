import { NavLink } from 'react-router-dom';
import { ChevronLeft, LogOut, Sparkles } from 'lucide-react';
import { navigationItems } from '@/data/navigation';
import { BrandMark } from '@/components/ui/BrandMark';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import { useAuth } from '@/contexts/AuthContext';

export function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r border-white/10 bg-slate-950/90 p-5 backdrop-blur-2xl transition-transform duration-300 lg:static lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )}
    >
      <div className="flex items-center justify-between">
        <BrandMark />
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-white/10 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Workspace</p>
            <p className="mt-1 text-sm font-semibold text-white">
              {user?.name ?? 'Premium Plan'}
            </p>
          </div>
          <Badge variant="accent">Pro</Badge>
        </div>
        <div className="mt-4 flex items-center gap-3 text-sm text-slate-300">
          <Sparkles className="h-4 w-4 text-cyan-300" />
          <span>Fast processing pipeline</span>
        </div>
      </div>

      <nav className="mt-6 flex-1 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                  isActive
                    ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-white shadow-glow'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 border-t border-white/10 pt-4">
        <Button
          variant="secondary"
          className="w-full justify-start"
          onClick={() => {
            logout();
            onClose?.();
          }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}

