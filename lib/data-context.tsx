'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Application, Company, Job, UserProfile } from './types';
import { SEED_COMPANIES, SEED_JOBS } from './seed-data';
import { getItem, setItem, generateId } from './storage';

const JOBS_KEY = 'jp_jobs';
const COMPANIES_KEY = 'jp_companies';
const APPS_KEY = 'jp_applications';
const SAVED_KEY = 'jp_saved_jobs';
const PROFILE_KEY = 'jp_profile';
const SEED_KEY = 'jp_seeded_v1';

interface DataContextValue {
  jobs: Job[];
  companies: Company[];
  applications: Application[];
  savedJobIds: string[];
  profile: UserProfile;
  hydrated: boolean;

  addJob: (job: Omit<Job, 'id' | 'postedDate' | 'applicantsCount' | 'status'> & Partial<Job>) => Job;
  updateJob: (id: string, patch: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  toggleFeatured: (id: string) => void;
  setJobStatus: (id: string, status: Job['status']) => void;

  addCompany: (company: Omit<Company, 'id'>) => Company;
  updateCompany: (id: string, patch: Partial<Company>) => void;

  addApplication: (app: Omit<Application, 'id' | 'appliedDate' | 'status'>) => Application;
  updateApplicationStatus: (id: string, status: Application['status']) => void;
  deleteApplication: (id: string) => void;

  toggleSaved: (jobId: string) => void;
  isSaved: (jobId: string) => boolean;

  updateProfile: (patch: Partial<UserProfile>) => void;

  getJob: (id: string) => Job | undefined;
  getCompany: (id: string) => Company | undefined;
  getApplicationsForJob: (jobId: string) => Application[];
}

const defaultProfile: UserProfile = {
  name: '',
  email: '',
  phone: '',
  city: '',
  bio: '',
  education: '',
  skills: '',
  experience: '',
  isFresher: false,
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!getItem<boolean>(SEED_KEY, false)) {
      setItem(JOBS_KEY, SEED_JOBS);
      setItem(COMPANIES_KEY, SEED_COMPANIES);
      setItem(SAVED_KEY, []);
      setItem(APPS_KEY, []);
      setItem(PROFILE_KEY, defaultProfile);
      setItem(SEED_KEY, true);
    }
    setJobs(getItem<Job[]>(JOBS_KEY, SEED_JOBS));
    setCompanies(getItem<Company[]>(COMPANIES_KEY, SEED_COMPANIES));
    setApplications(getItem<Application[]>(APPS_KEY, []));
    setSavedJobIds(getItem<string[]>(SAVED_KEY, []));
    setProfile(getItem<UserProfile>(PROFILE_KEY, defaultProfile));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) setItem(JOBS_KEY, jobs);
  }, [jobs, hydrated]);
  useEffect(() => {
    if (hydrated) setItem(COMPANIES_KEY, companies);
  }, [companies, hydrated]);
  useEffect(() => {
    if (hydrated) setItem(APPS_KEY, applications);
  }, [applications, hydrated]);
  useEffect(() => {
    if (hydrated) setItem(SAVED_KEY, savedJobIds);
  }, [savedJobIds, hydrated]);
  useEffect(() => {
    if (hydrated) setItem(PROFILE_KEY, profile);
  }, [profile, hydrated]);

  const addJob = useCallback<DataContextValue['addJob']>((input) => {
    const newJob: Job = {
      id: generateId('job'),
      postedDate: new Date().toISOString(),
      applicantsCount: 0,
      status: 'Active',
      ...input,
    } as Job;
    setJobs((prev) => [newJob, ...prev]);
    return newJob;
  }, []);

  const updateJob = useCallback((id: string, patch: Partial<Job>) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)));
  }, []);

  const deleteJob = useCallback((id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setApplications((prev) => prev.filter((a) => a.jobId !== id));
  }, []);

  const toggleFeatured = useCallback((id: string) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, featured: !j.featured } : j)));
  }, []);

  const setJobStatus = useCallback((id: string, status: Job['status']) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
  }, []);

  const addCompany = useCallback<DataContextValue['addCompany']>((input) => {
    const newCompany: Company = { id: generateId('co'), ...input };
    setCompanies((prev) => [...prev, newCompany]);
    return newCompany;
  }, []);

  const updateCompany = useCallback((id: string, patch: Partial<Company>) => {
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const addApplication = useCallback<DataContextValue['addApplication']>((input) => {
    const newApp: Application = {
      id: generateId('app'),
      appliedDate: new Date().toISOString(),
      status: 'Applied',
      ...input,
    };
    setApplications((prev) => [newApp, ...prev]);
    setJobs((prev) =>
      prev.map((j) =>
        j.id === input.jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j
      )
    );
    return newApp;
  }, []);

  const updateApplicationStatus = useCallback(
    (id: string, status: Application['status']) => {
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    },
    []
  );

  const deleteApplication = useCallback((id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toggleSaved = useCallback((jobId: string) => {
    setSavedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  }, []);

  const isSaved = useCallback((jobId: string) => savedJobIds.includes(jobId), [savedJobIds]);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const getJob = useCallback((id: string) => jobs.find((j) => j.id === id), [jobs]);
  const getCompany = useCallback((id: string) => companies.find((c) => c.id === id), [companies]);
  const getApplicationsForJob = useCallback(
    (jobId: string) => applications.filter((a) => a.jobId === jobId),
    [applications]
  );

  const value = useMemo<DataContextValue>(
    () => ({
      jobs,
      companies,
      applications,
      savedJobIds,
      profile,
      hydrated,
      addJob,
      updateJob,
      deleteJob,
      toggleFeatured,
      setJobStatus,
      addCompany,
      updateCompany,
      addApplication,
      updateApplicationStatus,
      deleteApplication,
      toggleSaved,
      isSaved,
      updateProfile,
      getJob,
      getCompany,
      getApplicationsForJob,
    }),
    [
      jobs,
      companies,
      applications,
      savedJobIds,
      profile,
      hydrated,
      addJob,
      updateJob,
      deleteJob,
      toggleFeatured,
      setJobStatus,
      addCompany,
      updateCompany,
      addApplication,
      updateApplicationStatus,
      deleteApplication,
      toggleSaved,
      isSaved,
      updateProfile,
      getJob,
      getCompany,
      getApplicationsForJob,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
