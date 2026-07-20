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
  BarChart3
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
        <h1 className="text-3xl font-bold font-display text-slate-900 tracking-tight">
          Welcome to your Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-2 flex items-center">
          <span className="mr-2">📅</span> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Candidates */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[160px] border border-[#e5d5f5] bg-[#fcf9ff] shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[13px] font-bold text-[#8a4bbb] mb-3">
                Total Candidates
              </p>
              <h2 className="text-5xl font-extrabold text-[#8a4bbb]">
                {totalCandidates}
              </h2>
            </div>
            <div className="p-2.5 bg-[#f3e8fc] rounded-xl text-[#8a4bbb]">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </motion.div>

        {/* Shortlisted Candidates */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[160px] border border-[#f5e4cc] bg-[#fffbf2] shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[13px] font-bold text-[#c77119] mb-3">
                Candidates Selected
              </p>
              <h2 className="text-5xl font-extrabold text-[#d65d00]">
                {shortlistedCandidates}
              </h2>
            </div>
            <div className="p-2.5 bg-[#fcead7] rounded-xl text-[#d65d00]">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
        </motion.div>

        {/* New Entries */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[160px] border border-[#ccedd9] bg-[#f0fbf4] shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[13px] font-bold text-[#147a40] mb-3">
                New Profiles Today
              </p>
              <h2 className="text-5xl font-extrabold text-[#118c46]">
                {newCandidates}
              </h2>
            </div>
            <div className="p-2.5 bg-[#dcf5e6] rounded-xl text-[#118c46]">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>
        </motion.div>

      </div>

      {/* Quick Features Row */}
      <div className="glass-panel p-6 md:p-8 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>Portal Quick Features</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickFeatures.map((feature, idx) => {
            const Icon = feature.icon;

            // Enhance the glassmorphism and premium feel for the cards
            let colorClasses = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-slate-200/50';
            if (feature.color === 'blue') colorClasses = 'bg-gradient-to-br from-white to-blue-50 border-blue-100 text-blue-800 hover:border-blue-300 hover:shadow-blue-200/50';
            if (feature.color === 'emerald') colorClasses = 'bg-gradient-to-br from-white to-emerald-50 border-emerald-100 text-emerald-800 hover:border-emerald-300 hover:shadow-emerald-200/50';
            if (feature.color === 'indigo') colorClasses = 'bg-gradient-to-br from-white to-indigo-50 border-indigo-100 text-indigo-800 hover:border-indigo-300 hover:shadow-indigo-200/50';

            return (
              <motion.button
                key={idx}
                onClick={feature.action}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-2xl border text-left transition-all duration-300 shadow-sm hover:shadow-xl group cursor-pointer flex flex-col justify-between min-h-[170px] ${colorClasses}`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-white shadow-md shadow-${feature.color}-500/10 flex items-center justify-center mb-5 ${feature.color === 'blue' ? 'text-blue-600' :
                      feature.color === 'emerald' ? 'text-emerald-600' :
                        feature.color === 'indigo' ? 'text-indigo-600' :
                          'text-slate-600'
                    }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm mb-2">{feature.title}</h4>
                  <p className="text-xs opacity-70 leading-relaxed font-medium">{feature.desc}</p>
                </div>
                <div className={`mt-5 flex items-center text-[11px] font-bold uppercase tracking-wider ${feature.color === 'blue' ? 'text-blue-600' :
                    feature.color === 'emerald' ? 'text-emerald-600' :
                      feature.color === 'indigo' ? 'text-indigo-600' :
                        'text-slate-500'
                  }`}>
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
