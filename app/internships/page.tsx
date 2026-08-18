'use client';

import { useMemo } from 'react';
import { GraduationCap } from 'lucide-react';
import { useData } from '@/lib/data-context';
import { JobListSection } from '@/components/jobs/job-list-section';
import { isExpired } from '@/lib/storage';

export default function InternshipsPage() {
  const { jobs } = useData();
  const active = useMemo(() => jobs.filter((j) => !(j.status === 'Expired' || isExpired(j.deadline))), [jobs]);
  const internships = useMemo(() => active.filter((j) => j.jobType === 'Internship'), [active]);
  const paid = useMemo(() => internships.filter((j) => j.salaryMax > 0), [internships]);
  const byCategory = (cat: string) => internships.filter((j) => j.category === cat);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <GraduationCap className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Internships</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Gain real-world experience. Browse paid, remote and specialized internships for students and freshers.
        </p>
      </div>
      <div className="space-y-12">
        <JobListSection title={`All Internships (${internships.length})`} jobs={internships} />
        <JobListSection title="Paid Internships" jobs={paid} />
        <JobListSection title="Software Internships" jobs={byCategory('technology')} />
        <JobListSection title="Marketing Internships" jobs={byCategory('marketing')} />
        <JobListSection title="Business Internships" jobs={byCategory('business')} />
      </div>
    </div>
  );
}
