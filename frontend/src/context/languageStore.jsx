import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Navbar
    home: 'Home',
    services: 'Services',
    complaints: 'Complaints',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    getStarted: 'Get Started',
    adminPanel: 'Admin Panel',
    myDashboard: 'My Dashboard',
    loginToContinue: 'Login to continue',
    
    // Home Page
    findTrustedServices: 'Find Trusted Local Services Near You',
    heroSubtitle: 'NammaSevai connects you with verified local workers — electricians, plumbers, tutors & more. Also raise civic complaints and track their resolution.',
    searchPlaceholder: 'Search electrician, plumber...',
    search: 'Search',
    browseByService: 'Browse by Service',
    findRightProfessional: 'Find the right professional for any job',
    howItWorks: 'How It Works',
    simpleSteps: 'Simple steps to get your work done',
    searchService: 'Search Service',
    searchServiceDesc: 'Find the right worker by service type or location in seconds.',
    requestConnect: 'Request & Connect',
    requestConnectDesc: 'Send a service request directly to the worker.',
    getItDone: 'Get It Done',
    getItDoneDesc: 'Worker visits, completes the job, and you rate the service.',
    civicComplaint: 'Have a Civic Complaint?',
    civicComplaintDesc: 'Broken road, water shortage, power outage? Report it here and track the resolution in real-time. Your voice matters.',
    viewComplaints: 'View Complaints',
    raiseIssue: 'Raise Issue',
    skilledWorker: 'Are You a Skilled Worker?',
    skilledWorkerDesc: 'Join NammaSevai and connect with thousands of customers in your area. Get more work, build your reputation.',
    registerAsWorker: 'Register as Worker',
    browseWorkers: 'Browse Workers',
    verifiedWorkers: 'Verified Workers',
    happyCustomers: 'Happy Customers',
    villagesCovered: 'Villages Covered',
    satisfactionRate: 'Satisfaction Rate',
    
    // Services Page
    findServiceProviders: 'Find Service Providers',
    verifiedWorkersAvailable: 'verified workers available',
    searchByCity: 'Search by city or area...',
    filters: 'Filters',
    allServices: 'All Services',
    serviceType: 'Service Type',
    availability: 'Availability',
    any: 'Any',
    availableNow: 'Available Now',
    busy: 'Busy',
    offline: 'Offline',
    minimumRating: 'Minimum Rating',
    anyRating: 'Any Rating',
    above4Star: '4★ & above',
    above3Star: '3★ & above',
    noWorkersFound: 'No workers found',
    tryAdjustingFilters: 'Try adjusting your filters or search in a different area.',
    clearFilters: 'Clear Filters',
    allCategory: 'All Services',
    previous: 'Previous',
    next: 'Next',
    pageOf: 'Page {current} of {total}',
    
    // Footer
    aboutNammaSevai: 'About NammaSevai',
    aboutDesc: 'NammaSevai is a hyperlocal service finder that connects users with verified local workers for all their service needs.',
    quickLinks: 'Quick Links',
    contactUs: 'Contact Us',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    allRightsReserved: 'All rights reserved.',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    yes: 'Yes',
    no: 'No',
  },
  ta: {
    // Navbar
    home: 'முகப்பு',
    services: 'சேவைகள்',
    complaints: 'புகார்கள்',
    login: 'உள்நுழைய',
    logout: 'வெளியேறு',
    register: 'பதிவு செய்',
    getStarted: 'துவக்க���ங்கள்',
    adminPanel: 'நிர்வாக பகுதி',
    myDashboard: 'என் பகுதி',
    loginToContinue: 'தொடர உள்நுழைய',
    
    // Home Page
    findTrustedServices: 'உங்கள் அருகில் நம்பகமான உள்ளூர் சேவைகளைக் கண்டுபிடியுங்கள்',
    heroSubtitle: 'நம்ம சேவை மின்னல், பிளம்பர், டியூட்டர் மற்றும் பலருக்கு நம்பகமான உள்ளூர் தொழிலாளர்களை உங்களுக்கு இணைக்கிறது. மக்கள் புகார்களைத் தெரிவித்து அவற்றின் முடிவைக் கண்காணிக்கவும்.',
    searchPlaceholder: 'மின்னல், பிளம்பர்...',
    search: 'தேடு',
    browseByService: 'சேவை வகையின்படி பார்',
    findRightProfessional: 'எந்த வேலைக்கும் சரியான தொழிலாளரைக் கண்டுபிடியுங்கள்',
    howItWorks: 'இது எப்படி வேலை செய்கிறது',
    simpleSteps: 'உங்கள் வேலையைப் பெற சுலபமான வழிமுறைகள்',
    searchService: 'சேவையைத் தேடு',
    searchServiceDesc: 'சேவை வகை அல்லது இடத்தின் மூலம் சரியான தொழிலாளரைக் கண்டுபிடியுங்கள்.',
    requestConnect: 'கோரிக்கை & இணைக்க',
    requestConnectDesc: 'தொழிலாளருக்கு நேரடியாக சேவை கோரிக்கை அனுப்புங்கள்.',
    getItDone: 'வேலையை முடிக்க',
    getItDoneDesc: 'தொழிலாளர் வந்து வேலையை முடித்து, நீங்கள் மதிப்பீடு அளியுங்கள்.',
    civicComplaint: 'மக்கள் புகமா உள்ளதா?',
    civicComplaintDesc: ' சாலை பழுது, தண்ணீர் பக்க்கம், மின்னிழப்பா? இங்கே தெரிவித்து அதன் முடிவைத் தெரியலாம். உங்கள் குரல் முக்கியம்.',
    viewComplaints: 'புகார்களைப் பார்',
    raiseIssue: 'புகார் தெரிவி',
    skilledWorker: 'நீங்கள் திறமையான தொழிலாளரா?',
    skilledWorkerDesc: 'நம்ம சேவையில் சேர்ந்து உங்கள் பகுதியில் ஆயிரக்கணக்கான வாடிக்கையாளர்களை அடையுங்கள். அதிக வேலை பெறுங்கள்.',
    registerAsWorker: 'தொழிலாளராகப் பதிவு செய்',
    browseWorkers: 'தொழிலாளர்களைப் பார்',
    verifiedWorkers: 'சரிபார்க்கப்பட்ட தொழிலாளர்கள்',
    happyCustomers: 'மகிழ்ச்சியான வாடிக்கையாளர்கள்',
    villagesCovered: 'மாவட்டங்கள்',
    satisfactionRate: 'திருப்தி விகிதம்',
    
    // Services Page
    findServiceProviders: 'சேவை வழங்குபவர்களைக் கண்டுபிடியுங்கள்',
    verifiedWorkersAvailable: 'சரிபார்க்கப்பட்ட தொழிலாளர்கள் உள்ளன',
    searchByCity: 'நகரம��� அ���்லது பகுதியின் மூலம் தேடு...',
    filters: 'வடிகட்டி',
    allServices: 'எல்லா சேவைகள்',
    serviceType: 'சேவை வகை',
    availability: 'இருக்கிறதா',
    any: 'ஏதாவது',
    availableNow: 'இப்போது இருக்கிறது',
    busy: 'வேலை இருக்கிறது',
    offline: 'இல்லை',
    minimumRating: 'குறைந்த மதிப்பீடு',
    anyRating: 'ஏதாவது மதிப்பீடு',
    above4Star: '4★ மேல்',
    above3Star: '3★ மேல்',
    noWorkersFound: 'தொழிலாளர் கிடைக்கவில்லை',
    tryAdjustingFilters: 'வடிகட்டியை மாற்றி முயற்சி செயுங்கள்.',
    clearFilters: 'வடிகட்டி அழி',
    allCategory: 'எல்லா சேவைகள்',
    previous: 'முன்',
    next: 'அடுத்த',
    pageOf: 'பக்கம்',
    
    // Footer
    aboutNammaSevai: 'நம்ம சேவை பற்றி',
    aboutDesc: 'நம்ம சேவை ஒரு உள்ளூர் சேவை கண்டுபிடிப்பு ஆகும். இது பயனர்களை அவர்களின் எல்லா சேவை தேவைகளுக்கு சரிபார்க்கப்பட்ட உள்ளூர் தொழிலாளர்களுடன் இணைக்கிறது.',
    quickLinks: 'விரைவு இணைப்புகள்',
    contactUs: 'தொடர்பு கொள்ளுங்கள்',
    privacyPolicy: 'தனியுரிமை கொள்கை',
    termsOfService: 'சேவை விதிமுறைகள்',
    allRightsReserved: 'எல்லா உரிமைகளும் பாதுக்கப்பட்டவை.',
    
    // Common
    loading: 'ஏற்றுகிறது...',
    error: 'தவறு',
    success: 'வெற்றி',
    submit: 'சமர்ப்பி',
    cancel: 'ரத்து',
    save: 'சேமி',
    delete: 'அழி',
    edit: 'திருத்து',
    view: 'பார்',
    yes: 'ஆம்',
    no: 'இல்லை',
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ta' : 'en');
  };

  const t = (key) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default useLanguage;