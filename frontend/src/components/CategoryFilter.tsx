import React from 'react';
import type { Category } from '../types';
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
    <div className="overflow-x-auto no-scrollbar scroll-smooth">
      <div className="flex items-center gap-1.5 min-w-max py-0.5">
        <button
          onClick={() => {
            hapticSelection();
            onSelectCategory(null);
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
            selectedCategoryId === null
              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold'
              : 'bg-white dark:bg-[#181b20] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800'
          }`}
        >
          {t.allCategories}
        </button>

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
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold'
                  : 'bg-white dark:bg-[#181b20] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800'
              }`}
            >
              {localizedName}
            </button>
          );
        })}
      </div>
    </div>
  );
};
