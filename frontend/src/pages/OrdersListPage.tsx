import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ClipboardList, Plus, Search, Calendar, IndianRupee, Users, Briefcase, Loader2, ChevronDown, Building, X, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Order, Client } from '../types';
import { saveOrderToDb, getOrdersFromDb, getClientsFromDb } from '../services/db';
import SearchableDropdown from '../components/SearchableDropdown';

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
    <div className="space-y-6">
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
            className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:outline-none text-slate-700 text-sm font-medium"
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
              className="bg-white rounded-2xl flex flex-col group transition-all duration-300 shadow-sm hover:shadow-lg border border-slate-200 overflow-hidden cursor-pointer hover:border-slate-300"
            >
              <div className="h-1.5 w-full bg-[#0047ba]" />
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 line-clamp-1 mb-1 group-hover:text-[#0047ba] transition-colors">
                      {order.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md inline-flex border border-slate-100">
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

                <div className="grid grid-cols-2 gap-4 my-6">
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-indigo-50/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Headcount</p>
                      <p className="text-sm font-bold text-slate-700">{order.headcount} required</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-emerald-50/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                      <IndianRupee className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Salary</p>
                      <p className="text-sm font-bold text-slate-700">{order.expectedSalary}</p>
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

                <div className="mt-auto pt-5 mt-5 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-100">
                  <div className="flex items-center text-rose-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    Due: {new Date(order.dueDate).toLocaleDateString()}
                  </div>
                  <span>ID: {order.id}</span>
                </div>
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

      {/* Create Order Modal - Enhanced Design */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl my-auto overflow-hidden flex flex-col"
            style={{ maxHeight: 'calc(100vh - 2rem)' }}
          >
            {/* Header Sticky */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 font-display">Create New Order</h3>
                <p className="text-slate-500 text-xs mt-1">Fill in the requisition details below</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Client (Company)</label>
                  <div className="relative">
                    <select
                      value={formData.clientId}
                      onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                      className="w-full glass-input appearance-none py-3 pl-4 pr-10 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all font-semibold"
                    >
                      <option value="">Select a Client...</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Designation / Role</label>
                  <input 
                    type="text" 
                    value={formData.designation}
                    onChange={(e) => setFormData({...formData, designation: e.target.value})}
                    className="w-full glass-input py-3 px-4 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all font-semibold" 
                    placeholder="e.g. Senior Frontend Developer" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Number of Positions</label>
                  <input 
                    type="number" 
                    min="1"
                    value={formData.positions}
                    onChange={(e) => setFormData({...formData, positions: parseInt(e.target.value) || 1})}
                    className="w-full glass-input py-3 px-4 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all font-semibold" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Industry</label>
                  <SearchableDropdown
                    value={formData.requiredIndustry}
                    onChange={(val) => setFormData({...formData, requiredIndustry: val})}
                    options={["IT / Software", "Healthcare / Medical", "Finance / Banking", "Construction / Real Estate", "Engineering / Manufacturing", "Retail / E-Commerce", "Logistics / Transportation", "Other"]}
                    placeholder="Select or type Industry..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Min. Experience (Years)</label>
                  <SearchableDropdown
                    value={formData.requiredExperience}
                    onChange={(val) => setFormData({...formData, requiredExperience: val})}
                    options={["0", "1", "2", "3", "4", "5", "6-10", "10+"]}
                    placeholder="Select Experience..."
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Required Skills & Expertise</label>
                  <SearchableDropdown
                    value={formData.requiredSkillset}
                    onChange={(val) => setFormData({...formData, requiredSkillset: val})}
                    options={["Driver, Truck driver", "React, Node.js, Typescript", "Project Management", "Heavy Machinery Operation", "Customer Service", "Accounting & Finance", "Sales & Marketing", "Other"]}
                    placeholder="e.g. React, Node, AI, Typescript..."
                  />
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Salary Range / Budget</label>
                  <input 
                    type="text" 
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    className="w-full glass-input py-3 px-4 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all font-semibold" 
                    placeholder="e.g. ₹80,000 - ₹120,000" 
                  />
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Internal Remarks / Notes</label>
                  <textarea 
                    value={formData.remarks}
                    onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                    className="w-full glass-input py-3 px-4 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all font-semibold h-24 resize-none" 
                    placeholder="Add any internal notes here..." 
                  />
                </div>
              </div>
            </div>

            {/* Footer Sticky */}
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end space-x-4 sticky bottom-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateOrder}
                disabled={isSaving}
                className="px-8 py-2.5 gradient-btn text-white text-sm font-bold rounded-xl cursor-pointer shadow-lg shadow-blue-500/30 disabled:opacity-50 flex items-center"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isSaving ? 'Creating...' : 'Create Order'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
