import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiUpload, HiLocationMarker } from 'react-icons/hi';
import { complaintAPI } from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Road', 'Water', 'Electricity', 'Sanitation', 'Street Light', 'Others'];
const CATEGORY_ICONS = { Road: '🛣️', Water: '💧', Electricity: '⚡', Sanitation: '🗑️', 'Street Light': '💡', Others: '📋' };

export default function NewComplaintPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', category: '', description: '', imageURL: '',
    location: { address: '', city: '' },
  });
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const handleLocationChange = (key, value) => setForm((p) => ({ ...p, location: { ...p.location, [key]: value } }));

  // Simulate image upload (in production: upload to Cloudinary)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be less than 5MB');
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setForm((p) => ({ ...p, imageURL: reader.result })); // In production, use actual upload URL
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.description) {
      return toast.error('Please fill all required fields');
    }
    setSubmitting(true);
    try {
      await complaintAPI.create(form);
      toast.success('Complaint submitted successfully!');
      navigate('/complaints');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Raise a Complaint</h1>
        <p className="text-gray-500 dark:text-gray-400">Report civic issues in your area. All complaints are publicly tracked.</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        {/* Title */}
        <div>
          <label className="label">Complaint Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="input-field"
            placeholder="e.g., Pothole on Main Road near Market"
            required
            maxLength={100}
          />
          <p className="text-xs text-gray-400 mt-1">{form.title.length}/100</p>
        </div>

        {/* Category */}
        <div>
          <label className="label">Category *</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleChange('category', cat)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${form.category === cat ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-primary-200'}`}
              >
                <div className="text-2xl">{CATEGORY_ICONS[cat]}</div>
                <div className="text-xs font-medium mt-1 text-gray-700 dark:text-gray-300">{cat}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="label">Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="input-field min-h-[120px] resize-none"
            placeholder="Describe the issue in detail — when did it start, how severe is it..."
            required
            maxLength={1000}
          />
          <p className="text-xs text-gray-400 mt-1">{form.description.length}/1000</p>
        </div>

        {/* Image upload */}
        <div>
          <label className="label">Photo Evidence (Optional)</label>
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center hover:border-primary-300 transition-colors">
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full max-h-48 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => { setPreview(null); setForm(p => ({ ...p, imageURL: '' })); }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <HiUpload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Click to upload photo</p>
                <p className="text-xs text-gray-300 mt-1">Max 5MB, JPG/PNG</p>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="label flex items-center gap-1"><HiLocationMarker className="w-4 h-4" /> Location</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={form.location.address}
              onChange={(e) => handleLocationChange('address', e.target.value)}
              className="input-field"
              placeholder="Street / Area"
            />
            <input
              type="text"
              value={form.location.city}
              onChange={(e) => handleLocationChange('city', e.target.value)}
              className="input-field"
              placeholder="City / Town"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1">
            {submitting ? 'Submitting...' : '📤 Submit Complaint'}
          </button>
        </div>
      </form>
    </div>
  );
}
