'use client';

import { Job } from '@/lib/types';
import { daysLeft, isExpired, timeAgo } from '@/lib/storage';
import { Building2, MapPin, Banknote, Briefcase, Calendar, Users, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Company } from '@/lib/types';

interface JobDetailHeaderProps {
  job: Job;
  company?: Company;
}

export function JobDetailHeader({ job, company }: JobDetailHeaderProps) {
  const expired = job.status === 'Expired' || isExpired(job.deadline);
  const left = daysLeft(job.deadline);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
            {company?.logo ?? <Building2 className="h-8 w-8" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{job.title}</h1>
            <p className="mt-1 text-lg text-muted-foreground">{company?.name ?? 'Company'}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary" className="font-normal">
                <MapPin className="mr-1 h-3 w-3" /> {job.location}
              </Badge>
              <Badge variant="secondary" className="font-normal">
                {job.jobType}
              </Badge>
              <Badge variant="secondary" className="font-normal">
                {job.workMode}
              </Badge>
              {job.featured && (
                <Badge className="bg-gradient-to-r from-primary to-accent font-normal">
                  Featured
                </Badge>
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
        <InfoItem
          icon={<Banknote className="h-4 w-4 text-success" />}
          label="Salary"
          value={`${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} ${job.currency}`}
        />
        <InfoItem
          icon={<Briefcase className="h-4 w-4 text-primary" />}
          label="Experience"
          value={
            job.experienceYears === 0 ? 'No experience' : `${job.experienceYears}+ years`
          }
        />
        <InfoItem
          icon={<Users className="h-4 w-4 text-accent" />}
          label="Applicants"
          value={`${job.applicantsCount}`}
        />
        <InfoItem
          icon={<Calendar className="h-4 w-4 text-warning" />}
          label="Deadline"
          value={expired ? 'Closed' : left > 0 ? `${left} days left` : 'Today'}
        />
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}


