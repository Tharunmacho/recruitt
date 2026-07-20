import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Search, User, Briefcase, DollarSign, Calendar, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';
import { getCandidatesFromDb, getOrdersFromDb, getClientsFromDb, updateOrderInDb, deleteOrderFromDb, saveShortlistedCandidateToDb, getShortlistedCandidatesForOrder } from '../services/db';
import { CandidateProfile, Order, OrderCandidate } from '../types';

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [clientName, setClientName] = useState('');
  
  const [allCandidates, setAllCandidates] = useState<CandidateProfile[]>([]);
  const [orderCandidates, setOrderCandidates] = useState<OrderCandidate[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '', headcount: '', dueDate: '', requiredIndustry: '', requiredDesignation: '', requiredExperience: '', requiredSkillset: '', expectedSalary: '', remarks: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orders, clients, candidates, shortlisted] = await Promise.all([
          getOrdersFromDb(),
          getClientsFromDb(),
          getCandidatesFromDb(),
          id ? getShortlistedCandidatesForOrder(id) : Promise.resolve([])
        ]);
        
        const foundOrder = orders.find(o => o.id === id);
        if (foundOrder) {
          let status = foundOrder.status;
          // Check for Expired status if still Open and past due date
          if (status === 'Open' && new Date(foundOrder.dueDate) < new Date(new Date().setHours(0,0,0,0))) {
            status = 'Expired';
          }
          
          setOrder({ ...foundOrder, status });
          const client = clients.find(c => c.id === foundOrder.clientId);
          if (client) setClientName(client.name);
        }
        
        setAllCandidates(candidates as CandidateProfile[]);
        setOrderCandidates(shortlisted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  if (!order) return <div className="p-8 text-center text-slate-500 font-medium">Loading Order Details...</div>;

  // Advanced Multi-Field Matching Engine
  const matchedCandidates = allCandidates.map(c => {
    let score = 0;
    const matchData = { skill: false, industry: false, designation: false, experience: false };

    // Skill Match
    const skills = (c.keySkills || '').toLowerCase();
    const reqSkills = (order.requiredSkillset || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
    if (reqSkills.length > 0 && reqSkills.some(req => skills.includes(req))) {
      matchData.skill = true;
      score++;
    }

    // Industry Match
    const ind = (c.industry || '').toLowerCase();
    const reqInd = (order.requiredIndustry || '').toLowerCase();
    if (reqInd && (ind.includes(reqInd) || reqInd.includes(ind))) {
      matchData.industry = true;
      score++;
    }

    // Designation Match
    const des = (c.designation || '').toLowerCase();
    const reqDes = (order.requiredDesignation || '').toLowerCase();
    if (reqDes && (des.includes(reqDes) || reqDes.includes(des))) {
      matchData.designation = true;
      score++;
    }

    // Experience Match
    const exp = parseInt(c.totalExperience || '0');
    const reqExp = parseInt(order.requiredExperience || '0');
    if (reqExp > 0 && exp >= reqExp) {
      matchData.experience = true;
      score++;
    }

    return { candidate: c, matchData, score };
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score);

  const selectedCount = orderCandidates.filter(c => c.status === 'Selected').length;
  const progressPercentage = Math.min(100, Math.round((selectedCount / order.headcount) * 100));

  const handleAction = async (candidateId: string, action: 'Selected' | 'Rejected') => {
    try {
      if (!order) return;
      const savedRecord = await saveShortlistedCandidateToDb(order.id, candidateId, action);
      
      setOrderCandidates(prev => {
        const existing = prev.find(p => p.candidateId === candidateId);
        if (existing) {
          return prev.map(p => p.candidateId === candidateId ? { ...p, status: action } : p);
        } else {
          return [...prev, savedRecord];
        }
      });
    } catch (e) {
      alert("Failed to save selection to the database.");
    }
  };

  const getCandidateStatus = (candidateId: string) => {
    const oc = orderCandidates.find(c => c.candidateId === candidateId);
    return oc ? oc.status : 'Matched';
  };

  const handleCloseOrder = async () => {
    if (confirm("Are you sure you want to close this order? No more candidates can be selected.")) {
      try {
        await updateOrderInDb(order?.id || '', { status: 'Closed' });
        setOrder(prev => prev ? { ...prev, status: 'Closed' } : null);
      } catch (e) {
        alert("Failed to close the order in the database.");
      }
    }
  };

  const handleReopenOrder = async () => {
    if (confirm("Are you sure you want to reopen this order?")) {
      try {
        await updateOrderInDb(order?.id || '', { status: 'Open' });
        setOrder(prev => prev ? { ...prev, status: 'Open' } : null);
      } catch (e) {
        alert("Failed to reopen the order in the database.");
      }
    }
  };

  const openEditModal = () => {
    if (order) {
      setEditFormData({
        title: order.title,
        headcount: order.headcount.toString(),
        dueDate: order.dueDate,
        requiredIndustry: order.requiredIndustry || '',
        requiredDesignation: order.requiredDesignation || '',
        requiredExperience: order.requiredExperience || '',
        requiredSkillset: order.requiredSkillset || '',
        expectedSalary: order.expectedSalary || '',
        remarks: order.remarks || ''
      });
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!order) return;
    try {
      const updates = {
        title: editFormData.title,
        headcount: parseInt(editFormData.headcount) || 1,
        dueDate: editFormData.dueDate,
        requiredIndustry: editFormData.requiredIndustry,
        requiredDesignation: editFormData.requiredDesignation,
        requiredExperience: editFormData.requiredExperience,
        requiredSkillset: editFormData.requiredSkillset,
        expectedSalary: editFormData.expectedSalary,
        remarks: editFormData.remarks
      };
      await updateOrderInDb(order.id, updates);
      setOrder({ ...order, ...updates });
      setIsEditModalOpen(false);
    } catch (error) {
      alert("Failed to save changes.");
    }
  };

  const handleDeleteOrder = async () => {
    if (confirm("Are you sure you want to PERMANENTLY delete this order? This action cannot be undone.")) {
      try {
        await deleteOrderFromDb(order?.id || '');
        navigate('/orders');
      } catch (e) {
        alert("Failed to delete the order from the database.");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top bar */}
      <button 
        onClick={() => navigate('/orders')}
        className="flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </button>

      {/* Order Header Card */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl relative overflow-hidden glow-blue-lg">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                {order.id}
              </span>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                order.status === 'Open' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                order.status === 'Closed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                'bg-rose-50 text-rose-600 border-rose-100'
              }`}>
                {order.status}
              </span>
              {order.status === 'Open' ? (
                <button 
                  onClick={handleCloseOrder}
                  className="px-3 py-1 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider rounded-md hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
                >
                  Close Order
                </button>
              ) : (
                <button 
                  onClick={handleReopenOrder}
                  className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-md hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
                >
                  Reopen Order
                </button>
              )}
              <button 
                onClick={openEditModal}
                className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md hover:bg-slate-100 hover:text-slate-800 transition-colors shadow-sm cursor-pointer border border-slate-200 flex items-center"
              >
                <Edit2 className="w-3 h-3 mr-1" />
                Edit
              </button>
              <button 
                onClick={handleDeleteOrder}
                className="px-2.5 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-wider rounded-md hover:bg-rose-100 hover:text-rose-700 transition-colors shadow-sm cursor-pointer border border-rose-100 flex items-center"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </button>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 tracking-tight">
              {order.title}
            </h1>
            <p className="text-slate-500 text-sm mt-1 flex items-center">
              <Briefcase className="w-4 h-4 mr-1.5 text-blue-500" />
              {clientName}
            </p>
          </div>
          
          <div className="w-full md:w-64">
            <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-2 font-mono">
              <span>Fulfillment Progress</span>
              <span className="text-blue-600">{selectedCount} / {order.headcount}</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Required Skills</p>
            <p className="text-sm font-semibold text-slate-800 line-clamp-1" title={order.requiredSkillset}>{order.requiredSkillset}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Industry</p>
            <p className="text-sm font-semibold text-slate-800 line-clamp-1" title={order.requiredIndustry}>{order.requiredIndustry || 'Any'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Designation</p>
            <p className="text-sm font-semibold text-slate-800 line-clamp-1" title={order.requiredDesignation}>{order.requiredDesignation || 'Any'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Min. Exp.</p>
            <p className="text-sm font-semibold text-slate-800">{order.requiredExperience ? `${order.requiredExperience} yrs` : 'Any'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Expected Salary</p>
            <p className="text-sm font-semibold text-slate-800 flex items-center">
              <DollarSign className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {order.expectedSalary}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Due Date</p>
            <p className="text-sm font-semibold text-rose-600 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {new Date(order.dueDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Remarks</p>
            <p className="text-sm font-semibold text-slate-600 line-clamp-1" title={order.remarks}>{order.remarks || 'None'}</p>
          </div>
        </div>
      </div>

      {/* Candidate Matching Engine */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 font-display flex items-center">
            <Search className="w-5 h-5 mr-2 text-blue-500" />
            Candidate Matching Engine
          </h2>
          <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
            {matchedCandidates.length} potential matches found
          </span>
        </div>

        <div className="space-y-4">
          {matchedCandidates.length > 0 ? (
            matchedCandidates.map(({ candidate, matchData, score }) => {
              const status = getCandidateStatus(candidate.id || '');
              return (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-panel p-4 md:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-blue-300 transition-colors relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-500 opacity-50" />
                  <div className="flex items-center space-x-4 flex-1 overflow-hidden ml-2">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-100 shrink-0">
                      {candidate.candidateName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-slate-800 truncate">{candidate.candidateName}</h3>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{score} matches</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {candidate.designation || 'No Role'} • {candidate.highestQualification} • {candidate.totalExperience || '0'} exp
                      </p>
                      
                      {/* Match Tags */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {matchData.skill && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-blue-100">✓ Skills</span>}
                        {matchData.industry && <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-indigo-100">✓ Industry</span>}
                        {matchData.designation && <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-purple-100">✓ Role</span>}
                        {matchData.experience && <span className="px-2 py-0.5 bg-cyan-50 text-cyan-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-cyan-100">✓ Exp</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    {status === 'Selected' ? (
                      <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wide">Selected</span>
                      </div>
                    ) : status === 'Rejected' ? (
                      <div className="flex items-center space-x-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
                        <XCircle className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wide">Rejected</span>
                      </div>
                    ) : order.status === 'Open' ? (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleAction(candidate.id || '', 'Rejected')}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleAction(candidate.id || '', 'Selected')}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white gradient-btn flex items-center space-x-1 transition-transform hover:-translate-y-0.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Select
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                        Locked
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 bg-white/50 border border-dashed border-slate-200 rounded-2xl">
              <User className="w-12 h-12 mb-3 text-slate-300" />
              <p>No suitable candidates found in the database for this required skillset.</p>
            </div>
          )}
        </div>
      {/* Edit Order Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-xl premium-modal p-8 rounded-3xl"
          >
            <h3 className="text-2xl font-bold text-slate-900 font-display mb-6">Edit Job Order</h3>
            
            <div className="space-y-5">
              <div>
                <label className="premium-label">Job Title</label>
                <input 
                  type="text" 
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                  className="w-full premium-input py-3 px-4 text-sm font-medium" 
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="premium-label">Headcount</label>
                  <input 
                    type="number" 
                    value={editFormData.headcount}
                    onChange={(e) => setEditFormData({...editFormData, headcount: e.target.value})}
                    className="w-full premium-input py-3 px-4 text-sm font-medium" 
                  />
                </div>
                <div>
                  <label className="premium-label">Due Date</label>
                  <input 
                    type="date" 
                    value={editFormData.dueDate ? editFormData.dueDate.split('T')[0] : ''}
                    onChange={(e) => setEditFormData({...editFormData, dueDate: e.target.value})}
                    className="w-full premium-input py-3 px-4 text-sm font-medium" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="premium-label">Required Industry</label>
                  <input 
                    type="text" 
                    value={editFormData.requiredIndustry}
                    onChange={(e) => setEditFormData({...editFormData, requiredIndustry: e.target.value})}
                    className="w-full premium-input py-3 px-4 text-sm font-medium" 
                  />
                </div>
                <div>
                  <label className="premium-label">Required Designation</label>
                  <input 
                    type="text" 
                    value={editFormData.requiredDesignation}
                    onChange={(e) => setEditFormData({...editFormData, requiredDesignation: e.target.value})}
                    className="w-full premium-input py-3 px-4 text-sm font-medium" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="premium-label">Min. Experience (Years)</label>
                  <input 
                    type="number" 
                    value={editFormData.requiredExperience}
                    onChange={(e) => setEditFormData({...editFormData, requiredExperience: e.target.value})}
                    className="w-full premium-input py-3 px-4 text-sm font-medium" 
                  />
                </div>
                <div>
                  <label className="premium-label">Expected Salary</label>
                  <input 
                    type="text" 
                    value={editFormData.expectedSalary}
                    onChange={(e) => setEditFormData({...editFormData, expectedSalary: e.target.value})}
                    className="w-full premium-input py-3 px-4 text-sm font-medium" 
                  />
                </div>
              </div>
              <div>
                <label className="premium-label">Required Skills</label>
                <input 
                  type="text" 
                  value={editFormData.requiredSkillset}
                  onChange={(e) => setEditFormData({...editFormData, requiredSkillset: e.target.value})}
                  className="w-full premium-input py-3 px-4 text-sm font-medium" 
                />
              </div>
              <div>
                <label className="premium-label">Remarks</label>
                <textarea 
                  value={editFormData.remarks}
                  onChange={(e) => setEditFormData({...editFormData, remarks: e.target.value})}
                  className="w-full premium-input py-3 px-4 text-sm font-medium h-24 resize-none" 
                ></textarea>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-6 py-2.5 gradient-btn text-white text-sm font-bold rounded-xl cursor-pointer shadow-lg shadow-blue-500/30 flex items-center"
              >
                Update
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </div>
    </div>
  );
}
