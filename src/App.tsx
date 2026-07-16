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
import { INITIAL_MOCK_PROFILE, EMPTY_PROFILE } from './mockData';

// Pages and Core Components
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CandidateFormPage from './pages/CandidateFormPage';
import ProfilePreviewPage from './pages/ProfilePreviewPage';

export default function App() {
  // Navigation & UI States
  const [activePage, setActivePage] = useState<string>('dashboard');
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
    return INITIAL_MOCK_PROFILE; // Preload with Alex Mercer's beautiful sample dossier
  });

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

  // Calculate overall profile completion percentage
  const calculateCompletion = (prof: CandidateProfile): number => {
    let score = 0;
    let max = 0;

    // Weight 1: Personal Info (10 keys)
    const personalKeys: (keyof CandidateProfile)[] = [
      'firstName', 'lastName', 'gender', 'dateOfBirth', 'nationality', 
      'email', 'mobileNumber', 'address', 'city', 'country'
    ];
    personalKeys.forEach(k => {
      max += 2.5;
      if (prof[k]) score += 2.5;
    });

    // Weight 2: Professional Info (5 keys)
    const profKeys: (keyof CandidateProfile)[] = [
      'currentDesignation', 'currentCompany', 'totalExperience', 'expectedCTC', 'professionalSummary'
    ];
    profKeys.forEach(k => {
      max += 5;
      if (prof[k]) score += 5;
    });

    // Weight 3: Static Education
    max += 5; if (prof.school10th) score += 5;
    max += 5; if (prof.school12th) score += 5;
    max += 5; if (prof.educationList && prof.educationList.length > 0) score += 5;

    // Weight 4: Technical Skills
    max += 10; if (prof.programmingLanguages) score += 10;
    max += 5; if (prof.frameworks) score += 5;

    // Weight 5: Documents
    max += 10; if (prof.resume) score += 10;
    max += 5; if (prof.passportPhoto) score += 5;
    max += 5; if (prof.aadhaarCard) score += 5;

    // Weight 6: Additional Info
    max += 5; if (prof.linkedin || prof.github) score += 5;

    return Math.min(100, Math.round((score / max) * 100));
  };

  const currentCompletionPercentage = calculateCompletion(profile);

  // Sync state to local storage on any changes
  useEffect(() => {
    localStorage.setItem('nexhire_candidate_profile', JSON.stringify(profile));
  }, [profile]);

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
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    setUser(prev => ({ ...prev, isLoggedIn: false }));
    showToast('Secure session terminated.');
    setActivePage('dashboard');
  };

  const handleSaveDraft = () => {
    localStorage.setItem('nexhire_candidate_profile', JSON.stringify(profile));
    showToast('Draft backing synchronized successfully.');
  };

  const handlePreviewNavigation = () => {
    localStorage.setItem('nexhire_candidate_profile', JSON.stringify(profile));
    setActivePage('preview');
    showToast('Preview Dossier compiled.');
  };

  const handleClearForm = () => {
    if (window.confirm('Are you sure you want to clear all fields? This will delete all current draft entries.')) {
      setProfile(EMPTY_PROFILE);
      setUser(prev => ({
        ...prev,
        profileStatus: 'Draft'
      }));
      showToast('Form cleared successfully.');
    }
  };

  const handleLoadSample = () => {
    setProfile(INITIAL_MOCK_PROFILE);
    setUser(prev => ({
      ...prev,
      profileStatus: 'Draft'
    }));
    showToast('Loaded mock dossier data for Senior Engineer Alex Mercer.');
  };

  const setProfileStatus = (status: 'Draft' | 'Submitted') => {
    setUser(prev => ({ ...prev, profileStatus: status }));
  };

  const setApplicationStatus = (status: ApplicationStatus) => {
    setUser(prev => ({ ...prev, applicationStatus: status }));
  };

  // Mark all notifications as read
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications cleared.');
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
            activePage={activePage}
            setActivePage={setActivePage}
            onLogout={handleLogout}
            candidateName={profile.firstName ? `${profile.firstName} ${profile.lastName}` : 'Candidate User'}
            avatar={profile.profilePhoto}
            completionPercentage={currentCompletionPercentage}
            isOpen={isMobileSidebarOpen}
            setIsOpen={setIsMobileSidebarOpen}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            unreadNotificationsCount={unreadNotificationsCount}
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
                    Workspace / {activePage.replace('-', ' ')}
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
                
                {/* Mini notification icon */}
                <button
                  onClick={() => setActivePage('notifications')}
                  className="relative p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Notifications Log"
                >
                  <Bell className="w-[18px] h-[18px]" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                  )}
                </button>
              </div>
            </header>

            {/* Inner Content Scroller */}
            <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 print:p-0">
              
              {/* Conditional Routing Pages */}
              {activePage === 'dashboard' && (
                <Dashboard
                  candidateName={profile.firstName}
                  profile={profile}
                  profileStatus={user.profileStatus}
                  applicationStatus={user.applicationStatus}
                  completionPercentage={currentCompletionPercentage}
                  setActivePage={setActivePage}
                  onClearForm={handleClearForm}
                  onLoadSample={handleLoadSample}
                />
              )}

              {activePage === 'form' && (
                <CandidateFormPage
                  profile={profile}
                  setProfile={setProfile}
                  onSaveDraft={handleSaveDraft}
                  onPreview={handlePreviewNavigation}
                />
              )}

              {activePage === 'preview' && (
                <ProfilePreviewPage
                  profile={profile}
                  profileStatus={user.profileStatus}
                  applicationStatus={user.applicationStatus}
                  setProfileStatus={setProfileStatus}
                  setApplicationStatus={setApplicationStatus}
                  completionPercentage={currentCompletionPercentage}
                  setActivePage={setActivePage}
                />
              )}

              {activePage === 'notifications' && (
                <div className="space-y-6 text-left" id="notifications-page">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">Security Notifications Log</h1>
                      <p className="text-slate-500 text-xs mt-1">Audit log of system synchronizations and recruitment process triggers.</p>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={handleMarkAllNotificationsRead}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-slate-100">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-5 flex space-x-4 transition-colors duration-200 ${
                          notif.read ? 'bg-slate-50/20' : 'bg-blue-50/30'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl shrink-0 ${
                          notif.read ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'
                        }`}>
                          <Bell className="w-5 h-5" />
                        </div>
                        <div className="space-y-1 overflow-hidden flex-1">
                          <div className="flex justify-between items-baseline">
                            <h4 className="text-sm font-bold text-slate-800">{notif.title}</h4>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">{notif.date}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePage === 'settings' && (
                <div className="space-y-6 text-left" id="settings-page">
                  <div>
                    <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">Portal Configuration</h1>
                    <p className="text-slate-500 text-xs mt-1">Configure secure local keys, biometrics simulation, and candidate notifications.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* General Settings */}
                    <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-6">
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">Dossier Account Settings</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-slate-800">Email System Alerts</h4>
                            <p className="text-[10px] text-slate-500">Send immediate HR interview milestones to candidate email.</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.notificationsEnabled}
                            onChange={(e) => setSettings(prev => ({ ...prev, notificationsEnabled: e.target.checked }))}
                            className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-slate-800">Evaluation SMS Ping Alerts</h4>
                            <p className="text-[10px] text-slate-500">Enable real-time SMS evaluations if candidate matches HR scorecard.</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.evaluationSMSAlerts}
                            onChange={(e) => setSettings(prev => ({ ...prev, evaluationSMSAlerts: e.target.checked }))}
                            className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-slate-800">Simulate Biometric Dossier Verification</h4>
                            <p className="text-[10px] text-slate-500">Require face mapping checks during evaluation lock engagement.</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.biometricsSimulation}
                            onChange={(e) => setSettings(prev => ({ ...prev, biometricsSimulation: e.target.checked }))}
                            className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={() => showToast('Configurations successfully verified.')}
                          className="gradient-btn py-2 px-5 rounded-xl text-white text-xs font-semibold cursor-pointer"
                        >
                          Save Configurations
                        </button>
                      </div>
                    </div>

                    {/* Developer Sandbox side details */}
                    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">Dossier Keys & Token</h3>
                        
                        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                          <span className="text-[9px] text-slate-500 font-mono uppercase block">Active Encryption Core:</span>
                          <span className="text-[11px] font-mono text-slate-700 font-bold block truncate">AES_256_GCM_NEXHIRE_LOCK</span>
                        </div>

                        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                          <span className="text-[9px] text-slate-500 font-mono uppercase block">Authorized Portal Client:</span>
                          <span className="text-[11px] font-mono text-slate-700 font-bold block truncate">demo@company.com</span>
                        </div>
                      </div>

                      <div className="pt-4 mt-6 border-t border-slate-900">
                        <button
                          onClick={() => {
                            if (window.confirm('Erase all portal keys and reset to initial template?')) {
                              localStorage.removeItem('nexhire_candidate_profile');
                              localStorage.removeItem('nexhire_user');
                              window.location.reload();
                            }
                          }}
                          className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-400 hover:text-rose-300 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Erase Cache & Reload</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </main>
          </div>
        </div>
      )}
    </div>
  );
}
