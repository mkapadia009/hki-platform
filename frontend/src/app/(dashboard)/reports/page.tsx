'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Download, FileText } from 'lucide-react';

export default function ReportsPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (error) {
      console.error('Failed to fetch customers for reports', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (customerId: string, companyName: string) => {
    try {
      const response = await api.get(`/reports/customer/${customerId}/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${companyName.replace(/\\s+/g, '_')}_Report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed', error);
      alert('Failed to generate report');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reporting Engine</h1>
        <p className="text-sm text-gray-500">Generate PDF reports for your customers.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Customer Service Reports</h3>
        {loading ? (
          <div className="flex space-x-2 items-center text-gray-500"><div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div><span>Loading customers...</span></div>
        ) : customers.length === 0 ? (
          <p className="text-gray-500">No customers available for reporting.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customers.map(c => (
              <div key={c.id} className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{c.companyName}</p>
                    <p className="text-xs text-gray-500">{c.contactPerson}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(c.id, c.companyName)}
                  className="flex items-center space-x-2 text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Download size={16} />
                  <span className="font-medium">PDF</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
