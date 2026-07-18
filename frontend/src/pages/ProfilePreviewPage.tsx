import React, { useState } from 'react';
import { saveCandidateToDb } from '../services/db';
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Sparkles, 
  Edit, 
  Download, 
  Printer, 
  CheckCircle, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Cpu, 
  FolderGit, 
  Award, 
  FileCheck2, 
  Link, 
  ExternalLink,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Building,
  Check,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { CandidateProfile, ApplicationStatus } from '../types';
import DocumentViewerModal from '../components/DocumentViewerModal';

interface ProfilePreviewPageProps {
  profile: CandidateProfile;
  profileStatus: 'Draft' | 'Submitted';
  applicationStatus: ApplicationStatus;
  setProfileStatus: (status: 'Draft' | 'Submitted') => void;
  setApplicationStatus: (status: ApplicationStatus) => void;
  completionPercentage: number;
  onSuccessComplete?: () => void;
}

export default function ProfilePreviewPage({
  profile,
  profileStatus,
  applicationStatus,
  setProfileStatus,
  setApplicationStatus,
  completionPercentage,
  onSuccessComplete
}: ProfilePreviewPageProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'about' | 'professional' | 'education' | 'skills' | 'experience' | 'documents'>('about');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewDocument, setViewDocument] = useState<{url: string, filename: string} | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Status steps mapping
  const statusSteps: { key: ApplicationStatus; label: string }[] = [
    { key: 'Submitted', label: 'File Received' },
    { key: 'Under Review', label: 'HR Screening' },
    { key: 'Shortlisted', label: 'Pre-Selected' },
    { key: 'Interview Scheduled', label: 'Interviews' },
    { key: 'Selected', label: 'Offer Stage' }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      // Simulate file download
      const element = document.createElement("a");
      const file = new Blob([
        `Candidate Dossier: ${profile.firstName} ${profile.lastName}\n` +
        `Current Title: ${profile.currentDesignation}\n` +
        `Email: ${profile.email}\n` +
        `Mobile: ${profile.mobileNumber}\n` +
        `Summary: ${profile.professionalSummary}\n` +
        `Education Percentage (10th/12th): ${profile.percentage10th} / ${profile.percentage12th}\n` +
        `Skills: ${profile.programmingLanguages}, ${profile.frameworks}\n` +
        `Submitted via NexHire Candidate Portal.\n`
      ], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${profile.firstName}_${profile.lastName}_Dossier.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { submitCandidateProfile } = await import('../services/db');
      await submitCandidateProfile(profile);
      
      setIsSubmitting(false);
      setProfileStatus('Submitted');
      setApplicationStatus('Submitted');
      setShowSubmitModal(true);
    } catch (error: any) {
      console.error("Failed to save candidate:", error);
      setIsSubmitting(false);
      alert(`Failed to submit profile to the database.\nError: ${error?.message || error}`);
    }
  };

  const handleStatusShift = (nextStatus: ApplicationStatus) => {
    setApplicationStatus(nextStatus);
  };

  return (
    <div className="space-y-6 text-left print:p-0 print:space-y-4" id="profile-preview-container">
      
      {/* Visual Header Banner - Hidden during print */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors bg-white shrink-0 cursor-pointer"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
              Digital Profile Preview
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              This represents your formal evaluation dossier as seen by HR and technical interview panels.
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => navigate('/form')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
          
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Download className={`w-3.5 h-3.5 ${downloading ? 'animate-bounce' : ''}`} />
            <span>{downloading ? 'Preparing File...' : 'Export TXT'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>

          {profileStatus === 'Draft' ? (
            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className={`px-5 py-2 rounded-xl text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer ${isSubmitting ? 'bg-slate-400' : 'gradient-btn'}`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Processing...' : profile.id ? 'Update Profile' : 'Submit Profile'}</span>
            </button>
          ) : (
            <div className="px-5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>{profile.id ? 'Updated' : 'Submitted'}</span>
            </div>
          )}
        </div>
      </div>



      {/* Main Premium Digital Resume Card */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-sm relative border border-slate-250 bg-white print:border-none print:shadow-none print:bg-transparent">
        
        {/* Accent visual top bar - hidden on print */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600 print:hidden" />

        {/* Profile Header Block */}
        <div className="p-6 md:p-8 border-b border-slate-200 bg-slate-50/60 grid grid-cols-1 md:grid-cols-4 gap-6 items-center print:bg-transparent print:border-b print:p-2">
          
          {/* Avatar Area */}
          <div className="flex justify-center md:justify-start">
            {profile.profilePhoto ? (
              <img 
                src={typeof profile.profilePhoto === 'object' ? (profile.profilePhoto as any).url || (profile.profilePhoto as any).base64 : profile.profilePhoto} 
                alt={`${profile.firstName} ${profile.lastName}`} 
                className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover border-2 border-slate-200 shadow-sm shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 shrink-0">
                <User className="w-12 h-12" />
                <span className="text-[10px] mt-1 font-mono">No Image</span>
              </div>
            )}
          </div>

          {/* Title Area */}
          <div className="md:col-span-2 text-center md:text-left space-y-2">
            <div className="space-y-0.5">
              <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 tracking-tight">
                {profile.firstName ? `${profile.firstName} ${profile.lastName}` : 'Unspecified Candidate'}
              </h2>
              <p className="text-base font-semibold text-blue-600 font-display">
                {profile.currentDesignation || 'Product Architect / Engineer'}
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-xs text-slate-600 font-mono">
              <span className="flex items-center space-x-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile.currentCompany || 'Freelance / Consultant'}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile.city ? `${profile.city}, ${profile.country}` : 'Location Unsaved'}</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100 text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                {profile.totalExperience || 'N/A Exp'} Total
              </span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-1.5 text-xs text-slate-600">
              <a href={`mailto:${profile.email}`} className="flex items-center space-x-1.5 hover:text-blue-600 transition-colors">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{profile.email || 'name@company.com'}</span>
              </a>
              <span className="flex items-center space-x-1.5">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{profile.mobileNumber || 'Unspecified'}</span>
              </span>
            </div>
          </div>

          {/* Micro Stats side block - hidden during print */}
          <div className="text-center md:text-right flex flex-col items-center md:items-end space-y-2.5 print:hidden">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold font-mono uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Internal Candidate</span>
            </div>
            <div className="w-32 bg-slate-100 rounded-xl p-3 border border-slate-200 text-left">
              <div className="flex justify-between items-center text-[10px] mb-1 font-mono text-slate-500">
                <span>Dossier Lock</span>
                <span className="font-semibold text-blue-600">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Category Tabs Selection - Hidden on print */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 flex flex-wrap gap-1 overflow-x-auto print:hidden">
          {[
            { id: 'about', label: 'About & Career', icon: User },
            { id: 'professional', label: 'Preferences', icon: Briefcase },
            { id: 'education', label: 'Education', icon: GraduationCap },
            { id: 'skills', label: 'Tech Stack', icon: Cpu },
            { id: 'experience', label: 'Work & Projects', icon: FolderGit },
            { id: 'documents', label: 'Documents Locked', icon: FileCheck2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-4 text-xs font-semibold tracking-wide border-b-2 transition-all cursor-pointer ${
                  isTabActive
                    ? 'border-blue-600 text-blue-600 font-bold bg-blue-50/40'
                    : 'border-transparent text-slate-500 hover:text-slate-850 hover:bg-slate-100/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Tab Contents - shown completely stacked on print! */}
        <div className="p-6 md:p-8 print:p-2 space-y-8 bg-white">
          
          {/* TAB 1: About - Shown either if tab active or printing */}
          <div className={`${activeTab === 'about' ? 'block' : 'hidden'} print:block space-y-6 text-left`}>
            <div>
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest font-mono mb-3 border-b border-slate-100 pb-1">
                Professional Summary
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-sans">
                {profile.professionalSummary || 'No professional summary provided. Update candidate form to include summary detail.'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest font-mono mb-3 border-b border-slate-100 pb-1">
                Career Objective
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-sans">
                {profile.careerObjective || 'No specific objective listed.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left">
                <h4 className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider mb-2">Strengths</h4>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{profile.strengths || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left">
                <h4 className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider mb-2">Growth Dimensions / Weaknesses</h4>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{profile.weaknesses || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left">
                <h4 className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider mb-2">Hobbies & Interests</h4>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{profile.hobbies || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* TAB 2: Preferences / Professional Info */}
          <div className={`${activeTab === 'professional' ? 'block' : 'hidden'} print:block space-y-6 text-left`}>
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest font-mono border-b border-slate-100 pb-1">
              Employment Details & Preferences
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 font-mono block">Notice Period:</span>
                <span className="text-sm font-bold text-slate-800 block mt-1">{profile.noticePeriod || 'Immediate'}</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 font-mono block">Work Mode Preference:</span>
                <span className="text-sm font-bold text-slate-800 block mt-1">{profile.workPreference || 'Hybrid'}</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 font-mono block">Expected CTC:</span>
                <span className="text-sm font-bold text-slate-800 block mt-1">{profile.expectedCTC || 'Unspecified'}</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 font-mono block">Willing to Relocate:</span>
                <span className="text-sm font-bold text-slate-800 block mt-1">{profile.willingToRelocate ? 'Yes' : 'No'}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5">
              <h4 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wider">Geographical and Personal Metadata</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-slate-700">
                <div className="space-y-1.5">
                  <div><span className="text-slate-500 font-mono">Primary Email:</span> {profile.email || 'N/A'}</div>
                  <div><span className="text-slate-500 font-mono">Mobile Number:</span> {profile.mobileNumber || 'N/A'}</div>
                  <div><span className="text-slate-500 font-mono">Alternate Number:</span> {profile.alternateNumber || 'N/A'}</div>
                  <div><span className="text-slate-500 font-mono">Permanent Residence:</span> {profile.address || 'N/A'}</div>
                </div>
                <div className="space-y-1.5">
                  <div><span className="text-slate-500 font-mono">Date of Birth:</span> {profile.dateOfBirth || 'N/A'}</div>
                  <div><span className="text-slate-500 font-mono">Gender Identifier:</span> {profile.gender || 'N/A'}</div>
                  <div><span className="text-slate-500 font-mono">Nationality:</span> {profile.nationality || 'N/A'}</div>
                  <div><span className="text-slate-500 font-mono">Preferred Workspace:</span> {profile.preferredLocation || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* TAB 3: Education */}
          <div className={`${activeTab === 'education' ? 'block' : 'hidden'} print:block space-y-6 text-left`}>
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest font-mono border-b border-slate-100 pb-1">
              Education Timeline
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 font-display flex justify-between">
                  <span>10th Standard secondary</span>
                  <span className="text-blue-600 font-mono font-bold">{profile.percentage10th || 'N/A'}</span>
                </h4>
                <p className="text-xs text-slate-650 mt-2">{profile.school10th || 'School Unspecified'}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 font-display flex justify-between">
                  <span>12th Standard senior secondary</span>
                  <span className="text-blue-600 font-mono font-bold">{profile.percentage12th || 'N/A'}</span>
                </h4>
                <p className="text-xs text-slate-650 mt-2">{profile.school12th || 'School Unspecified'}</p>
                {profile.diploma && (
                  <p className="text-[10px] text-slate-500 font-mono mt-1">Diploma: {profile.diploma}</p>
                )}
              </div>
            </div>

            {profile.educationList.length > 0 && (
              <div className="space-y-3 pt-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">University & Advanced Qualification</h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left text-slate-650 bg-white">
                    <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider font-mono">
                      <tr>
                        <th className="px-4 py-3">Degree Qualification</th>
                        <th className="px-4 py-3">Branch / Specialization</th>
                        <th className="px-4 py-3">College / Institution</th>
                        <th className="px-4 py-3">Year</th>
                        <th className="px-4 py-3 text-right">CGPA / Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.educationList.map((edu, idx) => (
                        <tr key={edu.id} className="border-t border-slate-200 hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-semibold text-slate-800">{edu.degree}</td>
                          <td className="px-4 py-3 text-slate-650">{edu.department}</td>
                          <td className="px-4 py-3 text-slate-600">{edu.college} <span className="text-[10px] block text-slate-400">{edu.university}</span></td>
                          <td className="px-4 py-3 text-slate-500">{edu.graduationYear}</td>
                          <td className="px-4 py-3 text-right text-blue-600 font-semibold font-mono">{edu.cgpa}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* TAB 4: Skills */}
          <div className={`${activeTab === 'skills' ? 'block' : 'hidden'} print:block space-y-6 text-left`}>
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest font-mono border-b border-slate-100 pb-1">
              Technical Stack Capabilities
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { title: 'Programming Languages', value: profile.programmingLanguages },
                { title: 'Frameworks / Architectures', value: profile.frameworks },
                { title: 'Libraries / Extensions', value: profile.libraries },
                { title: 'Databases & In-Memory Stores', value: profile.databases },
                { title: 'Cloud Platforms / Containerization', value: profile.cloudPlatforms },
                { title: 'Operating Systems', value: profile.operatingSystems },
                { title: 'Developer Toolings', value: profile.tools },
                { title: 'Version Control Systems', value: profile.versionControl },
                { title: 'Soft Skills / Agile Methodologies', value: profile.softSkills },
                { title: 'Languages Known', value: profile.languagesKnown }
              ].map((skill, index) => {
                if (!skill.value) return null;
                return (
                  <div key={index} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left">
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest block mb-2">{skill.title}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {skill.value.split(',').map((val, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-white border border-slate-200 text-slate-700 shadow-sm"
                        >
                          {val.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TAB 5: Work Experience & Projects */}
          <div className={`${activeTab === 'experience' ? 'block' : 'hidden'} print:block space-y-8 text-left`}>
            
            {/* Professional Work Experience */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest font-mono border-b border-slate-100 pb-1">
                Professional Experience Chronology
              </h3>

              {profile.workExperience.length === 0 ? (
                <p className="text-slate-500 text-xs font-mono">No work history records found.</p>
              ) : (
                <div className="space-y-6">
                  {profile.workExperience.map((work) => (
                    <div key={work.id} className="p-5 bg-slate-50 border border-slate-205 rounded-xl space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1.5">
                        <div className="text-left">
                          <h4 className="text-sm font-bold text-slate-800">{work.designation}</h4>
                          <span className="text-xs text-blue-600 font-semibold">{work.companyName}</span>
                          <span className="px-1.5 py-0.5 ml-2 rounded bg-slate-200 text-[9px] text-slate-600 border border-slate-300 uppercase font-mono">{work.employmentType}</span>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">
                          {work.joiningDate} to {work.leavingDate || 'Present'}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-slate-700">
                        <div>
                          <span className="text-slate-400 font-mono uppercase text-[9px] tracking-wider block">Core Responsibility:</span>
                          <p className="mt-0.5 leading-relaxed">{work.responsibilities}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-mono uppercase text-[9px] tracking-wider block">Key Accomplishment:</span>
                          <p className="mt-0.5 leading-relaxed">{work.achievements}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-mono uppercase text-[9px] tracking-wider block">Reason for Departure:</span>
                          <p className="mt-0.5 leading-relaxed italic text-slate-500">{work.reasonForLeaving}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Engineering Projects */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest font-mono border-b border-slate-100 pb-1">
                Engineering Projects Directory
              </h3>

              {profile.projects.length === 0 ? (
                <p className="text-slate-500 text-xs font-mono">No registered engineering projects found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {profile.projects.map((proj) => (
                    <div key={proj.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-start">
                          <div className="text-left">
                            <h4 className="text-sm font-bold text-slate-800">{proj.projectName}</h4>
                            <span className="text-[10px] text-blue-600 font-mono font-bold uppercase tracking-wider">{proj.role}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{proj.duration}</span>
                        </div>

                        <p className="text-xs text-slate-650 leading-relaxed text-left">{proj.description}</p>

                        <div className="text-xs text-left">
                          <span className="text-slate-400 font-mono uppercase text-[9px]">Tech:</span>
                          <p className="text-slate-700">{proj.technologiesUsed}</p>
                        </div>

                        <div className="text-xs text-left bg-white p-2.5 rounded border border-slate-200">
                          <span className="text-slate-400 font-mono uppercase text-[9px] block">Impact Outcome:</span>
                          <p className="text-slate-700 mt-0.5">{proj.achievements}</p>
                        </div>
                      </div>

                      {/* Project Link anchors */}
                      <div className="flex space-x-3 pt-4 mt-4 border-t border-slate-200 text-[11px] font-mono print:hidden">
                        {proj.githubLink && (
                          <a 
                            href={proj.githubLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-slate-500 hover:text-blue-600 flex items-center space-x-1"
                          >
                            <Link className="w-3.5 h-3.5" />
                            <span>Repository</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {proj.liveProjectLink && (
                          <a 
                            href={proj.liveProjectLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-slate-500 hover:text-blue-600 flex items-center space-x-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Live App</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Certifications lists */}
            {profile.certifications.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest font-mono border-b border-slate-100 pb-1">
                  Certifications & Verified Credentials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.certifications.map((cert) => (
                    <div key={cert.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-left">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{cert.certificateName}</h4>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{cert.organization} • Completed {cert.completionDate}</span>
                      </div>
                      {cert.credentialLink && (
                        <a 
                           href={cert.credentialLink} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="p-1.5 bg-white hover:bg-slate-50 text-blue-600 border border-slate-200 rounded-lg text-xs hover:text-blue-700 shrink-0 print:hidden"
                           title="Verify Credential"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* TAB 6: Uploaded Documents */}
          <div className={`${activeTab === 'documents' ? 'block' : 'hidden'} print:block space-y-6 text-left`}>
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest font-mono border-b border-slate-100 pb-1">
              Document Ledger Verification
            </h3>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-left flex items-start space-x-3 text-slate-600 print:hidden">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Candidate attachments have been safely received and stored on company storage servers. Redact sensitive personal data where necessary.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Primary CV / Resume', doc: profile.resume },
                { label: 'Passport Photo', doc: profile.passportPhoto },
                { label: 'Aadhaar Card copy', doc: profile.aadhaarCard },
                { label: 'PAN Card copy', doc: profile.panCard },
                { label: 'University Degree Cert', doc: profile.degreeCertificate },
                { label: 'Experience Relieving Cert', doc: profile.experienceCertificate },
                { label: 'Offer Letter (Secondary)', doc: profile.offerLetter }
              ].map((item, idx) => {
                if (!item.doc) {
                  return (
                    <div key={idx} className="p-4 border border-dashed border-slate-200 rounded-xl flex items-center justify-between text-left opacity-60">
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block uppercase">{item.label}</span>
                        <span className="text-xs text-slate-400 block mt-1">Not Uploaded (Optional)</span>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={idx} className="p-4 bg-emerald-50/40 border border-emerald-200/80 rounded-xl flex items-center justify-between text-left">
                    <div className="overflow-hidden pr-3">
                      <span className="text-[10px] text-emerald-600 font-mono block uppercase tracking-wide">✓ Verified Lock</span>
                      <span className="text-xs font-bold text-slate-800 block truncate mt-1">{item.doc.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{item.doc.size} • Uploaded {item.doc.uploadedAt}</span>
                    </div>
                    <div className="flex space-x-1 print:hidden">
                      <button
                        onClick={() => {
                          if (item.doc && (item.doc as any).url) {
                            setViewDocument({
                              url: (item.doc as any).url,
                              filename: item.doc.name
                            });
                          } else {
                            alert(`File has not been uploaded yet: ${item.doc?.name}`);
                          }
                        }}
                        className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 bg-white rounded-lg transition-colors cursor-pointer"
                        title="View Asset"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Success Submission Modal Popup */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-200 text-center space-y-5"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <Check className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-slate-900 font-display">
                {profile.id ? 'Profile Updated Successfully!' : 'Profile Submitted Successfully!'}
              </h3>
              <p className="text-xs text-emerald-600 font-mono uppercase tracking-wider">Evaluation File Active</p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              {profile.id 
                ? 'The candidate profile and all associated documents have been successfully updated in the system.' 
                : 'Your profile has been submitted successfully to the HR Recruitment Team. Your onboarding coordinator has been notified and your evaluation timeline is now active.'}
            </p>

            <div className="p-3.5 bg-slate-50 rounded-xl text-left border border-slate-200 text-xs text-slate-500 space-y-1.5">
              <div className="flex justify-between">
                <span>Application State:</span>
                <span className="text-blue-600 font-bold uppercase font-mono">
                  {profile.id ? 'Updated' : 'Submitted'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Verification Stage:</span>
                <span className="text-slate-850 font-semibold">Under HR Screening</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowSubmitModal(false);
                if (onSuccessComplete) onSuccessComplete();
                navigate('/dashboard');
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all font-sans cursor-pointer"
            >
              Proceed to Dashboard
            </button>
          </motion.div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewDocument && (
        <DocumentViewerModal 
          url={viewDocument.url}
          filename={viewDocument.filename}
          onClose={() => setViewDocument(null)}
        />
      )}
    </div>
  );
}
