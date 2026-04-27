import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiFilter, HiSearch, HiRefresh, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { workerAPI } from '../services/api';
import WorkerCard from '../components/services/WorkerCard';
import { SkeletonCard, EmptyState } from '../components/common';
import { useLanguage } from '../context/languageStore';
import toast from 'react-hot-toast';

const CATEGORY_DATA = {
  SkilledTrades: {
    name: 'Skilled Trades & Technical',
    icon: '🔧',
    skills: ['Electrician', 'Plumber', 'Carpenter', 'Mechanic', 'Welder', 'Mason', 'Painter', 'Blacksmith', 'HVAC Technician', 'Roofer', 'Tailor', 'Driver', 'Machine Operator']
  },
  Education: {
    name: 'Education & Training',
    icon: '📚',
    skills: ['Tutor', 'Teacher', 'Professor', 'Trainer', 'Librarian', 'Research Assistant']
  },
  Healthcare: {
    name: 'Healthcare & Caregiving',
    icon: '🏥',
    skills: ['Doctor', 'Nurse', 'Pharmacist', 'Lab Technician', 'Physiotherapist', 'Paramedic', 'Caregiver', 'Dentist']
  },
  FoodHospitality: {
    name: 'Food & Hospitality',
    icon: '🍳',
    skills: ['Chef', 'Waiter', 'Bartender', 'Hotel Receptionist', 'Housekeeping', 'Catering Worker', 'Baker']
  },
  Construction: {
    name: 'Construction & Infrastructure',
    icon: '🚧',
    skills: ['Civil Engineer', 'Surveyor', 'Site Supervisor', 'Heavy Equipment Operator', 'Road Worker', 'Architect']
  },
  RetailServices: {
    name: 'Retail & Services',
    icon: '🛒',
    skills: ['Shopkeeper', 'Cashier', 'Salesperson', 'Delivery Worker', 'Beautician', 'Security Guard', 'Cleaner']
  },
  Agriculture: {
    name: 'Agriculture & Outdoor',
    icon: '🌾',
    skills: ['Farmer', 'Gardener', 'Fisherman', 'Agricultural Technician', 'Forestry Worker']
  },
  Technology: {
    name: 'Technology & Office',
    icon: '💻',
    skills: ['IT Technician', 'Software Developer', 'Data Entry Operator', 'Graphic Designer', 'Accountant', 'Clerk']
  },
  CreativeMedia: {
    name: 'Creative & Media',
    icon: '🎨',
    skills: ['Artist', 'Photographer', 'Videographer', 'Musician', 'Actor', 'Writer']
  }
};

const ALL_SKILLS = Object.values(CATEGORY_DATA).flatMap(cat => cat.skills);

