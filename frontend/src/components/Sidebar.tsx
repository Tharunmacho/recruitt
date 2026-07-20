import {
  LayoutDashboard,
  FileSpreadsheet,
  User,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Sparkles,
  ShieldAlert,
  Users,
  Network,
  ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

interface SidebarProps {
  onLogout: () => void;
  candidateName: string;
  avatar: string;
  completionPercentage: number;
  isOpen: boolean; // Mobile open state
  setIsOpen: (open: boolean) => void;
  isCollapsed: boolean; // Desktop collapsed state
  setIsCollapsed: (collapsed: boolean) => void;
  onAvatarClick?: () => void;
  onNavClick?: (pageId: string) => void;
}

export default function Sidebar({
  onLogout,
  candidateName,
  avatar,
  completionPercentage,
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed,
  onAvatarClick,
  onNavClick
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const activePage = location.pathname.substring(1) || 'dashboard';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'form', label: 'Candidate Form', icon: FileSpreadsheet },
    { id: 'candidates', label: 'All Candidates', icon: Users },
    { id: 'sourcing', label: 'Sourcing Hub', icon: Network },
    { id: 'orders', label: 'Job Orders', icon: ClipboardList },
  ];

  const handleNavClick = (pageId: string) => {
    if (onNavClick) {
      onNavClick(pageId);
    }
    navigate(`/${pageId}`);
    setIsOpen(false); // Close mobile menu if open
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 shadow-sm">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-200/50 h-20 shrink-0 bg-white/50 backdrop-blur-md">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center glow-blue shrink-0 shadow-lg shadow-blue-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {(!isCollapsed || isOpen) && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-left"
            >
              <h1 className="text-sm font-bold tracking-tight text-slate-900 font-display leading-none">
                NexHire
              </h1>
              <span className="text-[10px] text-blue-600 font-bold tracking-widest uppercase font-mono">
                Internal Portal
              </span>
            </motion.div>
          )}
        </div>

        {/* Collapse Button (Desktop only) */}
        {!isOpen && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* User Quick Card */}
      {(!isCollapsed || isOpen) ? (
        <div className="p-5 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative shrink-0">
              {avatar ? (
                <img
                  src={avatar}
                  alt={candidateName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
                  referrerPolicy="no-referrer"
                  onClick={onAvatarClick}
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={onAvatarClick}
                >
                  {candidateName ? candidateName.charAt(0) : 'C'}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center" />
            </div>
            <div className="text-left overflow-hidden">
              <h2 className="text-xs font-semibold text-slate-800 truncate leading-tight">
                {candidateName || 'Candidate User'}
              </h2>
              <span className="text-[10px] text-slate-400">Candidate Account</span>
            </div>
          </div>

          {/* Mini progress */}
          <div className="mt-4">
            <div className="flex justify-between items-center text-[10px] mb-1 font-mono text-slate-500">
              <span>Profile Progress</span>
              <span className="font-semibold text-blue-600">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="py-4 flex flex-col items-center border-b border-slate-200 shrink-0 bg-slate-50">
          <div className="relative">
            {avatar ? (
              <img
                src={avatar}
                alt={candidateName}
                className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">
                {candidateName ? candidateName.charAt(0) : 'C'}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto bg-white">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 cursor-pointer ${isActive
                  ? 'bg-blue-50 text-blue-600 border border-blue-100 font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                {(!isCollapsed || isOpen) && (
                  <span className="text-sm tracking-wide">{item.label}</span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Logout button at bottom */}
      <div className="p-4 border-t border-slate-200 shrink-0 bg-white">
        <button
          onClick={onLogout}
          className={`w-full flex items-center px-3.5 py-3 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 cursor-pointer ${isCollapsed && !isOpen ? 'justify-center' : 'justify-start space-x-3'
            }`}
        >
          <LogOut className="w-[18px] h-[18px] text-slate-400 group-hover:text-rose-500" />
          {(!isCollapsed || isOpen) && (
            <span className="text-sm tracking-wide font-medium">Log out</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block shrink-0 sticky top-0 h-screen transition-all duration-300 z-30 ${isCollapsed ? 'w-20' : 'w-80'
          }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Absolute overlay) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-slate-950 z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 bottom-0 left-0 w-80 z-50 h-screen"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
