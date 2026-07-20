import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ClipboardList, Plus, Search, Calendar, DollarSign, Users, Briefcase, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Order, Client } from '../types';
import { saveOrderToDb, getOrdersFromDb, getClientsFromDb } from '../services/db';

export default function OrdersListPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [fetchedOrders, fetchedClients] = await Promise.all([
        getOrdersFromDb(),
        getClientsFromDb()
      ]);
      setOrders(fetchedOrders as Order[]);
      setClients(fetchedClients as Client[]);
      setIsLoading(false);
    };
    fetchData();
  }, []);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    headcount: '',
    dueDate: '',
    requiredIndustry: '',
    requiredDesignation: '',
    requiredExperience: '',
    requiredSkillset: '',
    expectedSalary: '',
    remarks: ''
  });

  const handleCreateOrder = async () => {
    if (!formData.clientId || !formData.title || !formData.headcount) {
      alert("Please fill in the required fields (Client, Title, Headcount).");
      return;
    }

    setIsSaving(true);
    try {
      const savedOrder = await saveOrderToDb({
        clientId: formData.clientId,
        title: formData.title,
        headcount: parseInt(formData.headcount) || 1,
        requiredIndustry: formData.requiredIndustry,
        requiredDesignation: formData.requiredDesignation,
        requiredExperience: formData.requiredExperience,
        expectedSalary: formData.expectedSalary || 'Negotiable',
        requiredSkillset: formData.requiredSkillset,
        dueDate: formData.dueDate || new Date().toISOString(),
        remarks: formData.remarks
      });

      setOrders([savedOrder, ...orders]);
      setIsModalOpen(false);
      setFormData({ clientId: '', title: '', headcount: '', dueDate: '', requiredIndustry: '', requiredDesignation: '', requiredExperience: '', requiredSkillset: '', expectedSalary: '', remarks: '' });
    } catch (error) {
      alert("Error saving order");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredOrders = orders.filter(
    (o) => o.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           o.requiredSkillset.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getClientName = (clientId: string) => {
    return clients.find(c => c.id === clientId)?.name || 'Unknown Client';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            Job Orders
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Manage open requisitions and client demands
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Order</span>
        </button>
      </div>

      {/* Search */}
      <div className="glass-panel p-2 rounded-2xl flex items-center">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by job title or required skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:outline-none text-slate-700 text-sm"
          />
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p>Loading orders from database...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="glass-panel p-6 rounded-2xl flex flex-col group hover:border-blue-300 transition-all duration-300 hover:shadow-xl cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
                    {order.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                    <span>{getClientName(order.clientId)}</span>
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                  order.status === 'Open' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                  order.status === 'Fulfilled' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  'bg-slate-50 text-slate-600 border-slate-200'
                }`}>
                  {order.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 my-5 py-4 border-y border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Users className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Headcount</p>
                    <p className="text-sm font-semibold text-slate-700">{order.headcount} required</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Expected Salary</p>
                    <p className="text-sm font-semibold text-slate-700">{order.expectedSalary}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4 flex-1">
                <p className="text-xs text-slate-600 line-clamp-2">
                  <span className="font-semibold text-slate-700">Skills required:</span> {order.requiredSkillset}
                </p>
                {order.remarks && (
                  <p className="text-xs text-slate-500 italic line-clamp-1">
                    "{order.remarks}"
                  </p>
                )}
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-50/50 -mx-6 -mb-6 px-6 py-4 rounded-b-2xl border-t border-slate-100">
                <div className="flex items-center text-rose-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  Due: {new Date(order.dueDate).toLocaleDateString()}
                </div>
                <span>ID: {order.id}</span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 bg-white/50 border border-dashed border-slate-200 rounded-2xl">
            <ClipboardList className="w-12 h-12 mb-3 text-slate-300" />
            <p>No job orders found matching your search.</p>
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-xl premium-modal p-8 rounded-3xl"
          >
            <h3 className="text-2xl font-bold text-slate-900 font-display mb-6">Create New Order</h3>
            
            <div className="space-y-5">
              <div>
                <label className="premium-label">Client</label>
                <select 
                  className="w-full premium-input py-3 px-4 text-sm font-medium"
                  value={formData.clientId}
                  onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                >
                  <option value="">Select a client...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="premium-label">Job Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full premium-input py-3 px-4 text-sm font-medium" 
                  placeholder="e.g. Prompt Engineers" 
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="premium-label">Headcount</label>
                  <input 
                    type="number" 
                    value={formData.headcount}
                    onChange={(e) => setFormData({...formData, headcount: e.target.value})}
                    className="w-full premium-input py-3 px-4 text-sm font-medium" 
                    placeholder="e.g. 5" 
                  />
                </div>
                <div>
                  <label className="premium-label">Due Date</label>
                  <input 
                    type="date" 
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="w-full premium-input py-3 px-4 text-sm font-medium" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="premium-label">Required Industry</label>
                  <input 
                    type="text" 
                    value={formData.requiredIndustry}
                    onChange={(e) => setFormData({...formData, requiredIndustry: e.target.value})}
                    className="w-full premium-input py-3 px-4 text-sm font-medium" 
                    placeholder="e.g. IT, Manufacturing" 
                  />
                </div>
                <div>
                  <label className="premium-label">Required Designation</label>
                  <input 
                    type="text" 
                    value={formData.requiredDesignation}
                    onChange={(e) => setFormData({...formData, requiredDesignation: e.target.value})}
                    className="w-full premium-input py-3 px-4 text-sm font-medium" 
                    placeholder="e.g. Manager, Developer" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="premium-label">Min. Experience (Years)</label>
                  <input 
                    type="number" 
                    value={formData.requiredExperience}
                    onChange={(e) => setFormData({...formData, requiredExperience: e.target.value})}
                    className="w-full premium-input py-3 px-4 text-sm font-medium" 
                    placeholder="e.g. 3" 
                  />
                </div>
                <div>
                  <label className="premium-label">Expected Salary</label>
                  <input 
                    type="text" 
                    value={formData.expectedSalary}
                    onChange={(e) => setFormData({...formData, expectedSalary: e.target.value})}
                    className="w-full premium-input py-3 px-4 text-sm font-medium" 
                    placeholder="e.g. $80,000" 
                  />
                </div>
              </div>
              <div>
                <label className="premium-label">Required Skills</label>
                <input 
                  type="text" 
                  value={formData.requiredSkillset}
                  onChange={(e) => setFormData({...formData, requiredSkillset: e.target.value})}
                  className="w-full premium-input py-3 px-4 text-sm font-medium" 
                  placeholder="e.g. React, Node, AI" 
                />
              </div>
              <div>
                <label className="premium-label">Remarks</label>
                <textarea 
                  value={formData.remarks}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                  className="w-full premium-input py-3 px-4 text-sm font-medium h-24 resize-none" 
                  placeholder="Any additional notes..."
                ></textarea>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateOrder}
                disabled={isSaving}
                className="px-6 py-2.5 gradient-btn text-white text-sm font-bold rounded-xl cursor-pointer shadow-lg shadow-blue-500/30 disabled:opacity-50 flex items-center"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create Order
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
