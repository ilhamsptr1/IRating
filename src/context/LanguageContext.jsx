import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || 'id';
  });

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    // Jika bahasa arab, set direction to RTL, else LTR
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  // Convert internal language code to TMDB locale format
  const getTmdbLocale = () => {
    switch(language) {
      case 'id': return 'id-ID';
      case 'en': return 'en-US';
      case 'fr': return 'fr-FR';
      case 'es': return 'es-ES';
      case 'ar': return 'ar-SA';
      default: return 'id-ID';
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getTmdbLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
