'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

export default function NewOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    customerId: '',
    orderNumber: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    status: 'Draft',
    paymentStatus: 'Pending',
    notes: ''
  });

  const [items, setItems] = useState<any[]>([{
    productName: '',
    productCode: '',
    quantity: 1,
    unitPrice: 0,
    amcEligible: true
  }]);

  useEffect(() => {
    api.get('/customers').then(res => setCustomers(res.data)).catch(console.error);
  }, []);

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { productName: '', productCode: '', quantity: 1, unitPrice: 0, amcEligible: true }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, items: { create: items } };
      const res = await api.post('/orders', payload);
      router.push(`/orders/${res.data.id}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Order</h1>
          <p className="text-sm text-gray-500">Create a new order and add products.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer *</label>
              <select 
                required 
                value={formData.customerId} 
                onChange={e => setFormData({...formData, customerId: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Select a customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Order Number *</label>
              <input 
                type="text" required value={formData.orderNumber} 
                onChange={e => setFormData({...formData, orderNumber: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Order Items</h3>
              <button type="button" onClick={addItem} className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-100 flex items-center gap-1">
                <Plus size={16} /> Add Product
              </button>
            </div>
            
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex gap-4 items-start bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                  <div className="flex-1 grid grid-cols-12 gap-4">
                    <div className="col-span-4">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Product Name *</label>
                      <input type="text" required value={item.productName} onChange={e => handleItemChange(index, 'productName', e.target.value)} className="w-full px-2 py-1.5 border rounded-md text-sm dark:bg-gray-700" />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Code</label>
                      <input type="text" value={item.productCode} onChange={e => handleItemChange(index, 'productCode', e.target.value)} className="w-full px-2 py-1.5 border rounded-md text-sm dark:bg-gray-700" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Qty *</label>
                      <input type="number" min="1" required value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value))} className="w-full px-2 py-1.5 border rounded-md text-sm dark:bg-gray-700" />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Unit Price *</label>
                      <input type="number" min="0" step="0.01" required value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))} className="w-full px-2 py-1.5 border rounded-md text-sm dark:bg-gray-700" />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeItem(index)} className="mt-6 text-gray-400 hover:text-red-500 p-1" disabled={items.length === 1}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t flex justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Save size={18} /> {loading ? 'Saving...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
