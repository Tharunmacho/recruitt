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
          <div className="w-8 h-8 flex items-center justify-center shrink-0 text-[#0047ba]">
            <Sparkles className="w-8 h-8" />
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
              <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase font-mono">
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

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto bg-white">
        {(!isCollapsed || isOpen) && (
          <div className="px-3 mb-4 mt-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            Navigation
          </div>
        )}
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group ${isActive
                ? 'bg-[#0047ba] text-white font-bold shadow-md shadow-[#0047ba]/20'
                : 'text-slate-600 hover:text-[#0047ba] hover:bg-[#f0f7ff] font-semibold'
                }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#0047ba]'}`} />
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
          className={`w-full flex items-center px-4 py-3 rounded-xl text-slate-600 font-semibold hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 cursor-pointer group ${isCollapsed && !isOpen ? 'justify-center' : 'justify-start space-x-3'
            }`}
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
          {(!isCollapsed || isOpen) && (
            <span className="text-sm tracking-wide">Log out</span>
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
