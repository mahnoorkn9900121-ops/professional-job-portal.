import { Category, JobType, WorkMode } from './types';

export const JOB_TYPES: JobType[] = [
  'Full Time',
  'Part Time',
  'Internship',
  'Remote',
  'Hybrid',
  'On Site',
  'Freelance',
  'Contract',
  'Temporary',
];

export const WORK_MODES: WorkMode[] = ['Remote', 'On Site', 'Hybrid'];

export const LOCATIONS = [
  'Remote',
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Hyderabad',
  'Other',
  'International',
];

export const EDUCATION_LEVELS = [
  'Matriculation',
  'Intermediate',
  'Diploma',
  'Bachelor',
  'Master',
  'MPhil',
  'PhD',
  'Not Required',
];

export const CATEGORIES: Category[] = [
  {
    id: 'technology',
    name: 'Technology',
    subcategories: [
      'Software Developer',
      'Web Developer',
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer',
      'Python Developer',
      'Java Developer',
      'React Developer',
      'AI Engineer',
      'Machine Learning Engineer',
      'Data Analyst',
      'Data Scientist',
      'Cybersecurity',
      'DevOps',
      'IT Support',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    subcategories: [
      'Business Analyst',
      'Business Development',
      'Operations',
      'Project Management',
      'Management',
      'Administration',
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    subcategories: [
      'Digital Marketing',
      'Social Media Manager',
      'SEO',
      'Content Marketing',
      'Brand Management',
      'Graphic Design',
      'Content Creator',
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    subcategories: [
      'Accountant',
      'Finance Officer',
      'Banking',
      'Audit',
      'Tax',
      'Accounts Assistant',
    ],
  },
  {
    id: 'sales',
    name: 'Sales',
    subcategories: [
      'Sales Executive',
      'Sales Representative',
      'Business Development',
      'Customer Acquisition',
    ],
  },
  {
    id: 'customer-service',
    name: 'Customer Service',
    subcategories: ['Customer Support', 'Call Center', 'Chat Support', 'Customer Success'],
  },
  {
    id: 'education',
    name: 'Education',
    subcategories: ['Teacher', 'Online Teacher', 'Tutor', 'Lecturer', 'Teaching Assistant'],
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    subcategories: [
      'Medical Assistant',
      'Receptionist',
      'Healthcare Administration',
      'Pharmacy',
      'Nursing',
    ],
  },
  {
    id: 'creative',
    name: 'Creative',
    subcategories: [
      'Graphic Designer',
      'UI/UX Designer',
      'Video Editor',
      'Photographer',
      'Animator',
      'Content Creator',
    ],
  },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'salary-low', label: 'Salary: Low to High' },
  { value: 'salary-high', label: 'Salary: High to Low' },
  { value: 'relevant', label: 'Most Relevant' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'popularity', label: 'Popularity' },
] as const;

export const APPLICATION_STATUSES = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview',
  'Selected',
  'Rejected',
  'Expired',
];
