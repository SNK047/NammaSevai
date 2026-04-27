import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiSearch, HiLightningBolt, HiShieldCheck, HiStar, HiArrowRight } from 'react-icons/hi';
import useAuthStore from '../context/authStore';
import { useLanguage } from '../context/languageStore';

const CATEGORIES = {
  en: [
    { label: 'Electrician', icon: '⚡', color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600' },
    { label: 'Plumber', icon: '🔧', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
    { label: 'Mechanic', icon: '🔩', color: 'bg-red-50 dark:bg-red-900/20 text-red-600' },
    { label: 'Tutor', icon: '📚', color: 'bg-green-50 dark:bg-green-900/20 text-green-600' },
    { label: 'Carpenter', icon: '🪚', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' },
    { label: 'Painter', icon: '🎨', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' },
    { label: 'Mason', icon: '🧱', color: 'bg-stone-50 dark:bg-stone-900/20 text-stone-600' },
    { label: 'Driver', icon: '🚗', color: 'bg-gray-50 dark:bg-gray-800 text-gray-600' },
  ],
  ta: [
    { label: 'மின்னல்', icon: '⚡', color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600' },
    { label: 'பிளம்பர்', icon: '🔧', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
    { label: 'மெக்கானிக்', icon: '🔩', color: 'bg-red-50 dark:bg-red-900/20 text-red-600' },
    { label: 'டியூட்டர்', icon: '📚', color: 'bg-green-50 dark:bg-green-900/20 text-green-600' },
    { label: 'தச்சர்', icon: '🪚', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' },
    { label: 'வரைவாளர்', icon: '🎨', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' },
    { label: 'கிருஷ்ணர்', icon: '🧱', color: 'bg-stone-50 dark:bg-stone-900/20 text-stone-600' },
    { label: 'இயக்குநர்', icon: '🚗', color: 'bg-gray-50 dark:bg-gray-800 text-gray-600' },
  ]
};

export default function HomePage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { t, language } = useLanguage();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/services?search=${encodeURIComponent(search)}`);
  };

  const categories = CATEGORIES[language] || CATEGORIES.en;

  return (
    <div className="animate-fade-in">
      {/* Hero Section with Banner Image */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 text-white overflow-hidden">
        {/* Banner Image Background */}
        <div className="absolute inset-0">
          <img 
            src="/nammasevai.png" 
            alt="NammaSevai Banner" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-500/85 to-secondary-500/90" />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white" />
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-white" />
          <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 text-sm">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <span>{language === 'ta' ? 'தமிழ்நாடு, கர்நாடகா உள்ளிட்டவை' : 'Available in Tamil Nadu, Karnataka & more'}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
              {language === 'ta' ? 'உங்கள் அருகில் நம்பகமான' : 'Find Trusted Local'}
              <span className="text-yellow-300"> {language === 'ta' ? 'உள்ளூர் சேவைகள்' : 'Services'}</span>
              {language === 'ta' ? '' : ' Near You'}
            </h1>

            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              {t('heroSubtitle')}
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3 max-w-xl">
              <div className="flex-1 relative">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-lg"
                />
              </div>
              <button type="submit" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-4 rounded-xl transition-all shadow-lg active:scale-95 whitespace-nowrap">
                {t('search')}
              </button>
            </form>

            <div className="flex flex-wrap gap-2 mt-4">
              {(language === 'ta' ? ['மின்னல்', 'பிளம்பர்', 'டியூட்டர்'] : ['Electrician', 'Plumber', 'Tutor']).map((s) => (
                <button key={s} onClick={() => navigate(`/services?skill=${s}`)}
                  className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-1.5 rounded-full transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">648+</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('verifiedWorkers')}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">2000+</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('happyCustomers')}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">38</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('villagesCovered')}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">98%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('satisfactionRate')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('browseByService')}</h2>
          <p className="text-gray-500 dark:text-gray-400">{t('findRightProfessional')}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => navigate(`/services?skill=${cat.label}`)}
              className={`${cat.color} p-5 rounded-2xl flex flex-col items-center gap-3 hover:scale-105 transition-all duration-200 active:scale-95 group`}
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="font-semibold text-sm">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('howItWorks')}</h2>
            <p className="text-gray-500 dark:text-gray-400">{t('simpleSteps')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-md">
                🔍
              </div>
              <span className="absolute top-0 right-1/4 text-6xl font-black text-primary-100 dark:text-gray-700 -z-10 select-none">
                01
              </span>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{language === 'ta' ? 'சேவையைத் தேடு' : t('searchService')}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {language === 'ta' ? 'சேவை வகை அல்லது இடத்தின் மூலம் சரியான தொழிலாளரைக் கண்டுபிடியுங்கள்.' : 'Find the right worker by service type or location in seconds.'}
              </p>
            </div>
            <div className="relative text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-md">
                📞
              </div>
              <span className="absolute top-0 right-1/4 text-6xl font-black text-primary-100 dark:text-gray-700 -z-10 select-none">
                02
              </span>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{language === 'ta' ? 'கோரிக்கை & இணைக்க' : t('requestConnect')}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {language === 'ta' ? 'தொழிலாளருக்கு நேரடியாக சேவை கோரிக்கை அனுப்புங்கள்.' : 'Send a service request directly to the worker.'}
              </p>
            </div>
            <div className="relative text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-md">
                ✅
              </div>
              <span className="absolute top-0 right-1/4 text-6xl font-black text-primary-100 dark:text-gray-700 -z-10 select-none">
                03
              </span>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{language === 'ta' ? 'வேலையை முடி' : t('getItDone')}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {language === 'ta' ? 'தொழிலாளர் வந்து வேலையை முடித்து, நீங்கள் மதிப்பீடு அளியுங்கள்.' : 'Worker visits, completes the job, and you rate the service.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Complaint CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-secondary-500 to-primary-500 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{t('civicComplaint')}</h2>
            <p className="text-blue-100 max-w-lg">
              {t('civicComplaintDesc')}
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link to="/complaints" className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-all">
              {t('viewComplaints')}
            </Link>
            <Link
              to={isAuthenticated ? '/complaints/new' : '/login'}
              className="bg-white text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all flex items-center gap-2"
            >
              {t('raiseIssue')} <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA for workers */}
      <section className="bg-gray-900 dark:bg-gray-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{t('skilledWorker')}</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            {t('skilledWorkerDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=worker" className="btn-primary inline-flex items-center justify-center gap-2">
              {t('registerAsWorker')} <HiArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/services" className="btn-secondary inline-flex items-center justify-center">
              {language === 'ta' ? 'தொழிலாளர்களைப் பார்' : t('browseWorkers')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}