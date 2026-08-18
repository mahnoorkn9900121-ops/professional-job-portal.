'use client';

import { useMemo } from 'react';
import { useData } from '@/lib/data-context';
import { CompanyCard } from '@/components/companies/company-card';
import { isExpired } from '@/lib/storage';
import { Building2 } from 'lucide-react';

export default function CompaniesPage() {
  const { companies, jobs } = useData();
  const active = useMemo(() => jobs.filter((j) => !(j.status === 'Expired' || isExpired(j.deadline))), [jobs]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Building2 className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
        <p className="mt-2 text-muted-foreground">Discover employers hiring right now.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {companies.map((c) => (
          <CompanyCard
            key={c.id}
            company={c}
            jobCount={active.filter((j) => j.companyId === c.id).length}
          />
        ))}
      </div>
    </div>
  );
}
