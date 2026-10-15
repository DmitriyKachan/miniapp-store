import React, { useState } from 'react';
import type { Category } from '../../types';
import { api } from '../../api';
import { CategoryIcon, ICON_OPTIONS } from '../CategoryIcon';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  Layers,
  AlertTriangle,
} from 'lucide-react';
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
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Sparkles');
  const [sortOrder, setSortOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // In-app delete confirmation state
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      setError('Введіть назву категорії');
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

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);
      hapticImpact('heavy');
      await api.deleteCategory(categoryToDelete.id);
      hapticNotification('success');
      if (editingId === categoryToDelete.id) resetForm();
      setCategoryToDelete(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Помилка видалення категорії');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-white dark:bg-[#141a24] rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-300 border border-stone-200/60 dark:border-white/10">
        
        {/* Mobile handle & Header */}
        <div className="pt-2 sm:pt-0">
          <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-slate-700 mx-auto sm:hidden my-2" />
          <div className="px-5 py-3.5 border-b border-stone-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                <Layers className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-black text-stone-900 dark:text-white leading-tight">
                  Категорії вітрини
                </h3>
                <p className="text-[11px] text-stone-400">
                  Flowers Lviv Atelier
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                hapticImpact('light');
                onClose();
              }}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 no-scrollbar pb-[calc(2.5rem+env(safe-area-inset-bottom,20px))]">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 rounded-2xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Card: Create / Edit Category */}
          <form onSubmit={handleSubmit} className="p-4 bg-stone-50/80 dark:bg-slate-800/40 rounded-2xl border border-stone-200/60 dark:border-white/5 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-stone-800 dark:text-white">
                {editingId ? 'Редагувати категорію' : 'Нова категорія'}
              </span>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Скасувати
                </button>
              )}
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                Назва розділу *
              </label>
              <input
                type="text"
                required
                placeholder="Наприклад: Авторські букети / Троянди"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#141a24] text-xs sm:text-sm text-stone-900 dark:text-white rounded-xl border border-stone-200/60 dark:border-white/10 focus:border-rose-500 focus:outline-none transition-colors placeholder:text-stone-400"
              />
            </div>

            {/* Visual Icon Picker Grid */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1.5">
                Оберіть іконку:
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
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
                      className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#131d33] text-[#c5a880] shadow-xs scale-105 ring-2 ring-[#131d33]/40'
                          : 'bg-white dark:bg-[#141a24] text-stone-600 dark:text-stone-300 border border-[#e8e4da] dark:border-white/5 hover:border-[#131d33]/30'
                      }`}
                      title={opt.label}
                    >
                      <opt.Icon className="w-4 h-4 shrink-0" />
                      <span className="text-[9px] truncate max-w-full font-bold">
                        {opt.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort Order */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400">
                Порядок показу (сортування):
              </span>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-20 px-3 py-1.5 text-center bg-white dark:bg-[#141a24] text-xs font-bold text-stone-900 dark:text-white rounded-xl border border-stone-200/60 dark:border-white/10 focus:border-[#131d33] focus:outline-none"
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#131d33] hover:bg-[#1a2846] text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-[#131d33]/20 active:scale-[0.98] transition-all cursor-pointer border border-[#2b3c5c]"
            >
              {editingId ? <Check className="w-3.5 h-3.5 text-[#c5a880]" /> : <Plus className="w-3.5 h-3.5 text-[#c5a880]" />}
              <span className="font-brand-serif tracking-wider uppercase">{editingId ? 'Зберегти категорію' : 'Створити категорію'}</span>
            </button>
          </form>

          {/* List of current categories */}
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              Поточні категорії ({categories.length})
            </h4>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 no-scrollbar">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-3 bg-white dark:bg-[#141a24] rounded-2xl border border-stone-200/60 dark:border-white/5 flex items-center justify-between gap-2 shadow-2xs hover:border-rose-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                      <CategoryIcon name={cat.icon} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-stone-900 dark:text-white truncate block">
                        {cat.name_ua || cat.name}
                      </span>
                      <span className="text-[10px] text-stone-400 font-medium">
                        Порядок: {cat.sort_order || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEdit(cat)}
                      className="p-2 text-stone-500 hover:text-rose-600 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                      title="Редагувати"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCategoryToDelete(cat)}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
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

        {/* Delete Category In-App Confirmation Modal */}
        {categoryToDelete && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-xs bg-white dark:bg-[#141a24] rounded-3xl p-5 shadow-2xl border border-stone-200/60 dark:border-white/10 space-y-4 animate-in zoom-in-95 duration-200 text-center">
              <div className="w-11 h-11 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500 mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-sm font-black text-stone-900 dark:text-white">
                  Видалити категорію?
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  «{categoryToDelete.name_ua || categoryToDelete.name}»
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setCategoryToDelete(null)}
                  className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Скасувати
                </button>

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDeleteCategory}
                  className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {isDeleting ? '...' : 'Видалити'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
