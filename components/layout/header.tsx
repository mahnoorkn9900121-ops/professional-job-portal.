'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  Menu,
  Search,
  X,
  Heart,
  FileText,
  Building2,
  LayoutDashboard,
  Rocket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/jobs', label: 'Browse Jobs' },
  { href: '/freshers', label: 'Freshers' },
  { href: '/internships', label: 'Internships' },
  { href: '/remote', label: 'Remote' },
  { href: '/companies', label: 'Companies' },
  { href: '/resources', label: 'Resources' },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Briefcase className="h-5 w-5" />
          </span>
          <span className="tracking-tight">
            Career<span className="text-primary">Hub</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-primary',
                isActive(link.href) ? 'text-primary' : 'text-foreground/70'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/saved">
              <Heart className="mr-1 h-4 w-4" /> Saved
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/applications">
              <FileText className="mr-1 h-4 w-4" /> Applications
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/profile">Profile</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/post-job">
              <Rocket className="mr-1 h-4 w-4" /> Post a Job
            </Link>
          </Button>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link href="/jobs" aria-label="Search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">Menu</span>
              </div>
              <nav className="mt-6 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent/10',
                      isActive(link.href) ? 'text-primary' : 'text-foreground/80'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-2 border-t pt-4">
                <Link href="/saved" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Heart className="mr-2 h-4 w-4" /> Saved Jobs
                  </Button>
                </Link>
                <Link href="/applications" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" /> My Applications
                  </Button>
                </Link>
                <Link href="/profile" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Building2 className="mr-2 h-4 w-4" /> Profile
                  </Button>
                </Link>
                <Link href="/post-job" onClick={() => setOpen(false)}>
                  <Button className="mt-2 w-full">
                    <Rocket className="mr-2 h-4 w-4" /> Post a Job
                  </Button>
                </Link>
                <Link href="/admin" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
