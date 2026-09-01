import React from 'react';
import type { Category } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { LayoutGrid } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
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
  const { t } = useLanguage();

  return (
    <div className="py-2 overflow-x-auto no-scrollbar scroll-smooth">
      <div className="flex items-center gap-2 px-4 min-w-max">
        {/* "All" button */}
        <button
          onClick={() => {
            hapticSelection();
            onSelectCategory(null);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs ${
            selectedCategoryId === null
              ? 'bg-blue-600 text-white shadow-blue-500/20'
              : 'bg-white dark:bg-[#18222d] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#233142] border border-gray-100 dark:border-gray-800'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>{t.allCategories}</span>
        </button>

        {/* Dynamic Category Chips */}
        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          return (
            <button
              key={category.id}
              onClick={() => {
                hapticSelection();
                onSelectCategory(category.id);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-blue-500/20'
                  : 'bg-white dark:bg-[#18222d] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#233142] border border-gray-100 dark:border-gray-800'
              }`}
            >
              <CategoryIcon name={category.icon} className="w-3.5 h-3.5" />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
