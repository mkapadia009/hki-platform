'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export default function AmcDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [amc, setAmc] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/amcs/${id}`).then(res => {
        setAmc(res.data);
        setLoading(false);
      }).catch(console.error);
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!amc) return <div className="p-8 text-center">AMC not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldAlert size={24} className="text-blue-600" />
            AMC Contract Details
          </h1>
          <p className="text-sm text-gray-500 mt-1">ID: {amc.id}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Status:</span> 
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${amc.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{amc.status}</span>
          </div>
          <div><span className="text-gray-500">Coverage Type:</span> {amc.coverageType}</div>
          <div><span className="text-gray-500">Start Date:</span> {new Date(amc.startDate).toLocaleDateString()}</div>
          <div><span className="text-gray-500">End Date:</span> {new Date(amc.endDate).toLocaleDateString()}</div>
          <div><span className="text-gray-500">SLA:</span> {amc.slaType || 'N/A'}</div>
          <div><span className="text-gray-500">Renewal Status:</span> {amc.renewalStatus}</div>
        </div>
      </div>
    </div>
  );
}
