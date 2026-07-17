import React, { useState, useEffect } from 'react';
import { X, Activity, Clock, User, FileText, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getCandidateLogs } from '../services/db';
import { SystemLog } from '../types';

interface CandidateLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  candidateName: string;
}

export default function CandidateLogsModal({ isOpen, onClose, candidateId, candidateName }: CandidateLogsModalProps) {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && candidateId) {
      const fetchLogs = async () => {
        setIsLoading(true);
        try {
          const data = await getCandidateLogs(candidateId);
          setLogs(data);
        } catch (error) {
          console.error("Failed to load logs", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchLogs();
    }
  }, [isOpen, candidateId]);

  if (!isOpen) return null;

  const getCategoryColor = (category: SystemLog['category']) => {
    switch (category) {
      case 'CREATE': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'UPDATE': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'DELETE': return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'SYSTEM': return 'bg-purple-50 text-purple-600 border-purple-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getCategoryIcon = (category: SystemLog['category']) => {
    switch (category) {
      case 'CREATE': return <FileText className="w-3.5 h-3.5 mr-1" />;
      case 'SYSTEM': return <ShieldCheck className="w-3.5 h-3.5 mr-1" />;
      default: return <Activity className="w-3.5 h-3.5 mr-1" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Activity Logs
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                History for <span className="font-semibold text-slate-700">{candidateName}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 overflow-y-auto flex-1 bg-slate-50">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-sm text-slate-500 font-medium animate-pulse">Loading history...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm">
                  <Activity className="w-6 h-6 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-700">No History Found</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    There are no recorded events for this candidate yet.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {logs.map((log) => (
                  <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 bg-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                      {log.category === 'CREATE' ? (
                        <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full" />
                      ) : (
                        <div className="w-3.5 h-3.5 bg-blue-500 rounded-full" />
                      )}
                    </div>
                    
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-2xl shadow-sm border border-slate-100 group-hover:border-blue-100 group-hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold tracking-wide border uppercase ${getCategoryColor(log.category)}`}>
                          {log.action}
                        </div>
                        <div className="flex items-center text-[10px] font-mono text-slate-400">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(log.timestamp).toLocaleTimeString('en-IN', {
                            timeZone: 'Asia/Kolkata', 
                            hour: '2-digit', 
                            minute:'2-digit',
                            hour12: true
                          })}
                        </div>
                      </div>
                      
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {log.details}
                      </p>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center text-[10px] font-medium text-slate-500">
                          <User className="w-3 h-3 mr-1" />
                          {log.userEmail}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(log.timestamp).toLocaleDateString('en-IN', {
                            timeZone: 'Asia/Kolkata',
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })} (IST)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
