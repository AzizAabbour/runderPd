import { Menu, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export function Topbar({ onMenuClick, title, subtitle }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/50 backdrop-blur-2xl">
      <div className="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Button variant="secondary" size="sm" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-4 w-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
            {subtitle}
          </p>
          <h1 className="truncate text-xl font-semibold text-white">{title}</h1>
        </div>
        <div className="hidden w-full max-w-md items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400 md:flex">
          <Search className="mr-3 h-4 w-4" />
          Search tools, jobs, and files
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <LanguageSwitcher />
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            {user?.name ?? 'Guest'}
          </div>
        </div>
      </div>
    </header>
  );
}

