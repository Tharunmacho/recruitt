import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Building2, Briefcase, Plus, Search, MoreVertical, Loader2, Users, User, Phone, Mail } from 'lucide-react';
import { Client, ClientType } from '../types';
import { saveClientToDb, getClientsFromDb } from '../services/db';

export default function SourcingPage() {
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

  const filteredClients = clients.filter(
    (c) => c.type === activeTab && c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            Sourcing Hub
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Manage Associations and Business Clients
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 gradient-btn text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Client</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="bg-[#f0f7ff] border border-[#cce4ff] p-2 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
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
            className="w-full pl-9 pr-4 py-2.5 glass-input rounded-xl text-sm"
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
              whileHover={{ y: -5, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl flex flex-col justify-between group transition-all shadow-sm hover:shadow-lg border border-slate-200 overflow-hidden cursor-pointer hover:border-slate-300"
            >
              <div className={`h-1.5 w-full ${client.type === 'Association' ? 'bg-[#8a4bbb]' : 'bg-[#d65d00]'}`} />
              <div className="p-6 flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      client.type === 'Association' ? 'bg-[#f3e8fc] text-[#8a4bbb]' : 'bg-[#fcead7] text-[#d65d00]'
                    }`}>
                      {client.type === 'Association' ? (
                        <Building2 className="w-5 h-5" />
                      ) : (
                        <Briefcase className="w-5 h-5" />
                      )}
                    </div>
                    <button className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1 mb-2">{client.name}</h3>
                  <div className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-md mb-5 border border-emerald-200">
                    {client.status}
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center space-x-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-slate-100/50 transition-colors">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-700 truncate">{client.contactPerson}</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-slate-100/50 transition-colors">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-700 truncate">{client.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-slate-100/50 transition-colors">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-700 truncate">{client.email}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>ID: {client.id}</span>
                  <span>{new Date(client.createdAt).toLocaleDateString()}</span>
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

      {/* Premium Create Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-xl premium-modal p-8 rounded-3xl"
          >
            <h3 className="text-2xl font-bold text-slate-900 font-display mb-6">Create New Client</h3>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="premium-label">Client Type</label>
                  <select 
                    className="w-full premium-input py-3 px-4 text-sm font-medium"
                    value={formClientType}
                    onChange={(e) => setFormClientType(e.target.value as ClientType)}
                  >
                    <option value="Association">Association</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
                <div>
                  <label className="premium-label">{formClientType === 'Association' ? 'Association Name' : 'Company Name'}</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full premium-input py-3 px-4 text-sm font-medium" 
                    placeholder={`e.g. Apex ${formClientType === 'Association' ? 'Association' : 'Inc.'}`} 
                  />
                </div>
              </div>

              {formClientType === 'Business' && (
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="premium-label">Industry / Sector</label>
                    <input type="text" className="w-full premium-input py-3 px-4 text-sm font-medium" placeholder="e.g. IT Services" />
                  </div>
                  <div>
                    <label className="premium-label">Company Registration No.</label>
                    <input type="text" className="w-full premium-input py-3 px-4 text-sm font-medium" placeholder="e.g. CRN-12345" />
                  </div>
                </div>
              )}

              {formClientType === 'Association' && (
                <div>
                  <label className="premium-label">Non-Profit Registration No.</label>
                  <input type="text" className="w-full premium-input py-3 px-4 text-sm font-medium" placeholder="e.g. NP-98765" />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="premium-label">{formClientType === 'Association' ? 'President / Chairman' : 'HR Contact Person'}</label>
                  <input 
                    type="text" 
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    className="w-full premium-input py-3 px-4 text-sm font-medium" 
                    placeholder="e.g. Jane Doe" 
                  />
                </div>
                <div>
                  <label className="premium-label">Phone Number</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full premium-input py-3 px-4 text-sm font-medium" 
                    placeholder="e.g. +1 555-0199" 
                  />
                </div>
              </div>
              
              <div>
                <label className="premium-label">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full premium-input py-3 px-4 text-sm font-medium" 
                  placeholder="e.g. contact@company.com" 
                />
              </div>
              
              <div>
                <label className="premium-label">Head Office Address</label>
                <textarea 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full premium-input py-3 px-4 text-sm font-medium h-24 resize-none" 
                  placeholder="123 Corporate Blvd..."
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
                onClick={handleCreateClient}
                disabled={isSaving}
                className="px-6 py-2.5 gradient-btn text-white text-sm font-bold rounded-xl cursor-pointer shadow-lg shadow-blue-500/30 disabled:opacity-50 flex items-center"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create Client
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
