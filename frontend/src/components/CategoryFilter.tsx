import React from 'react';
import type { Category } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { LayoutGrid } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCategoryName } from '../i18n/translations';
import { hapticSelection } from '../utils/telegram';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const { t, language } = useLanguage();

  return (
    <div className="py-1 overflow-x-auto no-scrollbar scroll-smooth">
      <div className="flex items-center gap-2 px-0.5 min-w-max">
        {/* "All" button */}
        <button
          onClick={() => {
            hapticSelection();
            onSelectCategory(null);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer active:scale-95 ${
            selectedCategoryId === null
              ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-500/25 ring-2 ring-rose-500/30'
              : 'bg-white dark:bg-[#141a24] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800 border border-stone-200/60 dark:border-white/5 shadow-2xs'
          }`}
        >
          <LayoutGrid className={`w-3.5 h-3.5 ${selectedCategoryId === null ? 'text-white' : 'text-rose-500'}`} />
          <span>{t.allCategories}</span>
        </button>

        {/* Dynamic Localized Category Chips */}
        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          const localizedName = getLocalizedCategoryName(category, language);
          return (
            <button
              key={category.id}
              onClick={() => {
                hapticSelection();
                onSelectCategory(category.id);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-500/25 ring-2 ring-rose-500/30'
                  : 'bg-white dark:bg-[#141a24] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-800 border border-stone-200/60 dark:border-white/5 shadow-2xs'
              }`}
            >
              <CategoryIcon
                name={category.icon}
                className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-rose-500'}`}
              />
              <span>{localizedName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
