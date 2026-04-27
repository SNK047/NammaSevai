import { useState, useEffect } from 'react';
import { serviceAPI, workerAPI } from '../services/api';
import useAuthStore from '../context/authStore';
import { StatusBadge, Avatar, PageLoader, EmptyState, StarRating } from '../components/common';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function WorkerDashboardPage() {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [workerProfile, setWorkerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const [rRes, wRes] = await Promise.all([
          serviceAPI.getWorkerRequests(),
          workerAPI.getMyProfile(),
        ]);
        setRequests(rRes.data.requests);
        setWorkerProfile(wRes.data.worker);
        setProfileForm({
          skills: wRes.data.worker.skills || [],
          description: wRes.data.worker.description || '',
          experience: wRes.data.worker.experience || 0,
          hourlyRate: wRes.data.worker.hourlyRate || 0,
          serviceArea: wRes.data.worker.serviceArea || { city: '', radius: 10 },
        });
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStatusUpdate = async (id, status, notes = '') => {
    try {
      await serviceAPI.updateStatus(id, { status, notes });
      setRequests((prev) => prev.map((r) => r._id === id ? { ...r, status } : r));
      toast.success(`Request ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleAvailabilityChange = async (availability) => {
    setUpdatingAvailability(true);
    try {
      await workerAPI.updateAvailability(availability);
      setWorkerProfile((p) => ({ ...p, availability }));
      toast.success('Availability updated');
    } catch {
      toast.error('Failed to update');
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const handleProfileSave = async () => {
    try {
      const { data } = await workerAPI.updateProfile(profileForm);
      setWorkerProfile(data.worker);
      setEditingProfile(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  if (loading) return <PageLoader />;

  const SKILLS_ALL = ['Electrician', 'Plumber', 'Mechanic', 'Tutor', 'Carpenter', 'Painter', 'Mason', 'Cleaner', 'Others'];
  const filteredRequests = requests.filter(r => {
    if (activeTab === 'pending') return r.status === 'pending';
    if (activeTab === 'active') return ['accepted', 'in_progress'].includes(r.status);
    if (activeTab === 'done') return ['completed', 'rejected', 'cancelled'].includes(r.status);
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-4">
          <Avatar src={user?.avatar} name={user?.name} size="lg" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Worker Dashboard</p>
            {workerProfile && <StarRating rating={workerProfile.rating?.average || 0} count={workerProfile.rating?.count || 0} />}
          </div>
        </div>

        {/* Availability toggle */}
        {workerProfile && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
            <select
              value={workerProfile.availability}
              onChange={(e) => handleAvailabilityChange(e.target.value)}
              disabled={updatingAvailability}
              className="input-field w-auto py-2 text-sm"
            >
              <option value="available">🟢 Available</option>
              <option value="busy">🟡 Busy</option>
              <option value="offline">⚫ Offline</option>
            </select>
          </div>
        )}
      </div>

      {/* Stats */}
      {workerProfile && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Jobs', value: workerProfile.totalJobs, icon: '✅' },
            { label: 'Rating', value: `${workerProfile.rating?.average?.toFixed(1) || '0.0'}★`, icon: '⭐' },
            { label: 'Reviews', value: workerProfile.rating?.count || 0, icon: '💬' },
            { label: 'Pending', value: requests.filter(r => r.status === 'pending').length, icon: '🔔' },
          ].map((s) => (
            <div key={s.label} className="card text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Profile section */}
      {workerProfile && !workerProfile.isApproved && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl">
          <p className="text-yellow-800 dark:text-yellow-200 font-medium">⏳ Your profile is pending admin approval. Complete your profile to speed up the process.</p>
        </div>
      )}

      {/* Edit Profile */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-white">My Profile</h2>
          <button
            onClick={() => setEditingProfile(!editingProfile)}
            className="text-sm text-primary-600 font-medium hover:underline"
          >
            {editingProfile ? 'Cancel' : '✏️ Edit'}
          </button>
        </div>

        {editingProfile ? (
          <div className="space-y-4">
            <div>
              <label className="label">Skills (select multiple)</label>
              <div className="flex flex-wrap gap-2">
                {SKILLS_ALL.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      const has = profileForm.skills.includes(skill);
                      setProfileForm(p => ({
                        ...p,
                        skills: has ? p.skills.filter(s => s !== skill) : [...p.skills, skill]
                      }));
                    }}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${profileForm.skills.includes(skill) ? 'bg-primary-500 text-white border-primary-500' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">About / Description</label>
              <textarea value={profileForm.description} onChange={(e) => setProfileForm(p => ({ ...p, description: e.target.value }))} className="input-field resize-none min-h-[80px]" placeholder="Describe your experience..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Experience (years)</label>
                <input type="number" value={profileForm.experience} onChange={(e) => setProfileForm(p => ({ ...p, experience: e.target.value }))} className="input-field" min={0} max={50} />
              </div>
              <div>
                <label className="label">Hourly Rate (₹)</label>
                <input type="number" value={profileForm.hourlyRate} onChange={(e) => setProfileForm(p => ({ ...p, hourlyRate: e.target.value }))} className="input-field" min={0} />
              </div>
            </div>
            <div>
              <label className="label">Service City</label>
              <input type="text" value={profileForm.serviceArea?.city} onChange={(e) => setProfileForm(p => ({ ...p, serviceArea: { ...p.serviceArea, city: e.target.value } }))} className="input-field" placeholder="Your service area city" />
            </div>
            <button onClick={handleProfileSave} className="btn-primary w-full">Save Profile</button>
          </div>
        ) : (
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p><span className="font-medium text-gray-800 dark:text-gray-200">Skills:</span> {workerProfile.skills?.join(', ') || 'Not set'}</p>
            <p><span className="font-medium text-gray-800 dark:text-gray-200">Experience:</span> {workerProfile.experience} years</p>
            <p><span className="font-medium text-gray-800 dark:text-gray-200">Rate:</span> ₹{workerProfile.hourlyRate}/hr</p>
            <p><span className="font-medium text-gray-800 dark:text-gray-200">Area:</span> {workerProfile.serviceArea?.city || 'Not set'}</p>
            {workerProfile.description && <p><span className="font-medium text-gray-800 dark:text-gray-200">About:</span> {workerProfile.description}</p>}
          </div>
        )}
      </div>

      {/* Requests */}
      <div>
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Job Requests</h2>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-5">
          {[
            { id: 'pending', label: `Pending (${requests.filter(r => r.status === 'pending').length})` },
            { id: 'active', label: `Active (${requests.filter(r => ['accepted','in_progress'].includes(r.status)).length})` },
            { id: 'done', label: `Done (${requests.filter(r => ['completed','rejected','cancelled'].includes(r.status)).length})` },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === tab.id ? 'bg-white dark:bg-gray-700 shadow text-primary-600' : 'text-gray-500'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <EmptyState icon="📭" title="No requests here" message="New requests will appear here" />
          ) : (
            filteredRequests.map((req) => (
              <div key={req._id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <Avatar src={req.user?.avatar} name={req.user?.name} size="md" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{req.user?.name}</p>
                      <p className="text-sm text-gray-500">{req.serviceType}</p>
                      {req.user?.phone && <p className="text-xs text-primary-600 mt-0.5">📞 {req.user.phone}</p>}
                    </div>
                  </div>
                  <StatusBadge status={req.status} />
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">{req.description}</p>
                <p className="text-xs text-gray-400 mt-1">📍 {req.address}</p>
                {req.scheduledDate && (
                  <p className="text-xs text-blue-500 mt-1">📅 {new Date(req.scheduledDate).toLocaleString()}</p>
                )}

                {req.status === 'pending' && (
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => handleStatusUpdate(req._id, 'accepted')} className="btn-success flex-1 text-sm py-2">
                      ✅ Accept
                    </button>
                    <button onClick={() => handleStatusUpdate(req._id, 'rejected')} className="flex-1 text-sm py-2 px-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-semibold">
                      ❌ Reject
                    </button>
                  </div>
                )}

                {req.status === 'accepted' && (
                  <button onClick={() => handleStatusUpdate(req._id, 'in_progress')} className="btn-primary w-full mt-4 text-sm py-2">
                    🚀 Mark In Progress
                  </button>
                )}

                {req.status === 'in_progress' && (
                  <button onClick={() => handleStatusUpdate(req._id, 'completed')} className="btn-success w-full mt-4 text-sm py-2">
                    ✅ Mark Completed
                  </button>
                )}

                <p className="text-xs text-gray-400 mt-3 text-right">
                  {formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
