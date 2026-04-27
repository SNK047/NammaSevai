import { Link } from 'react-router-dom';
import { HiLocationMarker, HiThumbUp, HiClock } from 'react-icons/hi';
import { StatusBadge, Avatar } from '../common';
import { formatDistanceToNow } from 'date-fns';

const categoryIcons = {
  Road: '🛣️', Water: '💧', Electricity: '⚡', Sanitation: '🗑️',
  'Street Light': '💡', Others: '📋',
};

export default function ComplaintCard({ complaint, onUpvote }) {
  const { title, category, description, status, location, user, upvotes, createdAt, _id } = complaint;

  return (
    <div className="card hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2">
          <span className="text-2xl">{categoryIcons[category] || '📋'}</span>
          <div>
            <Link to={`/complaints/${_id}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 transition-colors line-clamp-1">
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
      {complaint.imageURL && (
        <img src={complaint.imageURL} alt="Complaint" className="w-full h-32 object-cover rounded-xl mb-3" />
      )}

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 dark:border-gray-700 pt-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Avatar src={user?.avatar} name={user?.name} size="sm" />
            <span>{user?.name}</span>
          </div>
          {location?.city && (
            <div className="flex items-center gap-1">
              <HiLocationMarker className="w-3 h-3" />
              <span>{location.city}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {onUpvote && (
            <button
              onClick={() => onUpvote(_id)}
              className="flex items-center gap-1 hover:text-primary-500 transition-colors"
            >
              <HiThumbUp className="w-3.5 h-3.5" />
              <span>{upvotes?.length || 0}</span>
            </button>
          )}
          <div className="flex items-center gap-1">
            <HiClock className="w-3 h-3" />
            <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
