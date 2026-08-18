'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Building2,
  ChevronDown,
  Filter,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CATEGORIES, EDUCATION_LEVELS, JOB_TYPES, LOCATIONS, WORK_MODES } from '@/lib/constants';
import { Job } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface JobFilters {
  q: string;
  category: string[];
  subcategory: string[];
  location: string[];
  workMode: string[];
  jobType: string[];
  experienceMax: number;
  education: string[];
  skills: string[];
  fresherOnly: boolean;
  salaryMin: number;
  showExpired: boolean;
}

export const defaultFilters: JobFilters = {
  q: '',
  category: [],
  subcategory: [],
  location: [],
  workMode: [],
  jobType: [],
  experienceMax: 10,
  education: [],
  skills: [],
  fresherOnly: false,
  salaryMin: 0,
  showExpired: false,
};

interface FilterPanelProps {
  filters: JobFilters;
  onChange: (f: JobFilters) => void;
  jobs: Job[];
  className?: string;
}

const allSkills = (jobs: Job[]) => {
  const set = new Set<string>();
  jobs.forEach((j) => j.skills.forEach((s) => set.add(s)));
  return Array.from(set).sort();
};

export function FilterPanel({ filters, onChange, jobs, className }: FilterPanelProps) {
  const skills = useMemo(() => allSkills(jobs), [jobs]);

  const toggleArray = (key: keyof JobFilters, value: string) => {
    const arr = filters[key] as string[];
    onChange({
      ...filters,
      [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    });
  };

  return (
    <div className={cn('rounded-xl border border-border bg-card p-4', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold">
          <Filter className="h-4 w-4" /> Filters
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(defaultFilters)}
          className="h-8 text-xs"
        >
          Clear All
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['category', 'location', 'jobType', 'experience', 'salary']}>
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm">Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {CATEGORIES.map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={filters.category.includes(c.id)}
                    onCheckedChange={() => toggleArray('category', c.id)}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger className="text-sm">Location</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {LOCATIONS.map((l) => (
                <label key={l} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={filters.location.includes(l)}
                    onCheckedChange={() => toggleArray('location', l)}
                  />
                  {l}
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="jobType">
          <AccordionTrigger className="text-sm">Job Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {JOB_TYPES.map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={filters.jobType.includes(t)}
                    onCheckedChange={() => toggleArray('jobType', t)}
                  />
                  {t}
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="workMode">
          <AccordionTrigger className="text-sm">Work Mode</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {WORK_MODES.map((w) => (
                <label key={w} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={filters.workMode.includes(w)}
                    onCheckedChange={() => toggleArray('workMode', w)}
                  />
                  {w}
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience">
          <AccordionTrigger className="text-sm">Experience (max {filters.experienceMax} yrs)</AccordionTrigger>
          <AccordionContent>
            <Slider
              value={[filters.experienceMax]}
              min={0}
              max={10}
              step={1}
              onValueChange={(v) => onChange({ ...filters, experienceMax: v[0] })}
            />
            <label className="mt-3 flex items-center gap-2 text-sm">
              <Checkbox
                checked={filters.fresherOnly}
                onCheckedChange={(v) => onChange({ ...filters, fresherOnly: v === true })}
              />
              Fresher Friendly only
            </label>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="salary">
          <AccordionTrigger className="text-sm">Min Salary: {filters.salaryMin.toLocaleString()}</AccordionTrigger>
          <AccordionContent>
            <Slider
              value={[filters.salaryMin]}
              min={0}
              max={400000}
              step={5000}
              onValueChange={(v) => onChange({ ...filters, salaryMin: v[0] })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="education">
          <AccordionTrigger className="text-sm">Education</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {EDUCATION_LEVELS.map((e) => (
                <label key={e} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={filters.education.includes(e)}
                    onCheckedChange={() => toggleArray('education', e)}
                  />
                  {e}
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills">
          <AccordionTrigger className="text-sm">Skills</AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-48 pr-3">
              <div className="space-y-2">
                {skills.map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={filters.skills.includes(s)}
                      onCheckedChange={() => toggleArray('skills', s)}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="misc">
          <AccordionTrigger className="text-sm">More</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={filters.showExpired}
                  onCheckedChange={(v) => onChange({ ...filters, showExpired: v === true })}
                />
                Show expired jobs
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function useJobFilters(jobs: Job[]) {
  const router = useRouter();
  const sp = useSearchParams();
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);

  useEffect(() => {
    const next: JobFilters = { ...defaultFilters };
    const q = sp.get('q');
    if (q) next.q = q;
    const loc = sp.get('location');
    if (loc) next.location = [loc];
    const cat = sp.get('category');
    if (cat) next.category = [cat];
    const jt = sp.get('jobType');
    if (jt) next.jobType = [jt];
    const wm = sp.get('workMode');
    if (wm) next.workMode = [wm];
    const fresher = sp.get('fresher');
    if (fresher === '1') next.fresherOnly = true;
    const expired = sp.get('showExpired');
    if (expired === '1') next.showExpired = true;
    setFilters(next);
  }, [sp]);

  const setFilter = (f: JobFilters) => {
    setFilters(f);
    const params = new URLSearchParams();
    if (f.q) params.set('q', f.q);
    if (f.location.length === 1) params.set('location', f.location[0]);
    if (f.category.length === 1) params.set('category', f.category[0]);
    if (f.jobType.length === 1) params.set('jobType', f.jobType[0]);
    if (f.workMode.length === 1) params.set('workMode', f.workMode[0]);
    if (f.fresherOnly) params.set('fresher', '1');
    if (f.showExpired) params.set('showExpired', '1');
    router.replace(`/jobs?${params.toString()}`, { scroll: false });
  };

  return { filters, setFilters: setFilter };
}

export function filterJobs(jobs: Job[], f: JobFilters): Job[] {
  return jobs.filter((j) => {
    if (j.status === 'Expired' && !f.showExpired) {
      if (new Date(j.deadline).getTime() > Date.now()) {
        // still active by date
      } else {
        return false;
      }
    }
    if (f.q) {
      const q = f.q.toLowerCase();
      const hit =
        j.title.toLowerCase().includes(q) ||
        j.skills.some((s) => s.toLowerCase().includes(q)) ||
        j.category.toLowerCase().includes(q) ||
        j.subcategory?.toLowerCase().includes(q);
      if (!hit) return false;
    }
    if (f.category.length && !f.category.includes(j.category)) return false;
    if (f.location.length && !f.location.includes(j.location)) return false;
    if (f.workMode.length && !f.workMode.includes(j.workMode)) return false;
    if (f.jobType.length && !f.jobType.includes(j.jobType)) return false;
    if (j.experienceYears > f.experienceMax) return false;
    if (f.salaryMin && j.salaryMax < f.salaryMin) return false;
    if (f.education.length && !f.education.includes(j.education)) return false;
    if (f.skills.length && !f.skills.some((s) => j.skills.includes(s))) return false;
    if (f.fresherOnly && j.experienceYears > 0 && j.jobType !== 'Internship') return false;
    return true;
  });
}
