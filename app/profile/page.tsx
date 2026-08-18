'use client';

import { useState } from 'react';
import { User, Upload, FileText, Trash2, Download, Linkedin, Github, Globe } from 'lucide-react';
import { useData } from '@/lib/data-context';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { UserProfile } from '@/lib/types';

export default function ProfilePage() {
  const { profile, updateProfile } = useData();
  const { toast } = useToast();
  const [form, setForm] = useState<UserProfile>(profile);

  const set = <K extends keyof UserProfile>(k: K, v: UserProfile[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    updateProfile(form);
    toast({ title: 'Profile updated', description: 'Your changes have been saved.' });
  };

  const handleResume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max 2MB.', variant: 'destructive' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = String(reader.result ?? '');
      setForm((p) => ({ ...p, resumeName: file.name, resumeData: data }));
      updateProfile({ resumeName: file.name, resumeData: data });
      toast({ title: 'Resume uploaded', description: file.name });
    };
    reader.readAsDataURL(file);
  };

  const removeResume = () => {
    setForm((p) => ({ ...p, resumeName: undefined, resumeData: undefined }));
    updateProfile({ resumeName: undefined, resumeData: undefined });
    toast({ title: 'Resume removed' });
  };

  const completion = Math.round(
    [
      form.name,
      form.email,
      form.phone,
      form.city,
      form.bio,
      form.education,
      form.skills,
      form.experience,
      form.linkedin,
      form.resumeName,
    ].filter(Boolean).length / 10 * 100
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-1 text-3xl font-bold tracking-tight">My Profile</h1>
      <p className="mb-6 text-muted-foreground">Keep your profile up to date for better matches.</p>

      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <User className="h-8 w-8" />
              </div>
              <div>
                <p className="font-semibold">{form.name || 'Your name'}</p>
                <p className="text-sm text-muted-foreground">{form.email || 'Add your email'}</p>
              </div>
            </div>
            <div className="w-full max-w-xs">
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted-foreground">Profile completion</span>
                <span className="font-semibold">{completion}%</span>
              </div>
              <Progress value={completion} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="Full Name">
              <Input value={form.name} onChange={(e) => set('name', e.target.value)} />
            </Field>
            <Field label="Email">
              <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
            </Field>
            <Field label="Phone">
              <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </Field>
            <Field label="City">
              <Input value={form.city} onChange={(e) => set('city', e.target.value)} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Bio">
                <Textarea rows={3} value={form.bio} onChange={(e) => set('bio', e.target.value)} placeholder="Tell employers about yourself..." />
              </Field>
            </div>
            <div className="flex items-center gap-3 md:col-span-2">
              <Switch
                checked={form.isFresher}
                onCheckedChange={(v) => set('isFresher', v)}
                id="fresher"
              />
              <Label htmlFor="fresher">I am a Fresher (show me entry-level opportunities)</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Education & Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Education">
              <Input value={form.education} onChange={(e) => set('education', e.target.value)} placeholder="e.g. Bachelor in Computer Science" />
            </Field>
            <Field label="Skills (comma separated)">
              <Input value={form.skills} onChange={(e) => set('skills', e.target.value)} placeholder="React, Python, SQL" />
            </Field>
            <Field label="Experience">
              <Input value={form.experience} onChange={(e) => set('experience', e.target.value)} placeholder="e.g. 2 years as Frontend Developer" />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Online Presence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="LinkedIn URL">
              <div className="relative">
                <Linkedin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" value={form.linkedin ?? ''} onChange={(e) => set('linkedin', e.target.value)} placeholder="linkedin.com/in/..." />
              </div>
            </Field>
            <Field label="Portfolio URL">
              <div className="relative">
                <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" value={form.portfolio ?? ''} onChange={(e) => set('portfolio', e.target.value)} placeholder="yoursite.com" />
              </div>
            </Field>
            <Field label="GitHub URL">
              <div className="relative">
                <Github className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" value={form.github ?? ''} onChange={(e) => set('github', e.target.value)} placeholder="github.com/..." />
              </div>
            </Field>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Resume / CV</CardTitle>
          </CardHeader>
          <CardContent>
            {form.resumeName ? (
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{form.resumeName}</p>
                    <p className="text-xs text-success">Resume uploaded</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={form.resumeData} download={form.resumeName}>
                      <Download className="mr-1 h-4 w-4" /> Download
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => document.getElementById('resume-upload')?.click()}>
                    Replace
                  </Button>
                  <Button variant="ghost" size="sm" onClick={removeResume} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border p-8 transition-colors hover:border-primary">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="font-medium">Upload Your Resume</span>
                <span className="text-sm text-muted-foreground">PDF or DOC, max 2MB</span>
                <input id="resume-upload" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResume} />
              </label>
            )}
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Separator className="mb-4" />
          <Button onClick={handleSave} size="lg">Save Profile</Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}
