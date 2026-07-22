import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Building2, Briefcase, Plus, Search, MoreVertical, Loader2, Users, User, Phone, Mail, X, Building, Contact, Calendar, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Client, ClientType } from '../types';
import { saveClientToDb, getClientsFromDb, deleteClientFromDb } from '../services/db';
import SearchableDropdown from '../components/SearchableDropdown';

export default function SourcingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ClientType>('Association');
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formClientType, setFormClientType] = useState<ClientType>('Association');
  
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      const data = await getClientsFromDb();
      setClients(data as Client[]);
      setIsLoading(false);
    };
    fetchClients();
  }, []);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleCreateClient = async () => {
    if (!formData.name) {
      alert("Please enter a name.");
      return;
    }

    setIsSaving(true);
    try {
      const savedClient = await saveClientToDb({
        name: formData.name,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        address: formData.address
      }, formClientType);

      setClients([savedClient, ...clients]);
      setIsModalOpen(false);
      setFormData({ name: '', contactPerson: '', phone: '', email: '', address: '' });
    } catch (error) {
      alert("Error saving client");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClient = async (id: string, type: ClientType) => {
    if (window.confirm(`Are you sure you want to permanently delete this ${type.toLowerCase()}?`)) {
      try {
        await deleteClientFromDb(id, type);
        setClients(clients.filter(c => c.id !== id));
        setActiveMenuId(null);
      } catch (error) {
        alert("Failed to delete client. Please try again.");
      }
    }
  };

  const filteredClients = clients.filter(
    (c) => c.type === activeTab && c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button 
            type="button"
            onClick={() => navigate('/dashboard')} 
            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors bg-white shrink-0 cursor-pointer"
            title="Go to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
              Sourcing Hub
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Manage Associations and Business Clients
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Client</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white border border-slate-200 shadow-sm p-2 rounded flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex p-1 bg-white/50 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab('Association')}
            className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'Association' 
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/30'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Associations</span>
          </button>
          <button
            onClick={() => setActiveTab('Business')}
            className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'Business' 
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/30'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Businesses</span>
          </button>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={`Search ${activeTab.toLowerCase()}s...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#f4f7fb] border border-slate-200 rounded text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-blue-500/15 focus:border-blue-400 transition-all duration-200"
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p>Loading {activeTab.toLowerCase()}s from database...</p>
          </div>
        ) : filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="bg-[#f4f7fb] rounded-xl flex flex-col justify-between group transition-all duration-300 shadow-sm hover:shadow-md border border-blue-100 overflow-hidden cursor-pointer hover:border-blue-300 p-5"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      client.type === 'Association' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {client.type === 'Association' ? (
                        <Building2 className="w-5 h-5" />
                      ) : (
                        <Briefcase className="w-5 h-5" />
                      )}
                    </div>
                    <div className="relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === client.id ? null : client.id); }}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white/50 transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {activeMenuId === client.id && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-10 animate-in fade-in zoom-in-95">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClient(client.id, client.type);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center cursor-pointer font-medium"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-[#003366] line-clamp-1 mt-4 mb-2">{client.name}</h3>
                  <div className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded w-max mb-5">
                    {client.status}
                  </div>

                  <div className="grid grid-cols-2 gap-3 my-5">
                    <div className="flex flex-col p-3 rounded-lg bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2 mb-1.5">
                        <User className="w-4 h-4 text-blue-500" />
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Contact</p>
                      </div>
                      <p className="text-sm font-bold text-slate-800 truncate">{client.contactPerson}</p>
                    </div>
                    <div className="flex flex-col p-3 rounded-lg bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2 mb-1.5">
                        <Phone className="w-4 h-4 text-emerald-500" />
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone</p>
                      </div>
                      <p className="text-sm font-bold text-slate-800 truncate">{client.phone}</p>
                    </div>
                  </div>

                  <div className="mb-4 flex-1">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-blue-50">
                        <Mail className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Email Address</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{client.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>ID: {client.id}</span>
                  <div className="flex items-center text-blue-600 font-bold">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    {new Date(client.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 bg-white/50 border border-dashed border-slate-200 rounded-2xl">
            <Building2 className="w-12 h-12 mb-3 text-slate-300" />
            <p>No {activeTab.toLowerCase()}s found matching your search.</p>
          </div>
        )}
      </div>

      {/* Create Client Modal - Enhanced Design */}
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
                <h3 className="text-2xl font-bold text-slate-900 font-display">Create New Client</h3>
                <p className="text-slate-500 text-xs mt-1">Fill in the client details below</p>
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
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Client Type</label>
                  <SearchableDropdown
                    value={formClientType}
                    onChange={(val) => setFormClientType(val as ClientType)}
                    options={["Association", "Business"]}
                    placeholder="Select Type..."
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">{formClientType === 'Association' ? 'Association Name' : 'Company Name'}</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#f4f7fb] border border-slate-200 rounded text-sm py-2.5 px-3 text-slate-800 focus:bg-white focus:ring-[3px] focus:ring-blue-500/15 focus:border-blue-400 transition-all duration-200 outline-none" 
                    placeholder={`e.g. Apex ${formClientType === 'Association' ? 'Association' : 'Inc.'}`} 
                  />
                </div>

                {formClientType === 'Business' && (
                  <>
                    <div>
                      <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Industry / Sector</label>
                      <SearchableDropdown
                        value=""
                        onChange={() => {}}
                        options={["IT / Software", "Healthcare / Medical", "Finance / Banking", "Construction / Real Estate", "Engineering / Manufacturing", "Retail / E-Commerce", "Logistics / Transportation", "Other"]}
                        placeholder="e.g. IT Services"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Company Registration No.</label>
                      <input type="text" className="w-full bg-[#f4f7fb] border border-slate-200 rounded text-sm py-2.5 px-3 text-slate-800 focus:bg-white focus:ring-[3px] focus:ring-blue-500/15 focus:border-blue-400 transition-all duration-200 outline-none" placeholder="e.g. CRN-12345" />
                    </div>
                  </>
                )}

                {formClientType === 'Association' && (
                  <div className="sm:col-span-2">
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Non-Profit Registration No.</label>
                    <input type="text" className="w-full bg-[#f4f7fb] border border-slate-200 rounded text-sm py-2.5 px-3 text-slate-800 focus:bg-white focus:ring-[3px] focus:ring-blue-500/15 focus:border-blue-400 transition-all duration-200 outline-none" placeholder="e.g. NP-98765" />
                  </div>
                )}

                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">{formClientType === 'Association' ? 'President / Chairman' : 'HR Contact Person'}</label>
                  <input 
                    type="text" 
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    className="w-full bg-[#f4f7fb] border border-slate-200 rounded text-sm py-2.5 px-3 text-slate-800 focus:bg-white focus:ring-[3px] focus:ring-blue-500/15 focus:border-blue-400 transition-all duration-200 outline-none" 
                    placeholder="e.g. Jane Doe" 
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Phone Number</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-[#f4f7fb] border border-slate-200 rounded text-sm py-2.5 px-3 text-slate-800 focus:bg-white focus:ring-[3px] focus:ring-blue-500/15 focus:border-blue-400 transition-all duration-200 outline-none" 
                    placeholder="e.g. +1 555-0199" 
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[#f4f7fb] border border-slate-200 rounded text-sm py-2.5 px-3 text-slate-800 focus:bg-white focus:ring-[3px] focus:ring-blue-500/15 focus:border-blue-400 transition-all duration-200 outline-none" 
                    placeholder="e.g. contact@company.com" 
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Head Office Address</label>
                  <textarea 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-[#f4f7fb] border border-slate-200 rounded text-sm py-2.5 px-3 text-slate-800 focus:bg-white focus:ring-[3px] focus:ring-blue-500/15 focus:border-blue-400 transition-all duration-200 outline-none h-24 resize-none" 
                    placeholder="123 Corporate Blvd..."
                  ></textarea>
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
                onClick={handleCreateClient}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold transition-colors cursor-pointer flex items-center shadow-sm disabled:opacity-70"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isSaving ? 'Creating...' : 'Create Client'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
