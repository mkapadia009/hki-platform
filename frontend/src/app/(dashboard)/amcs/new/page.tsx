'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewAmcPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState('');
  
  const [formData, setFormData] = useState({
    orderItemId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    coverageType: 'Full Coverage',
    status: 'Active',
    slaType: '24x7',
  });

  useEffect(() => {
    api.get('/customers').then(res => setCustomers(res.data)).catch(console.error);
    api.get('/orders').then(res => setAllOrders(res.data)).catch(console.error);
  }, []);

  const filteredOrders = allOrders.filter(o => o.customerId === selectedCustomerId);
  const selectedOrder = allOrders.find(o => o.id === selectedOrderId);
  const orderItems = selectedOrder?.items || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.orderItemId) return alert('Please select an order item');
    
    setLoading(true);
    try {
      const res = await api.post('/amcs', formData);
      router.push(`/amcs/${res.data.id}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New AMC</h1>
          <p className="text-sm text-gray-500">Create a new Annual Maintenance Contract linked to a purchased product.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-4 border border-blue-100 dark:border-blue-800/50">
            <h3 className="font-medium text-blue-800 dark:text-blue-300">1. Select Product to Cover</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-900 dark:text-blue-200">Customer *</label>
                <select 
                  required value={selectedCustomerId} 
                  onChange={e => { setSelectedCustomerId(e.target.value); setSelectedOrderId(''); setFormData({...formData, orderItemId: ''}); }}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">-- Select Customer --</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-900 dark:text-blue-200">Order *</label>
                <select 
                  required disabled={!selectedCustomerId} value={selectedOrderId} 
                  onChange={e => { setSelectedOrderId(e.target.value); setFormData({...formData, orderItemId: ''}); }}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                >
                  <option value="">-- Select Order --</option>
                  {filteredOrders.map(o => <option key={o.id} value={o.id}>{o.orderNumber}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-900 dark:text-blue-200">Order Item *</label>
                <select 
                  required disabled={!selectedOrderId} value={formData.orderItemId} 
                  onChange={e => setFormData({...formData, orderItemId: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                >
                  <option value="">-- Select Product --</option>
                  {orderItems.map((item: any) => <option key={item.id} value={item.id}>{item.productName} (Qty: {item.quantity})</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Coverage Type</label>
              <select required value={formData.coverageType} onChange={e => setFormData({...formData, coverageType: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700">
                <option>Full Coverage</option>
                <option>Limited Coverage</option>
                <option>Service Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SLA Type</label>
              <select value={formData.slaType} onChange={e => setFormData({...formData, slaType: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700">
                <option>24x7</option>
                <option>8x5</option>
                <option>Next Business Day</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Status</label>
              <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700">
                <option>Active</option>
                <option>Expired</option>
                <option>Pending</option>
              </select>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t flex justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Save size={18} /> {loading ? 'Saving...' : 'Create AMC'}
          </button>
        </div>
      </form>
    </div>
  );
}
