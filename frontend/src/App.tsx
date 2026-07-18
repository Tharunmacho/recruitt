import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Sparkles, 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Settings, 
  Trash2, 
  FileText, 
  ArrowLeft,
  X,
  Lock,
  Globe,
  Database,
  Mail,
  ShieldCheck,
  UserCheck,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types and Mocks
import { CandidateProfile, ApplicationStatus, UserState } from './types';
import { EMPTY_PROFILE } from './mockData';
import { getCandidatesFromDb, deleteCandidateFromDb } from './services/db';
// Pages and Core Components
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import DocumentViewerModal from './components/DocumentViewerModal';
import Dashboard from './pages/Dashboard';
import CandidateFormPage from './pages/CandidateFormPage';
import ProfilePreviewPage from './pages/ProfilePreviewPage';
import CandidatesTablePage from './pages/CandidatesTablePage';

import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  // Navigation & UI States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication state
  const [user, setUser] = useState<UserState>(() => {
    const saved = localStorage.getItem('nexhire_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      email: '',
      isLoggedIn: false,
      profileStatus: 'Draft',
      applicationStatus: 'Submitted',
      profileCompletionPercentage: 0
    };
  });

  // Candidate Profile State (Defaulting to preloaded mockup on fresh load for evaluator convenience)
  const [profile, setProfile] = useState<CandidateProfile>(() => {
    const saved = localStorage.getItem('nexhire_candidate_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return EMPTY_PROFILE; 
  });

  const [savedProfile, setSavedProfile] = useState<CandidateProfile>(profile);
  const [sidebarViewerDoc, setSidebarViewerDoc] = useState<{url: string, filename: string} | null>(null);

  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(true);

  // Fetch real candidates from Firebase on load
  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoadingCandidates(true);
      try {
        const data = await getCandidatesFromDb();
        setCandidates(data);
      } catch (error) {
        console.error("Failed to load candidates:", error);
      } finally {
        setIsLoadingCandidates(false);
      }
    };
    fetchCandidates();
  }, [location.pathname]); // Refresh when navigating back to dashboard/table

  // Edit / View logic
  const handleEditCandidate = (candidate: CandidateProfile) => {
    setProfile(candidate);
    setSavedProfile(candidate);
    navigate('/form');
  };

  const handleViewCandidate = (candidate: CandidateProfile) => {
    setProfile(candidate);
    setSavedProfile(candidate);
    navigate('/preview');
  };

  const handleDeleteCandidate = async (candidateId: string) => {
    if (window.confirm("Are you sure you want to completely delete this candidate from the database?")) {
      try {
        await deleteCandidateFromDb(candidateId);
        showToast('Candidate deleted successfully.');
        // Refresh candidates
        const data = await getCandidatesFromDb();
        setCandidates(data);
      } catch (error) {
        console.error("Failed to delete candidate:", error);
        showToast('Failed to delete candidate.');
      }
    }
  };

  // Notification State
  const [notifications, setNotifications] = useState(() => {
    return [
      { id: 'notif-1', title: 'HR Evaluation System Initialized', message: 'Evaluation portal linked securely with company recruitment core.', date: 'Jul 15, 2026', read: false },
      { id: 'notif-2', title: 'Primary Resume Verified', message: 'Resume parser has extracted primary technical skill matrices successfully.', date: 'Jul 14, 2026', read: false },
      { id: 'notif-3', title: 'Security Advisory', message: 'Secure login from authorized company dev terminal. Remember to clear cache after testing.', date: 'Jul 12, 2026', read: true }
    ];
  });

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Settings State
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    evaluationSMSAlerts: false,
    biometricsSimulation: true,
    analyticsOptIn: true
  });

  const calculateCompletion = (prof: CandidateProfile): number => {
    let score = 0;
    let max = 0;

    // Weight 1: Personal Info (35%)
    const personalKeys: (keyof CandidateProfile)[] = [
      'candidateName', 'dateOfBirth', 'highestQualification', 
      'contactNumber', 'whatsappNumber', 'email', 'address'
    ];
    personalKeys.forEach(k => {
      max += 5;
      if (prof[k]) score += 5;
    });

    // Weight 2: Professional Info (30%)
    const profKeys: (keyof CandidateProfile)[] = [
      'designation', 'industry', 'totalExperience', 
      'indianExperience', 'overseasExperience', 'keySkills'
    ];
    profKeys.forEach(k => {
      max += 5;
      if (prof[k]) score += 5;
    });

    // Weight 3: Passport Details (10%)
    max += 5; if (prof.passportNumber) score += 5;
    max += 5; if (prof.passportExpiryDate) score += 5;

    // Weight 4: Documents (25%)
    max += 10; if (prof.resume) score += 10;
    max += 5; if (prof.passport) score += 5;
    max += 5; if (prof.educationCertificate) score += 5;
    max += 5; if (prof.expertiseCertificates) score += 5;

    return Math.min(100, Math.round((score / max) * 100));
  };

  const currentCompletionPercentage = calculateCompletion(profile);

  // Removed auto-sync to local storage to ensure explicit save behavior

  useEffect(() => {
    localStorage.setItem('nexhire_user', JSON.stringify(user));
  }, [user]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLoginSuccess = (email: string) => {
    setUser({
      email,
      isLoggedIn: true,
      profileStatus: profile.declaredTrue ? 'Submitted' : 'Draft',
      applicationStatus: profile.declaredTrue ? 'Under Review' : 'Submitted',
      profileCompletionPercentage: currentCompletionPercentage
    });
    showToast('Secure credentials accepted. Welcome back.');
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(prev => ({ ...prev, isLoggedIn: false }));
    showToast('Secure session terminated.');
    navigate('/');
  };

  const handleSaveDraft = () => {
    try {
      localStorage.setItem('nexhire_candidate_profile', JSON.stringify(profile));
      setSavedProfile(profile);
      showToast('Draft backing synchronized successfully.');
    } catch (e) {
      showToast('Failed to save draft. Storage quota exceeded.');
    }
  };

  const handlePreviewNavigation = () => {
    try {
      localStorage.setItem('nexhire_candidate_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('LocalStorage quota exceeded on preview navigation.', e);
    }
    setSavedProfile(profile);
    navigate('/preview');
    showToast('Preview Dossier compiled.');
  };

  const handleClearForm = () => {
    if (window.confirm('Are you sure you want to clear all fields? This will delete all current draft entries.')) {
      setProfile(EMPTY_PROFILE);
      setSavedProfile(EMPTY_PROFILE);
      setUser(prev => ({
        ...prev,
        profileStatus: 'Draft'
      }));
      showToast('Form cleared successfully.');
    }
  };

  const setProfileStatus = (status: 'Draft' | 'Submitted') => {
    setUser(prev => ({ ...prev, profileStatus: status }));
  };

  const setApplicationStatus = (status: ApplicationStatus) => {
    setUser(prev => ({ ...prev, applicationStatus: status }));
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Toast Messages */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl glass-panel border border-blue-100 text-slate-800 shadow-xl flex items-center space-x-2 text-xs font-semibold glow-blue"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!user.isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="flex h-screen overflow-hidden">
          
          {/* Collapsible Sidebar */}
          <Sidebar
            onLogout={handleLogout}
            candidateName={profile.candidateName || 'Candidate User'}
            avatar={(() => {
              let url = profile.profilePhoto && typeof profile.profilePhoto === 'object' 
                ? profile.profilePhoto.url || profile.profilePhoto.base64 || '' 
                : profile.profilePhoto as string || '';
              if (url.startsWith('/api/')) {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4005';
                return `${API_URL}${url}`;
              }
              return url;
            })()}
            completionPercentage={currentCompletionPercentage}
            isOpen={isMobileSidebarOpen}
            setIsOpen={setIsMobileSidebarOpen}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            onAvatarClick={() => {
              // The user doesn't have a profile photo field anymore, so we can ignore this or add a dummy handler
            }}
            onNavClick={(pageId) => {
              if (pageId === 'form') {
                setProfile(EMPTY_PROFILE);
                setSavedProfile(EMPTY_PROFILE);
                localStorage.removeItem('nexhire_candidate_profile');
              }
            }}
          />

          {/* Main Workspace Frame */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-50">
            
            {/* Top Toolbar Navigation Header - Print Hidden */}
            <header className="sticky top-0 z-20 h-20 shrink-0 border-b border-slate-200 bg-white/85 backdrop-blur-xl flex items-center justify-between px-6 print:hidden">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="md:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-all"
                  title="Open Sidebar"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="text-left">
                  <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider font-mono">
                    HR INTERNAL SYSTEM
                  </span>
                  <h2 className="text-xs font-semibold text-slate-500 capitalize">
                    Workspace / {location.pathname === '/' ? 'login' : location.pathname.substring(1).replace('-', ' ')}
                  </h2>
                </div>
              </div>

              {/* Status block top panel */}
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex flex-col items-end text-xs text-right">
                  <span className="text-slate-400 font-mono">Evaluation Dossier Status:</span>
                  <span className={`font-mono font-bold ${user.profileStatus === 'Submitted' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {user.profileStatus === 'Submitted' ? '✓ SUBMITTED TO HR' : '⚠️ INCOMPLETE DRAFT'}
                  </span>
                </div>
                
              </div>
            </header>

            {/* Inner Content Scroller */}
            <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 print:p-0">
              
              {/* Conditional Routing Pages */}
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={
                  <Dashboard
                    candidates={candidates}
                  />
                } />
                <Route path="/form" element={
                  <CandidateFormPage
                    profile={profile}
                    setProfile={setProfile}
                    onSaveDraft={handleSaveDraft}
                    onPreview={handlePreviewNavigation}
                  />
                } />
                <Route path="/preview" element={
                  <ProfilePreviewPage
                    profile={profile}
                    profileStatus={user.profileStatus}
                    applicationStatus={user.applicationStatus}
                    setProfileStatus={setProfileStatus}
                    setApplicationStatus={setApplicationStatus}
                    completionPercentage={currentCompletionPercentage}
                    onSuccessComplete={() => {
                      setProfile(EMPTY_PROFILE);
                      setSavedProfile(EMPTY_PROFILE);
                      localStorage.removeItem('nexhire_candidate_profile');
                    }}
                  />
                } />
                <Route path="/candidates" element={
                  <CandidatesTablePage
                    candidates={candidates}
                    onEdit={handleEditCandidate}
                    onView={handleViewCandidate}
                    onDelete={handleDeleteCandidate}
                  />
                } />
              </Routes>

            </main>
          </div>

          {sidebarViewerDoc && (
            <DocumentViewerModal
              url={sidebarViewerDoc.url}
              filename={sidebarViewerDoc.filename}
              onClose={() => setSidebarViewerDoc(null)}
            />
          )}

        </div>
      )}
    </div>
  );
}
