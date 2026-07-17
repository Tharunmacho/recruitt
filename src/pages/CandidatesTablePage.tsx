import React, { useState } from 'react';
import { 
  MoreVertical, 
  Search, 
  Filter, 
  Download,
  Plus,
  Edit2,
  Eye,
  MessageCircle,
  History,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CandidateProfile } from '../types';
import CandidateLogsModal from '../components/CandidateLogsModal';

interface CandidatesTablePageProps {
  candidates: CandidateProfile[];
  onEdit: (candidate: CandidateProfile) => void;
  onView: (candidate: CandidateProfile) => void;
  onDelete: (candidateId: string) => void;
}

export default function CandidatesTablePage({
  candidates,
  onEdit,
  onView,
  onDelete
}: CandidatesTablePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedLogsCandidate, setSelectedLogsCandidate] = useState<{id: string, name: string} | null>(null);

  // Filter candidates
  const filteredCandidates = candidates.filter(c => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || c.mobileNumber?.includes(query);
  });

  const getInterestColor = (level: string) => {
    switch (level) {
      case 'More Interested': return 'text-emerald-600 font-bold';
      case 'Interested': return 'text-emerald-500 font-bold';
      case 'Somewhat Interested': return 'text-slate-500 font-bold';
      case 'Not Interested': return 'text-red-500 font-bold';
      default: return 'text-slate-600';
    }
  };

  const getSCColor = (sc: string) => {
    switch (sc) {
      case 'Agreed': return 'text-emerald-500 font-bold';
      case 'Need Time': return 'text-slate-500 font-bold';
      default: return 'text-slate-600';
    }
  };

  const handleExportCSV = () => {
    if (filteredCandidates.length === 0) return;
    
    const headers = ['First Name', 'Last Name', 'DOB', 'Mobile Number', 'Job Preference', 'Country Looking For', 'Passport Available', 'Interest Level', 'SC Status', 'HR Assigned', 'Created At'];
    const csvRows = [headers.join(',')];
    
    for (const c of filteredCandidates) {
      const values = [
        `"${c.firstName || ''}"`,
        `"${c.lastName || ''}"`,
        `"${c.dateOfBirth || ''}"`,
        `"${c.mobileNumber || ''}"`,
        `"${c.jobPreference || ''}"`,
        `"${c.countryLookingFor || ''}"`,
        `"${c.passportAvailable || ''}"`,
        `"${c.interestLevel || ''}"`,
        `"${c.serviceChargesStatus || ''}"`,
        `"${c.assignedToHR || ''}"`,
        `"${c.createdAt || ''}"`
      ];
      csvRows.push(values.join(','));
    }
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'candidates_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            All Candidates
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Manage, evaluate, and track candidate progress across the pipeline.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm w-full md:w-64 transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl shadow-sm transition-colors" title="Filter">
            <Filter className="w-4 h-4" />
          </button>
          <button onClick={handleExportCSV} className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl shadow-sm transition-colors" title="Export CSV">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-900 text-slate-50 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-4 text-center">Name / DOB</th>
                <th className="px-4 py-4 text-center">Contact</th>
                <th className="px-4 py-4 text-center">Pass.</th>
                <th className="px-4 py-4 text-center">Job Preferred</th>
                <th className="px-4 py-4 text-center">Preferred Country</th>
                <th className="px-4 py-4 text-center">SC</th>
                <th className="px-4 py-4 text-center">Telecalling User</th>
                <th className="px-4 py-4 text-center">Interest Level</th>
                <th className="px-4 py-4 text-center">WA</th>
                <th className="px-4 py-4 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.map((candidate, idx) => {
                const isMenuOpen = activeMenu === candidate.id;
                
                return (
                  <tr key={candidate.id || idx} className="group bg-white border-b border-slate-100 last:border-0 hover:bg-blue-50/50 transition-all duration-300 relative hover:z-10 hover:shadow-xl hover:shadow-blue-900/10">

                    {/* Name / DOB */}
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-slate-800 capitalize">{candidate.firstName} {candidate.lastName}</span>
                        <span className="text-slate-500">{candidate.dateOfBirth?.split('-').reverse().join('/') || '-'}</span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-4 text-center font-bold text-slate-700">
                      {candidate.mobileNumber}
                    </td>

                    {/* Pass. */}
                    <td className="px-4 py-4 text-center font-semibold text-slate-700">
                      {candidate.passportAvailable || 'No'}
                    </td>

                    {/* Job Preferred */}
                    <td className="px-4 py-4 text-center text-slate-700 font-medium whitespace-nowrap">
                      {candidate.jobPreference || 'N/A'}
                    </td>

                    {/* Preferred Country */}
                    <td className="px-4 py-4 text-center">
                      {candidate.countryLookingFor ? (
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-full text-[11px] font-bold tracking-wider uppercase whitespace-nowrap shadow-md shadow-rose-500/30">
                          {candidate.countryLookingFor}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>

                    {/* SC */}
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <span className={getSCColor(candidate.serviceChargesStatus || '')}>
                        {candidate.serviceChargesStatus || '-'}
                      </span>
                    </td>

                    {/* Telecalling User */}
                    <td className="px-4 py-4 text-center text-slate-700 font-medium">
                      {candidate.assignedToHR || '-'}
                    </td>

                    {/* Interest Level */}
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className={getInterestColor(candidate.interestLevel || '')}>
                          {candidate.interestLevel || '-'}
                        </span>
                      </div>
                    </td>

                    {/* WA (WhatsApp) */}
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center">
                        <MessageCircle className="w-5 h-5 text-emerald-500" />
                      </div>
                    </td>

                    {/* Actions (Edit / View / Logs) */}
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setSelectedLogsCandidate({ id: candidate.id!, name: `${candidate.firstName} ${candidate.lastName}` })}
                          className="p-1.5 text-purple-500 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                          title="View Activity Logs"
                        >
                          <History className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onView(candidate)}
                          className="p-1.5 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(candidate)}
                          className="p-1.5 text-emerald-500 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                          title="Edit Candidate"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(candidate.id!)}
                          className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors ml-1"
                          title="Delete Candidate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-slate-500">
                    No candidates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Click outside to close menus */}
      {activeMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setActiveMenu(null)}
        />
      )}

      {/* Logs Modal */}
      <CandidateLogsModal
        isOpen={!!selectedLogsCandidate}
        onClose={() => setSelectedLogsCandidate(null)}
        candidateId={selectedLogsCandidate?.id || ''}
        candidateName={selectedLogsCandidate?.name || ''}
      />
    </div>
  );
}
