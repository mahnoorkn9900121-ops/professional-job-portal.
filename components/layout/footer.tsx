import Link from 'next/link';
import { Briefcase, Facebook, Twitter, Linkedin, Github, Instagram } from 'lucide-react';

const columns = [
  {
    title: 'Job Seekers',
    links: [
      { label: 'Search Jobs', href: '/jobs' },
      { label: 'Freshers', href: '/freshers' },
      { label: 'Internships', href: '/internships' },
      { label: 'Remote Jobs', href: '/remote' },
      { label: 'Saved Jobs', href: '/saved' },
      { label: 'My Applications', href: '/applications' },
    ],
  },
  {
    title: 'Employers',
    links: [
      { label: 'Post a Job', href: '/post-job' },
      { label: 'Manage Jobs', href: '/admin' },
      { label: 'View Applications', href: '/admin?tab=applications' },
      { label: 'Company Profile', href: '/companies' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Career Advice', href: '/resources' },
      { label: 'Resume Tips', href: '/resources#resume' },
      { label: 'Interview Tips', href: '/resources#interview' },
      { label: 'Help Center', href: '/resources#help' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/#about' },
      { label: 'Contact', href: '/#contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Briefcase className="h-5 w-5" />
              </span>
              <span>
                Career<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Find jobs, internships and career opportunities that match your skills and goals.
            </p>
            <div className="mt-4 flex gap-3">
              {[Facebook, Twitter, Linkedin, Github, Instagram].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-border/60 pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CareerHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
