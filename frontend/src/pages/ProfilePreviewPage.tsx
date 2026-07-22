import React, { useState } from 'react';
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
  Briefcase, 
  FileCheck2, 
  Building,
  Check,
  ArrowLeft,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
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
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewDocument, setViewDocument] = useState<{url: string, filename: string} | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      const element = document.createElement("a");
      const file = new Blob([
        `Candidate Dossier: ${profile.candidateName}\n` +
        `Entry Date: ${profile.entryDate}\n` +
        `DOB: ${profile.dateOfBirth}\n` +
        `Highest Qualification: ${profile.highestQualification}\n` +
        `Designation: ${profile.designation}\n` +
        `Industry: ${profile.industry}\n` +
        `Total Experience: ${profile.totalExperience}\n` +
        `Contact Number: ${profile.contactNumber}\n` +
        `Email ID: ${profile.email}\n` +
        `Key Skills: ${profile.keySkills}\n`
      ], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${profile.candidateName.replace(/\s+/g, '_')}_Dossier.txt`;
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

  return (
    <div className="space-y-6 text-left print:p-0 print:space-y-4" id="profile-preview-container">
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors bg-white shrink-0 cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
              Digital Profile Preview
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Candidate form preview mode.
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

      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none print:bg-transparent">
        
        <div className="p-6 md:p-8 border-b border-slate-200 bg-slate-50/60 grid grid-cols-1 md:grid-cols-4 gap-6 items-center print:bg-transparent print:border-b print:p-2">
          <div className="md:col-span-3 text-center md:text-left space-y-2">
            <div className="space-y-0.5">
              <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 tracking-tight">
                {profile.candidateName || 'Unspecified Candidate'}
              </h2>
              <p className="text-base font-semibold text-blue-600 font-display">
                {profile.designation || 'Unknown Designation'}
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-1.5 text-xs text-slate-600">
              <span className="flex items-center space-x-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{profile.email || 'Unspecified Email'}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{profile.contactNumber || 'Unspecified Contact'}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 print:p-2 space-y-8 bg-white">
          <div className="space-y-6 text-left">
            
            <div>
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest font-mono mb-3 border-b border-slate-100 pb-1">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-slate-700">
                <div><span className="text-slate-500 font-semibold block text-xs">Entry Date</span> {profile.entryDate || 'N/A'}</div>
                <div><span className="text-slate-500 font-semibold block text-xs">Date of Birth</span> {profile.dateOfBirth || 'N/A'}</div>
                <div><span className="text-slate-500 font-semibold block text-xs">WhatsApp Number</span> {profile.whatsappNumber || 'N/A'}</div>
                <div><span className="text-slate-500 font-semibold block text-xs">Highest Qualification</span> {profile.highestQualification || 'N/A'}</div>
                <div className="md:col-span-3"><span className="text-slate-500 font-semibold block text-xs">Address</span> {profile.address || 'N/A'}</div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest font-mono mb-3 border-b border-slate-100 pb-1">
                Professional Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-700">
                <div><span className="text-slate-500 font-semibold block text-xs">Industry</span> {profile.industry || 'N/A'}</div>
                <div><span className="text-slate-500 font-semibold block text-xs">Indian Experience</span> {profile.indianExperience || 'N/A'}</div>
                <div><span className="text-slate-500 font-semibold block text-xs">Overseas Experience</span> {profile.overseasExperience || 'N/A'}</div>
                <div><span className="text-slate-500 font-semibold block text-xs">Total Experience</span> {profile.totalExperience || 'N/A'}</div>
                <div className="md:col-span-4"><span className="text-slate-500 font-semibold block text-xs">Key Skills/Knowledge</span> {profile.keySkills || 'N/A'}</div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest font-mono mb-3 border-b border-slate-100 pb-1">
                Passport Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
                <div><span className="text-slate-500 font-semibold block text-xs">Passport Number</span> {profile.passportNumber || 'N/A'}</div>
                <div><span className="text-slate-500 font-semibold block text-xs">Passport Expiry Date</span> {profile.passportExpiryDate || 'N/A'}</div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest font-mono border-b border-slate-100 pb-1">
                Document Uploads
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Passport', doc: profile.passport },
                  { label: 'Resume', doc: profile.resume },
                  { label: 'Education Certificate', doc: profile.educationCertificate },
                  { label: 'Expertise Certificates', doc: profile.expertiseCertificates },
                ].map((item, idx) => {
                  if (!item.doc) {
                    return (
                      <div key={idx} className="p-4 border border-dashed border-slate-200 rounded-xl flex items-center justify-between text-left opacity-60">
                        <div>
                          <span className="text-[10px] text-slate-400 font-mono block uppercase">{item.label}</span>
                          <span className="text-xs text-slate-400 block mt-1">Not Uploaded</span>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={idx} className="p-4 bg-emerald-50/40 border border-emerald-200/80 rounded-xl flex items-center justify-between text-left">
                      <div className="overflow-hidden pr-3">
                        <span className="text-[10px] text-emerald-600 font-mono block uppercase tracking-wide">✓ Uploaded</span>
                        <span className="text-xs font-bold text-slate-800 block truncate mt-1">{item.doc.name}</span>
                      </div>
                      <div className="flex space-x-1 print:hidden">
                        <button
                          onClick={() => {
                            const docAny = item.doc as any;
                            const docUrl = docAny.url || docAny.base64;
                            if (item.doc && docUrl) {
                              setViewDocument({
                                url: docUrl,
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
      </div>

      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white p-8 rounded border border-slate-200 text-center space-y-5 shadow-lg"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <Check className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-slate-900 font-display">
                {profile.id ? 'Profile Updated Successfully!' : 'Profile Submitted Successfully!'}
              </h3>
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