const getCategoryName = (key) => {
  const names = {
    SkilledTrades: 'திறமையான தொழில்கள்',
    Education: 'கல்வி & பயிற்சி',
    Healthcare: 'மருத்துவம் & பராமரிப்பு',
    FoodHospitality: 'உணவு & உதவி',
    Construction: 'கட்டுமானம்',
    RetailServices: 'சேவைகள்',
    Agriculture: 'விவசாயம்',
    Technology: 'தகவல் தொழில்',
    CreativeMedia: 'படைப்பாளர்கள்'
  };
  return names[key] || key;
};

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const { t, language } = useLanguage();

  const [filters, setFilters] = useState({
    skill: searchParams.get('skill') || '',
    city: searchParams.get('city') || '',
    availability: searchParams.get('availability') || '',
    minRating: searchParams.get('minRating') || '',
    page: 1,
  });

  const fetchWorkers = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
      const { data } = await workerAPI.getAll(params);
      setWorkers(data.workers);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load workers');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchWorkers(); }, [fetchWorkers]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleCategoryClick = (categoryKey) => {
    setActiveCategory(categoryKey === activeCategory ? null : categoryKey);
    setFilters((prev) => ({ ...prev, skill: '', page: 1 }));
    setSearchParams({});
  };

  const handleSkillClick = (skill) => {
    handleFilterChange('skill', filters.skill === skill ? '' : skill);
    setActiveCategory(null);
  };

  const clearFilters = () => {
    setFilters({ skill: '', city: '', availability: '', minRating: '', page: 1 });
    setSearchParams({});
    setActiveCategory(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  const activeFilterCount = [filters.skill, filters.city, filters.availability, filters.minRating].filter(Boolean).length;

  const getPageNumbers = () => {
    const total = pagination.pages || 1;
    const current = filters.page;
    const pages = [];
    
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (current >= total - 2) {
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        for (let i = current - 2; i <= current + 2; i++) pages.push(i);
      }
    }
    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">{t('findServiceProviders')}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {loading ? t('loading') : `${pagination.total || 0} ${t('verifiedWorkersAvailable')}`}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 flex-nowrap min-w-max pb-2">
          <button
            onClick={() => { setActiveCategory(null); handleFilterChange('skill', ''); }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${!activeCategory && !filters.skill ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900'}`}
          >
            {t('allCategory')}
          </button>
          {Object.entries(CATEGORY_DATA).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => handleCategoryClick(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${activeCategory === key ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900'}`}
            >
              <span>{cat.icon}</span>
              <span className="hidden sm:inline">{language === 'ta' ? getCategoryName(key) : cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Skills by Category */}
      {activeCategory && (
        <div className="card mb-6 animate-slide-up">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span className="text-xl">{CATEGORY_DATA[activeCategory].icon}</span>
            <span>{CATEGORY_DATA[activeCategory].name}</span>
          </h3>
          <div className="flex gap-2 flex-wrap">
            {CATEGORY_DATA[activeCategory].skills.map((skill) => (
              <button
                key={skill}
                onClick={() => handleSkillClick(skill)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${filters.skill === skill ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900'}`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search + Filter Bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            placeholder="Search by city or area..."
            className="input-field pl-12"
          />
        </div>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-all ${showFilter || activeFilterCount > 0 ? 'bg-primary-500 text-white border-primary-500' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200'}`}
        >
          <HiFilter className="w-4 h-4" />
          Filters {activeFilterCount > 0 && <span className="bg-white text-primary-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{activeFilterCount}</span>}
        </button>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-red-500 transition-colors">
            <HiRefresh className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="card mb-6 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Service Type</label>
              <select value={filters.skill} onChange={(e) => handleFilterChange('skill', e.target.value)} className="input-field">
                <option value="">All Services</option>
                {ALL_SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Availability</label>
              <select value={filters.availability} onChange={(e) => handleFilterChange('availability', e.target.value)} className="input-field">
                <option value="">Any</option>
                <option value="available">Available Now</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <div>
              <label className="label">Minimum Rating</label>
              <select value={filters.minRating} onChange={(e) => handleFilterChange('minRating', e.target.value)} className="input-field">
                <option value="">Any Rating</option>
                <option value="5">5★ Only</option>
                <option value="4">4★ & above</option>
                <option value="3">3★ & above</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Quick Filter Chips */}
      {!activeCategory && (
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => handleFilterChange('skill', '')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!filters.skill ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-300'}`}
          >
            All
          </button>
          {ALL_SKILLS.slice(0, 8).map((skill) => (
            <button
              key={skill}
              onClick={() => handleFilterChange('skill', filters.skill === skill ? '' : skill)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filters.skill === skill ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-300'}`}
            >
              {skill}
            </button>
          ))}
        </div>
      )}

      {/* Worker Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : workers.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No workers found"
          message="Try adjusting your filters or search in a different area."
          action={<button onClick={clearFilters} className="btn-primary">Clear Filters</button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {workers.map((worker) => <WorkerCard key={worker._id} worker={worker} />)}
        </div>
      )}

      {/* Pagination with Prev/Next */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${filters.page === 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-primary-300'}`}
          >
            <HiChevronLeft className="w-4 h-4" />
            {t('previous')}
          </button>
          
          <div className="flex gap-1">
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${filters.page === pageNum ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-primary-300'}`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === pagination.pages}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${filters.page === pagination.pages ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-primary-300'}`}
          >
            {t('next')}
            <HiChevronRight className="w-4 h-4" />
          </button>

          <span className="text-gray-500 text-sm ml-2">
            {language === 'ta' ? `பக்கம் ${filters.page} / ${pagination.pages}` : `Page ${filters.page} of ${pagination.pages}`}
          </span>
        </div>
      )}
    </div>
  );
}