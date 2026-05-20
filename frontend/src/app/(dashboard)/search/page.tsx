'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Users, ShoppingCart, Activity, Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  
  const [results, setResults] = useState<any>({ customers: [], orders: [], incidents: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (q) {
      fetchResults();
    } else {
      setLoading(false);
    }
  }, [q]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await api.get('/search', { params: { q } });
      setResults(res.data);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Search Results for "{q}"</h1>
      
      {loading ? (
        <p>Searching...</p>
      ) : (
        <div className="space-y-8">
          {/* Customers */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center"><Users className="mr-2" /> Customers ({results.customers?.length || 0})</h2>
            {results.customers?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.customers.map((c: any) => (
                  <div key={c.id} className="p-4 border rounded-lg bg-white dark:bg-gray-800">
                    <p className="font-bold">{c.companyName}</p>
                    <p className="text-sm text-gray-500">{c.contactPerson} - {c.email}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-500">No customers found.</p>}
          </section>

          {/* Orders */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center"><ShoppingCart className="mr-2" /> Orders ({results.orders?.length || 0})</h2>
            {results.orders?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.orders.map((o: any) => (
                  <div key={o.id} className="p-4 border rounded-lg bg-white dark:bg-gray-800">
                    <p className="font-bold">Order #{o.orderNumber}</p>
                    <p className="text-sm text-gray-500">Status: {o.status}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-500">No orders found.</p>}
          </section>

          {/* Incidents */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center"><Activity className="mr-2" /> Incidents ({results.incidents?.length || 0})</h2>
            {results.incidents?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.incidents.map((i: any) => (
                  <div key={i.id} className="p-4 border rounded-lg bg-white dark:bg-gray-800">
                    <p className="font-bold">{i.incidentType}</p>
                    <p className="text-sm text-gray-500">{i.description}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-500">No incidents found.</p>}
          </section>
        </div>
      )}
    </div>
  );
}
