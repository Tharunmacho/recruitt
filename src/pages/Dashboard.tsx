import { 
  Sparkles, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileCheck, 
  User, 
  Bell, 
  ArrowRight, 
  FileText, 
  Smartphone,
  MapPin,
  Briefcase,
  History,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { CandidateProfile, ApplicationStatus } from '../types';

interface DashboardProps {
  candidateName: string;
  profile: CandidateProfile;
  profileStatus: 'Draft' | 'Submitted';
  applicationStatus: ApplicationStatus;
  completionPercentage: number;
  setActivePage: (page: string) => void;
  onClearForm: () => void;
  onLoadSample: () => void;
}

export default function Dashboard({
  candidateName,
  profile,
  profileStatus,
  applicationStatus,
  completionPercentage,
  setActivePage,
  onClearForm,
  onLoadSample
}: DashboardProps) {

  // Generate dynamic stats
  const hasResume = !!profile.resume;
  const projectCount = profile.projects.length;
  const experienceCount = profile.workExperience.length;
  const certificationCount = profile.certifications.length;

  // Checklist items
  const checklist = [
    { label: 'Personal details completed', done: !!(profile.firstName && profile.email && profile.mobileNumber) },
    { label: 'Professional Summary added', done: !!profile.professionalSummary },
    { label: 'Education details specified', done: !!(profile.school10th || profile.school12th || profile.educationList.length > 0) },
    { label: 'Technical Skills listed', done: !!profile.programmingLanguages },
    { label: 'Primary Resume uploaded', done: hasResume },
    { label: 'Experience & Projects logged', done: projectCount > 0 || experienceCount > 0 }
  ];

  const recentUpdates = [
    { id: 1, title: 'Evaluation Status Updated', desc: `Your application is currently marked as [${applicationStatus}].`, time: 'Just now', type: 'info' },
    { id: 2, title: 'Document Lock Engaged', desc: hasResume ? `Document '${profile.resume?.name}' has been securely indexed.` : 'No resume uploaded yet. Please upload to complete profile.', time: '2 hours ago', type: hasResume ? 'success' : 'warn' },
    { id: 3, title: 'Credentials Match', desc: 'Secure evaluation portal initialized for demo@company.com.', time: 'Today, 08:30 AM', type: 'success' },
    { id: 4, title: 'Candidate Profile Sync', desc: 'Draft backup has been auto-saved to client local cache.', time: 'Yesterday', type: 'info' }
  ];

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under Review': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Shortlisted': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Interview Scheduled': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Selected': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Top Banner with Welcome Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <div className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden glow-blue flex flex-col justify-between min-h-[220px]">
          {/* Decorative ambient background */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-semibold font-mono">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>HR INTERNAL SYSTEM</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 tracking-tight">
              Welcome, {candidateName || 'Candidate'}!
            </h1>
            
            <p className="text-sm text-slate-600 max-w-lg leading-relaxed">
              Complete your pre-interview onboarding dossier. This information is confidential and will be utilized exclusively by our recruitment and technical evaluation panels.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap gap-3 relative z-10">
            {profileStatus === 'Draft' ? (
              <button
                onClick={() => setActivePage('form')}
                className="gradient-btn py-2.5 px-5 rounded-xl text-white text-xs font-semibold flex items-center space-x-2 cursor-pointer"
              >
                <span>Complete Your Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setActivePage('preview')}
                className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 py-2.5 px-5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer"
              >
                <span>View Submitted Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setActivePage('preview')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              Preview Digital CV
            </button>
          </div>
        </div>

        {/* Evaluation Metrics Card */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase font-mono mb-4">
            Application Tracker
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">File Status:</span>
              <span className={`px-2.5 py-1 text-xs rounded-full border font-mono font-bold uppercase tracking-wider ${
                profileStatus === 'Submitted' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {profileStatus}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">HR Status:</span>
              <span className={`px-2.5 py-1 text-xs rounded-full border font-mono font-semibold ${getStatusColor(applicationStatus)}`}>
                {applicationStatus}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Primary CV:</span>
              <span className={`text-xs font-mono font-bold ${hasResume ? 'text-emerald-600' : 'text-rose-600'}`}>
                {hasResume ? 'Uploaded (PDF)' : 'Missing'}
              </span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 text-left">
            <div className="flex justify-between text-xs mb-1.5 font-mono text-slate-500">
              <span>Overall Completion</span>
              <span className="font-bold text-blue-600">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Checklist & Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Onboarding Checklist */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Onboarding Checklist</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {checklist.filter(c => c.done).length} of {checklist.length} Complete
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {checklist.map((item, index) => (
              <div 
                key={index}
                className={`p-3.5 rounded-xl border flex items-center space-x-3 transition-colors duration-300 ${
                  item.done 
                    ? 'bg-emerald-50/40 border-emerald-200/60 text-slate-700' 
                    : 'bg-slate-50/50 border-slate-200/85 text-slate-500'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                  item.done 
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-600' 
                    : 'border-slate-300 text-slate-400'
                }`}>
                  {item.done ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  )}
                </div>
                <span className="text-xs font-semibold tracking-wide">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Setup tools */}
          <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div className="text-left">
              <h4 className="text-xs font-bold text-slate-800">Testing Sandbox Tools</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Quickly swap or clear data blocks during evaluation.</p>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={onLoadSample}
                className="px-3 py-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-all cursor-pointer"
              >
                Load Alex Mercer Data
              </button>
              <button
                onClick={onClearForm}
                className="px-3 py-1.5 text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-all cursor-pointer"
              >
                Clear/Reset Profile
              </button>
            </div>
          </div>
        </div>

        {/* Live Status & Updates Timeline */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center space-x-2 mb-5">
              <History className="w-4 h-4 text-blue-600" />
              <span>Recent Activity Log</span>
            </h3>

            <div className="space-y-4">
              {recentUpdates.map((update) => (
                <div key={update.id} className="flex space-x-3 text-left">
                  <div className="relative shrink-0 flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                      update.type === 'success' 
                        ? 'bg-emerald-500' 
                        : update.type === 'warn' 
                        ? 'bg-rose-500' 
                        : 'bg-blue-500'
                    }`} />
                    <div className="w-0.5 bg-slate-200 h-full mt-1 absolute top-2.5 bottom-0" />
                  </div>
                  <div className="space-y-0.5 pb-2">
                    <div className="flex items-baseline space-x-2">
                      <h4 className="text-xs font-bold text-slate-800">
                        {update.title}
                      </h4>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {update.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      {update.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActivePage('form')}
              className="w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-700 py-1 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Review Form Inputs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Highlights Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-xs text-slate-400 font-mono font-medium uppercase">Experience Logged</p>
          <p className="text-lg font-bold text-slate-800 mt-1 font-display">{experienceCount} Entries</p>
        </div>
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-xs text-slate-400 font-mono font-medium uppercase">Projects Documented</p>
          <p className="text-lg font-bold text-slate-800 mt-1 font-display">{projectCount} Projects</p>
        </div>
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-xs text-slate-400 font-mono font-medium uppercase">Certifications Verified</p>
          <p className="text-lg font-bold text-slate-800 mt-1 font-display">{certificationCount} Certs</p>
        </div>
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="text-xs text-slate-400 font-mono font-medium uppercase">Evaluation Status</p>
          <p className="text-sm font-bold text-blue-600 mt-2 font-mono uppercase bg-blue-50 px-2.5 py-1 rounded border border-blue-100 inline-block">{applicationStatus}</p>
        </div>
      </div>
    </div>
  );
}
