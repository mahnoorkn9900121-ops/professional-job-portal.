'use client';

import Link from 'next/link';
import { Heart, FileText } from 'lucide-react';
import { useData } from '@/lib/data-context';
import { JobCard } from '@/components/jobs/job-card';
import { Button } from '@/components/ui/button';

export default function SavedJobsPage() {
  const { savedJobIds, jobs, companies } = useData();
  const savedJobs = jobs.filter((j) => savedJobIds.includes(j.id));

  if (savedJobs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Heart className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">No saved jobs</h1>
        <p className="mt-2 text-muted-foreground">Save jobs you're interested in to find them here later.</p>
        <Button asChild className="mt-6">
          <Link href="/jobs">Browse Jobs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-1 text-3xl font-bold tracking-tight">Saved Jobs</h1>
      <p className="mb-6 text-muted-foreground">{savedJobs.length} jobs you've saved.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {savedJobs.map((job) => (
          <JobCard key={job.id} job={job} company={companies.find((c) => c.id === job.companyId)} />
        ))}
      </div>
    </div>
  );
}
