'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (error) {
      console.error('Failed to fetch customers', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Company', accessorKey: 'companyName' },
    { header: 'Contact', accessorKey: 'contactPerson' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Phone', accessorKey: 'phoneNumber' },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${row.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
          {row.status}
        </span>
      )
    },
    { 
      header: 'Created', 
      accessorKey: 'createdAt',
      cell: (row: any) => new Date(row.createdAt).toLocaleDateString()
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-sm text-gray-500">Manage your CRM contacts and companies.</p>
        </div>
        <button 
          onClick={() => router.push('/customers/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={20} />
          <span className="font-medium">New Customer</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500">Loading customers...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={customers} 
          onRowClick={(row) => router.push(`/customers/${row.id}`)}
          defaultSort={{ key: 'createdAt', direction: 'desc' }}
          searchPlaceholder="Search customers by name, email, or phone..."
        />
      )}
    </div>
  );
}
