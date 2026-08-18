'use client';

import Link from 'next/link';

const quickFilters = [
  { label: 'Remote Jobs', href: '/jobs?workMode=Remote', color: 'bg-success/15 text-success' },
  { label: 'Freshers', href: '/freshers', color: 'bg-accent/15 text-accent' },
  { label: 'Internships', href: '/internships', color: 'bg-primary/15 text-primary' },
  { label: 'Part Time', href: '/jobs?jobType=Part Time', color: 'bg-warning/15 text-warning' },
  { label: 'Full Time', href: '/jobs?jobType=Full Time', color: 'bg-primary/15 text-primary' },
  { label: 'No Experience', href: '/jobs?fresher=1', color: 'bg-accent/15 text-accent' },
  { label: 'Latest Jobs', href: '/jobs', color: 'bg-primary/15 text-primary' },
];

export function QuickFilters() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {quickFilters.map((f) => (
        <Link
          key={f.label}
          href={f.href}
          className={`rounded-full border border-border px-4 py-1.5 text-sm font-medium transition-all hover:scale-105 ${f.color}`}
        >
          {f.label}
        </Link>
      ))}
    </div>
  );
}
