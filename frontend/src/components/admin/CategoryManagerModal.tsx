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
  const [icon, setIcon] = useState('Package');
  const [sortOrder, setSortOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const startEdit = (cat: Category) => {
    hapticImpact('light');
    setEditingId(cat.id);
    setName(cat.name);
    setIcon(cat.icon);
    setSortOrder(cat.sort_order);
    setError('');
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setIcon('Package');
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

      if (editingId) {
        await api.updateCategory(editingId, {
          name: name.trim(),
          icon,
          sort_order: Number(sortOrder),
        });
      } else {
        await api.createCategory({
          name: name.trim(),
          icon,
          sort_order: Number(sortOrder),
        });
      }

      hapticNotification('success');
      resetForm();
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Error');
      hapticNotification('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t.adminDeleteCategoryConfirm)) {
      return;
    }

    try {
      hapticImpact('heavy');
      await api.deleteCategory(id);
      hapticNotification('success');
      if (editingId === id) resetForm();
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full sm:max-w-lg bg-white dark:bg-[#18222d] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        
        {/* Header with pull handle indicator for mobile */}
        <div className="pt-2 sm:pt-0">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto sm:hidden my-1.5" />
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
              {t.adminCategoriesTitle} ({categories.length})
            </h3>
            <button
              onClick={() => {
                hapticImpact('light');
                onClose();
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* Add / Edit Form */}
          <form onSubmit={handleSubmit} className="p-3.5 sm:p-4 bg-gray-50 dark:bg-[#233142]/50 rounded-2xl space-y-3 border border-gray-200/60 dark:border-gray-700/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center justify-between">
              <span>{editingId ? t.adminEditCategory : t.adminNewCategory}</span>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-semibold text-blue-500 hover:underline normal-case"
                >
                  Anuluj
                </button>
              )}
            </h4>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.adminCategoryName}
              </label>
              <input
                type="text"
                required
                placeholder={t.adminCategoryNamePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 bg-white dark:bg-[#18222d] text-xs sm:text-sm text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Responsive Icon selector */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t.adminIcon}
              </label>
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-1.5">
                {ICON_OPTIONS.map((opt) => {
                  const isSelected = icon === opt.name;
                  return (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => {
                        hapticImpact('light');
                        setIcon(opt.name);
                      }}
                      title={opt.label}
                      className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/30'
                          : 'bg-white dark:bg-[#18222d] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2e3f53] border border-gray-200/60 dark:border-gray-700/60'
                      }`}
                    >
                      <opt.Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {editingId ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{editingId ? t.adminSave : t.adminCreate}</span>
            </button>
          </form>

          {/* Existing Categories List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {t.adminCurrentCategories}
            </h4>

            {categories.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">Brak kategorii</p>
            ) : (
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-2.5 bg-white dark:bg-[#18222d] border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <CategoryIcon name={cat.icon} className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {cat.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-[#233142] transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
