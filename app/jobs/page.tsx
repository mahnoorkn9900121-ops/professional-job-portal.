'use client';

import { Suspense, useMemo, useState } from 'react';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { SearchBar } from '@/components/jobs/search-bar';
import { JobCard } from '@/components/jobs/job-card';
import {
  FilterPanel,
  defaultFilters,
  filterJobs,
  useJobFilters,
} from '@/components/jobs/filter-panel';
import { useData } from '@/lib/data-context';
import { isExpired } from '@/lib/storage';
import { SORT_OPTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Job } from '@/lib/types';

function JobsContent() {
  const { jobs, companies, hydrated } = useData();
  const { filters, setFilters } = useJobFilters(jobs);
  const [sort, setSort] = useState<string>('newest');
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = filterJobs(jobs, filters);
    result = sortJobs(result, sort);
    return result;
  }, [jobs, filters, sort]);

  const activeCount = filters !== defaultFilters ? countActive(filters) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Browse Jobs</h1>
        <p className="mt-1 text-muted-foreground">
          {hydrated ? `${filtered.length} opportunities found` : 'Loading jobs...'}
        </p>
      </div>

      <div className="mb-6">
        <SearchBar initialQuery={filters.q} initialLocation={filters.location[0] ?? ''} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <FilterPanel filters={filters} onChange={setFilters} jobs={jobs} />
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between gap-2">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                  {activeCount > 0 && (
                    <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      {activeCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetTitle className="sr-only">Filters</SheetTitle>
                <FilterPanel filters={filters} onChange={setFilters} jobs={jobs} />
              </SheetContent>
            </Sheet>

            <div className="ml-auto flex items-center gap-2">
              <span className="hidden text-sm text-muted-foreground sm:inline">Sort by</span>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center">
              <p className="text-lg font-medium">No jobs match your filters</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or clearing filters.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => setFilters(defaultFilters)}>
                <X className="mr-2 h-4 w-4" /> Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  company={companies.find((c) => c.id === job.companyId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function countActive(f: typeof defaultFilters): number {
  let n = 0;
  if (f.q) n++;
  n += f.category.length + f.location.length + f.workMode.length + f.jobType.length + f.education.length + f.skills.length;
  if (f.fresherOnly) n++;
  if (f.showExpired) n++;
  if (f.experienceMax !== 10) n++;
  if (f.salaryMin !== 0) n++;
  return n;
}

function sortJobs(jobs: Job[], sort: string): Job[] {
  const arr = [...jobs];
  switch (sort) {
    case 'newest':
      return arr.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    case 'oldest':
      return arr.sort((a, b) => new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime());
    case 'salary-low':
      return arr.sort((a, b) => a.salaryMin - b.salaryMin);
    case 'salary-high':
      return arr.sort((a, b) => b.salaryMax - a.salaryMax);
    case 'deadline':
      return arr.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    case 'popularity':
      return arr.sort((a, b) => b.applicantsCount - a.applicantsCount);
    default:
      return arr.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading...</div>}>
      <JobsContent />
    </Suspense>
  );
}
