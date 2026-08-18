'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Briefcase, Building2, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useData } from '@/lib/data-context';
import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
  initialQuery?: string;
  initialLocation?: string;
}

export function SearchBar({ className, initialQuery = '', initialLocation = '' }: SearchBarProps) {
  const router = useRouter();
  const { jobs, companies } = useData();
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
    setLocation(initialLocation);
  }, [initialQuery, initialLocation]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const titleMatches = jobs
      .filter((j) => j.title.toLowerCase().includes(q))
      .map((j) => j.title)
      .slice(0, 4);
    const companyMatches = companies
      .filter((c) => c.name.toLowerCase().includes(q))
      .map((c) => c.name)
      .slice(0, 3);
    const catMatches = CATEGORIES.filter((c) => c.name.toLowerCase().includes(q))
      .map((c) => c.name)
      .slice(0, 2);
    const skillSet = new Set<string>();
    jobs.forEach((j) => j.skills.forEach((s) => s.toLowerCase().includes(q) && skillSet.add(s)));
    return [...titleMatches, ...companyMatches, ...Array.from(skillSet).slice(0, 3), ...catMatches].slice(
      0,
      7
    );
  }, [query, jobs, companies]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (location.trim()) params.set('location', location.trim());
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm md:flex-row md:items-center md:gap-2 md:p-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Job title, skill or company"
            className="border-0 pl-9 focus-visible:ring-0"
            aria-label="Search jobs"
          />
        </div>
        <div className="relative flex-1 border-t border-border md:border-l md:border-t-0 md:pl-2">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground md:left-3" />
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Location"
            className="border-0 pl-9 focus-visible:ring-0"
            aria-label="Location"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSearch} className="flex-1 md:flex-none">
            <Search className="mr-2 h-4 w-4" /> Search Jobs
          </Button>
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
          <ul className="py-1">
            {suggestions.map((s, i) => (
              <li key={i}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-accent/10"
                  onClick={() => {
                    setQuery(s);
                    setShowSuggestions(false);
                  }}
                >
                  {i < 4 ? (
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  )}
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
