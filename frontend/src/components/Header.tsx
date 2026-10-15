import React from 'react';
import { ShoppingBag, ShieldCheck, User, Search, X, Sparkles, Truck, ChevronDown, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import type { UserRole } from '../types';
import { hapticImpact, openExternalLink } from '../utils/telegram';

interface HeaderProps {
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, searchQuery, onSearchChange }) => {
  const { totalCount } = useCart();
  const { mode, setMode, user } = useAuth();
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
        return {
          label: t.roleAdmin,
          icon: ShieldCheck,
          color: 'text-rose-700 dark:text-rose-300 bg-rose-500/10 border-rose-500/25',
          dot: 'bg-rose-500',
        };
      case 'courier':
        return {
          label: t.roleCourier,
          icon: Truck,
          color: 'text-indigo-700 dark:text-indigo-300 bg-indigo-500/10 border-indigo-500/25',
          dot: 'bg-indigo-500',
        };
      default:
        return {
          label: t.roleBuyer,
          icon: User,
          color: 'text-stone-700 dark:text-stone-200 bg-stone-500/10 border-stone-300/30 dark:border-stone-700/50',
          dot: 'bg-rose-500',
        };
    }
  };

  const currentRoleInfo = getRoleLabel(mode);

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0b0f17]/85 backdrop-blur-xl border-b border-rose-100/60 dark:border-white/5 transition-all">
      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 py-2.5 flex items-center justify-between gap-2.5">
        
        {/* Left: Brand info */}
        <div className="flex items-center gap-2.5">
          <div className="relative group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-300 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 opacity-20 blur-sm group-hover:opacity-40 transition-opacity pointer-events-none" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight leading-none text-stone-900 dark:text-white uppercase">
                {t.appName}
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                Львів
              </span>
            </div>
            <p className="text-[11px] text-rose-600/80 dark:text-rose-400 font-medium truncate mt-0.5">
              {user?.first_name ? `Вітаємо, ${user.first_name}!` : t.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Lviv Instagram Pill */}
          <button
            onClick={() => {
              hapticImpact('light');
              openExternalLink('https://www.instagram.com/flowers___lviv/');
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 hover:from-amber-500/20 hover:to-purple-500/20 text-rose-600 dark:text-rose-400 border border-rose-300/40 dark:border-rose-500/20 transition-all cursor-pointer active:scale-95"
            title="Instagram @flowers___lviv"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Топольна, 4В</span>
            <span className="sm:hidden">Львів</span>
          </button>

          {/* Role Switcher Pill (Buyer / Admin / Courier) */}
          <div className="relative">
            <button
              onClick={() => {
                hapticImpact('light');
                setShowRoleMenu(!showRoleMenu);
              }}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border backdrop-blur-sm transition-all cursor-pointer active:scale-95 ${currentRoleInfo.color}`}
            >
              <currentRoleInfo.icon className="w-3.5 h-3.5 shrink-0" />
              <span>{currentRoleInfo.label}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white/95 dark:bg-[#141a24]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-stone-200/60 dark:border-white/10 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                  Режим перегляду:
                </div>
                {[
                  { key: 'buyer' as UserRole, label: 'Клієнт (Вітрина)', icon: User, desc: 'Каталог та замовлення квітів' },
                  { key: 'admin' as UserRole, label: 'Флорист (Адмін)', icon: ShieldCheck, desc: 'Букети, склад та канал' },
                  { key: 'courier' as UserRole, label: "Кур'єр", icon: Truck, desc: 'Маршрути та доставка' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => selectRole(item.key)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                      mode === item.key
                        ? 'text-rose-600 dark:text-rose-400 font-bold bg-rose-50/60 dark:bg-rose-950/30'
                        : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 shrink-0 text-rose-500" />
                      <div>
                        <div className="font-bold leading-tight">{item.label}</div>
                        <div className="text-[10px] text-stone-400 font-normal leading-tight mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                    {mode === item.key && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />}
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
              aria-label="Пошук"
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                showSearch
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-stone-100/80 dark:bg-slate-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-slate-700'
              }`}
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
              className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-500/25 active:scale-95 transition-transform cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-stone-950 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white dark:border-[#0b0f17] shadow-sm animate-bounce">
                  {totalCount > 99 ? '99+' : totalCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expandable search bar */}
      {showSearch && mode === 'buyer' && (
        <div className="px-3.5 pb-3 max-w-4xl mx-auto animate-in slide-in-from-top-2 duration-150">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-500" />
            <input
              type="text"
              autoFocus
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-stone-100/90 dark:bg-slate-800/90 text-xs sm:text-sm text-stone-900 dark:text-white rounded-2xl border border-rose-200/50 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all placeholder:text-stone-400 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
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
