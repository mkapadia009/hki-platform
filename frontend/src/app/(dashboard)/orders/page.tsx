'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Order #', accessorKey: 'orderNumber' },
    { 
      header: 'Customer', 
      accessorKey: 'customer.companyName',
      cell: (row: any) => row.customer ? row.customer.companyName : '-'
    },
    { 
      header: 'Date', 
      accessorKey: 'orderDate',
      cell: (row: any) => new Date(row.orderDate).toLocaleDateString()
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: (row: any) => {
        const total = row.items?.reduce((sum: number, item: any) => sum + (item.unitPrice * item.quantity), 0) || 0;
        return `$${total.toLocaleString()}`;
      }
    },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: (row: any) => {
        const colors: any = {
          'Draft': 'bg-gray-100 text-gray-800 border-gray-200',
          'Confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
          'In Progress': 'bg-purple-100 text-purple-800 border-purple-200',
          'Completed': 'bg-green-100 text-green-800 border-green-200',
          'Cancelled': 'bg-red-100 text-red-800 border-red-200',
        };
        const color = colors[row.status] || 'bg-gray-100 text-gray-800 border-gray-200';
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${color}`}>{row.status}</span>;
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-sm text-gray-500">Manage sales and hardware purchases.</p>
        </div>
        <button 
          onClick={() => router.push('/orders/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={20} />
          <span className="font-medium">New Order</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500">Loading orders...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={orders} 
          onRowClick={(row) => router.push(`/orders/${row.id}`)}
          defaultSort={{ key: 'orderDate', direction: 'desc' }}
          searchPlaceholder="Search orders..."
        />
      )}
    </div>
  );
}
