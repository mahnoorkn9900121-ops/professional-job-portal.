'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { GraduationCap, Sparkles, ArrowRight } from 'lucide-react';
import { useData } from '@/lib/data-context';
import { JobListSection } from '@/components/jobs/job-list-section';
import { isExpired } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function FreshersPage() {
  const { jobs } = useData();
  const active = useMemo(() => jobs.filter((j) => !(j.status === 'Expired' || isExpired(j.deadline))), [jobs]);
  const fresher = useMemo(
    () => active.filter((j) => j.experienceYears === 0 || j.jobType === 'Internship' || j.experienceYears <= 1),
    [active]
  );
  const noExp = useMemo(() => active.filter((j) => j.experienceYears === 0), [active]);
  const entryLevel = useMemo(() => active.filter((j) => j.experienceYears <= 1 && j.experienceYears > 0), [active]);
  const trainee = useMemo(() => active.filter((j) => j.jobType === 'Internship' || j.title.toLowerCase().includes('trainee')), [active]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <GraduationCap className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Jobs for Freshers</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Freshers welcome. No experience required. Start your career with entry-level roles, internships and trainee programs.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Badge2>Freshers Welcome</Badge2>
          <Badge2>No Experience Required</Badge2>
          <Badge2>Entry Level</Badge2>
          <Badge2>Internship</Badge2>
          <Badge2>Trainee</Badge2>
        </div>
      </div>

      <div className="space-y-12">
        <JobListSection title="No Experience Required" jobs={noExp} />
        <JobListSection title="Entry-Level Jobs" jobs={entryLevel} />
        <JobListSection title="Trainee & Internship Programs" jobs={trainee} />
        {fresher.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No fresher roles available right now. Check back soon.
          </div>
        )}
      </div>

      <Card className="mt-12 overflow-hidden bg-gradient-to-r from-accent to-primary text-white">
        <CardContent className="flex flex-col items-center justify-between gap-4 p-8 md:flex-row">
          <div>
            <h2 className="text-xl font-bold">Complete your profile for better matches</h2>
            <p className="mt-1 text-white/90">Mark yourself as a fresher and we'll surface relevant roles.</p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/profile">Update Profile <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Badge2({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-accent">
      {children}
    </span>
  );
}
