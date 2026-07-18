import { CandidateProfile } from './types';

export const INITIAL_MOCK_PROFILE: CandidateProfile = {
  candidateName: 'Alex Mercer',
  entryDate: '2026-07-18',
  dateOfBirth: '1995-04-12',
  highestQualification: 'Bachelor of Science in Computer Science',
  designation: 'Senior Software Engineer',
  industry: 'IT / Software',
  indianExperience: '2 Years',
  overseasExperience: '3 Years',
  totalExperience: '5 Years',
  passportNumber: 'Z1234567',
  passportExpiryDate: '2030-05-20',
  contactNumber: '+1 (555) 019-2834',
  email: 'alex.mercer@company.com',
  whatsappNumber: '+1 (555) 019-2834',
  address: '742 Evergreen Terrace, Springfield, Oregon',
  keySkills: 'TypeScript, React, Node.js, System Design',

  passport: null,
  resume: null,
  educationCertificate: null,
  expertiseCertificates: null,

  declaredTrue: true
};

export const EMPTY_PROFILE: CandidateProfile = {
  candidateName: '',
  entryDate: new Date().toISOString().split('T')[0],
  dateOfBirth: '',
  highestQualification: '',
  designation: '',
  industry: '',
  indianExperience: '',
  overseasExperience: '',
  totalExperience: '',
  passportNumber: '',
  passportExpiryDate: '',
  contactNumber: '',
  email: '',
  whatsappNumber: '',
  address: '',
  keySkills: '',

  passport: null,
  resume: null,
  educationCertificate: null,
  expertiseCertificates: null,

  declaredTrue: false
};

export const MOCK_CANDIDATES: CandidateProfile[] = [
  {
    ...EMPTY_PROFILE,
    id: 'cand-1',
    createdAt: '16 Jul 2026',
    candidateName: 'sathyaraj',
    dateOfBirth: '1986-07-19',
    contactNumber: '9003628412',
  },
  {
    ...EMPTY_PROFILE,
    id: 'cand-2',
    createdAt: '16 Jul 2026',
    candidateName: 'Deepan',
    dateOfBirth: '1990-09-05',
    contactNumber: '9080482747',
  },
  {
    ...EMPTY_PROFILE,
    id: 'cand-3',
    createdAt: '16 Jul 2026',
    candidateName: 'Vignesh',
    dateOfBirth: '1990-10-01',
    contactNumber: '8778281353',
  },
  {
    ...EMPTY_PROFILE,
    id: 'cand-4',
    createdAt: '16 Jul 2026',
    candidateName: 'Sathik',
    dateOfBirth: '1983-09-15',
    contactNumber: '9585602933',
  },
  {
    ...EMPTY_PROFILE,
    id: 'cand-5',
    createdAt: '16 Jul 2026',
    candidateName: 'ilakiyan',
    dateOfBirth: '1992-07-04',
    contactNumber: '7695912313',
  },
  {
    ...EMPTY_PROFILE,
    id: 'cand-6',
    createdAt: '16 Jul 2026',
    candidateName: 'Mahadir',
    dateOfBirth: '1994-06-01',
    contactNumber: '9790957915',
  },
  {
    ...EMPTY_PROFILE,
    id: 'cand-7',
    createdAt: '15 Jul 2026',
    candidateName: 'Elayaraja',
    dateOfBirth: '1989-05-04',
    contactNumber: '9080752847',
  }
];
