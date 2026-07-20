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
        <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
          HR Command Center
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          High-level overview of recruitment pipeline and portal metrics.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Candidates */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[150px] border-l-4 border-l-cyan-500 hover:shadow-cyan-500/20 shadow-lg cursor-default"
        >
          <div className="absolute top-[-50%] right-[-10%] w-[150px] h-[150px] bg-cyan-400/10 rounded-full blur-[40px] pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 tracking-wider uppercase font-mono mb-2">
                Total Candidates
              </p>
              <h2 className="text-4xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">
                {totalCandidates}
              </h2>
            </div>
            <div className="p-3.5 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl text-cyan-600 shadow-sm border border-cyan-100/50">
              <Database className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-5 flex items-center font-medium relative z-10">
            <span className="text-emerald-500 font-bold mr-1.5 px-2 py-0.5 bg-emerald-50 rounded-md">+12%</span> vs last month
          </p>
        </motion.div>

        {/* Shortlisted Candidates */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[150px] border-l-4 border-l-violet-500 hover:shadow-violet-500/20 shadow-lg cursor-default"
        >
          <div className="absolute top-[-50%] right-[-10%] w-[150px] h-[150px] bg-violet-400/10 rounded-full blur-[40px] pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 tracking-wider uppercase font-mono mb-2">
                Shortlisted
              </p>
              <h2 className="text-4xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">
                {shortlistedCandidates}
              </h2>
            </div>
            <div className="p-3.5 bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl text-violet-600 shadow-sm border border-violet-100/50">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-5 flex items-center font-medium relative z-10">
            High intent conversions ready for HR
          </p>
        </motion.div>

        {/* New Entries */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[150px] border-l-4 border-l-rose-500 hover:shadow-rose-500/20 shadow-lg cursor-default"
        >
          <div className="absolute top-[-50%] right-[-10%] w-[150px] h-[150px] bg-rose-400/10 rounded-full blur-[40px] pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 tracking-wider uppercase font-mono mb-2">
                New Entries
              </p>
              <h2 className="text-4xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">
                {newCandidates}
              </h2>
            </div>
            <div className="p-3.5 bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl text-rose-600 shadow-sm border border-rose-100/50">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-5 flex items-center font-medium relative z-10">
            Awaiting screening and telecalling
          </p>
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
