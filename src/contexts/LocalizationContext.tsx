import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { en } from '../localization/en';
import { vi } from '../localization/vi';
import { Language } from '../types';

type Translations = typeof en;

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => any;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const translations: Record<Language, Translations> = {
  [Language.EN]: en,
  [Language.VI]: vi,
};

// Helper function to get nested keys
const getNestedTranslation = (obj: any, key: string): any => {
  return key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
};

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
        const storedLang = localStorage.getItem('creator-suite-language') as Language;
        return storedLang && Object.values(Language).includes(storedLang) ? storedLang : Language.EN;
    } catch {
        return Language.EN;
    }
  });

  useEffect(() => {
    try {
        localStorage.setItem('creator-suite-language', language);
        document.documentElement.lang = language;
    } catch (error) {
        console.error("Could not save language to localStorage", error);
    }
  }, [language]);

  const t = (key: string): any => {
    const translation = getNestedTranslation(translations[language], key);
    if (translation === undefined) {
        // Fallback to English if translation is missing
        const fallback = getNestedTranslation(translations[Language.EN], key);
        return fallback || key;
    }
    return translation;
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};