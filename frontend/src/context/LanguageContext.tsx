import React, { createContext, useContext, useState } from 'react';
import type { Language, TranslationDictionary } from '../i18n/translations';
import { translations } from '../i18n/translations';
import { getTelegramUser } from '../utils/telegram';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  formatCurrency: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_STORAGE_KEY = 'tg_shop_language_v1';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language;
      if (saved && ['ru', 'pl', 'ua'].includes(saved)) return saved;
      
      const tgUser = getTelegramUser();
      if (tgUser?.language_code) {
        const code = tgUser.language_code.toLowerCase();
        if (code.startsWith('pl')) return 'pl';
        if (code.startsWith('uk') || code.startsWith('ua')) return 'ua';
        if (code.startsWith('ru')) return 'ru';
      }
    } catch {}
    return 'ru'; // Default to Russian as requested
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {}
  };

  const t = translations[language] || translations.ru;

  const formatCurrency = (amount: number): string => {
    return `${Number(amount).toLocaleString('pl-PL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} zł`;
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
