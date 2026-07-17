export interface EducationEntry {
  id: string;
  college: string;
  university: string;
  degree: string;
  department: string;
  cgpa: string;
  graduationYear: string;
}

export interface ProjectEntry {
  id: string;
  projectName: string;
  description: string;
  role: string;
  technologiesUsed: string;
  duration: string;
  githubLink: string;
  liveProjectLink: string;
  achievements: string;
}

export interface WorkExperienceEntry {
  id: string;
  companyName: string;
  designation: string;
  employmentType: string; // Full-time, Part-time, Contract, Internship
  joiningDate: string;
  leavingDate: string;
  responsibilities: string;
  achievements: string;
  reasonForLeaving: string;
}

export interface CertificationEntry {
  id: string;
  certificateName: string;
  organization: string;
  completionDate: string;
  credentialLink: string;
}

export interface DocumentUpload {
  name: string;
  size: string;
  uploadedAt: string;
  base64?: string;
}

export interface CandidateProfile {
  id?: string;
  // Personal Info
  profilePhoto: string; // Base64 or URL
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  email: string;
  mobileNumber: string;
  alternateNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;

  // Timestamps
  createdAt?: string;
  
  // Professional Info
  currentDesignation: string;
  currentCompany: string;
  totalExperience: string; // e.g., "5 Years"
  relevantExperience: string;
  currentCTC: string;
  expectedCTC: string;
  noticePeriod: string;
  immediateJoiner: boolean;
  preferredLocation: string;
  willingToRelocate: boolean;
  workPreference: string; // "Remote" | "Hybrid" | "Onsite"
  professionalSummary: string;

  // Education (Core static + list)
  school10th: string;
  percentage10th: string;
  school12th: string;
  percentage12th: string;
  diploma: string;
  educationList: EducationEntry[];

  // Technical Skills (Inputs)
  programmingLanguages: string;
  frameworks: string;
  libraries: string;
  databases: string;
  cloudPlatforms: string;
  operatingSystems: string;
  tools: string;
  versionControl: string;
  softSkills: string;
  languagesKnown: string;

  // Multiple items
  projects: ProjectEntry[];
  workExperience: WorkExperienceEntry[];
  certifications: CertificationEntry[];

  // Documents
  resume: DocumentUpload | null;
  passportPhoto: DocumentUpload | null;
  aadhaarCard: DocumentUpload | null;
  panCard: DocumentUpload | null;
  degreeCertificate: DocumentUpload | null;
  experienceCertificate: DocumentUpload | null;
  offerLetter: DocumentUpload | null;

  // Additional Information
  linkedin: string;
  github: string;
  portfolioWebsite: string;
  hackerRank: string;
  leetCode: string;
  codeChef: string;
  careerObjective: string;
  strengths: string;
  weaknesses: string;
  achievements: string;
  hobbies: string;

  // Added Features
  primaryNumber?: string;
  countryLookingFor?: string;
  jobPreference?: string;
  skill?: string;
  passportAvailable?: string;
  whatsappNumber?: string;
  whatsappSameAsPrimary?: boolean;
  familyMemberNumber?: string;
  source?: string;
  jobDurationPreference?: string;
  serviceChargesStatus?: string;
  bestTimeToContact?: string;
  interestLevel?: string;
  nextFollowUpDate?: string;
  assignedToHR?: string;
  telemarketerNotes?: string;
  voiceRecordingLegacy?: DocumentUpload | null;

  // Declarations
  declaredTrue: boolean;
}

export type ApplicationStatus = 'Submitted' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Selected' | 'Rejected';

export interface UserState {
  email: string;
  isLoggedIn: boolean;
  profileStatus: 'Draft' | 'Submitted';
  applicationStatus: ApplicationStatus;
  profileCompletionPercentage: number;
}

export interface SystemLog {
  id?: string;
  candidateId?: string;
  action: string;
  details: string;
  timestamp: string;
  userEmail: string;
  category: 'CREATE' | 'UPDATE' | 'DELETE' | 'SYSTEM';
}
