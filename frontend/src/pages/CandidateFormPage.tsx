import React, { useState, useEffect } from 'react';
import { 
  User, 
  Briefcase, 
  FileText, 
  Check, 
  Eye,
  Globe,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CandidateProfile, 
  DocumentUpload
} from '../types';
import FileUpload from '../components/FileUpload';
import DocumentViewerModal from '../components/DocumentViewerModal';
import SearchableDropdown from '../components/SearchableDropdown';

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
  const [notification, setNotification] = useState<string | null>(null);
  const [viewingDoc, setViewingDoc] = useState<DocumentUpload | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!profile.entryDate) {
      setProfile(prev => ({
        ...prev,
        entryDate: new Date().toISOString().split('T')[0]
      }));
    }
  }, [profile.entryDate, setProfile]);

  const handleDirectSubmit = async () => {
    setIsSubmitting(true);
    setNotification('Saving candidate data...');
    try {
      const { submitCandidateProfile } = await import('../services/db');
      const docId = await submitCandidateProfile(profile);
      
      if (!profile.id) {
        setProfile(prev => ({ ...prev, id: docId }));
      }
      
      setNotification('Profile successfully saved to database!');
      
      setTimeout(() => {
        onPreview();
      }, 800);
      
    } catch (e: any) {
      setNotification(`Error saving profile: ${e.message}`);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleTextChange = (field: keyof CandidateProfile, value: string | boolean) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  const inputClass = "w-full bg-[#f4f7fb] border border-slate-200 rounded text-sm py-2.5 px-3 text-slate-800 focus:bg-white focus:ring-[3px] focus:ring-blue-500/15 focus:border-blue-400 transition-all duration-200 outline-none";
  const labelClass = "block text-[12px] font-semibold text-slate-700 mb-1.5";

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6" id="candidate-form-container">
      
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-lg flex items-center space-x-2.5 font-semibold text-sm"
          >
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <button 
            type="button"
            onClick={() => window.history.back()} 
            className="text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Candidate Form
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Complete candidate details.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded">
        <form onSubmit={(e) => e.preventDefault()} className="p-6 md:p-8 space-y-10" id="dossier-full-form">
          
          {/* Personal Information */}
          <div>
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-slate-600" />
              <h2 className="text-[16px] font-bold text-slate-800">Personal Information</h2>
            </div>
            <p className="text-[12px] text-slate-500 mt-1 mb-3">Basic candidate details and background</p>
            <hr className="border-slate-200 mb-6" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
              <div>
                <label className={labelClass}>Candidate Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={profile.candidateName}
                  onChange={(e) => handleTextChange('candidateName', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Date of Birth (DOB) <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => handleTextChange('dateOfBirth', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Registration Date</label>
                <input
                  type="date"
                  value={profile.entryDate || new Date().toISOString().split('T')[0]}
                  readOnly
                  className={`${inputClass} bg-slate-100 text-slate-500 cursor-not-allowed border-transparent`}
                />
              </div>

              <div>
                <label className={labelClass}>Qualification <span className="text-red-500">*</span></label>
                <SearchableDropdown
                  value={profile.highestQualification}
                  onChange={(val) => handleTextChange('highestQualification', val)}
                  options={["High School", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Other"]}
                  placeholder="Select education level"
                />
              </div>

              <div>
                <label className={labelClass}>Email ID</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleTextChange('email', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Contact Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={profile.contactNumber}
                  onChange={(e) => handleTextChange('contactNumber', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>WhatsApp Number</label>
                <div className="flex items-center space-x-4 mb-2">
                  <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-600">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 border-slate-300" />
                    <span>Same as Primary</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={profile.whatsappNumber}
                  onChange={(e) => handleTextChange('whatsappNumber', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Full Address</label>
                <textarea
                  value={profile.address}
                  onChange={(e) => handleTextChange('address', e.target.value)}
                  rows={2}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div>
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-slate-600" />
              <h2 className="text-[16px] font-bold text-slate-800">Work Experience <span className="text-red-500">*</span></h2>
            </div>
            <p className="text-[12px] text-slate-500 mt-1 mb-3">Professional experience and skills</p>
            <hr className="border-slate-200 mb-6" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
              <div>
                <label className={labelClass}>Designation <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={profile.designation}
                  onChange={(e) => handleTextChange('designation', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Industry <span className="text-red-500">*</span></label>
                <SearchableDropdown
                  value={profile.industry}
                  onChange={(val) => handleTextChange('industry', val)}
                  options={["IT / Software", "Healthcare / Medical", "Finance / Banking", "Construction / Real Estate", "Engineering / Manufacturing", "Retail / E-Commerce", "Education", "Other"]}
                  placeholder="Select industry"
                />
              </div>

              <div>
                <label className={labelClass}>Total Exp. <span className="text-red-500">*</span></label>
                <SearchableDropdown
                  value={profile.totalExperience}
                  onChange={(val) => handleTextChange('totalExperience', val)}
                  options={["0 Years (Fresher)", "1 Year", "2 Years", "3 Years", "4 Years", "5 Years", "6-10 Years", "10+ Years"]}
                  placeholder="Select total exp"
                />
              </div>

              <div>
                <label className={labelClass}>Indian Exp.</label>
                <SearchableDropdown
                  value={profile.indianExperience}
                  onChange={(val) => handleTextChange('indianExperience', val)}
                  options={["0 Years", "1 Year", "2 Years", "3 Years", "4 Years", "5 Years", "6-10 Years", "10+ Years"]}
                  placeholder="Select indian exp"
                />
              </div>

              <div>
                <label className={labelClass}>Overseas Exp.</label>
                <SearchableDropdown
                  value={profile.overseasExperience}
                  onChange={(val) => handleTextChange('overseasExperience', val)}
                  options={["0 Years", "1 Year", "2 Years", "3 Years", "4 Years", "5 Years", "6-10 Years", "10+ Years"]}
                  placeholder="Select overseas exp"
                />
              </div>

              <div className="md:col-span-3">
                <label className={labelClass}>Key Skills & Expertise <span className="text-red-500">*</span></label>
                <SearchableDropdown
                  value={profile.keySkills}
                  onChange={(val) => handleTextChange('keySkills', val)}
                  options={["Driver, Truck driver", "React, Node.js, Typescript", "Project Management", "Heavy Machinery Operation", "Customer Service", "Accounting & Finance", "Sales & Marketing", "Other"]}
                  placeholder="Select or search skill"
                />
              </div>
            </div>
          </div>

          {/* Passport & Documents */}
          <div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-slate-600" />
              <h2 className="text-[16px] font-bold text-slate-800">Passport & Documents</h2>
            </div>
            <p className="text-[12px] text-slate-500 mt-1 mb-3">Travel documents and certifications</p>
            <hr className="border-slate-200 mb-6" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5 mb-8">
              <div>
                <label className={labelClass}>Passport Number</label>
                <input
                  type="text"
                  value={profile.passportNumber}
                  onChange={(e) => handleTextChange('passportNumber', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Passport Expiry Date</label>
                <input
                  type="date"
                  value={profile.passportExpiryDate}
                  onChange={(e) => handleTextChange('passportExpiryDate', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FileUpload
                id="passport"
                label="Passport Scan"
                accept="application/pdf,image/*"
                currentFile={profile.passport as any}
                onUpload={(file) => handleDocUpload('passport', file)}
                onClear={() => handleDocClear('passport')}
                onView={() => setViewingDoc(profile.passport as any)}
              />
              <FileUpload
                id="resume"
                label="Resume (PDF)"
                accept="application/pdf"
                currentFile={profile.resume as any}
                onUpload={(file) => handleDocUpload('resume', file)}
                onClear={() => handleDocClear('resume')}
                onView={() => setViewingDoc(profile.resume as any)}
              />
              <FileUpload
                id="educationCertificate"
                label="Education Certs"
                accept="application/pdf,image/*"
                currentFile={profile.educationCertificate as any}
                onUpload={(file) => handleDocUpload('educationCertificate', file)}
                onClear={() => handleDocClear('educationCertificate')}
                onView={() => setViewingDoc(profile.educationCertificate as any)}
              />
              <FileUpload
                id="expertiseCertificates"
                label="Expertise Certs"
                accept="application/pdf,image/*"
                currentFile={profile.expertiseCertificates as any}
                onUpload={(file) => handleDocUpload('expertiseCertificates', file)}
                onClear={() => handleDocClear('expertiseCertificates')}
                onView={() => setViewingDoc(profile.expertiseCertificates as any)}
              />
            </div>
          </div>
        </form>
      </div>

      {/* Action Buttons at the Bottom */}
      <div className="flex items-center justify-end space-x-4 mt-2 mb-8">
        {profile.id && (
          <button
            type="button"
            onClick={onPreview}
            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-md text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-md text-sm font-semibold hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDirectSubmit}
          disabled={isSubmitting}
          className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-bold transition-colors flex items-center shadow-sm disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <span>{profile.id ? 'Save Candidate' : 'Save Candidate'}</span>
          )}
        </button>
      </div>

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <DocumentViewerModal
          url={viewingDoc.url || viewingDoc.base64 || ''}
          filename={viewingDoc.name || 'Document'}
          onClose={() => setViewingDoc(null)}
        />
      )}
    </div>
  );
}