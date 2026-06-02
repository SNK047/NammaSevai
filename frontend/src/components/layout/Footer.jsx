import { Link } from 'react-router-dom';
import { FiHeart, FiTwitter, FiGithub, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <div>
                <span className="font-bold text-stone-800 dark:text-white block">NammaSevai</span>
                <span className="text-xs text-stone-500">நம்ம சேவை</span>
              </div>
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              {window.innerWidth > 768 ? 'Connecting Tamil Nadu & Karnataka with trusted local services. Empowering communities to raise civic issues.' : 'Connecting communities with trusted local services.'}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-stone-800 dark:text-white mb-3 text-sm">Quick Links</h4>
            <div className="space-y-2">
              {[
                { to: '/services', label: 'Find Services' },
                { to: '/complaints', label: 'View Complaints' },
                { to: '/complaints/new', label: 'Raise Complaint' },
                { to: '/register', label: 'Register as Worker' },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="block text-sm text-stone-500 dark:text-stone-400 hover:text-primary-600 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-stone-800 dark:text-white mb-3 text-sm">Popular Services</h4>
            <div className="flex flex-wrap gap-2">
              {['Electrician', 'Plumber', 'Mechanic', 'Tutor', 'Carpenter', 'Painter'].map((cat) => (
                <Link
                  key={cat}
                  to={`/services?skill=${cat}`}
                  className="text-xs px-2.5 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-all"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-stone-200 dark:border-stone-700 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-stone-400">© 2024 NammaSevai. All rights reserved.</p>
          <p className="text-xs text-stone-400 flex items-center gap-1">
            Made with <FiHeart size={12} className="text-red-500" /> for Tamil Nadu & Karnataka
          </p>
        </div>
      </div>
    </footer>
  );
}
