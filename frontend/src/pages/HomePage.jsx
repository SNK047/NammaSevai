import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiSearch, HiStar, HiLightningBolt, HiShieldCheck, HiUserGroup, HiLocationMarker, HiArrowRight, HiCheckCircle } from 'react-icons/hi';
import useAuthStore from '../context/authStore';
import { useLanguage } from '../context/languageStore';

const CATEGORIES = {
  en: [
    { label: 'Electrician', icon: '⚡', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
    { label: 'Plumber', icon: '🔧', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
    { label: 'Mechanic', icon: '🔩', color: 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400' },
    { label: 'Tutor', icon: '📚', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
    { label: 'Carpenter', icon: '🪚', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' },
    { label: 'Painter', icon: '🎨', color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400' },
    { label: 'Mason', icon: '🧱', color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' },
    { label: 'Driver', icon: '🚗', color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400' },
  ],
  ta: [
    { label: 'மின்னல்', icon: '⚡', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
    { label: 'பிளம்பர்', icon: '🔧', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
    { label: 'மெக்கானிக்', icon: '🔩', color: 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400' },
    { label: 'டியூட்டர்', icon: '📚', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
    { label: 'தச்சர்', icon: '🪚', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' },
    { label: 'வரைவாளர்', icon: '🎨', color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400' },
    { label: 'கிருஷ்ணர்', icon: '🧱', color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' },
    { label: 'இயக்குநர்', icon: '🚗', color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400' },
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
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500" />
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-white rounded-full mix-blend-overlay filter blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 text-sm text-white">
              <HiCheckCircle className="w-4 h-4 text-green-300" />
              <span>{language === 'ta' ? 'தமிழ்நாடு, கர்நாடகா உள்ளிட்டவை' : 'Available in Tamil Nadu, Karnataka & more'}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5 text-white">
              {language === 'ta' ? 'உங்கள் அருகில் நம்பகமான' : 'Find Trusted Local'}
              <span className="text-yellow-300"> {language === 'ta' ? 'உள்ளூர் சேவைகள்' : 'Services'}</span>
              {language === 'ta' ? '' : ' Near You'}
            </h1>

            <p className="text-lg md:text-xl text-primary-100 mb-8 leading-relaxed">
              {t('heroSubtitle')}
            </p>

            {/* Enhanced Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mb-6">
              <div className="flex-1 relative">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-stone-900 text-base focus:outline-none focus:ring-2 focus:ring-primary-400 shadow-xl"
                />
              </div>
              <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg active:scale-95 whitespace-nowrap">
                {t('search')}
              </button>
            </form>

            {/* Quick Search Tags */}
            <div className="flex flex-wrap gap-2">
              {(language === 'ta' ? ['மின்னல்', 'பிளம்பர்', 'டியூட்டர்'] : ['Electrician', 'Plumber', 'Tutor']).map((s) => (
                <button key={s} onClick={() => navigate(`/services?skill=${s}`)}
                  className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-1.5 rounded-full transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" className="dark:fill-stone-800" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-stone-800 border-b border-stone-100 dark:border-stone-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl mb-3">
                <HiUserGroup className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <p className="text-3xl font-bold text-stone-800 dark:text-white">648+</p>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{t('verifiedWorkers')}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl mb-3">
                <HiStar className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
              </div>
              <p className="text-3xl font-bold text-stone-800 dark:text-white">2000+</p>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{t('happyCustomers')}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl mb-3">
                <HiLocationMarker className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-3xl font-bold text-stone-800 dark:text-white">38</p>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{t('villagesCovered')}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl mb-3">
                <HiShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-3xl font-bold text-stone-800 dark:text-white">98%</p>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{t('satisfactionRate')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-white mb-2">{t('browseByService')}</h2>
          <p className="text-stone-500 dark:text-stone-400">{t('findRightProfessional')}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => navigate(`/services?skill=${cat.label}`)}
              className={`${cat.color} p-5 rounded-2xl flex flex-col items-center gap-3 hover:scale-105 transition-all duration-200 active:scale-95 group shadow-sm hover:shadow-md`}
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="font-semibold text-sm">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-stone-50 dark:bg-stone-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-white mb-2">{t('howItWorks')}</h2>
            <p className="text-stone-500 dark:text-stone-400">{t('simpleSteps')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative text-center p-6">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
                🔍
              </div>
              <span className="absolute top-0 right-1/4 text-6xl font-black text-primary-100 dark:text-stone-700 -z-10 select-none">
                01
              </span>
              <h3 className="font-bold text-stone-800 dark:text-white mb-2">{language === 'ta' ? 'சேவையைத் தேடு' : t('searchService')}</h3>
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                {language === 'ta' ? 'சேவை வகை அல்லது இடத்தின் மூலம் சரியான தொழிலாளரைக் கண்டுபிடியுங்கள்.' : 'Find the right worker by service type or location in seconds.'}
              </p>
            </div>
            <div className="relative text-center p-6">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
                📞
              </div>
              <span className="absolute top-0 right-1/4 text-6xl font-black text-primary-100 dark:text-stone-700 -z-10 select-none">
                02
              </span>
              <h3 className="font-bold text-stone-800 dark:text-white mb-2">{language === 'ta' ? 'கோரிக்கை & இணைக்க' : t('requestConnect')}</h3>
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                {language === 'ta' ? 'தொழிலாளருக்கு நேரடியாக சேவை கோரிக்கை அனுப்புங்கள்.' : 'Send a service request directly to the worker.'}
              </p>
            </div>
            <div className="relative text-center p-6">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
                ✅
              </div>
              <span className="absolute top-0 right-1/4 text-6xl font-black text-primary-100 dark:text-stone-700 -z-10 select-none">
                03
              </span>
              <h3 className="font-bold text-stone-800 dark:text-white mb-2">{language === 'ta' ? 'வேலையை முடி' : t('getItDone')}</h3>
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                {language === 'ta' ? 'தொழிலாளர் வந்து வேலையை முடித்து, நீங்கள் மதிப்பீடு அளியுங்கள்.' : 'Worker visits, completes the job, and you rate the service.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Complaint CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-3xl p-8 md:p-12 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{t('civicComplaint')}</h2>
              <p className="text-secondary-100 max-w-lg">
                {t('civicComplaintDesc')}
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link to="/complaints" className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-all">
                {t('viewComplaints')}
              </Link>
              <Link
                to={isAuthenticated ? '/complaints/new' : '/login'}
                className="bg-white text-secondary-600 font-bold px-6 py-3 rounded-xl hover:bg-secondary-50 transition-all flex items-center gap-2"
              >
                {t('raiseIssue')} <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA for workers */}
      <section className="bg-stone-900 dark:bg-stone-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{t('skilledWorker')}</h2>
          <p className="text-stone-400 mb-8 max-w-xl mx-auto">
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