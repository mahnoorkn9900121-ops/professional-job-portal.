'use client';

import Link from 'next/link';
import { Building2, MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Company, Job } from '@/lib/types';

interface CompanyCardProps {
  company: Company;
  jobCount: number;
}

export function CompanyCard({ company, jobCount }: CompanyCardProps) {
  return (
    <Link href={`/companies/${company.id}`}>
      <Card className="group h-full transition-all hover:-translate-y-0.5 hover:shadow-lg">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary">
              {company.logo}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold group-hover:text-primary">{company.name}</h3>
              <p className="text-sm text-muted-foreground">{company.industry}</p>
            </div>
          </div>
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{company.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <Badge variant="secondary" className="font-normal">
              <MapPin className="mr-1 h-3 w-3" /> {company.location}
            </Badge>
            <span className="flex items-center gap-1 text-sm font-medium text-primary">
              {jobCount} jobs <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
