import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in">
      <div className="text-8xl mb-6">🔍</div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
      <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-3">Page Not Found</h2>
      <p className="text-gray-400 max-w-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary">← Back to Home</Link>
    </div>
  );
}
