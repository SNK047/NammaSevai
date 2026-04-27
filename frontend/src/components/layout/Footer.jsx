import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xs">NS</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">NammaSevai</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Connecting rural India with trusted local services and empowering communities to raise civic issues.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Quick Links</h4>
            <div className="space-y-2">
              {[
                { to: '/services', label: 'Find Services' },
                { to: '/complaints', label: 'View Complaints' },
                { to: '/complaints/new', label: 'Raise Complaint' },
                { to: '/register', label: 'Register as Worker' },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="block text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {['Electrician', 'Plumber', 'Mechanic', 'Tutor', 'Carpenter', 'Painter'].map((cat) => (
                <Link
                  key={cat}
                  to={`/services?skill=${cat}`}
                  className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-all"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">© 2024 NammaSevai. All rights reserved.</p>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            Made with <FiHeart size={12} className="text-red-500" /> for Rural India
          </p>
        </div>
      </div>
    </footer>
  );
}
