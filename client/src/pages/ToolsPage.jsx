import { useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ToolGrid } from '@/components/tools/ToolGrid';
import { toolCategories, getToolsByCategory } from '@/data/tools';
import { cn } from '@/utils/cn';

export function ToolsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filteredTools = useMemo(() => {
    return getToolsByCategory(category).filter((tool) => {
      const search = `${tool.title} ${tool.description} ${tool.category}`.toLowerCase();
      return search.includes(query.toLowerCase());
    });
  }, [category, query]);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Tool library"
        title="Choose the right tool for every file job."
        description="Use search and category filters to quickly find the exact workflow you need."
        action={
          <Button variant="secondary" size="sm">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        }
      />

      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools, like PDF, image, or convert..."
            label="Search"
          />
          <div className="flex flex-wrap gap-2 lg:items-end">
            {toolCategories.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setCategory(item)}
                className={cn(
                  'rounded-2xl border px-4 py-2 text-sm transition',
                  category === item
                    ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-100'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10',
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>{filteredTools.length} tools found</span>
        <span>Glassmorphism UI with motion-rich cards</span>
      </div>

      <ToolGrid tools={filteredTools} />
    </div>
  );
}
