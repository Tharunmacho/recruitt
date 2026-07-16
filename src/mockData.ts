import { CandidateProfile } from './types';

export const INITIAL_MOCK_PROFILE: CandidateProfile = {
  profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
  firstName: 'Alex',
  lastName: 'Mercer',
  gender: 'Male',
  dateOfBirth: '1995-04-12',
  nationality: 'American',
  email: 'alex.mercer@company.com',
  mobileNumber: '+1 (555) 019-2834',
  alternateNumber: '+1 (555) 019-5678',
  address: '742 Evergreen Terrace',
  city: 'Springfield',
  state: 'Oregon',
  country: 'United States',
  postalCode: '97477',

  currentDesignation: 'Senior Software Engineer',
  currentCompany: 'PixelCraft Tech',
  totalExperience: '6 Years',
  relevantExperience: '5 Years',
  currentCTC: '$120,000 USD',
  expectedCTC: '$145,000 USD',
  noticePeriod: '30 Days',
  immediateJoiner: false,
  preferredLocation: 'Chicago, IL',
  willingToRelocate: true,
  workPreference: 'Hybrid',
  professionalSummary: 'Product-focused full-stack engineer with 6+ years of experience building scalable web applications. Passionate about engineering craftsmanship, responsive design, performance optimization, and robust system architecture. Experienced in leading small teams, mentoring juniors, and collaborating with cross-functional stakeholders.',

  school10th: 'Springfield High School',
  percentage10th: '92.5%',
  school12th: 'Springfield Science Academy',
  percentage12th: '94.0%',
  diploma: '',
  educationList: [
    {
      id: 'edu-1',
      college: 'University of Oregon',
      university: 'State University System',
      degree: 'Bachelor of Science',
      department: 'Computer Science & Engineering',
      cgpa: '3.85 / 4.00',
      graduationYear: '2017'
    }
  ],

  programmingLanguages: 'TypeScript, JavaScript, Go, Python, SQL, HTML/CSS',
  frameworks: 'React, Next.js, Express.js, NestJS, FastAPI',
  libraries: 'Tailwind CSS, Redux Toolkit, Framer Motion, D3.js, Prisma, Drizzle',
  databases: 'PostgreSQL, Redis, MongoDB, SQLite',
  cloudPlatforms: 'Google Cloud Platform (GCP), AWS, Vercel',
  operatingSystems: 'macOS, Linux (Ubuntu/Debian), Windows Subsystem for Linux',
  tools: 'Docker, Git, Webpack, Vite, Postman, Figma',
  versionControl: 'GitHub, GitLab',
  softSkills: 'Team Leadership, Mentoring, Clear Technical Writing, Problem Solving, Agile Methodologies',
  languagesKnown: 'English (Fluent), Spanish (Conversational)',

  projects: [
    {
      id: 'proj-1',
      projectName: 'Nexus Enterprise Analytics Dashboard',
      description: 'A real-time metrics aggregator processing 10M+ events daily with visual charts and customized reporting tools.',
      role: 'Lead Full-Stack Developer',
      technologiesUsed: 'React, Tailwind CSS, Go, PostgreSQL, D3.js',
      duration: '8 Months',
      githubLink: 'https://github.com/company/nexus-analytics',
      liveProjectLink: 'https://nexus-demo.company.com',
      achievements: 'Improved page render speeds by 40% and reduced backend API latency by 150ms using connection pooling.'
    },
    {
      id: 'proj-2',
      projectName: 'SyncFlow Collaborative Workspace',
      description: 'A multi-user real-time document editor featuring concurrent conflict-free replicated data types (CRDTs).',
      role: 'Frontend Architect',
      technologiesUsed: 'TypeScript, Next.js, WebSockets, Redis',
      duration: '5 Months',
      githubLink: 'https://github.com/company/syncflow',
      liveProjectLink: 'https://syncflow.company.com',
      achievements: 'Designed visual state manager and WebSockets link ensuring synchronization within 50ms.'
    }
  ],

  workExperience: [
    {
      id: 'work-1',
      companyName: 'PixelCraft Tech',
      designation: 'Senior Software Engineer',
      employmentType: 'Full-time',
      joiningDate: '2021-06-01',
      leavingDate: 'Present',
      responsibilities: 'Lead development of client dashboards, design server-side API proxy routes, configure build-time esbuild bundlers, and coordinate release pipelines.',
      achievements: 'Decreased customer onboarding churn by 18% via responsive UX redesign. Spearheaded architectural shift to isolated server proxy routes.',
      reasonForLeaving: 'Seeking growth opportunities and looking to transition into internal roles within the core enterprise team.'
    },
    {
      id: 'work-2',
      companyName: 'Vertex Solutions Corp',
      designation: 'Software Engineer II',
      employmentType: 'Full-time',
      joiningDate: '2018-01-15',
      leavingDate: '2021-05-20',
      responsibilities: 'Maintained enterprise portals, crafted reusable visual components, integrated security rules, and handled third-party integrations.',
      achievements: 'Refactored codebases to reduce bundle size by 35%. Implemented robust security policies protecting key candidate assets.',
      reasonForLeaving: 'Felt ready for a senior title and more challenging technical leadership opportunities.'
    }
  ],

  certifications: [
    {
      id: 'cert-1',
      certificateName: 'Google Cloud Certified Professional Cloud Architect',
      organization: 'Google Cloud',
      completionDate: '2024-03-10',
      credentialLink: 'https://credentials.gcp.com/verify/10928374'
    },
    {
      id: 'cert-2',
      certificateName: 'AWS Certified Solutions Architect – Associate',
      organization: 'Amazon Web Services',
      completionDate: '2022-09-18',
      credentialLink: 'https://aws.amazon.com/verification'
    }
  ],

  resume: {
    name: 'Alex_Mercer_CV.pdf',
    size: '1.2 MB',
    uploadedAt: '2026-07-15'
  },
  passportPhoto: {
    name: 'Alex_Mercer_Photo.jpg',
    size: '420 KB',
    uploadedAt: '2026-07-15'
  },
  aadhaarCard: {
    name: 'Aadhaar_Card_Verified.pdf',
    size: '650 KB',
    uploadedAt: '2026-07-15'
  },
  panCard: {
    name: 'PAN_Card_Verified.pdf',
    size: '340 KB',
    uploadedAt: '2026-07-15'
  },
  degreeCertificate: {
    name: 'BS_Computer_Science_Degree.pdf',
    size: '1.8 MB',
    uploadedAt: '2026-07-15'
  },
  experienceCertificate: {
    name: 'PixelCraft_Experience_Letter.pdf',
    size: '800 KB',
    uploadedAt: '2026-07-15'
  },
  offerLetter: null,

  linkedin: 'https://linkedin.com/in/alex-mercer',
  github: 'https://github.com/alexmercer',
  portfolioWebsite: 'https://alexmercer.dev',
  hackerRank: 'https://hackerrank.com/alexmercer',
  leetCode: 'https://leetcode.com/alexmercer',
  codeChef: 'https://codechef.com/users/alexmercer',
  careerObjective: 'To leverage my senior-level engineering experience to drive technical excellence, create highly performant internal architectures, and lead development teams in delivering mission-critical applications.',
  strengths: 'Tenacious debugging capability, micro-frontends engineering, deep database performance analysis, clear mentoring of engineering colleagues, outstanding responsive layout engineering.',
  weaknesses: 'Occasional over-perfectionism in layout typography, high expectations of early-stage code documentation, trying to tackle too many parallel visual iterations before releasing.',
  achievements: 'Awarded Developer of the Year at Vertex Solutions Corp. Published open-source library with 5k+ GitHub stars.',
  hobbies: 'Amateur digital synthesizer design, retro arcade restorations, hiking, competitive chess, playing historical board games.',

  declaredTrue: true
};

