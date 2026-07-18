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
  file?: File;
}

export interface CandidateProfile {
  id?: string;
  candidateName: string;
  entryDate: string;
  dateOfBirth: string;
  highestQualification: string;
  designation: string;
  industry: string;
  indianExperience: string;
  overseasExperience: string;
  totalExperience: string;
  passportNumber: string;
  passportExpiryDate: string;
  contactNumber: string;
  email: string;
  whatsappNumber: string;
  address: string;
  keySkills: string;

  // Documents
  passport: DocumentUpload | null;
  resume: DocumentUpload | null;
  educationCertificate: DocumentUpload | null;
  expertiseCertificates: DocumentUpload | null;

  // Timestamps
  createdAt?: string;

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
