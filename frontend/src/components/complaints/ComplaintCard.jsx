import { Link } from 'react-router-dom';
import { HiLocationMarker, HiThumbUp, HiClock } from 'react-icons/hi';
import { StatusBadge, Avatar } from '../common';
import { formatDistanceToNow } from 'date-fns';

const categoryIcons = {
  Road: '🛣️', Water: '💧', Electricity: '⚡', Sanitation: '🗑️',
  'Street Light': '💡', Others: '📋',
};

export default function ComplaintCard({ complaint, onUpvote }) {
  const { title, category, description, status, location, user, upvotes, createdAt, created_at, id, _id } = complaint;
  const complaintId = id || _id;
  const createdTime = createdAt || created_at;

  return (
    <div className="card hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2">
          <span className="text-2xl">{categoryIcons[category] || '📋'}</span>
          <div>
            <Link to={`/complaints/${complaintId}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 transition-colors line-clamp-1">
              {title}
            </Link>
            <span className="text-xs text-gray-400">{category}</span>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{description}</p>

      {/* Image if present */}
      {(complaint.imageURL || complaint.image_url) && (
        <div className="w-full h-32 rounded-xl mb-3 overflow-hidden bg-stone-100 dark:bg-stone-800">
          <img 
            src={complaint.imageURL || complaint.image_url} 
            alt="Complaint" 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 dark:border-gray-700 pt-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Avatar src={user?.avatar} name={user?.name} size="sm" />
            <span>{user?.name}</span>
          </div>
          {(location?.city || complaint.city) && (
            <div className="flex items-center gap-1">
              <HiLocationMarker className="w-3 h-3" />
              <span>{location?.city || complaint.city}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {onUpvote && (
            <button
              onClick={() => onUpvote(complaintId)}
              className="flex items-center gap-1 hover:text-primary-500 transition-colors"
            >
              <HiThumbUp className="w-3.5 h-3.5" />
              <span>{upvotes?.length || 0}</span>
            </button>
          )}
          <div className="flex items-center gap-1">
            <HiClock className="w-3 h-3" />
            <span>{formatDistanceToNow(new Date(createdTime), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
