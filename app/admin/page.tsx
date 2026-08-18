'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Briefcase,
  Building2,
  FileText,
  Users,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Pencil,
  Trash2,
  StarOff,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { useData } from '@/lib/data-context';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { JobForm } from '@/components/jobs/job-form';
import { APPLICATION_STATUSES } from '@/lib/constants';
import { ApplicationStatus, Job } from '@/lib/types';
import { formatDate, isExpired, daysLeft } from '@/lib/storage';

function AdminContent() {
  const sp = useSearchParams();
  const initialTab = sp.get('tab') === 'applications' ? 'applications' : 'jobs';
  const {
    jobs,
    companies,
    applications,
    deleteJob,
    toggleFeatured,
    setJobStatus,
    updateApplicationStatus,
    deleteApplication,
  } = useData();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Job | null>(null);
  const [showForm, setShowForm] = useState(false);

  const activeJobs = jobs.filter((j) => j.status !== 'Expired' && !isExpired(j.deadline));
  const expiredJobs = jobs.filter((j) => j.status === 'Expired' || isExpired(j.deadline));
  const featuredJobs = jobs.filter((j) => j.featured);
  const pendingApps = applications.filter((a) => a.status === 'Applied');

  const stats = [
    { label: 'Total Jobs', value: jobs.length, icon: Briefcase },
    { label: 'Active Jobs', value: activeJobs.length, icon: CheckCircle },
    { label: 'Expired Jobs', value: expiredJobs.length, icon: XCircle },
    { label: 'Featured', value: featuredJobs.length, icon: Star },
    { label: 'Applications', value: applications.length, icon: FileText },
    { label: 'Pending Apps', value: pendingApps.length, icon: Clock },
    { label: 'Candidates', value: new Set(applications.map((a) => a.email)).size, icon: Users },
    { label: 'Companies', value: companies.length, icon: Building2 },
  ];

  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? 'Unknown';
  const jobTitle = (id: string) => jobs.find((j) => j.id === id)?.title ?? 'Unknown';

  const handleDelete = (id: string) => {
    deleteJob(id);
    toast({ title: 'Job deleted', description: 'The job has been removed.' });
  };

  if (showForm || editing) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <Button variant="ghost" size="sm" className="mb-4" onClick={() => { setShowForm(false); setEditing(null); }}>
          ← Back to dashboard
        </Button>
        <h1 className="mb-6 text-2xl font-bold">{editing ? 'Edit Job' : 'Add New Job'}</h1>
        <Card>
          <CardContent className="p-6">
            <JobForm
              initial={editing ?? undefined}
              onSubmit={() => { setShowForm(false); setEditing(null); }}
              submitLabel={editing ? 'Update Job' : 'Publish Job'}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage jobs, applications and platform activity.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Job
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue={initialTab}>
        <TabsList>
          <TabsTrigger value="jobs">Job Management</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="mt-6">
          <Card>
            <CardContent className="overflow-x-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Apps</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => {
                    const expired = job.status === 'Expired' || isExpired(job.deadline);
                    return (
                      <TableRow key={job.id}>
                        <TableCell>
                          <Link href={`/jobs/${job.id}`} className="font-medium hover:text-primary">
                            {job.title}
                          </Link>
                          {job.featured && (
                            <Badge className="ml-2 bg-accent/15 text-accent text-xs">Featured</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{companyName(job.companyId)}</TableCell>
                        <TableCell>
                          {expired ? (
                            <Badge variant="destructive">Expired</Badge>
                          ) : (
                            <Badge className="bg-success/15 text-success">Active</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(job.deadline)}
                          {!expired && <span className="text-xs text-muted-foreground"> ({daysLeft(job.deadline)}d)</span>}
                        </TableCell>
                        <TableCell className="text-sm">{job.applicantsCount}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                              <Link href={`/jobs/${job.id}`}>
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(job)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleFeatured(job.id)}>
                              {job.featured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                            </Button>
                            {!expired ? (
                              <Button variant="ghost" size="sm" className="h-8" onClick={() => setJobStatus(job.id, 'Expired')}>
                                Expire
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm" className="h-8" onClick={() => setJobStatus(job.id, 'Active')}>
                                Activate
                              </Button>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete this job?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently remove &quot;{job.title}&quot; and all its applications. This cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(job.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <Card>
            <CardContent className="overflow-x-auto p-0">
              {applications.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">No applications yet.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Job</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <p className="font-medium">{app.fullName}</p>
                          <p className="text-xs text-muted-foreground">{app.email}</p>
                        </TableCell>
                        <TableCell className="text-sm">{jobTitle(app.jobId)}</TableCell>
                        <TableCell className="text-sm">{formatDate(app.appliedDate)}</TableCell>
                        <TableCell>
                          <Select
                            value={app.status}
                            onValueChange={(v) => {
                              updateApplicationStatus(app.id, v as ApplicationStatus);
                              toast({ title: 'Status updated', description: `${app.fullName} → ${v}` });
                            }}
                          >
                            <SelectTrigger className="h-8 w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {APPLICATION_STATUSES.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete application?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently remove {app.fullName}&apos;s application.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => { deleteApplication(app.id); toast({ title: 'Application deleted' }); }}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading dashboard...</div>}>
      <AdminContent />
    </Suspense>
  );
}
