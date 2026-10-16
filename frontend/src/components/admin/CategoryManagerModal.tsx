import React, { useState } from 'react';
import type { Category } from '../../types';
import { api } from '../../api';
import {
  X,
  Edit2,
  Trash2,
  AlertCircle,
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

  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const startEdit = (cat: Category) => {
    hapticImpact('light');
    setEditingId(cat.id);
    setName(cat.name_ua || cat.name);
    setIcon(cat.icon || 'Sparkles');
    setSortOrder(cat.sort_order || 0);
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full sm:max-w-md bg-white dark:bg-[#181b20] rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[90vh] flex flex-col border border-zinc-200 dark:border-zinc-800">
        <div className="px-4 py-3.5 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            Категорії ({categories.length})
          </h3>

          <button
            onClick={() => {
              hapticImpact('light');
              onClose();
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4 flex-1 no-scrollbar pb-[calc(1.5rem+env(safe-area-inset-bottom,16px))]">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Create / Edit Category Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">
                {editingId ? 'Редагування категорії' : 'Додати категорію'}
              </span>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  Скасувати
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Назва категорії"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-xl shrink-0 cursor-pointer"
              >
                {editingId ? 'Зберегти' : 'Додати'}
              </button>
            </div>
          </form>

          {/* List */}
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border border-zinc-200/80 dark:border-zinc-800 rounded-xl overflow-hidden">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-3 bg-white dark:bg-[#181b20] flex items-center justify-between gap-2"
              >
                <span className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-white truncate">
                  {cat.name_ua || cat.name}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(cat)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg cursor-pointer"
                    title="Редагувати"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCategoryToDelete(cat)}
                    className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg cursor-pointer"
                    title="Видалити"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {categoryToDelete && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-xs bg-white dark:bg-[#181b20] rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 space-y-4 text-center">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Видалити категорію?
                </h3>
                <p className="text-xs text-zinc-500">
                  «{categoryToDelete.name_ua || categoryToDelete.name}»
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setCategoryToDelete(null)}
                  className="py-2 px-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Скасувати
                </button>

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDeleteCategory}
                  className="py-2 px-3 bg-red-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
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
