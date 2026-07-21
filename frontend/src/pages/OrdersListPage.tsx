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
      <div className="bg-[#f4f7fb] border border-slate-200 p-2 rounded flex items-center shadow-sm focus-within:bg-white focus-within:ring-[3px] focus-within:ring-blue-500/15 focus-within:border-blue-400 transition-all duration-200">
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
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="bg-[#f4f7fb] rounded-xl flex flex-col group transition-all duration-300 shadow-sm hover:shadow-md border border-blue-100 overflow-hidden cursor-pointer hover:border-blue-300 p-5"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-[#003366] line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
                      {order.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 bg-white px-2.5 py-1.5 rounded-md inline-flex border border-slate-100 shadow-sm">
                      <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                      <span>{getClientName(order.clientId)}</span>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    (order.status === 'Open' && new Date(order.dueDate) < new Date(new Date().setHours(0,0,0,0))) ? 'bg-rose-100 text-rose-700' :
                    order.status === 'Open' ? 'bg-amber-100 text-amber-700' :
                    (order.status === 'Closed' || order.status === 'Fulfilled') ? 'bg-emerald-100 text-emerald-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {(order.status === 'Open' && new Date(order.dueDate) < new Date(new Date().setHours(0,0,0,0))) ? 'Expired' : order.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 my-5">
                  <div className="flex flex-col p-3 rounded-lg bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-2 mb-1.5">
                      <Users className="w-4 h-4 text-purple-500" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Headcount</p>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{order.headcount} required</p>
                  </div>
                  <div className="flex flex-col p-3 rounded-lg bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-2 mb-1.5">
                      <IndianRupee className="w-4 h-4 text-emerald-500" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Salary</p>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{order.expectedSalary}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 flex-1">
                  <p className="text-xs text-slate-600 line-clamp-2">
                    <span className="font-bold text-slate-800">Skills:</span> {order.requiredSkillset}
                  </p>
                  {order.remarks && (
                    <p className="text-xs text-slate-500 italic line-clamp-1">
                      "{order.remarks}"
                    </p>
                  )}
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center text-blue-600 font-bold">
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
            className="w-full max-w-3xl bg-white rounded border border-slate-200 shadow-lg my-auto overflow-hidden flex flex-col"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Client (Company)</label>
                  <div className="relative">
                    <select
                      value={formData.clientId}
                      onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                      className="w-full bg-[#f4f7fb] border border-slate-200 rounded text-sm py-2.5 pl-3 pr-10 text-slate-800 focus:bg-white focus:ring-[3px] focus:ring-blue-500/15 focus:border-blue-400 transition-all duration-200 outline-none appearance-none"
                    >
                      <option value="">Select a Client...</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Designation / Role</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full bg-[#f4f7fb] border border-slate-200 rounded text-sm py-2.5 px-3 text-slate-800 focus:bg-white focus:ring-[3px] focus:ring-blue-500/15 focus:border-blue-400 transition-all duration-200 outline-none"
                    placeholder="e.g. Senior Frontend Developer"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Number of Positions</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.positions}
                    onChange={(e) => setFormData({ ...formData, positions: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#f4f7fb] border border-slate-200 rounded text-sm py-2.5 px-3 text-slate-800 focus:bg-white focus:ring-[3px] focus:ring-blue-500/15 focus:border-blue-400 transition-all duration-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Industry</label>
                  <SearchableDropdown
                    value={formData.requiredIndustry}
                    onChange={(val) => setFormData({ ...formData, requiredIndustry: val })}
                    options={["IT / Software", "Healthcare / Medical", "Finance / Banking", "Construction / Real Estate", "Engineering / Manufacturing", "Retail / E-Commerce", "Logistics / Transportation", "Other"]}
                    placeholder="Select or type Industry..."
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Min. Experience (Years)</label>
                  <SearchableDropdown
                    value={formData.requiredExperience}
                    onChange={(val) => setFormData({ ...formData, requiredExperience: val })}
                    options={["0", "1", "2", "3", "4", "5", "6-10", "10+"]}
                    placeholder="Select Experience..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Required Skills & Expertise</label>
                  <SearchableDropdown
                    value={formData.requiredSkillset}
                    onChange={(val) => setFormData({ ...formData, requiredSkillset: val })}
                    options={["Driver, Truck driver", "React, Node.js, Typescript", "Project Management", "Heavy Machinery Operation", "Customer Service", "Accounting & Finance", "Sales & Marketing", "Other"]}
                    placeholder="e.g. React, Node, AI, Typescript..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Salary Range / Budget</label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-[#f4f7fb] border border-slate-200 rounded text-sm py-2.5 px-3 text-slate-800 focus:bg-white focus:ring-[3px] focus:ring-blue-500/15 focus:border-blue-400 transition-all duration-200 outline-none"
                    placeholder="e.g. ₹80,000 - ₹120,000"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Internal Remarks / Notes</label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    className="w-full bg-[#f4f7fb] border border-slate-200 rounded text-sm py-2.5 px-3 text-slate-800 focus:bg-white focus:ring-[3px] focus:ring-blue-500/15 focus:border-blue-400 transition-all duration-200 outline-none h-24 resize-none"
                    placeholder="Add any internal notes here..."
                  />
                </div>
              </div>
            </div>

            {/* Footer Sticky */}
            <div className="px-8 py-5 flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrder}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold transition-colors cursor-pointer flex items-center shadow-sm disabled:opacity-70"
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
