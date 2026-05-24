import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BrandMark } from '@/components/ui/BrandMark';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { cn } from '@/utils/cn';

export function PublicHeader({ compact = false, className }) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-white/10 bg-slate-950/40 backdrop-blur-2xl dark:bg-slate-950/40',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <BrandMark compact={compact} />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#tools" className="transition hover:text-white">
            Tools
          </a>
          <a href="#security" className="transition hover:text-white">
            Security
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <ButtonLink to="/auth/login" size="sm" className="gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Open App</span>
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
