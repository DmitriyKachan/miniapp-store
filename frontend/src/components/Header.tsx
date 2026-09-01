import React from 'react';
import { ShoppingBag, ShieldCheck, User, Search, X, Globe, Sparkles, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../i18n/translations';
import type { UserRole } from '../types';
import { hapticImpact } from '../utils/telegram';

interface HeaderProps {
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, searchQuery, onSearchChange }) => {
  const { totalCount } = useCart();
  const { mode, setMode, user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [showSearch, setShowSearch] = React.useState(false);
  const [showLangMenu, setShowLangMenu] = React.useState(false);
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);

  const selectLanguage = (lang: Language) => {
    hapticImpact('light');
    setLanguage(lang);
    setShowLangMenu(false);
  };

  const selectRole = (newRole: UserRole) => {
    hapticImpact('medium');
    setMode(newRole);
    setShowRoleMenu(false);
  };

  const getLangFlag = (lang: Language) => {
    switch (lang) {
      case 'pl': return '🇵🇱 PL';
      case 'ua': return '🇺🇦 UA';
      default: return '🇷🇺 RU';
    }
  };

  const getRoleLabel = (r: UserRole) => {
    switch (r) {
      case 'admin': return { label: 'Флорист 🌸', icon: ShieldCheck, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50 border-rose-200' };
      case 'courier': return { label: 'Курьер 🚗', icon: Truck, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200' };
      default: return { label: 'Клиент 🛍', icon: User, color: 'text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border-gray-200' };
    }
  };

  const currentRoleInfo = getRoleLabel(mode);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#18222d]/90 backdrop-blur-md border-b border-rose-100/60 dark:border-gray-800 transition-colors">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        
        {/* Left: Brand / Flower Boutique info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-sm shadow-rose-500/20 shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-base font-bold tracking-tight leading-tight text-gray-900 dark:text-white truncate">
              {t.appName}
            </h1>
            <p className="text-[10px] sm:text-[11px] text-rose-600/80 dark:text-rose-400 truncate">
              {user?.first_name ? `Witaj, ${user.first_name}` : t.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* Language Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => {
                hapticImpact('light');
                setShowLangMenu(!showLangMenu);
                setShowRoleMenu(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-rose-50/70 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-rose-100 dark:hover:bg-gray-700 transition-all border border-rose-200/50 dark:border-gray-700/50 cursor-pointer"
            >
              <Globe className="w-3 h-3 text-rose-500" />
              <span>{getLangFlag(language)}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-[#1f2c3b] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50 animate-in fade-in zoom-in-95">
                {[
                  { key: 'ru' as Language, label: '🇷🇺 Русский' },
                  { key: 'pl' as Language, label: '🇵🇱 Polski' },
                  { key: 'ua' as Language, label: '🇺🇦 Українська' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => selectLanguage(item.key)}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between hover:bg-rose-50 dark:hover:bg-rose-900/40 transition-colors cursor-pointer ${
                      language === item.key
                        ? 'text-rose-600 dark:text-rose-400 font-bold'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{item.label}</span>
                    {language === item.key && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Switcher Pill (Buyer / Admin / Courier) */}
          <div className="relative">
            <button
              onClick={() => {
                hapticImpact('light');
                setShowRoleMenu(!showRoleMenu);
                setShowLangMenu(false);
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${currentRoleInfo.color}`}
            >
              <currentRoleInfo.icon className="w-3.5 h-3.5" />
              <span>{currentRoleInfo.label}</span>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-[#1f2c3b] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50 animate-in fade-in zoom-in-95 space-y-0.5">
                {[
                  { key: 'buyer' as UserRole, label: 'Клиент 🛍', icon: User },
                  { key: 'admin' as UserRole, label: 'Флорист 🌸', icon: ShieldCheck },
                  { key: 'courier' as UserRole, label: 'Курьер 🚗', icon: Truck },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => selectRole(item.key)}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-rose-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
                      mode === item.key
                        ? 'text-rose-600 dark:text-rose-400 font-bold bg-rose-50/50 dark:bg-rose-950/30'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <item.icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </div>
                    {mode === item.key && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search button */}
          {mode === 'buyer' && (
            <button
              onClick={() => {
                hapticImpact('light');
                setShowSearch(!showSearch);
                if (showSearch) onSearchChange('');
              }}
              aria-label="Search"
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {showSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>
          )}

          {/* Cart Icon with Counter */}
          {mode === 'buyer' && (
            <button
              onClick={() => {
                hapticImpact('medium');
                onOpenCart();
              }}
              className="relative w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-sm shadow-rose-500/25 active:scale-95 transition-transform cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-[#18222d]">
                  {totalCount > 99 ? '99+' : totalCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expandable search bar */}
      {showSearch && mode === 'buyer' && (
        <div className="px-3 pb-2.5 max-w-4xl mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              autoFocus
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-gray-100 dark:bg-[#233142] text-xs sm:text-sm text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
