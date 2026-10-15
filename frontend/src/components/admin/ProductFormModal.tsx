import React, { useState, useRef, useEffect } from 'react';
import type { Product, Category } from '../../types';
import { api, DEFAULT_GROUP_ID } from '../../api';
import {
  X,
  Check,
  AlertCircle,
  Send,
  Camera,
  Image as ImageIcon,
  Sparkles,
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

  // Auto-post to channel toggle
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
      setError('Введіть назву букета або композиції');
      return;
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError('Вкажіть коректну ціну букета у гривнях');
      return;
    }

    if (!categoryId) {
      setError('Будь ласка, оберіть категорію для букета');
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
      setError(err.message || 'Помилка збереження букета');
      hapticNotification('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-lg bg-white dark:bg-[#141a24] rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-300 border border-stone-200/60 dark:border-white/10">
        
        {/* Mobile drag handle & Header */}
        <div className="pt-2 sm:pt-0">
          <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-slate-700 mx-auto sm:hidden my-2" />
          <div className="px-5 py-3.5 border-b border-stone-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-black text-stone-900 dark:text-white leading-tight">
                  {product ? 'Редагувати букет' : 'Новий букет'}
                </h3>
                <p className="text-[11px] text-stone-400">
                  Flowers Lviv Atelier • Каталог
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 no-scrollbar pb-[calc(2.5rem+env(safe-area-inset-bottom,20px))]">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 rounded-2xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400 animate-in shake duration-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Photo Upload Zone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
              Фотографія букета
            </label>

            {imageUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-stone-200/80 dark:border-white/10 bg-stone-100 dark:bg-slate-800 p-2 flex items-center gap-3">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-stone-200 dark:border-white/5 bg-stone-200">
                  <img src={imageUrl} alt="Прев'ю букета" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                    Фото завантажено
                  </p>
                  <p className="text-[11px] text-stone-400 truncate mt-0.5 font-mono">
                    {imageUrl}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-stone-200/80 hover:bg-stone-300 dark:bg-slate-700 text-[11px] font-bold text-stone-700 dark:text-stone-200 transition-colors cursor-pointer"
                    >
                      Змінити фото
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="px-2.5 py-1 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group border-2 border-dashed border-stone-200 hover:border-rose-400 dark:border-white/10 dark:hover:border-rose-500/50 rounded-2xl p-5 text-center cursor-pointer transition-colors bg-stone-50/50 dark:bg-slate-800/30 flex flex-col items-center justify-center gap-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {isUploading ? (
                    <div className="w-5 h-5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    {isUploading ? 'Завантаження фотографії...' : 'Натисніть для вибору фото з галереї'}
                  </span>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Підтримуються JPEG, PNG, WebP
                  </p>
                </div>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Optional URL Toggle */}
            <div className="flex justify-end pt-0.5">
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-[11px] font-semibold text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer flex items-center gap-1"
              >
                <ImageIcon className="w-3 h-3" />
                <span>{showUrlInput ? 'Сховати пряме посилання' : 'Вказати посилання (URL)'}</span>
              </button>
            </div>

            {showUrlInput && (
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-slate-800 text-xs text-stone-900 dark:text-white rounded-xl border border-stone-200/60 dark:border-white/10 focus:border-rose-500 focus:outline-none transition-colors"
              />
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Назва букета / композиції *
            </label>
            <input
              type="text"
              required
              placeholder="Наприклад: Букет «Півонієвий світанок» XL"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-slate-800 text-xs sm:text-sm text-stone-900 dark:text-white rounded-2xl border border-stone-200/60 dark:border-white/10 focus:border-rose-500 focus:outline-none transition-colors placeholder:text-stone-400"
            />
          </div>

          {/* Category & Price Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Категорія *
              </label>
              <div className="relative">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-slate-800 text-xs sm:text-sm text-stone-900 dark:text-white rounded-2xl border border-stone-200/60 dark:border-white/10 focus:border-rose-500 focus:outline-none transition-colors appearance-none pr-9 cursor-pointer font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name_ua || c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Ціна букета *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  min="0"
                  required
                  placeholder="1850"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-3.5 pr-8 py-2.5 bg-stone-50 dark:bg-slate-800 text-xs sm:text-sm text-stone-900 dark:text-white rounded-2xl border border-stone-200/60 dark:border-white/10 focus:border-rose-500 focus:outline-none transition-colors font-bold"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-rose-600 dark:text-rose-400">
                  ₴
                </span>
              </div>
            </div>
          </div>

          {/* Composition Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Склад квітів та опис
            </label>
            <textarea
              rows={3}
              placeholder="Склад: півонії, кущова троянда, евкаліпт, дизайнерське матове пакування..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-slate-800 text-xs sm:text-sm text-stone-900 dark:text-white rounded-2xl border border-stone-200/60 dark:border-white/10 focus:border-rose-500 focus:outline-none transition-colors resize-none placeholder:text-stone-400 leading-relaxed"
            />
          </div>

          {/* iOS-Style Toggle: In Stock */}
          <div
            onClick={() => {
              hapticImpact('light');
              setInStock(!inStock);
            }}
            className="p-3.5 rounded-2xl bg-stone-50/80 dark:bg-slate-800/50 border border-stone-200/60 dark:border-white/5 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all select-none"
          >
            <div>
              <span className="text-xs font-bold text-stone-900 dark:text-white block">
                Свіжі квіти в наявності
              </span>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                Букет одразу доступний до замовлення на вітрині
              </p>
            </div>

            {/* Custom iOS switch */}
            <div
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                inStock ? 'bg-emerald-500' : 'bg-stone-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  inStock ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* iOS-Style Toggle: Auto-publish to Telegram channel */}
          <div className="space-y-2">
            <div
              onClick={() => {
                hapticImpact('light');
                setPublishToChannel(!publishToChannel);
              }}
              className="p-3.5 rounded-2xl bg-stone-50/80 dark:bg-slate-800/50 border border-stone-200/60 dark:border-white/5 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all select-none"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-900 dark:text-white block">
                    Опублікувати в Telegram-канал
                  </span>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Створити гарний пост із фото та кнопкою швидкої покупки
                  </p>
                </div>
              </div>

              {/* Custom iOS switch */}
              <div
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                  publishToChannel ? 'bg-sky-500' : 'bg-stone-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    publishToChannel ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>

            {publishToChannel && (
              <div className="px-1 animate-in slide-in-from-top-2 duration-150">
                <input
                  type="text"
                  placeholder="@flowers___lviv або ID групи"
                  value={channelUsername}
                  onChange={(e) => setChannelUsername(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 dark:bg-slate-800 text-xs text-stone-900 dark:text-white rounded-xl border border-sky-300 dark:border-sky-800/50 focus:border-sky-500 focus:outline-none transition-colors"
                />
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="w-full py-4 bg-[#131d33] hover:bg-[#1a2846] text-white text-xs sm:text-sm font-black rounded-2xl shadow-lg shadow-[#131d33]/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-[#2b3c5c]"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4 text-[#c5a880]" />
                  <span className="font-brand-serif tracking-wider uppercase">{product ? 'Зберегти зміни' : 'Опублікувати букет на вітрину'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
