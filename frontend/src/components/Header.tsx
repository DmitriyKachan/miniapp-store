import React from 'react';
import { ShoppingBag, ShieldCheck, User, Search, X, Truck, ChevronDown, MapPin } from 'lucide-react';
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
          shortLabel: 'Флорист',
          icon: ShieldCheck,
          color: 'text-[#131d33] dark:text-[#f1f5f9] bg-[#131d33]/10 dark:bg-white/10 border-[#131d33]/20 dark:border-white/20',
          dot: 'bg-[#131d33] dark:bg-white',
        };
      case 'courier':
        return {
          label: t.roleCourier,
          shortLabel: "Кур'єр",
          icon: Truck,
          color: 'text-[#475b7c] dark:text-[#a5b9d8] bg-[#475b7c]/10 dark:bg-[#475b7c]/20 border-[#475b7c]/25',
          dot: 'bg-[#475b7c]',
        };
      default:
        return {
          label: t.roleBuyer,
          shortLabel: 'Клієнт',
          icon: User,
          color: 'text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-slate-800/80 border-stone-200 dark:border-white/10',
          dot: 'bg-[#131d33]',
        };
    }
  };

  const currentRoleInfo = getRoleLabel(mode);

  return (
    <header className="sticky top-0 z-30 bg-[#faf8f5]/90 dark:bg-[#0b111d]/90 backdrop-blur-xl border-b border-[#e8e4da] dark:border-[#1f2b43] transition-all">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-1.5 sm:gap-2.5">
        
        {/* Left: Brand info with actual Logo */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-sm border border-[#e8e4da] dark:border-[#202d44] bg-white shrink-0">
            <img src="./logo.png" alt="Flowers Lviv Logo" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <h1 className="font-brand-serif text-xs sm:text-sm font-black tracking-[0.2em] leading-none text-[#131d33] dark:text-[#f8fafc] uppercase truncate">
              {t.appName}
            </h1>
            <p className="text-[10px] text-[#6e809f] dark:text-[#8fa0ba] font-medium tracking-wider uppercase truncate mt-0.5">
              {user?.first_name ? `Вітаємо, ${user.first_name}!` : 'Квітковий дім • Львів'}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Lviv Address Pill */}
          <button
            onClick={() => {
              hapticImpact('light');
              openExternalLink('https://www.instagram.com/flowers___lviv/');
            }}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-white dark:bg-[#131b2d] hover:bg-[#f3f0ea] text-[#131d33] dark:text-[#e2e8f0] border border-[#e8e4da] dark:border-[#1f2b43] transition-all cursor-pointer active:scale-95 shadow-2xs"
            title="Instagram @flowers___lviv"
          >
            <MapPin className="w-3.5 h-3.5 text-[#6e809f]" />
            <span>вул. Топольна, 4В</span>
          </button>

          {/* Role Switcher Pill (Buyer / Admin / Courier) */}
          <div className="relative">
            <button
              onClick={() => {
                hapticImpact('light');
                setShowRoleMenu(!showRoleMenu);
              }}
              className={`px-2 sm:px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 sm:gap-1.5 border backdrop-blur-sm transition-all cursor-pointer active:scale-95 ${currentRoleInfo.color}`}
            >
              <currentRoleInfo.icon className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">{currentRoleInfo.shortLabel}</span>
              <span className="hidden sm:inline">{currentRoleInfo.label}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white/95 dark:bg-[#131b2d]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#e8e4da] dark:border-white/10 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#6e809f]">
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
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between hover:bg-[#f5f2eb] dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                      mode === item.key
                        ? 'text-[#131d33] dark:text-white font-bold bg-[#faf8f5] dark:bg-slate-800/80'
                        : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 shrink-0 text-[#6e809f]" />
                      <div>
                        <div className="font-bold leading-tight">{item.label}</div>
                        <div className="text-[10px] text-stone-400 font-normal leading-tight mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                    {mode === item.key && <span className="w-2 h-2 rounded-full bg-[#131d33] dark:bg-white shrink-0" />}
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
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0 ${
                showSearch
                  ? 'bg-[#131d33] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 border border-[#e8e4da] dark:border-transparent'
              }`}
            >
              {showSearch ? <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
          )}

          {/* Cart Icon with Counter */}
          {mode === 'buyer' && (
            <button
              onClick={() => {
                hapticImpact('medium');
                onOpenCart();
              }}
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#131d33] hover:bg-[#1c2c49] text-white flex items-center justify-center shadow-md shadow-[#131d33]/25 active:scale-95 transition-transform cursor-pointer shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c5a880] text-[#131d33] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-[#0b111d] shadow-sm">
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
