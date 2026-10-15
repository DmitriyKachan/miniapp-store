import React, { createContext, useContext, useState } from 'react';
import type { Language, TranslationDictionary } from '../i18n/translations';
import { translations } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  formatCurrency: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language] = useState<Language>('ua');

  const setLanguage = (_lang: Language) => {
    // Pure Ukrainian localization for Flowers Lviv
  };

  const t = translations.ua;

  const formatCurrency = (amount: number): string => {
    return `${Math.round(amount).toLocaleString('uk-UA')} ₴`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatCurrency }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
