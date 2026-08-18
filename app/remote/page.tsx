'use client';

import { useMemo } from 'react';
import { Laptop } from 'lucide-react';
import { useData } from '@/lib/data-context';
import { JobListSection } from '@/components/jobs/job-list-section';
import { isExpired } from '@/lib/storage';

export default function RemotePage() {
  const { jobs } = useData();
  const active = useMemo(() => jobs.filter((j) => !(j.status === 'Expired' || isExpired(j.deadline))), [jobs]);
  const remote = useMemo(
    () => active.filter((j) => j.workMode === 'Remote' || j.jobType === 'Remote'),
    [active]
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-success/15 text-success">
          <Laptop className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Remote Opportunities</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Work from anywhere. Browse fully remote roles across technology, marketing, design and more.
        </p>
      </div>
      <JobListSection title={`Remote Jobs (${remote.length})`} jobs={remote} viewAllHref="/jobs?workMode=Remote" />
    </div>
  );
}
