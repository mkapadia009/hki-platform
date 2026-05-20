'use client';

import { ShoppingCart, Plus } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders Management</h1>
          <p className="text-sm text-gray-500">Track and manage customer purchases.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} />
          <span className="font-medium">New Order</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-12 text-center rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Orders Found</h3>
        <p className="text-gray-500 mt-1">Start by creating a new order.</p>
      </div>
    </div>
  );
}
