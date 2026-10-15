import React, { useState, useRef, useEffect } from 'react';
import type { Product, Category } from '../../types';
import { api, DEFAULT_GROUP_ID } from '../../api';
import { useLanguage } from '../../context/LanguageContext';
import { X, Upload, Check, AlertCircle, Send } from 'lucide-react';
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
  const { t } = useLanguage();

  const [title, setTitle] = useState(product?.title_ua || product?.title || '');
  const [description, setDescription] = useState(product?.description_ua || product?.description || '');
  const [categoryId, setCategoryId] = useState<number>(
    product?.category_id || (categories.length > 0 ? categories[0].id : 1)
  );
  const [price, setPrice] = useState(product ? String(Math.round(product.price)) : '');
  const [imageUrl, setImageUrl] = useState(product?.image_url || '');
  const [inStock, setInStock] = useState(product ? product.in_stock === 1 : true);

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
      setError(t.errorTitleRequired);
      return;
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError(t.errorPriceRequired);
      return;
    }

    if (!categoryId) {
      setError('Будь ласка, оберіть категорію');
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full sm:max-w-lg bg-white dark:bg-[#18222d] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="pt-2 sm:pt-0">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto sm:hidden my-1.5" />
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
              {product ? t.adminEditProduct : t.adminNewProduct}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              {t.adminProductTitle}
            </label>
            <input
              type="text"
              required
              placeholder={t.adminProductTitlePlaceholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#233142] text-xs sm:text-sm text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:border-rose-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.adminCategory}
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#233142] text-xs sm:text-sm text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:border-rose-500 focus:outline-none transition-colors cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_ua || c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.adminPrice}
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
                  className="w-full pl-3 pr-8 py-2.5 bg-gray-50 dark:bg-[#233142] text-xs sm:text-sm text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:border-rose-500 focus:outline-none transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                  ₴
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              {t.adminDescription}
            </label>
            <textarea
              rows={3}
              placeholder={t.adminDescriptionPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#233142] text-xs sm:text-sm text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:border-rose-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              {t.adminImage}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t.adminImagePlaceholder}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-[#233142] text-xs text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:border-rose-500 focus:outline-none transition-colors"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-800 flex items-center gap-1.5 hover:bg-rose-100 transition-colors shrink-0 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Завантаження...' : t.adminUploadImage}</span>
              </button>
            </div>

            {imageUrl && (
              <div className="mt-2 relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <img src={imageUrl} alt="Прев'ю букету" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* In Stock toggle */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                {t.adminProductInStock}
              </span>
            </label>
          </div>

          {/* Publish to Channel / Group Option */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={publishToChannel}
                onChange={(e) => setPublishToChannel(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                <Send className="w-3 h-3 text-sky-500" />
                <span>{t.adminPublishToChannel}</span>
              </span>
            </label>

            {publishToChannel && (
              <div className="pl-6 pt-1">
                <input
                  type="text"
                  placeholder={t.adminChannelUsernamePlaceholder}
                  value={channelUsername}
                  onChange={(e) => setChannelUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#233142] text-xs text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:border-sky-500 focus:outline-none transition-colors font-mono"
                />
              </div>
            )}
          </div>

          {/* Footer Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-rose-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Збереження...' : product ? t.adminSave : t.adminCreate}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
