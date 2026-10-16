import React from 'react';
import { ShoppingBag, ShieldCheck, User, Search, X, Truck, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import type { UserRole } from '../types';
import { hapticImpact } from '../utils/telegram';

interface HeaderProps {
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, searchQuery, onSearchChange }) => {
  const { totalCount } = useCart();
  const { mode, setMode } = useAuth();
  const { t } = useLanguage();
  const [showSearch, setShowSearch] = React.useState(false);
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);

  const selectRole = (newRole: UserRole) => {
    hapticImpact('medium');
    setMode(newRole);
    setShowRoleMenu(false);
  };

  const getRoleLabel = (r: UserRole) => {
    switch (r) {
      case 'admin':
        return { label: 'Адмін', icon: ShieldCheck };
      case 'courier':
        return { label: "Кур'єр", icon: Truck };
      default:
        return { label: 'Магазин', icon: User };
    }
  };

  const currentRoleInfo = getRoleLabel(mode);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#181b20]/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 h-14 flex items-center justify-between gap-2">
        {/* Left: Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white shrink-0">
            <img src="./logo.png" alt="Flowers Lviv" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate leading-tight">
              {t.appName}
            </h1>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate leading-tight">
              Львів • Топольна, 4В
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                hapticImpact('light');
                setShowRoleMenu(!showRoleMenu);
              }}
              className="h-8 px-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200/70 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <currentRoleInfo.icon className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
              <span>{currentRoleInfo.label}</span>
              <ChevronDown className="w-3 h-3 opacity-50" />
            </button>

            {showRoleMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowRoleMenu(false)} />
                <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-[#181b20] rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-1 z-50">
                  {[
                    { key: 'buyer' as UserRole, label: 'Магазин', icon: User },
                    { key: 'admin' as UserRole, label: 'Адмін-панель', icon: ShieldCheck },
                    { key: 'courier' as UserRole, label: "Кур'єр", icon: Truck },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => selectRole(item.key)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        mode === item.key
                          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <item.icon className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{item.label}</span>
                      </span>
                      {mode === item.key && (
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Search toggle */}
          {mode === 'buyer' && (
            <button
              onClick={() => {
                hapticImpact('light');
                setShowSearch(!showSearch);
                if (showSearch) onSearchChange('');
              }}
              aria-label="Пошук"
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                showSearch
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/70'
              }`}
            >
              {showSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>
          )}

          {/* Cart Button */}
          {mode === 'buyer' && (
            <button
              onClick={() => {
                hapticImpact('medium');
                onOpenCart();
              }}
              className="relative h-8 px-2.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center gap-1.5 text-xs font-semibold active:scale-95 transition-transform cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {totalCount > 0 && <span>{totalCount}</span>}
            </button>
          )}
        </div>
      </div>

      {/* Expandable Search Input */}
      {showSearch && mode === 'buyer' && (
        <div className="px-3.5 sm:px-6 pb-2.5 max-w-4xl mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              autoFocus
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-zinc-100 dark:bg-zinc-800/90 text-xs sm:text-sm text-zinc-900 dark:text-white rounded-lg border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none transition-all placeholder:text-zinc-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-zinc-600 cursor-pointer"
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
