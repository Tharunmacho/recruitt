import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Cpu, 
  FolderGit, 
  FileText, 
  Award, 
  UploadCloud, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  CheckCircle,
  HelpCircle,
  FileCheck2,
  MapPin,
  Save,
  Eye,
  AlertCircle,
  Globe,
  MessageSquare,
  Clock,
  Mic
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CandidateProfile, 
  EducationEntry, 
  ProjectEntry, 
  WorkExperienceEntry, 
  CertificationEntry,
  DocumentUpload
} from '../types';
import FileUpload from '../components/FileUpload';

interface CandidateFormPageProps {
  profile: CandidateProfile;
  setProfile: React.Dispatch<React.SetStateAction<CandidateProfile>>;
  onSaveDraft: () => void;
  onPreview: () => void;
}

export default function CandidateFormPage({
  profile,
  setProfile,
  onSaveDraft,
  onPreview
}: CandidateFormPageProps) {
  // Section Accordion expanded state
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    personal: true,
    professional: true,
    education: false,
    skills: false,
    projects: false,
    work: false,
    certifications: false,
    documents: false,
    additional: false
  });

  const [notification, setNotification] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const expandAll = () => {
    setExpanded({
      personal: true,
      professional: true,
      education: true,
      skills: true,
      projects: true,
      work: true,
      certifications: true,
      documents: true,
      additional: true
    });
  };

  const collapseAll = () => {
    setExpanded({
      personal: false,
      professional: false,
      education: false,
      skills: false,
      projects: false,
      work: false,
      certifications: false,
      documents: false,
      additional: false
    });
  };

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // State update handlers
  const handleTextChange = (field: keyof CandidateProfile, value: string | boolean) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Dynamic Education Entry Handlers
  const addEducation = () => {
    const newEntry: EducationEntry = {
      id: `edu-${Date.now()}`,
      college: '',
      university: '',
      degree: '',
      department: '',
      cgpa: '',
      graduationYear: ''
    };
    setProfile(prev => ({
      ...prev,
      educationList: [...prev.educationList, newEntry]
    }));
    triggerToast('Added empty degree entry');
  };

  const updateEducation = (id: string, field: keyof EducationEntry, value: string) => {
    setProfile(prev => ({
      ...prev,
      educationList: prev.educationList.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeEducation = (id: string) => {
    setProfile(prev => ({
      ...prev,
      educationList: prev.educationList.filter(item => item.id !== id)
    }));
    triggerToast('Removed degree entry');
  };

  // Dynamic Project Handlers
  const addProject = () => {
    const newEntry: ProjectEntry = {
      id: `proj-${Date.now()}`,
      projectName: '',
      description: '',
      role: '',
      technologiesUsed: '',
      duration: '',
      githubLink: '',
      liveProjectLink: '',
      achievements: ''
    };
    setProfile(prev => ({
      ...prev,
      projects: [...prev.projects, newEntry]
    }));
    triggerToast('Added empty project entry');
  };

  const updateProject = (id: string, field: keyof ProjectEntry, value: string) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeProject = (id: string) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.filter(item => item.id !== id)
    }));
    triggerToast('Removed project entry');
  };

  // Dynamic Work Handlers
  const addWork = () => {
    const newEntry: WorkExperienceEntry = {
      id: `work-${Date.now()}`,
      companyName: '',
      designation: '',
      employmentType: 'Full-time',
      joiningDate: '',
      leavingDate: '',
      responsibilities: '',
      achievements: '',
      reasonForLeaving: ''
    };
    setProfile(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, newEntry]
    }));
    triggerToast('Added empty work entry');
  };

  const updateWork = (id: string, field: keyof WorkExperienceEntry, value: string) => {
    setProfile(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeWork = (id: string) => {
    setProfile(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter(item => item.id !== id)
    }));
    triggerToast('Removed work entry');
  };

  // Dynamic Certification Handlers
  const addCertification = () => {
    const newEntry: CertificationEntry = {
      id: `cert-${Date.now()}`,
      certificateName: '',
      organization: '',
      completionDate: '',
      credentialLink: ''
    };
    setProfile(prev => ({
      ...prev,
      certifications: [...prev.certifications, newEntry]
    }));
    triggerToast('Added empty certification entry');
  };

  const updateCertification = (id: string, field: keyof CertificationEntry, value: string) => {
    setProfile(prev => ({
      ...prev,
      certifications: prev.certifications.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeCertification = (id: string) => {
    setProfile(prev => ({
      ...prev,
      certifications: prev.certifications.filter(item => item.id !== id)
    }));
    triggerToast('Removed certification entry');
  };

  // Document upload handler
  const handleDocUpload = (key: keyof CandidateProfile, file: DocumentUpload) => {
    setProfile(prev => ({
      ...prev,
      [key]: file
    }));
    triggerToast(`Uploaded document: ${file.name}`);
  };

  const handleDocClear = (key: keyof CandidateProfile) => {
    setProfile(prev => ({
      ...prev,
      [key]: null
    }));
    triggerToast(`Removed document`);
  };


  const handleWhatsAppChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 10) {
      handleTextChange('whatsappNumber', val);
    }
  };

  const handlePrimaryNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 10) {
      handleTextChange('primaryNumber', val);
      if (profile.whatsappSameAsPrimary) {
        handleTextChange('whatsappNumber', val);
      }
    }
  };

  const handleFamilyNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 10) {
      handleTextChange('familyMemberNumber', val);
    }
  };

  const toggleSameAsPrimary = (e) => {
    const checked = e.target.checked;
    handleTextChange('whatsappSameAsPrimary', checked);
    if (checked) {
      handleTextChange('whatsappNumber', profile.primaryNumber || '');
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-10 text-left space-y-10" id="candidate-form-container">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-xl flex items-center space-x-2.5 font-semibold text-xs"
          >
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            Complete Evaluation Dossier
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Ensure complete and accurate entries for optimal processing. All draft data is stored locally.
          </p>
        </div>
        
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-10" id="dossier-full-form">
        
        {/* SECTION 1: Personal Information */}
        
        <div className="pb-10 pt-4 border-b border-slate-200 last:border-0">
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-slate-800 mb-1">
              <User className="w-[18px] h-[18px] text-slate-600" />
              <h2 className="text-base font-bold text-slate-800">Personal Information</h2>
            </div>
            <p className="text-[13px] text-slate-500 ml-6">Contact detail registry and home address verification</p>
          </div>
          <div className="px-1">

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* Photo url placeholder */}
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-5 items-center pb-3 border-b border-slate-200">
                    <div className="text-left">
                      <label className="text-xs font-semibold text-slate-700 block tracking-wide uppercase">
                        Profile Photo URL / Base64
                      </label>
                      <p className="text-[10px] text-slate-500 mt-0.5">Loads instant face vector inside dossier.</p>
                    </div>
                    <div className="md:col-span-3 flex items-center space-x-4">
                      {profile.profilePhoto ? (
                        <img 
                          src={profile.profilePhoto} 
                          alt="Avatar draft" 
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                      <input
                        type="text"
                        value={profile.profilePhoto}
                        onChange={(e) => handleTextChange('profilePhoto', e.target.value)}
                        className="flex-1 glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-xs"
                        placeholder="Paste image address URL or leave empty"
                      />
                    </div>
                  </div>

                  {/* Name inputs */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="first-name">First Name</label>
                    <input
                      id="first-name"
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => handleTextChange('firstName', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="Alex"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="last-name">Last Name</label>
                    <input
                      id="last-name"
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => handleTextChange('lastName', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="Mercer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="gender-select">Gender</label>
                    <select
                      id="gender-select"
                      value={profile.gender}
                      onChange={(e) => handleTextChange('gender', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm bg-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="dob">Date of Birth</label>
                    <input
                      id="dob"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => handleTextChange('dateOfBirth', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="nationality">Nationality</label>
                    <input
                      id="nationality"
                      type="text"
                      value={profile.nationality}
                      onChange={(e) => handleTextChange('nationality', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="e.g. American, Indian"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="email-info">Contact Email</label>
                    <input
                      id="email-info"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleTextChange('email', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="alex@example.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="mobile">Mobile Number</label>
                    <input
                      id="mobile"
                      type="text"
                      value={profile.mobileNumber}
                      onChange={(e) => handleTextChange('mobileNumber', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="+1 (555) 012-3456"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="alternate">Alternate Contact</label>
                    <input
                      id="alternate"
                      type="text"
                      value={profile.alternateNumber}
                      onChange={(e) => handleTextChange('alternateNumber', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="Secondary number"
                    />
                  </div>

                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="address-full">Street Address</label>
                    <input
                      id="address-full"
                      type="text"
                      value={profile.address}
                      onChange={(e) => handleTextChange('address', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="123 Corporate Parkway, Suite 500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="city">City</label>
                    <input
                      id="city"
                      type="text"
                      value={profile.city}
                      onChange={(e) => handleTextChange('city', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="San Francisco"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="state">State / Province</label>
                    <input
                      id="state"
                      type="text"
                      value={profile.state}
                      onChange={(e) => handleTextChange('state', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="California"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="country">Country</label>
                    <input
                      id="country"
                      type="text"
                      value={profile.country}
                      onChange={(e) => handleTextChange('country', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="United States"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="postal-code">Postal Code</label>
                    <input
                      id="postal-code"
                      type="text"
                      value={profile.postalCode}
                      onChange={(e) => handleTextChange('postalCode', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="94103"
                    />
                  </div>

                </div>
              </div></div>

        {/* SECTION 2: Professional Information */}
        
        <div className="pb-10 pt-4 border-b border-slate-200 last:border-0">
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-slate-800 mb-1">
              <Briefcase className="w-[18px] h-[18px] text-slate-600" />
              <h2 className="text-base font-bold text-slate-800">Professional Information</h2>
            </div>
            <p className="text-[13px] text-slate-500 ml-6">Current title, experience timeline, CTC numbers, and availability</p>
          </div>
          <div className="px-1">

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="current-designation">Current Designation</label>
                    <input
                      id="current-designation"
                      type="text"
                      value={profile.currentDesignation}
                      onChange={(e) => handleTextChange('currentDesignation', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="current-company">Current Company</label>
                    <input
                      id="current-company"
                      type="text"
                      value={profile.currentCompany}
                      onChange={(e) => handleTextChange('currentCompany', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="Company Name"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="total-experience">Total Experience</label>
                    <input
                      id="total-experience"
                      type="text"
                      value={profile.totalExperience}
                      onChange={(e) => handleTextChange('totalExperience', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="e.g. 5 Years"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="relevant-experience">Relevant Experience</label>
                    <input
                      id="relevant-experience"
                      type="text"
                      value={profile.relevantExperience}
                      onChange={(e) => handleTextChange('relevantExperience', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="e.g. 4 Years"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="current-ctc">Current CTC</label>
                    <input
                      id="current-ctc"
                      type="text"
                      value={profile.currentCTC}
                      onChange={(e) => handleTextChange('currentCTC', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="e.g. $100,000 USD / Annum"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="expected-ctc">Expected CTC</label>
                    <input
                      id="expected-ctc"
                      type="text"
                      value={profile.expectedCTC}
                      onChange={(e) => handleTextChange('expectedCTC', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="e.g. $130,000 USD / Annum"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="notice-period">Notice Period</label>
                    <input
                      id="notice-period"
                      type="text"
                      value={profile.noticePeriod}
                      onChange={(e) => handleTextChange('noticePeriod', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="e.g. 30 Days"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="pref-loc">Preferred Job Location</label>
                    <input
                      id="pref-loc"
                      type="text"
                      value={profile.preferredLocation}
                      onChange={(e) => handleTextChange('preferredLocation', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="e.g. Chicago, Remote"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="work-pref-select">Work Preference</label>
                    <select
                      id="work-pref-select"
                      value={profile.workPreference}
                      onChange={(e) => handleTextChange('workPreference', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm bg-white"
                    >
                      <option value="Hybrid">Hybrid</option>
                      <option value="Remote">Remote</option>
                      <option value="Onsite">Onsite</option>
                    </select>
                  </div>

                  <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 border-y border-slate-200 bg-slate-50/50 px-4 rounded-xl">
                    <label className="flex items-center space-x-3.5 py-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.immediateJoiner}
                        onChange={(e) => handleTextChange('immediateJoiner', e.target.checked)}
                        className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800">Immediate Joiner</p>
                        <p className="text-[10px] text-slate-600">I am available to join within 7 business days.</p>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3.5 py-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.willingToRelocate}
                        onChange={(e) => handleTextChange('willingToRelocate', e.target.checked)}
                        className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800">Willing to Relocate</p>
                        <p className="text-[10px] text-slate-600">I am open to geographic transfers if required.</p>
                      </div>
                    </label>
                  </div>

                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="prof-summary">Professional Summary</label>
                    <textarea
                      id="prof-summary"
                      value={profile.professionalSummary}
                      onChange={(e) => handleTextChange('professionalSummary', e.target.value)}
                      rows={4}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="Outline core technological competencies and leadership highlights..."
                    />
                  </div>

                </div>
              </div></div>

        {/* SECTION 3: Education */}
        
        <div className="pb-10 pt-4 border-b border-slate-200 last:border-0">
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-slate-800 mb-1">
              <GraduationCap className="w-[18px] h-[18px] text-slate-600" />
              <h2 className="text-base font-bold text-slate-800">Education</h2>
            </div>
            <p className="text-[13px] text-slate-500 ml-6">Standard schooling benchmarks and higher university degrees</p>
          </div>
          <div className="px-1">

                <div className="p-6 space-y-6">
                  
                  {/* Static School fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-5 border-b border-slate-200">
                    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3.5 text-left">
                      <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono font-semibold">Secondary Education (10th)</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2 space-y-1.5">
                          <label className="text-[10px] text-slate-600 font-mono font-medium" htmlFor="school10">School Name</label>
                          <input
                            id="school10"
                            type="text"
                            value={profile.school10th}
                            onChange={(e) => handleTextChange('school10th', e.target.value)}
                            className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                            placeholder="High School Name"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-slate-600 font-mono font-medium" htmlFor="pct10">Percentage</label>
                          <input
                            id="pct10"
                            type="text"
                            value={profile.percentage10th}
                            onChange={(e) => handleTextChange('percentage10th', e.target.value)}
                            className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                            placeholder="e.g. 90%"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3.5 text-left">
                      <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono font-semibold">Senior Secondary (12th / Diploma)</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2 space-y-1.5">
                          <label className="text-[10px] text-slate-600 font-mono font-medium" htmlFor="school12">School / Institute</label>
                          <input
                            id="school12"
                            type="text"
                            value={profile.school12th}
                            onChange={(e) => handleTextChange('school12th', e.target.value)}
                            className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                            placeholder="Senior Academy Name"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-slate-600 font-mono font-medium" htmlFor="pct12">Percentage</label>
                          <input
                            id="pct12"
                            type="text"
                            value={profile.percentage12th}
                            onChange={(e) => handleTextChange('percentage12th', e.target.value)}
                            className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                            placeholder="e.g. 88%"
                          />
                        </div>
                        <div className="sm:col-span-3 space-y-1.5">
                          <label className="text-[10px] text-slate-600 font-mono font-medium" htmlFor="diploma-f">Diploma Details (Optional)</label>
                          <input
                            id="diploma-f"
                            type="text"
                            value={profile.diploma}
                            onChange={(e) => handleTextChange('diploma', e.target.value)}
                            className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                            placeholder="e.g. Diploma in Computer Engineering (if applicable)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic University degrees */}
                  <div className="space-y-4 text-left">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono font-semibold">Higher Education / University Degrees</h3>
                      <button
                        type="button"
                        onClick={addEducation}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add University Degree</span>
                      </button>
                    </div>

                    {profile.educationList.length === 0 ? (
                      <div className="p-6 border border-dashed border-slate-200 rounded-xl text-center text-slate-500 text-xs font-mono">
                        No custom university degrees added yet. Click &apos;Add University Degree&apos; to append entries.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {profile.educationList.map((edu, index) => (
                          <div 
                            key={edu.id}
                            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative group transition-all"
                            id={`edu-card-${index}`}
                          >
                            <button
                              type="button"
                              onClick={() => removeEducation(edu.id)}
                              className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                              title="Delete Degree"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pr-6">
                              <div className="mb-6">
                                <label className="text-[10px] text-slate-600 font-mono block font-medium">Degree/Qualification</label>
                                <input
                                  type="text"
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                  className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                  placeholder="e.g. Bachelor of Technology"
                                />
                              </div>

                              <div className="mb-6">
                                <label className="text-[10px] text-slate-600 font-mono block font-medium">Department / Branch</label>
                                <input
                                  type="text"
                                  value={edu.department}
                                  onChange={(e) => updateEducation(edu.id, 'department', e.target.value)}
                                  className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                  placeholder="e.g. Mechanical, Computer Science"
                                />
                              </div>

                              <div className="mb-6">
                                <label className="text-[10px] text-slate-600 font-mono block font-medium">College / Institute</label>
                                <input
                                  type="text"
                                  value={edu.college}
                                  onChange={(e) => updateEducation(edu.id, 'college', e.target.value)}
                                  className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                  placeholder="College Name"
                                />
                              </div>

                              <div className="mb-6">
                                <label className="text-[10px] text-slate-600 font-mono block font-medium">University</label>
                                <input
                                  type="text"
                                  value={edu.university}
                                  onChange={(e) => updateEducation(edu.id, 'university', e.target.value)}
                                  className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                  placeholder="e.g. Stanford, Delhi University"
                                />
                              </div>

                              <div className="mb-6">
                                <label className="text-[10px] text-slate-600 font-mono block font-medium">CGPA / Final Grade</label>
                                <input
                                  type="text"
                                  value={edu.cgpa}
                                  onChange={(e) => updateEducation(edu.id, 'cgpa', e.target.value)}
                                  className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                  placeholder="e.g. 9.1 / 10.0"
                                />
                              </div>

                              <div className="mb-6">
                                <label className="text-[10px] text-slate-600 font-mono block font-medium">Graduation Year</label>
                                <input
                                  type="text"
                                  value={edu.graduationYear}
                                  onChange={(e) => updateEducation(edu.id, 'graduationYear', e.target.value)}
                                  className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                  placeholder="e.g. 2020"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>

                </div>
              </div></div>

        {/* SECTION 4: Technical Skills */}
        
        <div className="pb-10 pt-4 border-b border-slate-200 last:border-0">
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-slate-800 mb-1">
              <Cpu className="w-[18px] h-[18px] text-slate-600" />
              <h2 className="text-base font-bold text-slate-800">Technical Skills</h2>
            </div>
            <p className="text-[13px] text-slate-500 ml-6">Core technologies, frameworks, tools, and languages classification</p>
          </div>
          <div className="px-1">

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 font-mono tracking-wider">Programming Languages</label>
                    <input
                      type="text"
                      value={profile.programmingLanguages}
                      onChange={(e) => handleTextChange('programmingLanguages', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="TypeScript, Python, Go, C++ (comma separated)"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 font-mono tracking-wider">Frameworks</label>
                    <input
                      type="text"
                      value={profile.frameworks}
                      onChange={(e) => handleTextChange('frameworks', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="React, Next.js, Express, NestJS (comma separated)"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 font-mono tracking-wider">Libraries</label>
                    <input
                      type="text"
                      value={profile.libraries}
                      onChange={(e) => handleTextChange('libraries', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="Redux, Framer Motion, Recharts, Tailwind CSS"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 font-mono tracking-wider">Databases</label>
                    <input
                      type="text"
                      value={profile.databases}
                      onChange={(e) => handleTextChange('databases', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="PostgreSQL, Redis, MongoDB, MySQL"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 font-mono tracking-wider">Cloud Platforms</label>
                    <input
                      type="text"
                      value={profile.cloudPlatforms}
                      onChange={(e) => handleTextChange('cloudPlatforms', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="GCP, AWS, Azure, Cloud Run"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 font-mono tracking-wider">Operating Systems</label>
                    <input
                      type="text"
                      value={profile.operatingSystems}
                      onChange={(e) => handleTextChange('operatingSystems', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="Linux (Ubuntu), macOS, Windows Server"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 font-mono tracking-wider">Developer Tools</label>
                    <input
                      type="text"
                      value={profile.tools}
                      onChange={(e) => handleTextChange('tools', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="Docker, Kubernetes, Vite, Esbuild, Figma"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 font-mono tracking-wider">Version Control</label>
                    <input
                      type="text"
                      value={profile.versionControl}
                      onChange={(e) => handleTextChange('versionControl', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="GitHub, GitLab, Bitbucket"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 font-mono tracking-wider">Soft Skills</label>
                    <input
                      type="text"
                      value={profile.softSkills}
                      onChange={(e) => handleTextChange('softSkills', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="Technical Leadership, Mentoring, Agile Methodologies"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 font-mono tracking-wider">Languages Known</label>
                    <input
                      type="text"
                      value={profile.languagesKnown}
                      onChange={(e) => handleTextChange('languagesKnown', e.target.value)}
                      className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-sm"
                      placeholder="English (Fluent), Spanish (Conversational)"
                    />
                  </div>

                </div>
              </div></div>

        {/* SECTION 5: Projects */}
        
        <div className="pb-10 pt-4 border-b border-slate-200 last:border-0">
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-slate-800 mb-1">
              <FolderGit className="w-[18px] h-[18px] text-slate-600" />
              <h2 className="text-base font-bold text-slate-800">Projects</h2>
            </div>
            <p className="text-[13px] text-slate-500 ml-6">Key engineering projects, technologies deployed, and link endpoints</p>
          </div>
          <div className="px-1">

                <div className="p-6 space-y-5 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono font-semibold">Custom Project Registry</h3>
                    <button
                      type="button"
                      onClick={addProject}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Project</span>
                    </button>
                  </div>

                  {profile.projects.length === 0 ? (
                    <div className="p-6 border border-dashed border-slate-200 rounded-xl text-center text-slate-500 text-xs font-mono">
                      No custom projects documented yet. Click &apos;Add New Project&apos; to register records.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profile.projects.map((proj, index) => (
                        <div 
                          key={proj.id}
                          className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative group transition-all"
                          id={`proj-card-${index}`}
                        >
                          <button
                            type="button"
                            onClick={() => removeProject(proj.id)}
                            className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pr-6">
                            <div className="mb-6">
                              <label className="text-[10px] text-slate-600 font-mono block font-medium">Project Name</label>
                              <input
                                type="text"
                                value={proj.projectName}
                                onChange={(e) => updateProject(proj.id, 'projectName', e.target.value)}
                                className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                placeholder="Nexus Dashboard"
                              />
                            </div>

                            <div className="mb-6">
                              <label className="text-[10px] text-slate-600 font-mono block font-medium">Your Role</label>
                              <input
                                type="text"
                                value={proj.role}
                                onChange={(e) => updateProject(proj.id, 'role', e.target.value)}
                                className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                placeholder="Lead Frontend Developer"
                              />
                            </div>

                            <div className="mb-6">
                              <label className="text-[10px] text-slate-600 font-mono block font-medium">Duration</label>
                              <input
                                type="text"
                                value={proj.duration}
                                onChange={(e) => updateProject(proj.id, 'duration', e.target.value)}
                                className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                placeholder="e.g. 6 Months"
                              />
                            </div>

                            <div className="md:col-span-3 space-y-1">
                              <label className="text-[10px] text-slate-600 font-mono block font-medium">Technologies Used</label>
                              <input
                                type="text"
                                value={proj.technologiesUsed}
                                onChange={(e) => updateProject(proj.id, 'technologiesUsed', e.target.value)}
                                className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                placeholder="React, Node.js, WebSocket (comma separated)"
                              />
                            </div>

                            <div className="mb-6">
                              <label className="text-[10px] text-slate-600 font-mono block font-medium">GitHub Repository Link</label>
                              <input
                                type="text"
                                value={proj.githubLink}
                                onChange={(e) => updateProject(proj.id, 'githubLink', e.target.value)}
                                className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                placeholder="https://github.com/..."
                              />
                            </div>

                            <div className="mb-6">
                              <label className="text-[10px] text-slate-600 font-mono block font-medium">Live Project Endpoint</label>
                              <input
                                type="text"
                                value={proj.liveProjectLink}
                                onChange={(e) => updateProject(proj.id, 'liveProjectLink', e.target.value)}
                                className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                placeholder="https://nexus-analytics.com"
                              />
                            </div>

                            <div className="md:col-span-3 space-y-1">
                              <label className="text-[10px] text-slate-600 font-mono block font-medium">Project Description</label>
                              <textarea
                                value={proj.description}
                                onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                                rows={2}
                                className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                placeholder="Aggregates and formats cloud telemetry stats into visuals..."
                              />
                            </div>

                            <div className="md:col-span-3 space-y-1">
                              <label className="text-[10px] text-slate-600 font-mono block font-medium">Key Achievements / Visual Outcomes</label>
                              <textarea
                                value={proj.achievements}
                                onChange={(e) => updateProject(proj.id, 'achievements', e.target.value)}
                                rows={2}
                                className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                placeholder="Enhanced load efficiency by 40% and implemented custom chart widgets..."
                              />
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div></div>

        {/* SECTION 6: Work Experience */}
        
        <div className="pb-10 pt-4 border-b border-slate-200 last:border-0">
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-slate-800 mb-1">
              <Briefcase className="w-[18px] h-[18px] text-slate-600" />
              <h2 className="text-base font-bold text-slate-800">Work Experience</h2>
            </div>
            <p className="text-[13px] text-slate-500 ml-6">Corporate employment records, leadership titles, and reason for exits</p>
          </div>
          <div className="px-1">

                <div className="p-6 space-y-5 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono font-semibold">Professional Work Ledger</h3>
                    <button
                      type="button"
                      onClick={addWork}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Work Entry</span>
                    </button>
                  </div>

                  {profile.workExperience.length === 0 ? (
                    <div className="p-6 border border-dashed border-slate-200 rounded-xl text-center text-slate-500 text-xs font-mono">
                      No custom work history logged yet. Click &apos;Add Work Entry&apos; to register records.
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {profile.workExperience.map((work, index) => (
                        <div 
                          key={work.id}
                          className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative group transition-all"
                          id={`work-card-${index}`}
                        >
                          <button
                            type="button"
                            onClick={() => removeWork(work.id)}
                            className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete Employment Entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pr-6">
                            <div className="mb-6">
                              <label className="text-[10px] text-slate-600 font-mono block font-medium">Company Name</label>
                              <input
                                type="text"
                                value={work.companyName}
                                onChange={(e) => updateWork(work.id, 'companyName', e.target.value)}
                                className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                placeholder="PixelCraft Tech"
                              />
                            </div>

                            <div className="mb-6">
                              <label className="text-[10px] text-slate-600 font-mono block font-medium">Designation / Title</label>
                              <input
                                type="text"
                                value={work.designation}
                                onChange={(e) => updateWork(work.id, 'designation', e.target.value)}
                                className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                placeholder="Senior Software Engineer"
                              />
                            </div>

                            <div className="mb-6">
                              <label className="text-[10px] text-slate-600 font-mono block font-medium">Employment Type</label>
                              <select
                                value={work.employmentType}
                                onChange={(e) => updateWork(work.id, 'employmentType', e.target.value)}
                                className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs bg-white"
                              >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                              </select>
                            </div>

                            <div className="mb-6">
                              <label className="text-[10px] text-slate-600 font-mono block font-medium">Joining Date</label>
                              <input
                                type="date"
                                value={work.joiningDate}
                                onChange={(e) => updateWork(work.id, 'joiningDate', e.target.value)}
                                className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                              />
                            </div>

                            <div className="mb-6">
                              <label className="text-[10px] text-slate-600 font-mono block font-medium">Leaving Date</label>
                              <input
                                type="text"
                                value={work.leavingDate}
                                onChange={(e) => updateWork(work.id, 'leavingDate', e.target.value)}
                                className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                placeholder="YYYY-MM-DD or &apos;Present&apos;"
                              />
                            </div>

                            <div className="md:col-span-3 space-y-1">
                              <label className="text-[10px] text-slate-600 font-mono block font-medium">Core Responsibilities</label>
                              <textarea
                                value={work.responsibilities}
                                onChange={(e) => updateWork(work.id, 'responsibilities', e.target.value)}
                                rows={2}
                                className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                placeholder="Managed client-side proxy route logic and supervised micro-components architectures..."
                              />
                            </div>

                            <div className="md:col-span-3 space-y-1">
                              <label className="text-[10px] text-slate-600 font-mono block font-medium">Key Achievements</label>
                              <textarea
                                value={work.achievements}
                                onChange={(e) => updateWork(work.id, 'achievements', e.target.value)}
                                rows={2}
                                className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                placeholder="Refactored codebases to shave bundle weight by 35%..."
                              />
                            </div>

                            <div className="md:col-span-3 space-y-1">
                              <label className="text-[10px] text-slate-600 font-mono block font-medium">Reason for Leaving</label>
                              <textarea
                                value={work.reasonForLeaving}
                                onChange={(e) => updateWork(work.id, 'reasonForLeaving', e.target.value)}
                                rows={2}
                                className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                placeholder="Describe professional motivation to exit (career growth, transition, etc)..."
                              />
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div></div>

        {/* SECTION 7: Certifications */}
        
        <div className="pb-10 pt-4 border-b border-slate-200 last:border-0">
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-slate-800 mb-1">
              <Award className="w-[18px] h-[18px] text-slate-600" />
              <h2 className="text-base font-bold text-slate-800">Certifications</h2>
            </div>
            <p className="text-[13px] text-slate-500 ml-6">Professional credentials, certification bodies, and validation links</p>
          </div>
          <div className="px-1">

                <div className="p-6 space-y-5 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono font-semibold">Professional Certificates</h3>
                    <button
                      type="button"
                      onClick={addCertification}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Certificate</span>
                    </button>
                  </div>

                  {profile.certifications.length === 0 ? (
                    <div className="p-6 border border-dashed border-slate-200 rounded-xl text-center text-slate-500 text-xs font-mono">
                      No certificates registered yet. Click &apos;Add Certificate&apos; to register records.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profile.certifications.map((cert, index) => (
                        <div 
                          key={cert.id}
                          className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative group transition-all"
                          id={`cert-card-${index}`}
                        >
                          <button
                            type="button"
                            onClick={() => removeCertification(cert.id)}
                            className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete Certificate"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left pr-6">
                            <div className="md:col-span-2 space-y-1">
                              <label className="text-[10px] text-slate-600 font-mono block font-medium">Certificate Name</label>
                              <input
                                type="text"
                                value={cert.certificateName}
                                onChange={(e) => updateCertification(cert.id, 'certificateName', e.target.value)}
                                className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                placeholder="GCP Professional Cloud Architect"
                              />
                            </div>

                            <div className="mb-6">
                              <label className="text-[10px] text-slate-600 font-mono block font-medium">Issuing Organization</label>
                              <input
                                type="text"
                                value={cert.organization}
                                onChange={(e) => updateCertification(cert.id, 'organization', e.target.value)}
                                className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                placeholder="Google Cloud"
                              />
                            </div>

                            <div className="mb-6">
                              <label className="text-[10px] text-slate-600 font-mono block font-medium">Completion Date</label>
                              <input
                                type="date"
                                value={cert.completionDate}
                                onChange={(e) => updateCertification(cert.id, 'completionDate', e.target.value)}
                                className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                              />
                            </div>

                            <div className="md:col-span-4 space-y-1">
                              <label className="text-[10px] text-slate-600 font-mono block font-medium">Credential Verification Link</label>
                              <input
                                type="text"
                                value={cert.credentialLink}
                                onChange={(e) => updateCertification(cert.id, 'credentialLink', e.target.value)}
                                className="w-full glass-input rounded-lg py-2 px-3 text-slate-800 text-xs"
                                placeholder="https://verify.gcp.com/credential/..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div></div>

        {/* SECTION 8: Documents */}
        
        <div className="pb-10 pt-4 border-b border-slate-200 last:border-0">
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-slate-800 mb-1">
              <UploadCloud className="w-[18px] h-[18px] text-slate-600" />
              <h2 className="text-base font-bold text-slate-800">Documents</h2>
            </div>
            <p className="text-[13px] text-slate-500 ml-6">Mandatory legal card uploads and professional CV attachments</p>
          </div>
          <div className="px-1">

                <div className="p-6 space-y-6">
                  
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-left flex items-start space-x-3 text-slate-700">
                    <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">
                      Upload clear PDFs or high-resolution images. Maximum size threshold is 10 MB per file. These documents are securely locked and visible only to the company recruiting team.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FileUpload
                      id="resume"
                      label="Primary Resume / CV"
                      accept=".pdf,.docx"
                      currentFile={profile.resume}
                      onUpload={(file) => handleDocUpload('resume', file)}
                      onClear={() => handleDocClear('resume')}
                    />

                    <FileUpload
                      id="photo"
                      label="Passport Size Photo"
                      accept="image/*"
                      currentFile={profile.passportPhoto}
                      onUpload={(file) => handleDocUpload('passportPhoto', file)}
                      onClear={() => handleDocClear('passportPhoto')}
                    />

                    <FileUpload
                      id="aadhaar"
                      label="Aadhaar Card"
                      accept=".pdf,.jpg,.jpeg"
                      currentFile={profile.aadhaarCard}
                      onUpload={(file) => handleDocUpload('aadhaarCard', file)}
                      onClear={() => handleDocClear('aadhaarCard')}
                    />

                    <FileUpload
                      id="pan"
                      label="PAN Card"
                      accept=".pdf,.jpg,.jpeg"
                      currentFile={profile.panCard}
                      onUpload={(file) => handleDocUpload('panCard', file)}
                      onClear={() => handleDocClear('panCard')}
                    />

                    <FileUpload
                      id="degree-cert"
                      label="Highest Degree Certificate"
                      accept=".pdf"
                      currentFile={profile.degreeCertificate}
                      onUpload={(file) => handleDocUpload('degreeCertificate', file)}
                      onClear={() => handleDocClear('degreeCertificate')}
                    />

                    <FileUpload
                      id="exp-cert"
                      label="Experience / Relieving Certificate"
                      accept=".pdf"
                      currentFile={profile.experienceCertificate}
                      onUpload={(file) => handleDocUpload('experienceCertificate', file)}
                      onClear={() => handleDocClear('experienceCertificate')}
                    />

                    <div className="md:col-span-2 lg:col-span-3 border-t border-slate-200 pt-5">
                      <FileUpload
                        id="offer-letter"
                        label="Previous Corporate Offer Letter (Optional)"
                        accept=".pdf"
                        currentFile={profile.offerLetter}
                        onUpload={(file) => handleDocUpload('offerLetter', file)}
                        onClear={() => handleDocClear('offerLetter')}
                      />
                    </div>
                  </div>

                </div>
              </div></div>

        {/* SECTION 9: Additional Information */}
        
        <div className="pb-10 pt-4 border-b border-slate-200 last:border-0">
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-slate-800 mb-1">
              <FileText className="w-[18px] h-[18px] text-slate-600" />
              <h2 className="text-base font-bold text-slate-800">Additional Information</h2>
            </div>
            <p className="text-[13px] text-slate-500 ml-6">Social developer handles, core career objectives, strengths, and hobbies</p>
          </div>
          <div className="px-1">

                <div className="p-6 space-y-6 text-left">
                  
                  {/* Social Handles */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono font-semibold">Professional Handles & Sandbox Portals</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[11px] text-slate-600 font-mono font-medium">LinkedIn Profile</label>
                        <input
                          type="text"
                          value={profile.linkedin}
                          onChange={(e) => handleTextChange('linkedin', e.target.value)}
                          className="w-full glass-input rounded-xl py-2 px-3 text-slate-800 text-xs"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] text-slate-600 font-mono font-medium">GitHub Profile</label>
                        <input
                          type="text"
                          value={profile.github}
                          onChange={(e) => handleTextChange('github', e.target.value)}
                          className="w-full glass-input rounded-xl py-2 px-3 text-slate-800 text-xs"
                          placeholder="https://github.com/username"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] text-slate-600 font-mono font-medium">Portfolio Website</label>
                        <input
                          type="text"
                          value={profile.portfolioWebsite}
                          onChange={(e) => handleTextChange('portfolioWebsite', e.target.value)}
                          className="w-full glass-input rounded-xl py-2 px-3 text-slate-800 text-xs"
                          placeholder="https://portfolio.dev"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] text-slate-600 font-mono font-medium">HackerRank Handle</label>
                        <input
                          type="text"
                          value={profile.hackerRank}
                          onChange={(e) => handleTextChange('hackerRank', e.target.value)}
                          className="w-full glass-input rounded-xl py-2 px-3 text-slate-800 text-xs"
                          placeholder="HackerRank link"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] text-slate-600 font-mono font-medium">LeetCode Handle</label>
                        <input
                          type="text"
                          value={profile.leetCode}
                          onChange={(e) => handleTextChange('leetCode', e.target.value)}
                          className="w-full glass-input rounded-xl py-2 px-3 text-slate-800 text-xs"
                          placeholder="LeetCode link"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] text-slate-600 font-mono font-medium">CodeChef Handle</label>
                        <input
                          type="text"
                          value={profile.codeChef}
                          onChange={(e) => handleTextChange('codeChef', e.target.value)}
                          className="w-full glass-input rounded-xl py-2 px-3 text-slate-800 text-xs"
                          placeholder="CodeChef link"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Narrative details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-200">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Career Objective</label>
                      <textarea
                        value={profile.careerObjective}
                        onChange={(e) => handleTextChange('careerObjective', e.target.value)}
                        rows={3}
                        className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-xs"
                        placeholder="State your long-term career destination and professional objectives..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Strengths</label>
                      <textarea
                        value={profile.strengths}
                        onChange={(e) => handleTextChange('strengths', e.target.value)}
                        rows={3}
                        className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-xs"
                        placeholder="List core strengths, key technical vectors, soft-skill metrics..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Weaknesses</label>
                      <textarea
                        value={profile.weaknesses}
                        onChange={(e) => handleTextChange('weaknesses', e.target.value)}
                        rows={3}
                        className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-xs"
                        placeholder="State weaknesses in a professional, growth-oriented context..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Achievements & Awards</label>
                      <textarea
                        value={profile.achievements}
                        onChange={(e) => handleTextChange('achievements', e.target.value)}
                        rows={3}
                        className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-xs"
                        placeholder="Major awards, project accolades, hackathons won..."
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Hobbies & Interests</label>
                      <textarea
                        value={profile.hobbies}
                        onChange={(e) => handleTextChange('hobbies', e.target.value)}
                        rows={2}
                        className="w-full glass-input rounded-xl py-2.5 px-3.5 text-slate-800 text-xs"
                        placeholder="e.g. Amateur synthesizer engineering, competitive chess, restorations..."
                      />
                    </div>
                  </div>

                </div>
              </div></div>


        {/* Added New Form Sections */}
        <div className="space-y-6 pb-6 border-t border-slate-200 pt-6">
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-slate-800 mb-1">
              <Globe className="w-[18px] h-[18px] text-slate-600" />
              <h2 className="text-base font-bold text-slate-800">Job Preference & Contact Details</h2>
            </div>
            <p className="text-[13px] text-slate-500 ml-6">Career preferences and contact information</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 ">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Country Looking For <span className="text-red-500">*</span></label>
              <select
                value={profile.countryLookingFor || ''}
                onChange={(e) => handleTextChange('countryLookingFor', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select preferred country</option>
                <option value="India">India</option>
                <option value="UAE">UAE</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Job Preference <span className="text-red-500">*</span></label>
              <select
                value={profile.jobPreference || ''}
                onChange={(e) => handleTextChange('jobPreference', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select job preference</option>
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Skill</label>
              <select
                value={profile.skill || ''}
                onChange={(e) => handleTextChange('skill', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select or search skill</option>
                <option value="React">React</option>
                <option value="Node.js">Node.js</option>
                <option value="Python">Python</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Passport Available <span className="text-red-500">*</span></label>
              <select
                value={profile.passportAvailable || ''}
                onChange={(e) => handleTextChange('passportAvailable', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Primary Number <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={profile.primaryNumber || ''}
                onChange={handlePrimaryNumberChange}
                placeholder="Enter 10-digit mobile number"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Family Member Number</label>
              <input
                type="text"
                value={profile.familyMemberNumber || ''}
                onChange={handleFamilyNumberChange}
                placeholder="Enter 10-digit mobile number"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2 xl:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">WhatsApp Number</label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.whatsappSameAsPrimary || false}
                    onChange={toggleSameAsPrimary}
                    className="rounded text-red-600 focus:ring-red-500 h-4 w-4 border-slate-300"
                  />
                  <span className="text-sm text-slate-700 font-medium">Same as Primary</span>
                </label>
              </div>
              <div className="flex">
                <div className="relative">
                  <select className="appearance-none rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="+91">+91</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                <input
                  type="text"
                  value={profile.whatsappNumber || ''}
                  onChange={handleWhatsAppChange}
                  disabled={profile.whatsappSameAsPrimary}
                  placeholder="Enter 10-digit number"
                  className={`flex-1 rounded-r-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${profile.whatsappSameAsPrimary ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Selected: India (+91) - Requires 10 digits</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6 pb-6 border-t border-slate-200 pt-6">
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-slate-800 mb-1">
              <MessageSquare className="w-[18px] h-[18px] text-slate-600" />
              <h2 className="text-base font-bold text-slate-800">Assessment & Preferences</h2>
            </div>
            <p className="text-[13px] text-slate-500 ml-6">Candidate assessment and communication preferences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Source <span className="text-red-500">*</span></label>
              <select
                value={profile.source || ''}
                onChange={(e) => handleTextChange('source', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select source</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Job Board">Job Board</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Job Duration Preference <span className="text-red-500">*</span></label>
              <select
                value={profile.jobDurationPreference || ''}
                onChange={(e) => handleTextChange('jobDurationPreference', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select preference</option>
                <option value="Long Term">Long Term</option>
                <option value="Short Term">Short Term</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Service Charges Status <span className="text-red-500">*</span></label>
              <select
                value={profile.serviceChargesStatus || ''}
                onChange={(e) => handleTextChange('serviceChargesStatus', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select status</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Best Time to Contact <span className="text-red-500">*</span></label>
              <select
                value={profile.bestTimeToContact || ''}
                onChange={(e) => handleTextChange('bestTimeToContact', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select time</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
          </div>

          <div className=" space-y-2">
            <label className="text-sm font-semibold text-slate-700">Interest Level <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => handleTextChange('interestLevel', 'More Interested')}
                className={`py-3 px-4 rounded-lg border text-sm font-semibold transition-all ${profile.interestLevel === 'More Interested' ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-sm' : 'border-slate-200 text-emerald-500 hover:bg-slate-50'}`}
              >
                More Interested
              </button>
              <button
                type="button"
                onClick={() => handleTextChange('interestLevel', 'Interested')}
                className={`py-3 px-4 rounded-lg border text-sm font-semibold transition-all ${profile.interestLevel === 'Interested' ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm' : 'border-slate-200 text-blue-500 hover:bg-slate-50'}`}
              >
                Interested
              </button>
              <button
                type="button"
                onClick={() => handleTextChange('interestLevel', 'Somewhat Interested')}
                className={`py-3 px-4 rounded-lg border text-sm font-semibold transition-all ${profile.interestLevel === 'Somewhat Interested' ? 'bg-yellow-50 border-yellow-500 text-yellow-600 shadow-sm' : 'border-slate-200 text-yellow-500 hover:bg-slate-50'}`}
              >
                Somewhat Interested
              </button>
              <button
                type="button"
                onClick={() => handleTextChange('interestLevel', 'Not Interested')}
                className={`py-3 px-4 rounded-lg border text-sm font-semibold transition-all ${profile.interestLevel === 'Not Interested' ? 'bg-red-50 border-red-500 text-red-600 shadow-sm' : 'border-slate-200 text-red-500 hover:bg-slate-50'}`}
              >
                Not Interested
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6 pb-6 border-t border-slate-200 pt-6">
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-slate-800 mb-1">
              <Clock className="w-[18px] h-[18px] text-slate-600" />
              <h2 className="text-base font-bold text-slate-800">Follow-up & Notes</h2>
            </div>
            <p className="text-[13px] text-slate-500 ml-6">Follow-up scheduling and telemarketer observations</p>
          </div>

          <div className=" space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2 lg:col-span-1">
                <label className="text-sm font-semibold text-slate-700">Next Follow-up Date</label>
                <input
                  type="date"
                  value={profile.nextFollowUpDate || ''}
                  onChange={(e) => handleTextChange('nextFollowUpDate', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2 lg:col-span-1">
                <label className="text-sm font-semibold text-slate-700">Assigned to (HR staff)</label>
                <select
                  value={profile.assignedToHR || ''}
                  onChange={(e) => handleTextChange('assignedToHR', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select HR staff</option>
                  <option value="HR 1">HR 1</option>
                  <option value="HR 2">HR 2</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Telemarketer Notes</label>
              <textarea
                value={profile.telemarketerNotes || ''}
                onChange={(e) => handleTextChange('telemarketerNotes', e.target.value)}
                placeholder="Enter observations and notes from the call..."
                rows={4}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Upload Voice Recording (Legacy)</label>
              <div className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-sm text-slate-700">
                <input 
                  type="file" 
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer" 
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-700 block">Live Voice Recording</label>
                <p className="text-sm text-slate-500">Record voice directly using your microphone</p>
              </div>
              <button type="button" className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors cursor-pointer w-max">
                <Mic className="w-4 h-4" />
                <span>Start Recording</span>
              </button>
            </div>
          </div>
        </div>

        {/* Declaration and Action buttons */}
        <div className="glass-panel p-6 rounded-2xl space-y-5 text-left border border-slate-200 bg-white shadow-sm">
          <label className="flex items-start space-x-3 cursor-pointer group select-none">
            <input
              type="checkbox"
              id="declaration-checkbox"
              checked={profile.declaredTrue}
              onChange={(e) => handleTextChange('declaredTrue', e.target.checked)}
              className="mt-1 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500 w-4.5 h-4.5 cursor-pointer"
            />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                I hereby declare that all the information provided is true and correct.
              </p>
              <p className="text-[10px] text-slate-600">
                Falsification of credentials will result in immediate disqualification from the internal recruitment process.
              </p>
            </div>
          </label>

          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex space-x-3">
              <button
                type="button"
                id="save-draft-btn"
                onClick={onSaveDraft}
                className="px-5 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4 text-slate-500" />
                <span>Save Draft</span>
              </button>
            </div>

            <button
              type="button"
              id="preview-profile-btn"
              onClick={onPreview}
              className="px-6 py-3 rounded-xl text-white text-xs font-bold transition-all duration-300 gradient-btn flex items-center space-x-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Profile Dossier</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
