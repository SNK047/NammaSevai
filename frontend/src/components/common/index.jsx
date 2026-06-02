// Spinner
export function Spinner({ size = 'md', color = 'primary' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} animate-spin rounded-full border-2 border-stone-200 border-t-primary-500`} />
  );
}

// Full page loading
export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-stone-400">Loading...</p>
    </div>
  );
}

// Star Rating display
export function StarRating({ rating = 0, count, size = 'sm' }) {
  const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' };
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`${sizes[size]} ${star <= Math.round(rating) ? 'text-amber-400' : 'text-stone-200 dark:text-stone-600'}`}>
            ★
          </span>
        ))}
      </div>
      <span className={`${sizes[size]} font-medium text-stone-700 dark:text-stone-300`}>{rating.toFixed(1)}</span>
      {count !== undefined && <span className={`${sizes[size]} text-stone-400`}>({count})</span>}
    </div>
  );
}

// Interactive star picker
export function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-3xl transition-colors ${star <= value ? 'text-amber-400' : 'text-stone-300 hover:text-amber-300'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// Status Badge
export function StatusBadge({ status }) {
  const map = {
    pending: { cls: 'badge-pending', label: 'Pending' },
    in_progress: { cls: 'badge-progress', label: 'In Progress' },
    resolved: { cls: 'badge-resolved', label: 'Resolved' },
    completed: { cls: 'badge-resolved', label: 'Completed' },
    accepted: { cls: 'badge-progress', label: 'Accepted' },
    rejected: { cls: 'badge-rejected', label: 'Rejected' },
    cancelled: { cls: 'badge-rejected', label: 'Cancelled' },
  };
  const item = map[status] || { cls: 'badge bg-stone-100 text-stone-800', label: status };
  return <span className={item.cls}>{item.label}</span>;
}

// Availability Badge
export function AvailabilityBadge({ availability }) {
  const map = {
    available: 'badge-available',
    busy: 'badge-busy',
    offline: 'badge-offline',
  };
  return (
    <span className={`badge ${map[availability] || map.offline}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1 inline-block ${availability === 'available' ? 'bg-green-500' : availability === 'busy' ? 'bg-amber-500' : 'bg-stone-400'}`} />
      {availability?.charAt(0).toUpperCase() + availability?.slice(1)}
    </span>
  );
}

// Empty state
export function EmptyState({ icon, title, message, action }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-5xl mb-4">{icon || '📭'}</div>
      <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200 mb-1">{title || 'Nothing here'}</h3>
      <p className="text-stone-400 text-sm mb-5">{message}</p>
      {action}
    </div>
  );
}

// Skeleton card
export function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="flex gap-3">
        <div className="w-14 h-14 rounded-xl bg-stone-200 dark:bg-stone-700 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-2/3" />
          <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded w-1/2" />
          <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
}

// Avatar with fallback
export function Avatar({ src, name, size = 'md' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-12 h-12 text-sm', lg: 'w-16 h-16 text-lg', xl: 'w-24 h-24 text-2xl' };
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  if (src) {
    return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover flex-shrink-0`} />;
  }
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md`}>
      {initials}
    </div>
  );
}
