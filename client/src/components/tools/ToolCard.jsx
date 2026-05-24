import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

export function ToolCard({ tool, className }) {
  const Icon = tool.icon;

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 250, damping: 22 }}>
      <Link to={tool.route} className={cn('block h-full', className)}>
        <Card className="group relative h-full overflow-hidden p-5 transition hover:border-cyan-400/20">
          <div className={cn('absolute inset-0 bg-gradient-to-br opacity-10 blur-3xl', tool.accent)} />
          <div className="relative flex h-full flex-col gap-5">
            <div className="flex items-start justify-between gap-3">
              <div className={cn('rounded-2xl bg-gradient-to-br p-3 text-white shadow-glow', tool.accent)}>
                <Icon className="h-5 w-5" />
              </div>
              <Badge variant="default">{tool.badge}</Badge>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">{tool.title}</h3>
              <p className="text-sm leading-6 text-slate-300">{tool.description}</p>
            </div>
            <div className="mt-auto flex items-center justify-between text-sm text-slate-300">
              <span>{tool.category}</span>
              <span className="inline-flex items-center gap-2 text-cyan-300 transition group-hover:translate-x-0.5">
                Open tool
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

