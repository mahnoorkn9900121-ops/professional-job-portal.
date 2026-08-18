'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Building2,
  Users,
  TrendingUp,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Laptop,
  Clock,
} from 'lucide-react';
import { SearchBar } from '@/components/jobs/search-bar';
import { QuickFilters } from '@/components/jobs/quick-filters';
import { JobListSection } from '@/components/jobs/job-list-section';
import { CompanyCard } from '@/components/companies/company-card';
import { useData } from '@/lib/data-context';
import { isExpired } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CATEGORIES } from '@/lib/constants';

export default function HomePage() {
  const { jobs, companies } = useData();

  const active = useMemo(() => jobs.filter((j) => !(j.status === 'Expired' || isExpired(j.deadline))), [jobs]);
  const featured = useMemo(() => active.filter((j) => j.featured), [active]);
  const latest = useMemo(
    () => [...active].sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()),
    [active]
  );
  const fresher = useMemo(
    () => active.filter((j) => j.experienceYears === 0 || j.jobType === 'Internship'),
    [active]
  );
  const internships = useMemo(() => active.filter((j) => j.jobType === 'Internship'), [active]);
  const remote = useMemo(
    () => active.filter((j) => j.workMode === 'Remote' || j.jobType === 'Remote'),
    [active]
  );

  const stats = [
    { label: 'Active Jobs', value: active.length, icon: Briefcase },
    { label: 'Companies', value: companies.length, icon: Building2 },
    { label: 'Fresher Roles', value: fresher.length, icon: GraduationCap },
    { label: 'Remote Jobs', value: remote.length, icon: Laptop },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-[0.04]" />
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-sm font-medium backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              Your career starts here
            </div>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight md:text-6xl">
              Find Your Next Opportunity
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-balance text-lg text-muted-foreground">
              Discover jobs, internships and career opportunities that match your skills and goals.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <SearchBar />
            <div className="mt-5">
              <QuickFilters />
            </div>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/jobs">
                <Briefcase className="mr-2 h-5 w-5" /> Search Jobs
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/jobs">
                Browse Jobs <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border/60 bg-muted/20">
        <div className="container mx-auto grid grid-cols-2 gap-4 px-4 py-8 md:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="border-border/60">
              <CardContent className="flex items-center gap-3 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="container mx-auto space-y-16 px-4 py-14">
        {/* Featured */}
        {featured.length > 0 && (
          <JobListSection
            title="Featured Jobs"
            viewAllHref="/jobs"
            viewAllLabel="View All Jobs"
            jobs={featured}
            limit={6}
          />
        )}

        {/* Latest */}
        <JobListSection
          title="Latest Jobs"
          viewAllHref="/jobs"
          viewAllLabel="View All Jobs"
          jobs={latest}
          limit={6}
        />

        {/* Categories */}
        <section>
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Browse by Category</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const count = active.filter((j) => j.category === cat.id).length;
              return (
                <Link key={cat.id} href={`/jobs?category=${cat.id}`}>
                  <Card className="group h-full transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    <CardContent className="flex items-center justify-between p-5">
                      <div>
                        <h3 className="font-semibold group-hover:text-primary">{cat.name}</h3>
                        <p className="text-sm text-muted-foreground">{count} open roles</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Fresher + Internship split */}
        <div className="grid gap-8 lg:grid-cols-2">
          <JobListSection
            title="Jobs for Freshers"
            viewAllHref="/freshers"
            viewAllLabel="Explore Fresher Jobs"
            jobs={fresher}
            limit={3}
          />
          <JobListSection
            title="Internships"
            viewAllHref="/internships"
            viewAllLabel="Explore Internships"
            jobs={internships}
            limit={3}
          />
        </div>

        {/* Remote */}
        <JobListSection
          title="Remote Opportunities"
          viewAllHref="/remote"
          viewAllLabel="View All Remote"
          jobs={remote}
          limit={3}
        />

        {/* Companies */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Top Companies</h2>
            <Button asChild variant="ghost" className="text-primary">
              <Link href="/companies">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {companies.slice(0, 8).map((c) => (
              <CompanyCard
                key={c.id}
                company={c}
                jobCount={active.filter((j) => j.companyId === c.id).length}
              />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="about" className="overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-accent p-8 text-white md:p-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Are you hiring?</h2>
              <p className="mt-2 max-w-lg text-white/90">
                Post a job in minutes and reach thousands of qualified candidates across the country.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary">
              <Link href="/post-job">
                Post a Job <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
