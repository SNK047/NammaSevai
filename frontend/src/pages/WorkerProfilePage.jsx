import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiLocationMarker, HiBriefcase, HiPhone, HiMail, HiStar } from 'react-icons/hi';
import { workerAPI, serviceAPI } from '../services/api';
import useAuthStore from '../context/authStore';
import { PageLoader, StarRating, AvailabilityBadge, Avatar, StarPicker } from '../components/common';
import toast from 'react-hot-toast';

export default function WorkerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({ description: '', address: '', scheduledDate: '', serviceType: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await workerAPI.getById(id);
        setWorker(data.worker);
        setReviews(data.reviews || []);
        if (data.worker.skills?.[0]) {
          setRequestData(p => ({ ...p, serviceType: data.worker.skills[0] }));
        }
      } catch {
        toast.error('Worker not found');
        navigate('/services');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate('/login');
    if (!requestData.description || !requestData.address) return toast.error('Please fill all fields');
    setSubmitting(true);
    try {
      await serviceAPI.createRequest({ workerId: id, ...requestData });
      toast.success('Service request sent!');
      setShowRequestForm(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!worker) return null;

  const { user: workerUser, skills, experience, rating, availability, description, hourlyRate, totalJobs } = worker;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Profile Card */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <Avatar src={workerUser?.avatar} name={workerUser?.name} size="xl" />
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{workerUser?.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <HiLocationMarker className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500 text-sm">{workerUser?.location?.city || 'Location not set'}</span>
                </div>
              </div>
              <AvailabilityBadge availability={availability} />
            </div>

            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1 text-yellow-500">
                <HiStar className="w-4 h-4" />
                <span className="font-bold text-gray-800 dark:text-white">{rating?.average?.toFixed(1) || '0.0'}</span>
                <span className="text-gray-400">({rating?.count || 0} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <HiBriefcase className="w-4 h-4" />
                <span>{experience} years experience</span>
              </div>
              <div className="text-gray-500">
                <span className="font-medium text-gray-800 dark:text-white">{totalJobs}</span> jobs completed
              </div>
              {hourlyRate > 0 && (
                <div className="text-green-600 font-medium">₹{hourlyRate}/hr</div>
              )}
            </div>

            {description && <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>}

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {skills?.map((skill) => (
                <span key={skill} className="badge bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Contact & CTA */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-5 border-t border-gray-100 dark:border-gray-700">
          {workerUser?.phone && (
            <a href={`tel:${workerUser.phone}`} className="btn-secondary flex items-center justify-center gap-2 flex-1">
              <HiPhone className="w-4 h-4" /> {workerUser.phone}
            </a>
          )}
          {user?.role !== 'worker' && user?.role !== 'admin' && (
            <button
              onClick={() => isAuthenticated ? setShowRequestForm(!showRequestForm) : navigate('/login')}
              className="btn-primary flex-1"
            >
              {showRequestForm ? 'Cancel Request' : '📋 Request Service'}
            </button>
          )}
        </div>
      </div>

      {/* Service Request Form */}
      {showRequestForm && (
        <div className="card mb-6 border-primary-200 dark:border-primary-800 animate-slide-up">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📋 Send Service Request</h2>
          <form onSubmit={handleRequest} className="space-y-4">
            <div>
              <label className="label">Service Type</label>
              <select value={requestData.serviceType} onChange={(e) => setRequestData(p => ({ ...p, serviceType: e.target.value }))} className="input-field">
                {skills?.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Describe the Work Needed *</label>
              <textarea
                value={requestData.description}
                onChange={(e) => setRequestData(p => ({ ...p, description: e.target.value }))}
                className="input-field min-h-[100px] resize-none"
                placeholder="Explain what needs to be done..."
                required
              />
            </div>
            <div>
              <label className="label">Your Address *</label>
              <input type="text" value={requestData.address} onChange={(e) => setRequestData(p => ({ ...p, address: e.target.value }))} className="input-field" placeholder="House no, street, village..." required />
            </div>
            <div>
              <label className="label">Preferred Date (Optional)</label>
              <input type="datetime-local" value={requestData.scheduledDate} onChange={(e) => setRequestData(p => ({ ...p, scheduledDate: e.target.value }))} className="input-field" min={new Date().toISOString().slice(0, 16)} />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Sending...' : 'Send Request'}
            </button>
          </form>
        </div>
      )}

      {/* Reviews */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
          Reviews ({reviews.length})
        </h2>
        {reviews.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="flex gap-3 pb-4 border-b border-gray-50 dark:border-gray-700 last:border-0">
                <Avatar src={review.user?.avatar} name={review.user?.name} size="sm" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-gray-900 dark:text-white">{review.user?.name}</span>
                    <StarRating rating={review.rating} />
                  </div>
                  {review.comment && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{review.comment}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
