'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft, Activity, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function IncidentDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { addToast } = useToast();
  const [incident, setIncident] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const { addToast } = useToast();

  const fetchIncident = () => {
    if (id) {
      api.get(`/incidents/${id}`).then(res => {
        setIncident(res.data);
        setLoading(false);
      }).catch(console.error);
    }
  };

  useEffect(() => {
    fetchIncident();
  }, [id]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.post(`/incidents/${id}/comments`, { comment: newComment });
      setNewComment('');
      fetchIncident(); // Refresh to get new comment
      addToast('System: Email notification dispatched to client.', 'success');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!incident) return <div className="p-8 text-center">Incident not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity size={24} className="text-blue-600" />
            Incident Details
          </h1>
          <p className="text-sm text-gray-500 mt-1">Customer: {incident.customer?.companyName}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div><span className="text-gray-500">Status:</span> {incident.status}</div>
          <div><span className="text-gray-500">Severity:</span> {incident.severity}</div>
          <div><span className="text-gray-500">Type:</span> {incident.incidentType}</div>
          <div><span className="text-gray-500">Opened:</span> {new Date(incident.openedDate).toLocaleDateString()}</div>
        </div>
        <div className="pt-4 border-t dark:border-gray-700">
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{incident.description}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2"><MessageSquare size={18} /> Comments</h3>
        {incident.comments && incident.comments.length > 0 ? (
          <div className="space-y-4">
            {incident.comments.map((comment: any) => (
              <div key={comment.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm">{comment.comment}</p>
                <p className="text-xs text-gray-500 mt-2">{new Date(comment.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No comments yet.</p>
        )}
      </div>
    </div>
  );
}
