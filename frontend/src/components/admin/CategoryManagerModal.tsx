import React, { useState } from 'react';
import type { Category } from '../../types';
import { api } from '../../api';
import { CategoryIcon, ICON_OPTIONS } from '../CategoryIcon';
import { useLanguage } from '../../context/LanguageContext';
import { X, Plus, Edit2, Trash2, Check, AlertCircle } from 'lucide-react';
import { hapticImpact, hapticNotification } from '../../utils/telegram';

interface CategoryManagerModalProps {
  categories: Category[];
  onClose: () => void;
  onRefresh: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  categories,
  onClose,
  onRefresh,
}) => {
  const { t } = useLanguage();
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Sparkles');
  const [sortOrder, setSortOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const startEdit = (cat: Category) => {
    hapticImpact('light');
    setEditingId(cat.id);
    setName(cat.name_ua || cat.name);
    setIcon(cat.icon);
    setSortOrder(cat.sort_order);
    setError('');
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setIcon('Sparkles');
    setSortOrder(0);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t.errorCategoryNameRequired);
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      hapticImpact('medium');

      const payload = {
        name: name.trim(),
        name_ua: name.trim(),
        name_pl: name.trim(),
        name_ru: name.trim(),
        icon,
        sort_order: Number(sortOrder) || 0,
      };

      if (editingId) {
        await api.updateCategory(editingId, payload);
      } else {
        await api.createCategory(payload);
      }

      hapticNotification('success');
      resetForm();
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Помилка збереження категорії');
      hapticNotification('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`${t.adminDeleteCategoryConfirm}`)) return;

    try {
      hapticImpact('heavy');
      await api.deleteCategory(cat.id);
      hapticNotification('success');
      if (editingId === cat.id) resetForm();
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Помилка видалення');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-white dark:bg-[#18222d] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="pt-2 sm:pt-0">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto sm:hidden my-1.5" />
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
              {t.adminCategoriesTitle}
            </h3>
            <button
              onClick={() => {
                hapticImpact('light');
                onClose();
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Create / Edit */}
          <form onSubmit={handleSubmit} className="p-3.5 bg-gray-50 dark:bg-[#233142]/50 rounded-2xl border border-gray-200/60 dark:border-gray-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800 dark:text-white">
                {editingId ? t.adminEditCategory : t.adminNewCategory}
              </span>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-[11px] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                >
                  Скасувати
                </button>
              )}
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                {t.adminCategoryName}
              </label>
              <input
                type="text"
                required
                placeholder={t.adminCategoryNamePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#18222d] text-xs text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:border-rose-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Icon picker & Sort order */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                  {t.adminIcon}
                </label>
                <div className="flex items-center gap-1.5">
                  <div className="p-2 bg-white dark:bg-[#18222d] border border-gray-200 dark:border-gray-700 rounded-xl text-rose-500 shrink-0">
                    <CategoryIcon name={icon} className="w-4 h-4" />
                  </div>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="flex-1 px-2 py-2 bg-white dark:bg-[#18222d] text-xs text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:border-rose-500 focus:outline-none cursor-pointer"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.name} value={opt.name}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                  Порядок сортування
                </label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-[#18222d] text-xs text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:border-rose-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
            >
              {editingId ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{editingId ? t.adminSave : t.adminCreate}</span>
            </button>
          </form>

          {/* List of current categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t.adminCurrentCategories} ({categories.length})
            </h4>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-2.5 bg-white dark:bg-[#233142]/40 rounded-xl border border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-lg shrink-0">
                      <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {cat.name_ua || cat.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEdit(cat)}
                      className="p-1 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Редагувати"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Видалити"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
