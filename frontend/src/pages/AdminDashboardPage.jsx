import { useState, useEffect } from 'react';
import { adminAPI, complaintAPI } from '../services/api';
import { PageLoader, Avatar, StatusBadge } from '../components/common';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await adminAPI.getDashboard();
        setDashboard(data);
      } catch {
        toast.error('Failed to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await adminAPI.getUsers();
      setUsers(data.users);
    } catch { toast.error('Failed to load users'); }
  };

  const loadWorkers = async (approved = '') => {
    try {
      const { data } = await adminAPI.getWorkers({ approved });
      setWorkers(data.workers);
    } catch { toast.error('Failed to load workers'); }
  };

  const loadComplaints = async () => {
    try {
      const { data } = await complaintAPI.getAll({ limit: 20 });
      setComplaints(data.complaints);
    } catch { toast.error('Failed to load complaints'); }
  };

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'workers') loadWorkers(false); // pending workers
    if (activeTab === 'complaints') loadComplaints();
  }, [activeTab]);

  const handleApproveWorker = async (id, approve) => {
    try {
      await adminAPI.approveWorker(id, approve);
      setWorkers((prev) => prev.filter((w) => w._id !== id));
      toast.success(approve ? 'Worker approved!' : 'Worker rejected');
    } catch { toast.error('Failed to update'); }
  };

  const handleComplaintStatus = async (id, status, adminNotes = '') => {
    try {
      await adminAPI.updateComplaintStatus(id, { status, adminNotes });
      setComplaints((prev) => prev.map((c) => c._id === id ? { ...c, status } : c));
      toast.success('Complaint status updated');
    } catch { toast.error('Failed to update'); }
  };

  const handleToggleUser = async (id) => {
    try {
      const { data } = await adminAPI.toggleUserActive(id);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isActive: data.user.isActive } : u));
      toast.success('User updated');
    } catch { toast.error('Failed to update'); }
  };

  if (loading) return <PageLoader />;
  if (!dashboard) return null;

  const { stats, complaintsByCategory, recentComplaints, recentWorkerApprovals } = dashboard;

  const TABS = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'workers', label: `🔧 Pending Workers (${stats.pendingWorkers})` },
    { id: 'complaints', label: '📢 Complaints' },
    { id: 'users', label: '👥 Users' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">NammaSevai platform overview</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-8 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 py-2 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-gray-700 shadow text-primary-600 dark:text-primary-400' : 'text-gray-500'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
              { label: 'Active Workers', value: stats.totalWorkers, icon: '🔧', color: 'bg-green-50 dark:bg-green-900/20 text-green-600' },
              { label: 'Total Complaints', value: stats.totalComplaints, icon: '📢', color: 'bg-red-50 dark:bg-red-900/20 text-red-600' },
              { label: 'Jobs Done', value: stats.completedServices, icon: '✅', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' },
            ].map((stat) => (
              <div key={stat.label} className={`${stat.color} rounded-2xl p-5`}>
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs font-medium opacity-70 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Complaints by category */}
            <div className="card">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Complaints by Category</h3>
              {complaintsByCategory.map((item) => {
                const pct = Math.round((item.count / (stats.totalComplaints || 1)) * 100);
                return (
                  <div key={item._id} className="flex items-center gap-3 mb-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-24 flex-shrink-0">{item._id}</span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm font-medium text-gray-800 dark:text-white w-8 text-right">{item.count}</span>
                  </div>
                );
              })}
            </div>

            {/* Pending Approvals */}
            <div className="card">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Pending Worker Approvals</h3>
              {recentWorkerApprovals.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No pending approvals 🎉</p>
              ) : (
                recentWorkerApprovals.map((worker) => (
                  <div key={worker._id} className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-gray-50 dark:border-gray-700 last:border-0">
                    <div className="flex items-center gap-2">
                      <Avatar name={worker.user?.name} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{worker.user?.name}</p>
                        <p className="text-xs text-gray-400">{worker.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleApproveWorker(worker._id, true)} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg font-medium hover:bg-green-200">Approve</button>
                      <button onClick={() => handleApproveWorker(worker._id, false)} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-lg font-medium hover:bg-red-200">Reject</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pending Workers Tab */}
      {activeTab === 'workers' && (
        <div className="space-y-4 animate-fade-in">
          {workers.length === 0 ? (
            <div className="card text-center py-12 text-gray-400">No pending worker approvals 🎉</div>
          ) : (
            workers.map((worker) => (
              <div key={worker._id} className="card">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-start gap-3">
                    <Avatar src={worker.user?.avatar} name={worker.user?.name} size="md" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{worker.user?.name}</p>
                      <p className="text-sm text-gray-500">{worker.user?.email}</p>
                      <p className="text-sm text-gray-500">📞 {worker.user?.phone}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {worker.skills?.map((s) => (
                          <span key={s} className="badge bg-primary-50 text-primary-700 text-xs">{s}</span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{worker.experience} yrs exp • Applied {formatDistanceToNow(new Date(worker.createdAt), { addSuffix: true })}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApproveWorker(worker._id, true)} className="btn-success text-sm py-2 px-4">✅ Approve</button>
                    <button onClick={() => handleApproveWorker(worker._id, false)} className="text-sm py-2 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl font-semibold hover:bg-red-100">❌ Reject</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Complaints Tab */}
      {activeTab === 'complaints' && (
        <div className="space-y-4 animate-fade-in">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="card">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{complaint.title}</p>
                  <p className="text-sm text-gray-500">{complaint.category} • {complaint.location?.city} • {complaint.user?.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{complaint.description}</p>
                </div>
                <StatusBadge status={complaint.status} />
              </div>
              <div className="flex gap-2 mt-4 flex-wrap">
                {['pending', 'in_progress', 'resolved', 'rejected'].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleComplaintStatus(complaint._id, s)}
                    disabled={complaint.status === s}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${complaint.status === s ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-100 hover:text-primary-700'}`}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left py-3 px-3 font-semibold text-gray-600 dark:text-gray-400">User</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600 dark:text-gray-400">Role</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600 dark:text-gray-400">Joined</th>
                  <th className="py-3 px-3" />
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={u.name} size="sm" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`badge ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'worker' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`badge ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-400 text-xs">{formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}</td>
                    <td className="py-3 px-3">
                      {u.role !== 'admin' && (
                        <button onClick={() => handleToggleUser(u._id)} className="text-xs text-red-500 hover:text-red-700 font-medium">
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <p className="text-center py-8 text-gray-400">No users found</p>}
          </div>
        </div>
      )}
    </div>
  );
}
