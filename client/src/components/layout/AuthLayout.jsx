import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AnimatedBackground } from '@/components/layout/AnimatedBackground';
import { BrandMark } from '@/components/ui/BrandMark';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

const features = [
  'Drag-and-drop file workspace',
  'Live progress feedback',
  'Premium dashboard analytics',
];

export function AuthLayout({ title, description, children }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <BrandMark />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <ButtonLink to="/" variant="secondary" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Home
            </ButtonLink>
          </div>
        </div>

        <div className="mt-10 grid flex-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-cyan-200">
              <CheckCircle2 className="h-4 w-4" />
              Secure access
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              {description}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {features.map((feature) => (
                <div key={feature} className="glass-panel rounded-2xl px-4 py-4 text-sm text-slate-200">
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel relative overflow-hidden rounded-[2rem] p-4 shadow-glass">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
