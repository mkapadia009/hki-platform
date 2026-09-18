'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft, Building2, User, Phone, Mail, MapPin, ShoppingCart, Activity } from 'lucide-react';

export default function CustomerDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const res = await api.get(`/customers/${id}`);
      setCustomer(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  if (!customer) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Customer not found</h2>
        <button onClick={() => router.back()} className="mt-4 text-blue-600">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 size={24} className="text-blue-600" />
            {customer.companyName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">ID: {customer.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <User size={18} className="text-gray-400"/> Primary Contact
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-gray-900 dark:text-white">{customer.contactPerson}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                <span className="text-gray-500 flex items-center gap-1"><Phone size={14}/> Phone</span>
                <span className="font-medium text-gray-900 dark:text-white">{customer.phoneNumber}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                <span className="text-gray-500 flex items-center gap-1"><Mail size={14}/> Email</span>
                <span className="font-medium text-gray-900 dark:text-white">{customer.email}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <MapPin size={18} className="text-gray-400"/> Address & Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                <span className="text-gray-500">Status</span>
                <span className="font-medium text-gray-900 dark:text-white">{customer.status}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                <span className="text-gray-500">Type</span>
                <span className="font-medium text-gray-900 dark:text-white">{customer.customerType || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                <span className="text-gray-500">Address</span>
                <span className="font-medium text-gray-900 dark:text-white text-right">
                  {customer.address}<br/>
                  {customer.city} {customer.state}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Relations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Orders Table */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <ShoppingCart size={18} className="text-blue-600"/> Order History
            </h3>
            {customer.orders && customer.orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr className="text-left text-gray-500">
                      <th className="px-4 py-2 font-medium">Order Number</th>
                      <th className="px-4 py-2 font-medium">Date</th>
                      <th className="px-4 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {customer.orders.map((order: any) => (
                      <tr 
                        key={order.id} 
                        onClick={() => router.push(`/orders/${order.id}`)}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                      >
                        <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">{order.orderNumber}</td>
                        <td className="px-4 py-3">{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No orders found for this customer.</p>
            )}
          </div>

          {/* Incidents Table */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <Activity size={18} className="text-red-500"/> Recent Incidents
            </h3>
            {customer.incidents && customer.incidents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr className="text-left text-gray-500">
                      <th className="px-4 py-2 font-medium">Type</th>
                      <th className="px-4 py-2 font-medium">Status</th>
                      <th className="px-4 py-2 font-medium">Severity</th>
                      <th className="px-4 py-2 font-medium">Opened</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {customer.incidents.map((incident: any) => (
                      <tr 
                        key={incident.id} 
                        onClick={() => router.push(`/incidents/${incident.id}`)}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                      >
                        <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">{incident.incidentType}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{incident.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${incident.severity === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                            {incident.severity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{new Date(incident.openedDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No incidents found for this customer.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
