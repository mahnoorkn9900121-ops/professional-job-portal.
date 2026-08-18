'use client';

import Link from 'next/link';
import {
  FileText,
  MessageSquare,
  TrendingUp,
  GraduationCap,
  Linkedin,
  Wrench,
  Search,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const resources = [
  {
    id: 'resume',
    icon: FileText,
    title: 'Resume Tips',
    desc: 'Craft a resume that gets noticed by recruiters. Learn formatting, keywords and structure.',
    points: ['Keep it to one page', 'Use action verbs', 'Quantify achievements', 'Tailor to each job'],
  },
  {
    id: 'interview',
    icon: MessageSquare,
    title: 'Interview Tips',
    desc: 'Prepare for your next interview with proven strategies and common questions.',
    points: ['Research the company', 'Practice STAR method', 'Prepare questions', 'Dress appropriately'],
  },
  {
    id: 'career',
    icon: TrendingUp,
    title: 'Career Advice',
    desc: 'Navigate your career path with guidance from industry professionals.',
    points: ['Set clear goals', 'Build a network', 'Keep learning', 'Seek mentorship'],
  },
  {
    id: 'freshers-guide',
    icon: GraduationCap,
    title: 'Freshers Guide',
    desc: 'Just starting out? Everything you need to land your first job.',
    points: ['Build projects', 'Create a portfolio', 'Apply widely', 'Consider internships'],
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    title: 'LinkedIn Tips',
    desc: 'Optimize your LinkedIn profile to attract recruiters and opportunities.',
    points: ['Professional photo', 'Compelling headline', 'Detailed experience', 'Engage with content'],
  },
  {
    id: 'skills',
    icon: Wrench,
    title: 'Skill Development',
    desc: 'Identify and build the skills employers are looking for in 2026.',
    points: ['Learn in-demand tools', 'Take online courses', 'Build real projects', 'Get certified'],
  },
  {
    id: 'job-search',
    icon: Search,
    title: 'Job Search Tips',
    desc: 'Search smarter, not harder. Strategies to find the right job faster.',
    points: ['Set job alerts', 'Use keywords', 'Network actively', 'Follow up'],
  },
  {
    id: 'help',
    icon: HelpCircle,
    title: 'Help Center',
    desc: 'Got questions? Find answers to common questions about using CareerHub.',
    points: ['How to apply', 'Profile setup', 'Saving jobs', 'Application status'],
  },
];

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Career Resources</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Tips, guides and advice to help you land your next role and grow your career.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((r) => (
          <Card key={r.id} id={r.id} className="scroll-mt-20 transition-all hover:-translate-y-0.5 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <r.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-semibold">{r.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
              <ul className="mt-4 space-y-1.5">
                {r.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {p}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-10 overflow-hidden bg-gradient-to-r from-primary to-accent text-white">
        <CardContent className="flex flex-col items-center justify-between gap-4 p-8 md:flex-row">
          <div>
            <h2 className="text-xl font-bold">Ready to put these tips into action?</h2>
            <p className="mt-1 text-white/90">Browse thousands of jobs and apply today.</p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/jobs">Browse Jobs <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
