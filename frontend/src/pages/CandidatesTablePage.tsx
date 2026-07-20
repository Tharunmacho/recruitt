import React, { useState } from 'react';
import { 
  MoreVertical, 
  Search, 
  Filter, 
  Download,
  Edit2,
  Eye,
  History,
  Trash2,
  ArrowLeft
} from 'lucide-react';
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

  const filteredCandidates = candidates.filter(c => {
    const name = c.candidateName?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return name.includes(query) || c.contactNumber?.includes(query);
  });

  const handleExportCSV = () => {
    if (filteredCandidates.length === 0) return;
    
    const headers = ['Name', 'Entry Date', 'DOB', 'Highest Qualification', 'Designation', 'Industry', 'Total Experience', 'Contact Number', 'Email'];
    const csvRows = [headers.join(',')];
    
    for (const c of filteredCandidates) {
      const values = [
        `"${c.candidateName || ''}"`,
        `"${c.entryDate || ''}"`,
        `"${c.dateOfBirth || ''}"`,
        `"${c.highestQualification || ''}"`,
        `"${c.designation || ''}"`,
        `"${c.industry || ''}"`,
        `"${c.totalExperience || ''}"`,
        `"${c.contactNumber || ''}"`,
        `"${c.email || ''}"`
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.history.back()}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors bg-white shrink-0 cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
              All Candidates
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Manage, evaluate, and track candidate progress across the pipeline.
            </p>
          </div>
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

      <div className="bg-white border border-[#cce4ff] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#f0f7ff] text-[#0047ba] border-b border-[#cce4ff] text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-4 text-center">Name</th>
                <th className="px-4 py-4 text-center">Designation</th>
                <th className="px-4 py-4 text-center">Industry</th>
                <th className="px-4 py-4 text-center">Experience</th>
                <th className="px-4 py-4 text-center">Contact</th>
                <th className="px-4 py-4 text-center">Passport No.</th>
                <th className="px-4 py-4 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.map((candidate, idx) => (
                <tr key={candidate.id || idx} className="group bg-white border-b border-[#e5f0ff] last:border-0 hover:bg-[#f0f7ff] transition-all duration-300 relative hover:z-10 hover:shadow-xl hover:shadow-[#cce4ff]">
                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-[#0047ba] capitalize">{candidate.candidateName || 'N/A'}</span>
                      <span className="text-slate-500 text-xs">{candidate.dateOfBirth || '-'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-slate-700 font-medium">
                    {candidate.designation || 'N/A'}
                  </td>
                  <td className="px-4 py-4 text-center text-slate-700 font-medium">
                    {candidate.industry || 'N/A'}
                  </td>
                  <td className="px-4 py-4 text-center text-slate-700 font-medium">
                    {candidate.totalExperience || 'N/A'}
                  </td>
                  <td className="px-4 py-4 text-center font-bold text-slate-700">
                    {candidate.contactNumber || 'N/A'}
                  </td>
                  <td className="px-4 py-4 text-center text-slate-700">
                    {candidate.passportNumber || 'N/A'}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => setSelectedLogsCandidate({ id: candidate.id!, name: candidate.candidateName })}
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
              ))}
              {filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    No candidates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {activeMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setActiveMenu(null)}
        />
      )}

      <CandidateLogsModal
        isOpen={!!selectedLogsCandidate}
        onClose={() => setSelectedLogsCandidate(null)}
        candidateId={selectedLogsCandidate?.id || ''}
        candidateName={selectedLogsCandidate?.name || ''}
      />
    </div>
  );
}
