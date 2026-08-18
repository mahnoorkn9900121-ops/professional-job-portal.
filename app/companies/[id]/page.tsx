'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Building2, MapPin, Globe } from 'lucide-react';
import { useData } from '@/lib/data-context';
import { JobListSection } from '@/components/jobs/job-list-section';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { isExpired } from '@/lib/storage';
import { useMemo } from 'react';

export default function CompanyDetailPage() {
  const params = useParams<{ id: string }>();
  const { companies, jobs } = useData();
  const company = companies.find((c) => c.id === params.id);
  const companyJobs = useMemo(
    () => jobs.filter((j) => j.companyId === params.id && !(j.status === 'Expired' || isExpired(j.deadline))),
    [jobs, params.id]
  );

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Company not found</h1>
        <Button asChild className="mt-6">
          <Link href="/companies">Back to companies</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/companies"><ArrowLeft className="mr-2 h-4 w-4" /> Back to companies</Link>
      </Button>

      <Card className="mb-8">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
              {company.logo}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{company.name}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="secondary" className="font-normal">{company.industry}</Badge>
                <Badge variant="secondary" className="font-normal"><MapPin className="mr-1 h-3 w-3" /> {company.location}</Badge>
                {company.size && <Badge variant="secondary" className="font-normal">{company.size} employees</Badge>}
              </div>
              <p className="mt-4 max-w-2xl text-muted-foreground">{company.description}</p>
              {company.website && (
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <a href={company.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" /> Visit website
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <JobListSection title={`Open Positions (${companyJobs.length})`} jobs={companyJobs} />
    </div>
  );
}
