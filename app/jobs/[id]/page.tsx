'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import {
  ArrowLeft,
  Share2,
  Heart,
  Building2,
  MapPin,
  Banknote,
  Briefcase,
  Clock,
  Calendar,
  Users,
  GraduationCap,
  CheckCircle2,
  ListChecks,
  Target,
  Gift,
  Star,
} from 'lucide-react';
import { useData } from '@/lib/data-context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ApplyDialog } from '@/components/jobs/apply-dialog';
import { daysLeft, formatSalary, formatDate, isExpired, timeAgo } from '@/lib/storage';
import { cn } from '@/lib/utils';

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { jobs, companies, getJob, getCompany, toggleSaved, isSaved } = useData();
  const { toast } = useToast();
  const [applyOpen, setApplyOpen] = useState(false);

  const job = getJob(id);
  const company = job ? getCompany(job.companyId) : undefined;
  const related = useMemo(
    () =>
      job
        ? jobs
            .filter((j) => j.id !== job.id && j.category === job.category && !isExpired(j.deadline))
            .slice(0, 3)
        : [],
    [jobs, job]
  );

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Job not found</h1>
        <p className="mt-2 text-muted-foreground">This job may have been removed.</p>
        <Button asChild className="mt-6">
          <Link href="/jobs">Browse all jobs</Link>
        </Button>
      </div>
    );
  }

  const expired = job.status === 'Expired' || isExpired(job.deadline);
  const left = daysLeft(job.deadline);
  const saved = isSaved(job.id);

  const handleSave = () => {
    toggleSaved(job.id);
    toast({
      title: saved ? 'Job removed' : 'Job saved',
      description: saved ? 'Removed from saved jobs.' : 'Added to saved jobs.',
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: job.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: 'Link copied', description: 'Job link copied to clipboard.' });
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/jobs">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to jobs
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Header */}
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
                    {company?.logo ?? <Building2 className="h-8 w-8" />}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{job.title}</h1>
                    <Link href={`/companies/${company?.id ?? ''}`} className="text-lg text-muted-foreground hover:text-primary">
                      {company?.name ?? 'Company'}
                    </Link>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="font-normal">
                        <MapPin className="mr-1 h-3 w-3" /> {job.location}
                      </Badge>
                      <Badge variant="secondary" className="font-normal">{job.jobType}</Badge>
                      <Badge variant="secondary" className="font-normal">{job.workMode}</Badge>
                      {job.featured && (
                        <Badge className="bg-gradient-to-r from-primary to-accent font-normal">Featured</Badge>
                      )}
                      {job.experienceYears === 0 && (
                        <Badge className="bg-accent/15 text-accent font-normal">Fresher Friendly</Badge>
                      )}
                      {expired && <Badge variant="destructive">Expired</Badge>}
                    </div>
                  </div>
                </div>
                {job.rating && (
                  <div className="flex items-center gap-1 rounded-lg border border-border px-3 py-2">
                    <Star className="h-5 w-5 fill-warning text-warning" />
                    <span className="text-lg font-bold">{job.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 md:grid-cols-4">
                <Info icon={<Banknote className="h-4 w-4 text-success" />} label="Salary" value={formatSalary(job.salaryMin, job.salaryMax, job.currency)} />
                <Info icon={<Briefcase className="h-4 w-4 text-primary" />} label="Experience" value={job.experienceYears === 0 ? 'No experience' : `${job.experienceYears}+ years`} />
                <Info icon={<Users className="h-4 w-4 text-accent" />} label="Applicants" value={`${job.applicantsCount}`} />
                <Info icon={<Calendar className="h-4 w-4 text-warning" />} label="Deadline" value={expired ? 'Closed' : left > 0 ? `${left} days left` : 'Today'} />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Button onClick={() => setApplyOpen(true)} disabled={expired} size="lg">
                  {expired ? 'Application Closed' : 'Apply Now'}
                </Button>
                <Button variant="outline" size="lg" onClick={handleSave}>
                  <Heart className={cn('mr-2 h-4 w-4', saved && 'fill-primary text-primary')} />
                  {saved ? 'Saved' : 'Save Job'}
                </Button>
                <Button variant="outline" size="lg" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {job.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{job.description}</p>
              </CardContent>
            </Card>
          )}

          {job.responsibilities && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ListChecks className="h-5 w-5 text-primary" /> Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{job.responsibilities}</p>
              </CardContent>
            </Card>
          )}

          {job.requirements && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-primary" /> Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{job.requirements}</p>
              </CardContent>
            </Card>
          )}

          {job.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <Badge key={s} variant="secondary" className="font-normal">{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {job.benefits && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Gift className="h-5 w-5 text-success" /> Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{job.benefits}</p>
              </CardContent>
            </Card>
          )}

          {company && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About {company.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                    {company.logo}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed text-muted-foreground">{company.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="font-normal">{company.industry}</Badge>
                      <Badge variant="secondary" className="font-normal"><MapPin className="mr-1 h-3 w-3" /> {company.location}</Badge>
                      {company.size && <Badge variant="secondary" className="font-normal">{company.size} employees</Badge>}
                    </div>
                    <Button asChild variant="outline" size="sm" className="mt-4">
                      <Link href={`/companies/${company.id}`}>View company profile</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Job Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row icon={<Briefcase className="h-4 w-4" />} label="Job Type" value={job.jobType} />
              <Separator />
              <Row icon={<MapPin className="h-4 w-4" />} label="Location" value={job.location} />
              <Separator />
              <Row icon={<Clock className="h-4 w-4" />} label="Work Mode" value={job.workMode} />
              <Separator />
              <Row icon={<Banknote className="h-4 w-4" />} label="Salary" value={formatSalary(job.salaryMin, job.salaryMax, job.currency)} />
              <Separator />
              <Row icon={<GraduationCap className="h-4 w-4" />} label="Education" value={job.education} />
              <Separator />
              <Row icon={<Calendar className="h-4 w-4" />} label="Posted" value={timeAgo(job.postedDate)} />
              <Separator />
              <Row icon={<Calendar className="h-4 w-4" />} label="Deadline" value={formatDate(job.deadline)} />
            </CardContent>
          </Card>

          {related.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Related Jobs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {related.map((r) => {
                  const rc = companies.find((c) => c.id === r.companyId);
                  return (
                    <Link key={r.id} href={`/jobs/${r.id}`} className="block rounded-lg border border-border p-3 transition-colors hover:border-primary">
                      <p className="truncate text-sm font-semibold">{r.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{rc?.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{r.location} · {r.jobType}</p>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </aside>
      </div>

      <ApplyDialog job={job} open={applyOpen} onOpenChange={setApplyOpen} disabled={expired} />
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">{icon}{label}</div>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-muted-foreground">{icon}{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
