import { createContext, useContext, useMemo } from 'react';
import { translations } from '@/data/translations';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const LanguageContext = createContext(null);

function getValueByPath(source, path) {
  return path.split('.').reduce((current, key) => current?.[key], source);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useLocalStorage('file-tools-language', 'en');

  const value = useMemo(() => {
    const dictionary = translations[language] ?? translations.en;

    return {
      language,
      setLanguage,
      availableLanguages: [
        { code: 'en', label: 'EN' },
        { code: 'fr', label: 'FR' },
      ],
      t: (path, fallback = path) => getValueByPath(dictionary, path) ?? fallback,
    };
  }, [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

