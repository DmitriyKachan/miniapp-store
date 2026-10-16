import React, { useState, useRef, useEffect } from 'react';
import type { Product, Category } from '../../types';
import { api, DEFAULT_GROUP_ID } from '../../api';
import {
  X,
  AlertCircle,
  Camera,
  ChevronDown,
} from 'lucide-react';
import { hapticImpact, hapticNotification } from '../../utils/telegram';

interface ProductFormModalProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  categories,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState(product?.title_ua || product?.title || '');
  const [description, setDescription] = useState(product?.description_ua || product?.description || '');
  const [categoryId, setCategoryId] = useState<number>(
    product?.category_id || (categories.length > 0 ? categories[0].id : 1)
  );
  const [price, setPrice] = useState(product ? String(Math.round(product.price)) : '');
  const [imageUrl, setImageUrl] = useState(product?.image_url || '');
  const [inStock, setInStock] = useState(product ? product.in_stock === 1 : true);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const [publishToChannel, setPublishToChannel] = useState(false);
  const [channelUsername, setChannelUsername] = useState(DEFAULT_GROUP_ID);

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = api.getSavedChannel();
    if (saved) setChannelUsername(saved);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError('');
      hapticImpact('light');
      const res = await api.uploadImage(file);
      setImageUrl(res.url);
      hapticNotification('success');
    } catch (err: any) {
      setError(err.message || 'Помилка завантаження фото');
      hapticNotification('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Введіть назву букета');
      return;
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError('Вкажіть коректну ціну');
      return;
    }

    if (!categoryId) {
      setError('Оберіть категорію');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      hapticImpact('medium');

      const payload = {
        title: title.trim(),
        title_ua: title.trim(),
        title_ru: title.trim(),
        title_pl: title.trim(),
        description: description.trim(),
        description_ua: description.trim(),
        description_ru: description.trim(),
        description_pl: description.trim(),
        category_id: Number(categoryId),
        price: Number(price),
        image_url: imageUrl.trim(),
        in_stock: inStock ? 1 : 0,
      };

      if (product) {
        await api.updateProduct(product.id, payload);
        if (publishToChannel && channelUsername.trim()) {
          await api.publishToChannel({ ...payload, id: product.id }, channelUsername.trim());
        }
      } else {
        await api.createProduct(payload, {
          publish_to_channel: publishToChannel,
          channel_username: channelUsername.trim(),
        });
      }

      hapticNotification('success');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Помилка збереження');
      hapticNotification('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full sm:max-w-md bg-white dark:bg-[#181b20] rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[90vh] flex flex-col border border-zinc-200 dark:border-zinc-800">
        <div className="px-4 py-3.5 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            {product ? 'Редагувати букет' : 'Новий букет'}
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

        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3.5 flex-1 no-scrollbar pb-[calc(1.5rem+env(safe-area-inset-bottom,16px))]">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Photo */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Фото
            </label>

            {imageUrl ? (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-2 flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-zinc-100">
                  <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-200 cursor-pointer"
                  >
                    Змінити
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="px-2.5 py-1.5 rounded-lg text-red-600 text-xs font-medium cursor-pointer"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-4 text-center cursor-pointer bg-zinc-50/50 dark:bg-zinc-800/30 flex flex-col items-center justify-center gap-1.5"
              >
                <Camera className="w-5 h-5 text-zinc-400" />
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  {isUploading ? 'Завантаження...' : 'Обрати фото з галереї'}
                </span>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-[11px] text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                {showUrlInput ? 'Сховати посилання' : 'Або вказати URL фото'}
              </button>
            </div>

            {showUrlInput && (
              <input
                type="url"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none"
              />
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Назва *
            </label>
            <input
              type="text"
              required
              placeholder="Назва букета"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Категорія *
              </label>
              <div className="relative">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none appearance-none pr-8 cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name_ua || c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Ціна (₴) *
              </label>
              <input
                type="number"
                step="1"
                min="0"
                required
                placeholder="1500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none font-semibold"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Опис та склад
            </label>
            <textarea
              rows={3}
              placeholder="Склад букета..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none resize-none"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 rounded accent-zinc-900 dark:accent-white cursor-pointer"
              />
              <span className="text-xs text-zinc-700 dark:text-zinc-300">
                В наявності на вітрині
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={publishToChannel}
                onChange={(e) => setPublishToChannel(e.target.checked)}
                className="w-4 h-4 rounded accent-zinc-900 dark:accent-white cursor-pointer"
              />
              <span className="text-xs text-zinc-700 dark:text-zinc-300">
                Опублікувати в Telegram-канал
              </span>
            </label>

            {publishToChannel && (
              <input
                type="text"
                placeholder="@flowers___lviv або ID групи"
                value={channelUsername}
                onChange={(e) => setChannelUsername(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs sm:text-sm font-semibold rounded-xl cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Збереження...' : product ? 'Зберегти зміни' : 'Додати букет'}
          </button>
        </form>
      </div>
    </div>
  );
};
