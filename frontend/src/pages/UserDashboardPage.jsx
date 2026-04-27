import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiBriefcase, HiClipboardList, HiStar } from 'react-icons/hi';
import { serviceAPI, complaintAPI } from '../services/api';
import useAuthStore from '../context/authStore';
import { StatusBadge, Avatar, PageLoader, EmptyState } from '../components/common';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function UserDashboardPage() {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');

  useEffect(() => {
    const load = async () => {
      try {
        const [rRes, cRes] = await Promise.all([
          serviceAPI.getMyRequests(),
          complaintAPI.getMine(),
        ]);
        setRequests(rRes.data.requests);
        setComplaints(cRes.data.complaints);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCancelRequest = async (id) => {
    try {
      await serviceAPI.updateStatus(id, { status: 'cancelled' });
      setRequests((prev) => prev.map((r) => r._id === id ? { ...r, status: 'cancelled' } : r));
      toast.success('Request cancelled');
    } catch {
      toast.error('Failed to cancel');
    }
  };

  if (loading) return <PageLoader />;

  const activeRequests = requests.filter(r => !['completed', 'cancelled', 'rejected'].includes(r.status));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex items-center gap-4 mb-8">
        <Avatar src={user?.avatar} name={user?.name} size="lg" />
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Hello, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your service requests and complaints</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: '📋', label: 'Total Requests', value: requests.length, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
          { icon: '⚡', label: 'Active', value: activeRequests.length, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' },
          { icon: '📢', label: 'Complaints', value: complaints.length, color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-2xl p-4 text-center`}>
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold">{stat.value}</div>
            <div className="text-xs font-medium opacity-80 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
        {[
          { id: 'requests', label: '🔧 Service Requests', count: requests.length },
          { id: 'complaints', label: '📢 My Complaints', count: complaints.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white dark:bg-gray-700 shadow text-primary-600 dark:text-primary-400' : 'text-gray-500'}`}
          >
            {tab.label} <span className="ml-1 text-xs bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded-full">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <EmptyState
              icon="🔧"
              title="No service requests yet"
              message="Find a worker and send your first request"
              action={<Link to="/services" className="btn-primary">Find Workers</Link>}
            />
          ) : (
            requests.map((req) => (
              <div key={req._id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <Avatar src={req.worker?.user?.avatar} name={req.worker?.user?.name} size="md" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{req.worker?.user?.name}</p>
                      <p className="text-sm text-gray-500">{req.serviceType}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}</p>
                    </div>
                  </div>
                  <StatusBadge status={req.status} />
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">{req.description}</p>
                <p className="text-xs text-gray-400 mt-1">📍 {req.address}</p>

                {req.notes && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-700 dark:text-blue-300">
                    <span className="font-medium">Worker note: </span>{req.notes}
                  </div>
                )}

                {['pending', 'accepted'].includes(req.status) && (
                  <button
                    onClick={() => handleCancelRequest(req._id)}
                    className="mt-3 text-sm text-red-500 hover:text-red-700 font-medium"
                  >
                    Cancel Request
                  </button>
                )}

                {req.status === 'completed' && (
                  <div className="mt-3">
                    <Link to={`/workers/${req.worker?._id}`} className="text-sm text-primary-600 font-medium hover:underline">
                      ⭐ Leave a Review
                    </Link>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'complaints' && (
        <div className="space-y-4">
          {complaints.length === 0 ? (
            <EmptyState
              icon="📢"
              title="No complaints yet"
              message="Report a civic issue in your area"
              action={<Link to="/complaints/new" className="btn-primary">Raise Complaint</Link>}
            />
          ) : (
            complaints.map((complaint) => (
              <div key={complaint._id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{complaint.title}</p>
                    <p className="text-sm text-gray-500">{complaint.category} • {complaint.location?.city}</p>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{complaint.description}</p>
                {complaint.adminNotes && (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-700 dark:text-green-300">
                    <span className="font-medium">Admin update: </span>{complaint.adminNotes}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })} • {complaint.upvotes?.length || 0} upvotes
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
