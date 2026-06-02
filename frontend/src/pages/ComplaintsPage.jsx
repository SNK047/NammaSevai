import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HiFilter, HiPlus } from 'react-icons/hi';
import { complaintAPI } from '../services/api';
import ComplaintCard from '../components/complaints/ComplaintCard';
import { SkeletonCard, EmptyState } from '../components/common';
import useAuthStore from '../context/authStore';
import toast from 'react-hot-toast';

const CATEGORIES = ['Road', 'Water', 'Electricity', 'Sanitation', 'Street Light', 'Others'];
const STATUSES = ['pending', 'in_progress', 'resolved'];

export default function ComplaintsPage() {
  const { isAuthenticated } = useAuthStore();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({ category: '', status: '', page: 1 });

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
      const { data } = await complaintAPI.getAll(params);
      setComplaints(data.complaints);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const handleUpvote = async (id) => {
    if (!isAuthenticated) return toast.error('Please login to upvote');
    try {
      const { data } = await complaintAPI.upvote(id);
      setComplaints((prev) => prev.map((c) => (c.id === id || c._id === id) ? { ...c, upvotes: Array(data.upvotes || c.upvotes?.length || 0).fill(null) } : c));
    } catch {
      toast.error('Failed to upvote');
    }
  };

  const stats = {
    total: pagination.total || 0,
    pending: complaints.filter(c => c.status === 'pending' || c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">Public Complaints</h1>
          <p className="text-gray-500 dark:text-gray-400">Community-reported civic issues and their resolution status</p>
        </div>
        <Link
          to={isAuthenticated ? '/complaints/new' : '/login'}
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <HiPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Raise Issue</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: pagination.total || 0, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
          { label: 'Pending', value: complaints.filter(c => c.status === 'pending' || c.status === 'in_progress').length, color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600' },
          { label: 'Resolved', value: complaints.filter(c => c.status === 'resolved').length, color: 'bg-green-50 dark:bg-green-900/20 text-green-600' },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-0.5 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          value={filters.category}
          onChange={(e) => setFilters(p => ({ ...p, category: e.target.value, page: 1 }))}
          className="input-field w-auto"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters(p => ({ ...p, status: e.target.value, page: 1 }))}
          className="input-field w-auto"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        {(filters.category || filters.status) && (
          <button onClick={() => setFilters({ category: '', status: '', page: 1 })} className="btn-secondary text-sm py-2 px-4">
            Clear
          </button>
        )}
      </div>

      {/* Complaints List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : complaints.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No complaints found"
          message="Be the first to report a civic issue in your area."
          action={<Link to={isAuthenticated ? '/complaints/new' : '/login'} className="btn-primary">Raise a Complaint</Link>}
      />
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <ComplaintCard key={complaint.id || complaint._id} complaint={complaint} onUpvote={handleUpvote} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pagination.pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setFilters(p => ({ ...p, page: i + 1 }))}
              className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${filters.page === i + 1 ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 border border-gray-200 dark:border-gray-700'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
