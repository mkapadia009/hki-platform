'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft, Save, Building2, User, Phone, Mail, MapPin } from 'lucide-react';

export default function NewCustomerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phoneNumber: '',
    customerType: 'B2B',
    address: '',
    city: '',
    state: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/customers', formData);
      router.push(`/customers/${res.data.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create customer');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Customer</h1>
          <p className="text-sm text-gray-500">Add a new company or client to your CRM.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Info */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Building2 size={18} className="text-gray-400" />
                Company Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name *</label>
                  <input 
                    type="text" required name="companyName" value={formData.companyName} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Type</label>
                  <select 
                    name="customerType" value={formData.customerType} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Enterprise">Enterprise</option>
                    <option value="Mid-Market">Mid-Market</option>
                    <option value="SMB">SMB</option>
                    <option value="B2B">B2B</option>
                    <option value="B2C">B2C</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <User size={18} className="text-gray-400" />
                Primary Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Person *</label>
                  <input 
                    type="text" required name="contactPerson" value={formData.contactPerson} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"><Phone size={14}/> Phone Number *</label>
                  <input 
                    type="text" required name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"><Mail size={14}/> Email Address *</label>
                  <input 
                    type="email" required name="email" value={formData.email} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Address Info */}
            <div className="space-y-4 md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin size={18} className="text-gray-400" />
                Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                  <input 
                    type="text" name="address" value={formData.address} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <input 
                    type="text" name="city" value={formData.city} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State / Province</label>
                  <input 
                    type="text" name="state" value={formData.state} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors disabled:opacity-70"
          >
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
            <span className="font-medium">{loading ? 'Saving...' : 'Create Customer'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
