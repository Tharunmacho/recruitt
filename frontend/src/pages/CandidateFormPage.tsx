import React, { useState, useEffect } from 'react';
import { 
  User, 
  Briefcase, 
  FileText, 
  Check, 
  Save,
  Eye,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CandidateProfile, 
  DocumentUpload
} from '../types';
import FileUpload from '../components/FileUpload';
import DocumentViewerModal from '../components/DocumentViewerModal';

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

  return (
    <div className="w-full max-w-[95%] xl:max-w-7xl mx-auto bg-white/60 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-white p-8 md:p-14 text-left space-y-8 relative overflow-hidden" id="candidate-form-container">
      
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

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <button 
            type="button"
            onClick={() => window.history.back()} 
            className="text-slate-500 hover:text-slate-900 flex items-center space-x-2 text-sm font-bold mb-6 transition-colors group"
          >
            <div className="bg-slate-200/50 p-1.5 rounded-full group-hover:bg-slate-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            </div>
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            Candidate Form
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Complete candidate details.
          </p>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent -z-10 pointer-events-none"></div>
      
      <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8" id="dossier-full-form">
        
        {/* Left Column: Data Entry */}
        <div className="xl:col-span-8 space-y-6 md:space-y-8">
          
          {/* Personal Details */}
          <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm p-6 md:p-8 hover:bg-white/50 transition-colors duration-300">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-5 mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100/50 p-2.5 rounded-xl text-blue-600"><User className="w-5 h-5" /></div>
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">Personal Details</h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Candidate Name</label>
                <input
                  type="text"
                  value={profile.candidateName}
                  onChange={(e) => handleTextChange('candidateName', e.target.value)}
                  className="w-full glass-input rounded-xl py-3 px-4 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                  placeholder="e.g. Alex Mercer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Entry Date</label>
                <input
                  type="date"
                  value={profile.entryDate}
                  readOnly
                  disabled
                  className="w-full glass-input rounded-xl py-3 px-4 text-slate-500 bg-slate-50/50 cursor-not-allowed text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date of Birth</label>
                <input
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => handleTextChange('dateOfBirth', e.target.value)}
                  className="w-full glass-input rounded-xl py-3 px-4 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Qualification</label>
                <input
                  type="text"
                  list="qualifications-list"
                  value={profile.highestQualification}
                  onChange={(e) => handleTextChange('highestQualification', e.target.value)}
                  className="w-full glass-input rounded-xl py-3 px-4 text-slate-800 text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                  placeholder="Select or type..."
                />
                <datalist id="qualifications-list">
                  <option value="High School" />
                  <option value="Diploma" />
                  <option value="Bachelor's Degree" />
                  <option value="Master's Degree" />
                  <option value="PhD" />
                  <option value="Other" />
                </datalist>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contact Number</label>
                <input
                  type="text"
                  value={profile.contactNumber}
                  onChange={(e) => handleTextChange('contactNumber', e.target.value)}
                  className="w-full glass-input rounded-xl py-3 px-4 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                  placeholder="e.g. +1 555-0123"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">WhatsApp</label>
                <input
                  type="text"
                  value={profile.whatsappNumber}
                  onChange={(e) => handleTextChange('whatsappNumber', e.target.value)}
                  className="w-full glass-input rounded-xl py-3 px-4 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                  placeholder="e.g. +1 555-0123"
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email ID</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleTextChange('email', e.target.value)}
                  className="w-full glass-input rounded-xl py-3 px-4 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Full Address</label>
                <textarea
                  value={profile.address}
                  onChange={(e) => handleTextChange('address', e.target.value)}
                  rows={2}
                  className="w-full glass-input rounded-xl py-3 px-4 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                  placeholder="Street, City, Country"
                />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm p-6 md:p-8 hover:bg-white/50 transition-colors duration-300">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-5 mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-100/50 p-2.5 rounded-xl text-indigo-600"><Briefcase className="w-5 h-5" /></div>
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">Professional Details</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Designation</label>
                <input
                  type="text"
                  value={profile.designation}
                  onChange={(e) => handleTextChange('designation', e.target.value)}
                  className="w-full glass-input rounded-xl py-3 px-4 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                  placeholder="Current Role"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Industry</label>
                <input
                  type="text"
                  list="industry-list"
                  value={profile.industry}
                  onChange={(e) => handleTextChange('industry', e.target.value)}
                  className="w-full glass-input rounded-xl py-3 px-4 text-slate-800 text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                  placeholder="Select or type..."
                />
                <datalist id="industry-list">
                  <option value="IT / Software" />
                  <option value="Healthcare / Medical" />
                  <option value="Finance / Banking" />
                  <option value="Construction / Real Estate" />
                  <option value="Engineering / Manufacturing" />
                  <option value="Retail / E-Commerce" />
                  <option value="Education" />
                  <option value="Other" />
                </datalist>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Exp.</label>
                <input
                  type="text"
                  list="total-exp-list"
                  value={profile.totalExperience}
                  onChange={(e) => handleTextChange('totalExperience', e.target.value)}
                  className="w-full glass-input rounded-xl py-3 px-4 text-slate-800 text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                  placeholder="Years"
                />
                <datalist id="total-exp-list">
                  <option value="0 Years (Fresher)" />
                  <option value="1 Year" />
                  <option value="2 Years" />
                  <option value="3 Years" />
                  <option value="4 Years" />
                  <option value="5 Years" />
                  <option value="6-10 Years" />
                  <option value="10+ Years" />
                </datalist>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Indian Exp.</label>
                <input
                  type="text"
                  list="indian-exp-list"
                  value={profile.indianExperience}
                  onChange={(e) => handleTextChange('indianExperience', e.target.value)}
                  className="w-full glass-input rounded-xl py-3 px-4 text-slate-800 text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                  placeholder="Years"
                />
                <datalist id="indian-exp-list">
                  <option value="0 Years" />
                  <option value="1 Year" />
                  <option value="2 Years" />
                  <option value="3 Years" />
                  <option value="4 Years" />
                  <option value="5 Years" />
                  <option value="6-10 Years" />
                  <option value="10+ Years" />
                </datalist>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Overseas Exp.</label>
                <input
                  type="text"
                  list="overseas-exp-list"
                  value={profile.overseasExperience}
                  onChange={(e) => handleTextChange('overseasExperience', e.target.value)}
                  className="w-full glass-input rounded-xl py-3 px-4 text-slate-800 text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                  placeholder="Years"
                />
                <datalist id="overseas-exp-list">
                  <option value="0 Years" />
                  <option value="1 Year" />
                  <option value="2 Years" />
                  <option value="3 Years" />
                  <option value="4 Years" />
                  <option value="5 Years" />
                  <option value="6-10 Years" />
                  <option value="10+ Years" />
                </datalist>
              </div>

              <div className="space-y-2 md:col-span-3">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Key Skills & Expertise</label>
                <textarea
                  value={profile.keySkills}
                  onChange={(e) => handleTextChange('keySkills', e.target.value)}
                  rows={2}
                  className="w-full glass-input rounded-xl py-3 px-4 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                  placeholder="e.g. React, Node.js, Project Management"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Docs & Submit */}
        <div className="xl:col-span-4 space-y-6 md:space-y-8 flex flex-col">
          
          {/* Passport */}
          <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm p-6 md:p-8 hover:bg-white/50 transition-colors duration-300">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-5 mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-100/50 p-2.5 rounded-xl text-emerald-600"><Globe className="w-5 h-5" /></div>
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">Passport</h2>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Passport Number</label>
                <input
                  type="text"
                  value={profile.passportNumber}
                  onChange={(e) => handleTextChange('passportNumber', e.target.value)}
                  className="w-full glass-input rounded-xl py-3 px-4 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all font-mono"
                  placeholder="e.g. A1234567"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Expiry Date</label>
                <input
                  type="date"
                  value={profile.passportExpiryDate}
                  onChange={(e) => handleTextChange('passportExpiryDate', e.target.value)}
                  className="w-full glass-input rounded-xl py-3 px-4 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                />
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm p-6 md:p-8 flex-grow hover:bg-white/50 transition-colors duration-300">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-5 mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100/50 p-2.5 rounded-xl text-orange-600"><FileText className="w-5 h-5" /></div>
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">Documents</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
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

          {/* Submit Action */}
          <div className="bg-slate-900/5 backdrop-blur-2xl rounded-3xl border border-white/40 p-4 shadow-xl flex flex-col sm:flex-row items-center gap-3 sticky bottom-6 mt-auto">
            {profile.id && (
              <button
                type="button"
                onClick={onPreview}
                className="w-full sm:w-auto px-5 py-4 bg-white/80 text-slate-700 rounded-2xl font-bold text-sm hover:bg-white transition-colors flex items-center justify-center space-x-2 flex-1 shadow-sm"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
            )}
            
            <button
              type="button"
              onClick={handleDirectSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl font-bold text-sm hover:from-blue-500 hover:to-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center space-x-2 disabled:opacity-70 flex-[2]"
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
                <>
                  <Check className="w-4 h-4" />
                  <span>{profile.id ? 'Update Dossier' : 'Submit Dossier'}</span>
                </>
              )}
            </button>
          </div>

        </div>
      </form>

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