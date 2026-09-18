'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft, Activity, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function CustomerIncidentDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { addToast } = useToast();
  const [incident, setIncident] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchIncident();
    }
  }, [id]);

  const fetchIncident = async () => {
    try {
      const res = await api.get(`/incidents/${id}`);
      setIncident(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/incidents/${id}/comments`, { comment: newComment });
      setNewComment('');
      fetchIncident(); // Refresh to get new comment
      addToast('Success: Your reply has been posted and support has been notified.', 'success');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
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
            Support Ticket Details
          </h1>
          <p className="text-sm text-gray-500 mt-1">Status: <span className="font-semibold text-blue-600">{incident.status}</span></p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div><span className="text-gray-500">Type:</span> {incident.incidentType}</div>
          <div><span className="text-gray-500">Severity:</span> {incident.severity}</div>
          <div><span className="text-gray-500">Product:</span> {incident.orderItem ? incident.orderItem.productName : 'General'}</div>
          <div><span className="text-gray-500">Opened:</span> {new Date(incident.openedDate).toLocaleDateString()}</div>
        </div>
        <div className="pt-4 border-t dark:border-gray-700">
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{incident.description}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2"><MessageSquare size={18} /> Communication History</h3>
        
        <div className="space-y-4 mb-6">
          {incident.comments && incident.comments.length > 0 ? (
            incident.comments.map((comment: any) => (
              <div key={comment.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                <p className="text-sm whitespace-pre-wrap">{comment.comment}</p>
                <p className="text-xs text-gray-500 mt-2">{new Date(comment.createdAt).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No updates yet.</p>
          )}
        </div>

        <form onSubmit={handleAddComment} className="mt-4 pt-4 border-t dark:border-gray-700">
          <label className="block text-sm font-medium mb-2">Add an update or reply</label>
          <textarea
            required
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 mb-3"
            placeholder="Type your message here..."
          />
          <button 
            type="submit" 
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {submitting ? 'Posting...' : 'Post Reply'}
          </button>
        </form>
      </div>
    </div>
  );
}
