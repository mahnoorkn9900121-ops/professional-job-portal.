'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Rocket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { JobForm } from '@/components/jobs/job-form';

export default function PostJobPage() {
  const [published, setPublished] = useState(false);

  if (published) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Card className="mx-auto max-w-lg text-center">
          <CardContent className="p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
              <CheckCircle2 className="h-9 w-9 text-success" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">Job Published Successfully</h1>
            <p className="mt-2 text-muted-foreground">
              Your job is now live and visible to candidates across the platform.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button asChild>
                <Link href="/jobs">View in job listings</Link>
              </Button>
              <Button variant="outline" onClick={() => setPublished(false)}>
                Post another job
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Rocket className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Post a Job</h1>
        <p className="mt-2 text-muted-foreground">
          Reach thousands of qualified candidates. Fill in the details below to publish your opening.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <JobForm onSubmit={() => setPublished(true)} submitLabel="Publish Job" />
        </CardContent>
      </Card>
    </div>
  );
}
