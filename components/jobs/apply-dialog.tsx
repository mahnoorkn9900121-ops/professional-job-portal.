'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Application, Job } from '@/lib/types';
import { EDUCATION_LEVELS } from '@/lib/constants';
import { useData } from '@/lib/data-context';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Upload, FileText } from 'lucide-react';
import { formatDate } from '@/lib/storage';

interface ApplyDialogProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
}

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  whatsapp: '',
  city: '',
  address: '',
  education: '',
  degree: '',
  university: '',
  graduationYear: '',
  experience: '',
  skills: '',
  coverLetter: '',
  resumeName: '',
  resumeData: '',
};

export function ApplyDialog({ job, open, onOpenChange, disabled }: ApplyDialogProps) {
  const { addApplication, profile } = useData();
  const { toast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Application | null>(null);

  const prefill = () => {
    setForm({
      ...emptyForm,
      fullName: profile.name,
      email: profile.email,
      phone: profile.phone,
      city: profile.city,
      education: profile.education,
      skills: profile.skills,
      experience: profile.experience,
      resumeName: profile.resumeName ?? '',
      resumeData: profile.resumeData ?? '',
    });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrors((p) => ({ ...p, resume: 'File too large (max 2MB)' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((p) => ({ ...p, resumeName: file.name, resumeData: String(reader.result ?? '') }));
      setErrors((p) => ({ ...p, resume: '' }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^[0-9+\-\s()]{7,16}$/.test(form.phone)) e.phone = 'Invalid phone';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.education) e.education = 'Education is required';
    if (!form.coverLetter.trim()) e.coverLetter = 'Cover letter is required';
    if (!form.resumeName) e.resume = 'Resume is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!job) return;
    if (!validate()) return;
    const app = addApplication({
      jobId: job.id,
      ...form,
    });
    setSubmitted(app);
    toast({
      title: 'Application submitted',
      description: `Your application for ${job.title} was submitted.`,
    });
  };

  const handleClose = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      setTimeout(() => {
        setSubmitted(null);
        setForm(emptyForm);
        setErrors({});
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        {submitted ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
              <CheckCircle2 className="h-9 w-9 text-success" />
            </div>
            <h2 className="mt-4 text-xl font-bold">Application Submitted Successfully</h2>
            <p className="mt-2 text-muted-foreground">
              Your application has been received and is under review.
            </p>
            <div className="mx-auto mt-6 max-w-sm space-y-2 rounded-lg border border-border bg-muted/30 p-4 text-left text-sm">
              <Row label="Job Title" value={job?.title ?? ''} />
              <Row label="Company" value={job?.companyId ?? ''} />
              <Row label="Application Date" value={formatDate(submitted.appliedDate)} />
              <Row label="Application ID" value={submitted.id} />
              <Row label="Status" value={submitted.status} />
            </div>
            <Button className="mt-6" onClick={() => handleClose(false)}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Apply for {job?.title}</DialogTitle>
              <DialogDescription>
                Fill out the form below to submit your application.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
              <span className="text-muted-foreground">Want to save time?</span>
              <Button variant="outline" size="sm" onClick={prefill}>
                Autofill from profile
              </Button>
            </div>
            <div className="grid gap-4 py-2 md:grid-cols-2">
              <Field label="Full Name" error={errors.fullName} required>
                <Input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </Field>
              <Field label="Email" error={errors.email} required>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </Field>
              <Field label="Phone Number" error={errors.phone} required>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </Field>
              <Field label="WhatsApp Number">
                <Input
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                />
              </Field>
              <Field label="City" error={errors.city} required>
                <Input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </Field>
              <Field label="Address">
                <Input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </Field>
              <Field label="Education" error={errors.education} required>
                <Select
                  value={form.education}
                  onValueChange={(v) => setForm({ ...form, education: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select education" />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATION_LEVELS.map((e) => (
                      <SelectItem key={e} value={e}>
                        {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Degree">
                <Input
                  value={form.degree}
                  onChange={(e) => setForm({ ...form, degree: e.target.value })}
                />
              </Field>
              <Field label="University / Institute">
                <Input
                  value={form.university}
                  onChange={(e) => setForm({ ...form, university: e.target.value })}
                />
              </Field>
              <Field label="Graduation Year">
                <Input
                  value={form.graduationYear}
                  onChange={(e) => setForm({ ...form, graduationYear: e.target.value })}
                />
              </Field>
              <Field label="Experience">
                <Input
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  placeholder="e.g. 2 years"
                />
              </Field>
              <Field label="Skills">
                <Input
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="Comma separated"
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Cover Letter" error={errors.coverLetter} required>
                  <Textarea
                    rows={4}
                    value={form.coverLetter}
                    onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                  />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Resume / CV" error={errors.resume} required>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border p-4 transition-colors hover:border-primary">
                    {form.resumeName ? (
                      <>
                        <FileText className="h-6 w-6 text-primary" />
                        <span className="text-sm font-medium">{form.resumeName}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Click to upload (PDF/DOC, max 2MB)
                        </span>
                      </>
                    )}
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFile} />
                  </label>
                </Field>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleClose(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={disabled}>
                Submit Application
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
