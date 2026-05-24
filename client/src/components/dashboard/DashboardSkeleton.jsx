import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-10 w-20" />
            <Skeleton className="mt-4 h-4 w-full" />
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="h-80 p-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-4 h-64 w-full" />
        </Card>
        <Card className="h-80 p-5">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="mt-4 h-24 w-full" />
          <Skeleton className="mt-4 h-24 w-full" />
        </Card>
      </div>
    </div>
  );
}

