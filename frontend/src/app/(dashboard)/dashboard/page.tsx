'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Users, ShoppingCart, ShieldAlert, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/dashboard/metrics');
        setMetrics(res.data);
      } catch (error) {
        console.error('Failed to fetch metrics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const kpis = [
    { label: 'Total Customers', value: metrics?.kpis.totalCustomers || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Total Orders', value: metrics?.kpis.totalOrders || 0, icon: ShoppingCart, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: 'Active AMCs', value: metrics?.kpis.activeAmcs || 0, icon: ShieldAlert, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { label: 'Open Incidents', value: metrics?.kpis.openIncidents || 0, icon: Activity, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-sm text-gray-500">Welcome back. Here is what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${kpi.bg} ${kpi.color}`}>
              <kpi.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Incidents by Severity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={metrics?.severityData || []} 
                  cx="50%" cy="50%" 
                  innerRadius={60} outerRadius={80} 
                  paddingAngle={5} dataKey="value"
                >
                  {metrics?.severityData?.map((entry: any, index: number) => {
                    const colors: any = { Critical: '#dc2626', High: '#ea580c', Medium: '#ca8a04', Low: '#16a34a' };
                    return <Cell key={`cell-${index}`} fill={colors[entry.name] || '#3b82f6'} />;
                  })}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Orders over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics?.ordersData || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="Orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Incidents</h3>
        {metrics?.recentIncidents.length === 0 ? (
          <p className="text-gray-500">No recent incidents found.</p>
        ) : (
          <div className="space-y-4">
            {metrics?.recentIncidents.map((incident: any) => (
              <div key={incident.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{incident.incidentType}</p>
                  <p className="text-sm text-gray-500">{incident.customer?.companyName}</p>
                </div>
                <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  incident.status === 'Open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {incident.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
