import {
  LayoutDashboard,
  FileSpreadsheet,
  User,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  Sparkles,
  ShieldAlert,
  Users,
  Network,
  ClipboardList,
  PanelLeft
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
      <div className="flex items-center justify-between p-5 border-b-[3px] border-blue-600 h-16 shrink-0 bg-white">
        <div className="flex items-center overflow-hidden px-1">
          {(!isCollapsed || isOpen) && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-left"
            >
              <h1 className="text-[16px] font-extrabold text-slate-900 tracking-tight font-display">
                Internal Portal
              </h1>
            </motion.div>
          )}
        </div>

        {/* Collapse Button (Desktop only) */}
        {!isOpen && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <PanelLeft strokeWidth={2.5} className="w-5 h-5 transition-transform duration-300 text-slate-600" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto bg-white">
        {(!isCollapsed || isOpen) && (
          <div className="px-3 mb-3 mt-2 text-[15px] font-semibold text-[#4a6b8c]">
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
              className={`w-full flex items-center justify-between pr-3 pl-4 py-3 mb-1 transition-all duration-200 cursor-pointer group ${
                isActive
                  ? 'bg-[#f4f7fb] text-[#003366] font-semibold border-l-[4px] border-[#003366] rounded-r-xl'
                  : 'text-[#003366] hover:bg-[#f4f7fb]/50 font-medium border-l-[4px] border-transparent rounded-r-xl'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-[18px] h-[18px] shrink-0 text-[#003366]" strokeWidth={2} />
                {(!isCollapsed || isOpen) && (
                  <span className="text-[15px] tracking-wide">{item.label}</span>
                )}
              </div>
              {(!isCollapsed || isOpen) && (
                <ChevronRight className="w-4 h-4 text-[#003366]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout button at bottom */}
      <div className="p-3 border-t border-slate-200 shrink-0 bg-white">
        <button
          onClick={onLogout}
          className={`w-full flex items-center px-3 py-3 rounded-xl text-[#003366] font-semibold hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 cursor-pointer group ${isCollapsed && !isOpen ? 'justify-center' : 'justify-start space-x-4'
            }`}
        >
          <LogOut className="w-[18px] h-[18px] text-[#003366] group-hover:text-rose-500 transition-colors" strokeWidth={2} />
          {(!isCollapsed || isOpen) && (
            <span className="text-[15px] tracking-wide">Logout</span>
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
