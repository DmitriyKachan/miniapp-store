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
    <div className="py-2 overflow-x-auto no-scrollbar scroll-smooth">
      <div className="flex items-center gap-2 px-1 min-w-max">
        {/* "All" button */}
        <button
          onClick={() => {
            hapticSelection();
            onSelectCategory(null);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer ${
            selectedCategoryId === null
              ? 'bg-rose-600 text-white shadow-rose-500/25'
              : 'bg-white dark:bg-[#18222d] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#233142] border border-gray-100 dark:border-gray-800'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
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
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer ${
                isSelected
                  ? 'bg-rose-600 text-white shadow-rose-500/25'
                  : 'bg-white dark:bg-[#18222d] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#233142] border border-gray-100 dark:border-gray-800'
              }`}
            >
              <CategoryIcon name={category.icon} className="w-3.5 h-3.5" />
              <span>{localizedName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
