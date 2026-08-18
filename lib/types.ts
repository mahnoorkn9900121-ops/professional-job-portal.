export type JobType =
  | 'Full Time'
  | 'Part Time'
  | 'Internship'
  | 'Remote'
  | 'Hybrid'
  | 'On Site'
  | 'Freelance'
  | 'Contract'
  | 'Temporary';

export type WorkMode = 'Remote' | 'On Site' | 'Hybrid';

export type JobStatus = 'Active' | 'Expired';

export interface Job {
  id: string;
  title: string;
  companyId: string;
  category: string;
  subcategory?: string;
  location: string;
  jobType: JobType;
  workMode: WorkMode;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  experienceYears: number;
  education: string;
  skills: string[];
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  postedDate: string;
  deadline: string;
  featured: boolean;
  status: JobStatus;
  rating?: number;
  applicantsCount: number;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  website?: string;
  description: string;
  size?: string;
}

export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Rejected'
  | 'Expired';

export interface Application {
  id: string;
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  city: string;
  address?: string;
  education: string;
  degree?: string;
  university?: string;
  graduationYear?: string;
  experience: string;
  skills: string;
  coverLetter: string;
  resumeName?: string;
  resumeData?: string;
  appliedDate: string;
  status: ApplicationStatus;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
  education: string;
  skills: string;
  experience: string;
  linkedin?: string;
  portfolio?: string;
  github?: string;
  isFresher: boolean;
  resumeName?: string;
  resumeData?: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: string[];
}
