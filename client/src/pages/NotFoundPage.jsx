import { ArrowRight, Home } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ButtonLink } from '@/components/ui/ButtonLink';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="max-w-xl p-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          The route you requested does not exist. Let&apos;s bring you back to the workspace.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/dashboard" size="lg">
            <Home className="h-4 w-4" />
            Dashboard
          </ButtonLink>
          <ButtonLink to="/" variant="secondary" size="lg">
            <ArrowRight className="h-4 w-4" />
            Home
          </ButtonLink>
        </div>
      </Card>
    </div>
  );
}

