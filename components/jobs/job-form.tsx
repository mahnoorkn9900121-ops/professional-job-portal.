'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CATEGORIES, EDUCATION_LEVELS, JOB_TYPES, LOCATIONS, WORK_MODES } from '@/lib/constants';
import { Job, WorkMode, JobType } from '@/lib/types';
import { useData } from '@/lib/data-context';
import { useToast } from '@/hooks/use-toast';

interface JobFormProps {
  initial?: Partial<Job>;
  onSubmit?: (job: Job) => void;
  submitLabel?: string;
}

const empty = {
  title: '',
  companyId: '',
  category: 'technology',
  subcategory: '',
  location: 'Karachi',
  jobType: 'Full Time' as JobType,
  workMode: 'On Site' as WorkMode,
  salaryMin: 50000,
  salaryMax: 100000,
  currency: 'PKR',
  experienceYears: 0,
  education: 'Bachelor',
  skills: '',
  description: '',
  responsibilities: '',
  requirements: '',
  benefits: '',
  deadline: '',
  featured: false,
};

export function JobForm({ initial, onSubmit, submitLabel = 'Publish Job' }: JobFormProps) {
  const { companies, addJob, updateJob, addCompany } = useData();
  const { toast } = useToast();
  const [form, setForm] = useState({ ...empty, ...initial } as typeof empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newCompany, setNewCompany] = useState('');

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const cat = CATEGORIES.find((c) => c.id === form.category);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Required';
    if (!form.companyId && !newCompany.trim()) e.company = 'Select or add a company';
    if (!form.deadline) e.deadline = 'Required';
    if (form.salaryMax < form.salaryMin) e.salaryMax = 'Max must be >= min';
    if (!form.description.trim()) e.description = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    let companyId = form.companyId;
    if (!companyId && newCompany.trim()) {
      const co = addCompany({
        name: newCompany.trim(),
        logo: newCompany.trim().slice(0, 2).toUpperCase(),
        industry: 'General',
        location: form.location,
        description: '',
      });
      companyId = co.id;
    }
    const skills = form.skills.split(',').map((s) => s.trim()).filter(Boolean);
    const payload = {
      ...form,
      companyId: companyId!,
      skills,
      deadline: new Date(form.deadline).toISOString(),
      experienceYears: Number(form.experienceYears),
      salaryMin: Number(form.salaryMin),
      salaryMax: Number(form.salaryMax),
    };
    let saved: Job;
    if (initial?.id) {
      updateJob(initial.id, payload);
      saved = { ...(initial as Job), ...payload } as Job;
      toast({ title: 'Job updated', description: `${saved.title} has been updated.` });
    } else {
      saved = addJob(payload);
      toast({ title: 'Job published', description: `${saved.title} is now live.` });
    }
    onSubmit?.(saved);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Job Title" error={errors.title} required>
          <Input value={form.title} onChange={(e) => set('title', e.target.value)} />
        </Field>
        <Field label="Company" error={errors.company} required>
          {companies.length > 0 && (
            <Select value={form.companyId} onValueChange={(v) => set('companyId', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Input
            className="mt-2"
            placeholder="...or add a new company"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
          />
        </Field>
        <Field label="Category">
          <Select value={form.category} onValueChange={(v) => set('category', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Subcategory">
          <Select value={form.subcategory} onValueChange={(v) => set('subcategory', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {(cat?.subcategories ?? []).map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Location">
          <Select value={form.location} onValueChange={(v) => set('location', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Job Type">
          <Select value={form.jobType} onValueChange={(v) => set('jobType', v as JobType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {JOB_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Work Mode">
          <Select value={form.workMode} onValueChange={(v) => set('workMode', v as WorkMode)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WORK_MODES.map((w) => (
                <SelectItem key={w} value={w}>
                  {w}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Experience (years)">
          <Input
            type="number"
            min={0}
            value={form.experienceYears}
            onChange={(e) => set('experienceYears', Number(e.target.value))}
          />
        </Field>
        <Field label="Min Salary">
          <Input
            type="number"
            value={form.salaryMin}
            onChange={(e) => set('salaryMin', Number(e.target.value))}
          />
        </Field>
        <Field label="Max Salary" error={errors.salaryMax}>
          <Input
            type="number"
            value={form.salaryMax}
            onChange={(e) => set('salaryMax', Number(e.target.value))}
          />
        </Field>
        <Field label="Education">
          <Select value={form.education} onValueChange={(v) => set('education', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EDUCATION_LEVELS.map((ed) => (
                <SelectItem key={ed} value={ed}>
                  {ed}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Application Deadline" error={errors.deadline} required>
          <Input
            type="date"
            value={form.deadline ? form.deadline.slice(0, 10) : ''}
            onChange={(e) => set('deadline', e.target.value ? new Date(e.target.value).toISOString() : '')}
          />
        </Field>
      </div>

      <Field label="Skills (comma separated)">
        <Input value={form.skills} onChange={(e) => set('skills', e.target.value)} placeholder="React, TypeScript, Node.js" />
      </Field>

      <Field label="Job Description" error={errors.description} required>
        <Textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} />
      </Field>
      <Field label="Responsibilities">
        <Textarea rows={3} value={form.responsibilities} onChange={(e) => set('responsibilities', e.target.value)} />
      </Field>
      <Field label="Requirements">
        <Textarea rows={3} value={form.requirements} onChange={(e) => set('requirements', e.target.value)} />
      </Field>
      <Field label="Benefits">
        <Textarea rows={2} value={form.benefits} onChange={(e) => set('benefits', e.target.value)} />
      </Field>

      <div className="flex items-center gap-3">
        <Switch checked={form.featured} onCheckedChange={(v) => set('featured', v)} id="featured" />
        <Label htmlFor="featured">Mark as Featured job</Label>
      </div>

      <Button onClick={handleSubmit} size="lg">
        {submitLabel}
      </Button>
    </div>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-1.5 block">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
