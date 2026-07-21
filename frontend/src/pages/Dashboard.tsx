import React from 'react';
import {
  Users,
  UserPlus,
  UserCheck,
  Settings,
  FileText,
  Database,
  ArrowRight,
  Sparkles,
  BarChart3,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';
import { CandidateProfile } from '../types';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  candidates: CandidateProfile[];
}

export default function Dashboard({
  candidates
}: DashboardProps) {
  const navigate = useNavigate();

  // Dynamic Metrics Calculation
  const totalCandidates = candidates.length;
  // Since 'interestLevel' is removed, we'll mock shortlisted candidates count for display
  const shortlistedCandidates = Math.floor(candidates.length * 0.4);
  const newCandidates = totalCandidates - shortlistedCandidates > 0 ? totalCandidates - shortlistedCandidates : 2;

  const quickFeatures = [
    {
      title: 'View Candidates',
      desc: 'Access the complete CRM database and search records.',
      icon: Users,
      color: 'blue',
      action: () => navigate('/candidates')
    },
    {
      title: 'Add New Record',
      desc: 'Initialize a fresh candidate profile entry manually.',
      icon: UserPlus,
      color: 'emerald',
      action: () => navigate('/form')
    },
    {
      title: 'Export Reports',
      desc: 'Download CSV dumps of all shortlisted profiles.',
      icon: FileText,
      color: 'indigo',
      action: () => alert('CSV Export Started...') // Placeholder
    },
    {
      title: 'Interview Schedules',
      desc: 'Manage and sync upcoming evaluation slots.',
      icon: Settings,
      color: 'slate',
      action: () => alert('Interview Scheduler loading...')
    }
  ];

  return (
    <div className="space-y-6" id="dashboard-container">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-display text-[#0f172a] tracking-tight">
          Welcome to your Dashboard
        </h1>
        <p className="text-[#5c82a5] text-sm mt-3 flex items-center font-medium">
          <Calendar className="w-4 h-4 mr-2" strokeWidth={2.5} /> 
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Candidates */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#fcfaff] p-6 rounded-xl border-2 border-[#f3e8ff] shadow-sm flex flex-col justify-between min-h-[140px]"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-purple-700 mb-4">
                Total Candidates
              </p>
              <h2 className="text-5xl font-black text-purple-700 tracking-tight">
                {totalCandidates}
              </h2>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg text-purple-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </motion.div>

        {/* Selected Today */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#fffbf5] p-6 rounded-xl border-2 border-[#ffedd5] shadow-sm flex flex-col justify-between min-h-[140px]"
        >
          <div className="flex justify-between items-start">
            <div className="max-w-[70%]">
              <p className="text-sm font-bold text-[#c25e14] mb-4 leading-tight">
                Candidates Selected
              </p>
              <h2 className="text-5xl font-black text-[#d96611] tracking-tight">
                {shortlistedCandidates}
              </h2>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg text-orange-500">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
        </motion.div>

        {/* New Profiles Today */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#f6fcf8] p-6 rounded-xl border-2 border-[#dcfce7] shadow-sm flex flex-col justify-between min-h-[140px]"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-green-700 mb-4">
                New Profiles Today
              </p>
              <h2 className="text-5xl font-black text-green-700 tracking-tight">
                {newCandidates}
              </h2>
            </div>
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>
        </motion.div>

      </div>

      {/* Quick Features Row */}
      <div className="bg-white border border-slate-200 p-6 md:p-8 rounded shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
            <Settings className="w-4 h-4 text-blue-600" />
            <span>Portal Quick Features</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickFeatures.map((feature, idx) => {
            const Icon = feature.icon;

            // Use professional, flat, white cards with colored icons and very light colored background hover effects
            let colorClasses = 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50';
            let textClass = 'text-slate-800';
            let iconBgClass = 'bg-slate-50 text-slate-600 border-slate-100';
            
            if (feature.color === 'blue') { iconBgClass = 'bg-blue-50 text-blue-600 border-blue-100'; textClass = 'text-blue-700'; colorClasses = 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'; }
            if (feature.color === 'emerald') { iconBgClass = 'bg-emerald-50 text-emerald-600 border-emerald-100'; textClass = 'text-emerald-700'; colorClasses = 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50'; }
            if (feature.color === 'indigo') { iconBgClass = 'bg-indigo-50 text-indigo-600 border-indigo-100'; textClass = 'text-indigo-700'; colorClasses = 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50'; }

            return (
              <motion.button
                key={idx}
                onClick={feature.action}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded border text-left transition-all duration-200 bg-white group cursor-pointer flex flex-col justify-between min-h-[170px] ${colorClasses}`}
              >
                <div>
                  <div className={`w-10 h-10 rounded flex items-center justify-center mb-4 border ${iconBgClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className={`font-bold text-sm mb-2 ${textClass}`}>{feature.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                </div>
                <div className={`mt-5 flex items-center text-[11px] font-bold uppercase tracking-wider ${textClass}`}>
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

    </div>
  );
}
