'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { JobCard } from '@/components/jobs/job-card';
import { useData } from '@/lib/data-context';
import { Button } from '@/components/ui/button';

interface JobListProps {
  title?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  jobs: ReturnType<typeof useData>['jobs'];
  limit?: number;
}

export function JobListSection({
  title,
  viewAllHref,
  viewAllLabel,
  jobs,
  limit,
}: JobListProps) {
  const { companies } = useData();
  const list = limit ? jobs.slice(0, limit) : jobs;
  if (list.length === 0) {
    return (
      <section>
        {title && <h2 className="mb-6 text-2xl font-bold tracking-tight">{title}</h2>}
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No jobs found right now. Check back soon.
        </div>
      </section>
    );
  }
  return (
    <section>
      {(title || viewAllHref) && (
        <div className="mb-6 flex items-center justify-between">
          {title && <h2 className="text-2xl font-bold tracking-tight">{title}</h2>}
          {viewAllHref && (
            <Button asChild variant="ghost" className="text-primary">
              <Link href={viewAllHref}>
                {viewAllLabel ?? 'View All'} <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            company={companies.find((c) => c.id === job.companyId)}
          />
        ))}
      </div>
    </section>
  );
}
