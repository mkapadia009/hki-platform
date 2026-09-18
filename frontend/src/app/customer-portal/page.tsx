'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';

export default function CustomerDashboardPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const res = await api.get('/incidents');
      setIncidents(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      header: 'Type', 
      accessorKey: 'incidentType'
    },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: (row: any) => (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          {row.status}
        </span>
      )
    },
    { 
      header: 'Severity', 
      accessorKey: 'severity',
      cell: (row: any) => {
        const colors: any = {
          Critical: 'bg-red-100 text-red-800 border-red-200',
          High: 'bg-orange-100 text-orange-800 border-orange-200',
          Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          Low: 'bg-green-100 text-green-800 border-green-200'
        };
        const color = colors[row.severity] || 'bg-gray-100 text-gray-800 border-gray-200';
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${color}`}>{row.severity}</span>;
      }
    },
    { 
      header: 'Product / AMC', 
      accessorKey: 'orderItem.productName',
      cell: (row: any) => (
        <span className="text-gray-600 dark:text-gray-300">
          {row.orderItem ? row.orderItem.productName : '-'}
          {row.amc && <span className="ml-2 px-1.5 py-0.5 bg-green-50 text-green-700 text-[10px] rounded border border-green-200">AMC</span>}
        </span>
      )
    },
    { 
      header: 'Opened Date', 
      accessorKey: 'openedDate',
      cell: (row: any) => new Date(row.openedDate).toLocaleDateString()
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Incidents</h1>
          <p className="text-sm text-gray-500 mt-1">View and track your support tickets.</p>
        </div>
        <button 
          onClick={() => router.push('/customer-portal/incidents/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors md:hidden"
        >
          <Plus size={16} /> Raise Incident
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500">Loading incidents...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={incidents} 
          onRowClick={(row) => router.push(`/customer-portal/incidents/${row.id}`)}
          defaultSort={{ key: 'openedDate', direction: 'desc' }}
          searchPlaceholder="Search your incidents..."
        />
      )}
    </div>
  );
}
