'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';

export default function AMCsPage() {
  const [amcs, setAmcs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAMCs();
  }, []);

  const fetchAMCs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/amcs');
      setAmcs(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      header: 'Product', 
      accessorKey: 'orderItem.productName',
      cell: (row: any) => row.orderItem?.productName || '-' 
    },
    { 
      header: 'Customer', 
      accessorKey: 'orderItem.order.customer.companyName',
      cell: (row: any) => row.orderItem?.order?.customer?.companyName || '-' 
    },
    { 
      header: 'Coverage', 
      accessorKey: 'coverageType'
    },
    { 
      header: 'Start Date', 
      accessorKey: 'startDate',
      cell: (row: any) => new Date(row.startDate).toLocaleDateString()
    },
    { 
      header: 'End Date', 
      accessorKey: 'endDate',
      cell: (row: any) => new Date(row.endDate).toLocaleDateString()
    },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: (row: any) => {
        const isActive = row.status === 'Active';
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>{row.status}</span>;
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Annual Maintenance Contracts</h1>
          <p className="text-sm text-gray-500">Manage service contracts and renewals.</p>
        </div>
        <button 
          onClick={() => router.push('/amcs/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={20} />
          <span className="font-medium">New AMC</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500">Loading AMCs...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={amcs} 
          onRowClick={(row) => router.push(`/amcs/${row.id}`)}
          defaultSort={{ key: 'startDate', direction: 'desc' }}
          searchPlaceholder="Search AMCs..."
        />
      )}
    </div>
  );
}