export const EMPTY_PROFILE: CandidateProfile = {
  profilePhoto: '',
  firstName: '',
  lastName: '',
  gender: '',
  dateOfBirth: '',
  nationality: '',
  email: '',
  mobileNumber: '',
  alternateNumber: '',
  address: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',

  currentDesignation: '',
  currentCompany: '',
  totalExperience: '',
  relevantExperience: '',
  currentCTC: '',
  expectedCTC: '',
  noticePeriod: '',
  immediateJoiner: false,
  preferredLocation: '',
  willingToRelocate: false,
  workPreference: 'Hybrid',
  professionalSummary: '',

  school10th: '',
  percentage10th: '',
  school12th: '',
  percentage12th: '',
  diploma: '',
  educationList: [],

  programmingLanguages: '',
  frameworks: '',
  libraries: '',
  databases: '',
  cloudPlatforms: '',
  operatingSystems: '',
  tools: '',
  versionControl: '',
  softSkills: '',
  languagesKnown: '',

  projects: [],
  workExperience: [],
  certifications: [],

  resume: null,
  passportPhoto: null,
  aadhaarCard: null,
  panCard: null,
  degreeCertificate: null,
  experienceCertificate: null,
  offerLetter: null,

  linkedin: '',
  github: '',
  portfolioWebsite: '',
  hackerRank: '',
  leetCode: '',
  codeChef: '',
  careerObjective: '',
  strengths: '',
  weaknesses: '',
  achievements: '',
  hobbies: '',

  declaredTrue: false
};
