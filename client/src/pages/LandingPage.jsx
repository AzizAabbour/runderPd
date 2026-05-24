import {
  ArrowRight,
  CheckCircle2,
  CloudDownload,
  Gauge,
  Sparkles,
  ShieldCheck,
  Workflow,
  Zap,
  Globe2,
  Layers3,
  WandSparkles,
  Star,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { AnimatedBackground } from '@/components/layout/AnimatedBackground';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { ToolGrid } from '@/components/tools/ToolGrid';
import { tools } from '@/data/tools';
import { formatBytes } from '@/utils/format';

const heroStats = [
  {
    label: 'Files processed',
    value: 12840,
    suffix: '+',
    icon: Layers3,
    accent: 'from-cyan-500 to-sky-500',
    iconWrap: 'bg-cyan-400/15 text-cyan-200',
  },
  {
    label: 'Compression saved',
    value: 342,
    suffix: ' GB',
    icon: CloudDownload,
    accent: 'from-emerald-500 to-teal-500',
    iconWrap: 'bg-emerald-400/15 text-emerald-200',
  },
  {
    label: 'Automated tools',
    value: 12,
    suffix: '',
    icon: WandSparkles,
    accent: 'from-violet-500 to-fuchsia-500',
    iconWrap: 'bg-violet-400/15 text-violet-200',
  },
  {
    label: 'Avg. speed boost',
    value: 98,
    suffix: '%',
    icon: Gauge,
    accent: 'from-amber-500 to-orange-500',
    iconWrap: 'bg-amber-400/15 text-amber-200',
  },
];

const highlights = [
  {
    icon: Zap,
    title: 'Fast, responsive workflow',
    text: 'Smooth transitions, instant feedback, and a dashboard designed to stay out of your way.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure upload validation',
    text: 'Server-side file checks, size controls, and a clean API boundary keep uploads predictable.',
  },
  {
    icon: Globe2,
    title: 'Multi-language support',
    text: 'Switch languages in the UI without losing your place or your processing state.',
  },
  {
    icon: Workflow,
    title: 'Modern file orchestration',
    text: 'A unified tool library for image, PDF, video, and document workflows.',
  },
];

const steps = [
  {
    title: 'Upload',
    text: 'Drag files into the workspace or use the browse action for quick selection.',
  },
  {
    title: 'Tune',
    text: 'Adjust compression quality, conversion targets, or page operations as needed.',
  },
  {
    title: 'Download',
    text: 'Track progress live and download the processed output as soon as it is ready.',
  },
];

export function LandingPage() {
  const featuredTools = tools.slice(0, 6);

  return (
    <div className="relative overflow-hidden">
      <AnimatedBackground />
      <PublicHeader />

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-20">
          <div className="flex flex-col justify-center">
            <Badge variant="accent" className="mb-6 w-fit">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Premium file tools studio
            </Badge>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Modern file tools built for speed, clarity, and polished delivery.
            </motion.h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Compress images, optimize PDFs, convert documents, and manage file workflows in a
              premium dashboard with glassmorphism panels, motion-rich interactions, and real-time
              progress feedback.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink to="/auth/register" size="lg" className="gap-2">
                Get started
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink to="/auth/login" variant="secondary" size="lg">
                Sign in
              </ButtonLink>
              <a
                href="#tools"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 text-base font-medium text-slate-100 transition hover:bg-white/10"
              >
                Explore tools
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-4 text-sm text-slate-300">
              {[
                'Drag & drop uploads',
                'Instant downloads',
                'Dark / light mode',
                'Responsive mobile layout',
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <Card className="relative w-full overflow-hidden p-6 lg:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Live workspace
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Processing panel</h2>
                  </div>
                  <Badge variant="success">Ready</Badge>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">Brand deck.pdf</p>
                        <p className="text-xs text-slate-400">PDF compression active</p>
                      </div>
                      <span className="text-xs text-slate-300">{formatBytes(14_658_234)}</span>
                    </div>
                    <div className="mt-4">
                      <ProgressBar value={86} />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Output</p>
                      <p className="mt-2 text-lg font-semibold text-white">3.2 MB</p>
                      <p className="text-sm text-slate-400">From 14.0 MB</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">ETA</p>
                      <p className="mt-2 text-lg font-semibold text-white">18 sec</p>
                      <p className="text-sm text-slate-400">Estimated save time</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">Compression</Badge>
                    <Badge variant="default">Preview</Badge>
                    <Badge variant="default">Download</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <StatsGrid items={heroStats} />
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Product experience"
            title="A futuristic interface designed for serious file work."
            description="Every screen is built to feel premium: motion-rich, responsive, and focused on helping people move quickly from upload to download."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="p-5">
                  <div className="inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="tools" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Tool library"
            title="All the essential file utilities in one premium workspace."
            description="Browse the most common workflows and jump into a dedicated tool screen with upload, settings, progress tracking, and download actions."
          />
          <div className="mt-8">
            <ToolGrid tools={featuredTools} />
          </div>
        </section>

        <section id="security" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="p-6">
              <SectionHeader
                eyebrow="Security"
                title="Built with secure upload handling."
                description="The backend validates file size, MIME type, and request payloads before processing begins."
              />
              <div className="mt-6 space-y-4">
                {[
                  'Multer-based upload pipeline with configurable limits',
                  'JWT authentication ready for production auth flows',
                  'Rate limiting and helmet defaults for safer APIs',
                  'Download files served from a dedicated output path',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-300" />
                    <p className="text-sm leading-6 text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <SectionHeader
                eyebrow="How it works"
                title="A simple, polished three-step flow."
                description="The experience stays clear from the first upload to the final download."
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{step.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-cyan-100">
                  <Star className="h-4 w-4" />
                  Designed like a startup-grade cloud product
                </div>
                <p className="mt-2 text-sm leading-6 text-cyan-50/90">
                  Elegant, fast, and optimized for the polished feel people expect from a modern
                  SaaS file platform.
                </p>
              </div>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <Card className="overflow-hidden p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Badge variant="accent">Ready to launch</Badge>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Start with a premium file workflow today.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Create an account and move from landing page to a polished dashboard, with all
                  the responsive motion and tool pages already in place.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <ButtonLink to="/auth/register" size="lg">
                  Create account
                </ButtonLink>
                <ButtonLink to="/auth/login" variant="secondary" size="lg">
                  Sign in
                </ButtonLink>
              </div>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
