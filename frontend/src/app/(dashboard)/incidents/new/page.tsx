'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewIncidentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    customerId: '',
    orderId: '',
    orderItemId: '',
    amcId: '',
    incidentType: 'Hardware Issue',
    severity: 'Medium',
    status: 'Open',
    description: '',
  });

  useEffect(() => {
    api.get('/customers').then(res => setCustomers(res.data)).catch(console.error);
    api.get('/orders').then(res => setAllOrders(res.data)).catch(console.error);
  }, []);

  const filteredOrders = allOrders.filter(o => o.customerId === formData.customerId);
  const selectedOrder = allOrders.find(o => o.id === formData.orderId);
  const orderItems = selectedOrder?.items || [];
  const selectedItem = orderItems.find((i: any) => i.id === formData.orderItemId);
  const amcs = selectedItem?.amcs || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        orderId: formData.orderId || undefined,
        orderItemId: formData.orderItemId || undefined,
        amcId: formData.amcId || undefined,
      };
      const res = await api.post('/incidents', payload);
      router.push(`/incidents/${res.data.id}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Incident</h1>
          <p className="text-sm text-gray-500">Log a support ticket or issue and link it to relevant products.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 space-y-6">
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-4 border border-blue-100 dark:border-blue-800/50">
            <h3 className="font-medium text-blue-800 dark:text-blue-300">1. Link to Product (Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-900 dark:text-blue-200">Customer *</label>
                <select 
                  required value={formData.customerId} 
                  onChange={e => setFormData({...formData, customerId: e.target.value, orderId: '', orderItemId: '', amcId: ''})}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">-- Select Customer --</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-900 dark:text-blue-200">Order</label>
                <select 
                  disabled={!formData.customerId} value={formData.orderId} 
                  onChange={e => setFormData({...formData, orderId: e.target.value, orderItemId: '', amcId: ''})}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                >
                  <option value="">-- None --</option>
                  {filteredOrders.map(o => <option key={o.id} value={o.id}>{o.orderNumber}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-900 dark:text-blue-200">Order Item</label>
                <select 
                  disabled={!formData.orderId} value={formData.orderItemId} 
                  onChange={e => setFormData({...formData, orderItemId: e.target.value, amcId: ''})}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                >
                  <option value="">-- None --</option>
                  {orderItems.map((item: any) => <option key={item.id} value={item.id}>{item.productName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-900 dark:text-blue-200">AMC</label>
                <select 
                  disabled={!formData.orderItemId} value={formData.amcId} 
                  onChange={e => setFormData({...formData, amcId: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                >
                  <option value="">-- None --</option>
                  {amcs.map((amc: any) => <option key={amc.id} value={amc.id}>{amc.coverageType} ({amc.status})</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Incident Type</label>
              <select value={formData.incidentType} onChange={e => setFormData({...formData, incidentType: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700">
                <option>Hardware Issue</option>
                <option>Software Issue</option>
                <option>Network Issue</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Severity</label>
              <select value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700">
                <option>Open</option>
                <option>Assigned</option>
                <option>In Progress</option>
                <option>Waiting on Customer</option>
                <option>Resolved</option>
                <option>Closed</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea 
                required rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                placeholder="Please describe the issue in detail..."
              />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t flex justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Save size={18} /> {loading ? 'Saving...' : 'Log Incident'}
          </button>
        </div>
      </form>
    </div>
  );
}
