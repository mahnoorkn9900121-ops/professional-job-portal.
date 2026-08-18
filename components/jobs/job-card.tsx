'use client';

import Link from 'next/link';
import { Building2, MapPin, Banknote, Clock, Briefcase, Star, Heart, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Company, Job } from '@/lib/types';
import { cn } from '@/lib/utils';
import { daysLeft, formatSalary, isExpired, timeAgo } from '@/lib/storage';
import { useData } from '@/lib/data-context';
import { useToast } from '@/hooks/use-toast';

interface JobCardProps {
  job: Job;
  company?: Company;
  showSaveButton?: boolean;
  className?: string;
}

export function JobCard({ job, company, showSaveButton = true, className }: JobCardProps) {
  const { toggleSaved, isSaved } = useData();
  const { toast } = useToast();
  const expired = job.status === 'Expired' || isExpired(job.deadline);
  const saved = isSaved(job.id);
  const left = daysLeft(job.deadline);
  const isFresher = job.experienceYears === 0 || job.jobType === 'Internship';

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(job.id);
    toast({
      title: saved ? 'Job removed' : 'Job saved',
      description: saved ? 'Removed from your saved jobs.' : 'Added to your saved jobs.',
    });
  };

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg',
        className
      )}
    >
      {job.featured && (
        <div className="absolute right-0 top-0 rounded-bl-lg bg-gradient-to-r from-primary to-accent px-3 py-1 text-xs font-semibold text-white">
          Featured
        </div>
      )}
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Link
            href={`/companies/${company?.id ?? ''}`}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary"
          >
            {company?.logo ?? <Building2 className="h-6 w-6" />}
          </Link>
          <div className="min-w-0 flex-1">
            <Link href={`/jobs/${job.id}`} className="block">
              <h3 className="truncate font-semibold leading-tight group-hover:text-primary">
                {job.title}
              </h3>
            </Link>
            <Link href={`/companies/${company?.id ?? ''}`} className="block">
              <p className="truncate text-sm text-muted-foreground">{company?.name ?? 'Company'}</p>
            </Link>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary" className="font-normal">
            <Briefcase className="mr-1 h-3 w-3" /> {job.jobType}
          </Badge>
          <Badge variant="secondary" className="font-normal">
            <MapPin className="mr-1 h-3 w-3" /> {job.location}
          </Badge>
          {job.workMode === 'Remote' && (
            <Badge className="bg-success/15 text-success border-success/20 font-normal">
              <Zap className="mr-1 h-3 w-3" /> Remote
            </Badge>
          )}
          {isFresher && (
            <Badge className="bg-accent/15 text-accent border-accent/20 font-normal">
              Fresher Friendly
            </Badge>
          )}
          {job.experienceYears === 0 && (
            <Badge className="bg-warning/15 text-warning border-warning/20 font-normal">
              No Experience
            </Badge>
          )}
          {expired && (
            <Badge variant="destructive" className="font-normal">
              Expired
            </Badge>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 text-sm">
          <span className="flex items-center font-medium text-foreground">
            <Banknote className="mr-1 h-4 w-4 text-success" />
            {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
          </span>
          <span className="flex items-center text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            {expired ? 'Closed' : left <= 3 ? `${left}d left` : timeAgo(job.postedDate)}
          </span>
        </div>

        {job.rating && (
          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="font-medium text-foreground">{job.rating.toFixed(1)}</span>
            <span>· {job.applicantsCount} applicants</span>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          <Button asChild size="sm" className="flex-1" disabled={expired}>
            <Link href={`/jobs/${job.id}`}>{expired ? 'View Details' : 'View & Apply'}</Link>
          </Button>
          {showSaveButton && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleSave}
              aria-label={saved ? 'Unsave job' : 'Save job'}
              className={cn(saved && 'border-primary text-primary')}
            >
              <Heart className={cn('h-4 w-4', saved && 'fill-primary')} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
