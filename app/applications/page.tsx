'use client';

import Link from 'next/link';
import { FileText, Calendar, Building2, Clock } from 'lucide-react';
import { useData } from '@/lib/data-context';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate, daysLeft, isExpired } from '@/lib/storage';
import { APPLICATION_STATUSES } from '@/lib/constants';
import { ApplicationStatus } from '@/lib/types';

const statusColors: Record<string, string> = {
  Applied: 'bg-primary/15 text-primary',
  'Under Review': 'bg-warning/15 text-warning',
  Shortlisted: 'bg-accent/15 text-accent',
  Interview: 'bg-primary/15 text-primary',
  Selected: 'bg-success/15 text-success',
  Rejected: 'bg-destructive/15 text-destructive',
  Expired: 'bg-muted text-muted-foreground',
};

export default function ApplicationsPage() {
  const { applications, jobs, companies } = useData();

  if (applications.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">No applications yet</h1>
        <p className="mt-2 text-muted-foreground">Start applying to jobs to track them here.</p>
        <Button asChild className="mt-6">
          <Link href="/jobs">Browse Jobs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-1 text-3xl font-bold tracking-tight">My Applications</h1>
      <p className="mb-6 text-muted-foreground">Track the status of your job applications.</p>

      <div className="space-y-4">
        {applications.map((app) => {
          const job = jobs.find((j) => j.id === app.jobId);
          const company = job ? companies.find((c) => c.id === job.companyId) : undefined;
          const expired = job ? isExpired(job.deadline) : false;
          const left = job ? daysLeft(job.deadline) : 0;
          return (
            <Card key={app.id}>
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                      {company?.logo ?? <Building2 className="h-6 w-6" />}
                    </div>
                    <div>
                      <Link href={job ? `/jobs/${job.id}` : '/jobs'} className="font-semibold hover:text-primary">
                        {job?.title ?? 'Job removed'}
                      </Link>
                      <p className="text-sm text-muted-foreground">{company?.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Applied {formatDate(app.appliedDate)}
                        </span>
                        {job && !expired && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {left}d left to apply
                          </span>
                        )}
                        <span className="text-muted-foreground/70">ID: {app.id.slice(-8)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[app.status] ?? 'bg-muted'}>{app.status}</Badge>
                    <Button asChild variant="outline" size="sm">
                      <Link href={job ? `/jobs/${job.id}` : '/jobs'}>View Job</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
