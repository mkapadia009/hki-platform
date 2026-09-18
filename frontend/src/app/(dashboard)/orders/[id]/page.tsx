'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft, ShoppingCart, Package, Activity, ShieldAlert } from 'lucide-react';

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/orders/${id}`).then(res => {
        setOrder(res.data);
        setLoading(false);
      }).catch(console.error);
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!order) return <div className="p-8 text-center">Order not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart size={24} className="text-blue-600" />
            Order {order.orderNumber}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Customer: <span className="font-medium text-gray-900 dark:text-white">{order.customer?.companyName}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-4">Order Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                <span className="text-gray-500">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</span>
              </div>
              <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                <span className="text-gray-500">Payment</span>
                <span className="font-medium">{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                <span className="text-gray-500">Date</span>
                <span className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2"><Package size={18} className="text-blue-600"/> Order Items</h3>
            {order.items && order.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-2">Product</th>
                      <th className="py-2">Code</th>
                      <th className="py-2">Qty</th>
                      <th className="py-2">Active AMC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {order.items.map((item: any) => {
                      const activeAmc = item.amcs?.find((a: any) => a.status === 'Active');
                      return (
                        <tr key={item.id}>
                          <td className="py-3 font-medium">{item.productName}</td>
                          <td className="py-3 text-gray-500">{item.productCode || '-'}</td>
                          <td className="py-3">{item.quantity}</td>
                          <td className="py-3">
                            {activeAmc ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium border border-green-200">
                                <ShieldAlert size={12}/> {activeAmc.coverageType}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">No active AMC</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No items found.</p>
            )}
          </div>

          {/* Incidents Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2"><Activity size={18} className="text-red-500"/> Order Incidents</h3>
            {order.incidents && order.incidents.length > 0 ? (
              <div className="space-y-3">
                {order.incidents.map((inc: any) => (
                  <div key={inc.id} onClick={() => router.push(`/incidents/${inc.id}`)} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <div>
                      <p className="font-medium text-sm">{inc.incidentType}</p>
                      <p className="text-xs text-gray-500">{new Date(inc.openedDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">{inc.status}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${inc.severity === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-800'}`}>{inc.severity}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No incidents reported for this order.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
