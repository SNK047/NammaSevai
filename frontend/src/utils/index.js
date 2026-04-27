// Format currency in Indian Rupees
export const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

// Truncate text
export const truncate = (text, length = 100) =>
  text?.length > length ? text.slice(0, length) + '...' : text;

// Get initials from name
export const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

// Status label map
export const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  completed: 'Completed',
  accepted: 'Accepted',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

// Category emoji map
export const CATEGORY_EMOJIS = {
  Road: '🛣️', Water: '💧', Electricity: '⚡',
  Sanitation: '🗑️', 'Street Light': '💡', Others: '📋',
};

// Service skill icons
export const SKILL_ICONS = {
  Electrician: '⚡', Plumber: '🔧', Mechanic: '🔩',
  Tutor: '📚', Carpenter: '🪚', Painter: '🎨',
  Mason: '🧱', Cleaner: '🧹', Others: '🛠️',
};

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};
