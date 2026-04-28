import { Link } from 'react-router-dom';
import { HiLocationMarker, HiBriefcase, HiStar } from 'react-icons/hi';
import { Avatar, AvailabilityBadge } from '../common';

export default function WorkerCard({ worker }) {
  const { user, skills, experience, rating, availability, id, _id, rating_average, rating_count } = worker;
  const workerId = id || _id;
  const avgRating = rating?.average || rating_average || 0;
  const count = rating?.count || rating_count || 0;

  return (
    <Link to={`/workers/${workerId}`} className="block">
      <div className="card-hover group">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar src={user?.avatar} name={user?.name} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">
              {user?.name}
            </h3>
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mt-0.5">
              <HiLocationMarker className="w-3 h-3" />
              <span className="truncate">{user?.city || user?.location?.city || 'Location not set'}</span>
            </div>
            <div className="mt-1.5">
              <AvailabilityBadge availability={availability} />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skills?.slice(0, 3).map((skill) => (
            <span key={skill} className="badge bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs px-2 py-0.5">
              {skill}
            </span>
          ))}
          {skills?.length > 3 && (
            <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs">+{skills.length - 3}</span>
          )}
        </div>

        {/* Footer stats */}
        <div className="flex items-center justify-between text-sm border-t border-gray-50 dark:border-gray-700 pt-3">
          <div className="flex items-center gap-1 text-yellow-500">
            <HiStar className="w-4 h-4" />
            <span className="font-semibold text-gray-800 dark:text-gray-200">{avgRating.toFixed(1)}</span>
            <span className="text-gray-400 text-xs">({count})</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
            <HiBriefcase className="w-3.5 h-3.5" />
            <span>{experience}yr exp.</span>
          </div>
          <span className="text-primary-600 dark:text-primary-400 text-xs font-medium group-hover:underline">
            View Profile →
          </span>
        </div>
      </div>
    </Link>
  );
}
