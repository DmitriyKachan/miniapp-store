import React, { useState, useRef, useEffect } from 'react';
import type { Product, Category } from '../../types';
import { api } from '../../api';
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
  const [title, setTitle] = useState(product?.title || '');
  const [categoryId, setCategoryId] = useState<number>(
    product?.category_id || (categories.length > 0 ? categories[0].id : 1)
  );
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [description, setDescription] = useState(product?.description || '');
  const [imageUrl, setImageUrl] = useState(product?.image_url || '');
  const [inStock, setInStock] = useState(product ? product.in_stock === 1 : true);

  // Auto-post to channel toggle
  const [publishToChannel, setPublishToChannel] = useState(false);
  const [channelUsername, setChannelUsername] = useState('');

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
      setError(err.message || 'Error uploading');
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
      setError('Wybierz kategorię');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      hapticImpact('medium');

      const payload = {
        title: title.trim(),
        category_id: Number(categoryId),
        price: Number(price),
        description: description.trim(),
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
      setError(err.message || 'Error');
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.adminProductTitle}
            </label>
            <input
              type="text"
              required
              placeholder={t.adminProductTitlePlaceholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#233142] text-xs sm:text-sm text-gray-900 dark:text-white rounded-xl border border-transparent focus:border-rose-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.adminCategory}
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#233142] text-xs sm:text-sm text-gray-900 dark:text-white rounded-xl border border-transparent focus:border-rose-500 focus:outline-none transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.adminPrice}
              </label>
              <input
                type="number"
                required
                min="1"
                step="1"
                placeholder="280"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#233142] text-xs sm:text-sm text-gray-900 dark:text-white rounded-xl border border-transparent focus:border-rose-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.adminDescription}
            </label>
            <textarea
              rows={2}
              placeholder={t.adminDescriptionPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-gray-50 dark:bg-[#233142] text-xs sm:text-sm text-gray-900 dark:text-white rounded-xl border border-transparent focus:border-rose-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              {t.adminImage}
            </label>

            <div className="flex gap-2">
              <input
                type="url"
                placeholder={t.adminImagePlaceholder}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-[#233142] text-xs text-gray-900 dark:text-white rounded-xl border border-transparent focus:border-rose-500 focus:outline-none transition-colors truncate"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3 py-2 bg-gray-100 dark:bg-[#233142] text-gray-700 dark:text-gray-300 rounded-xl text-xs font-medium hover:bg-gray-200 dark:hover:bg-[#2e3f53] flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {isUploading ? (
                  <div className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>{t.adminUploadImage}</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Image Preview */}
            {imageUrl && (
              <div className="relative w-full h-32 rounded-xl bg-gray-100 dark:bg-[#233142] overflow-hidden mt-1 border border-gray-200 dark:border-gray-700">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* In Stock toggle */}
          <div className="pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
              />
              <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                {t.adminProductInStock}
              </span>
            </label>
          </div>

          {/* Telegram Channel Auto-posting Section */}
          <div className="p-3 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={publishToChannel}
                onChange={(e) => setPublishToChannel(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.adminPublishToChannel}</span>
              </span>
            </label>

            {publishToChannel && (
              <div className="pt-1 animate-in fade-in">
                <label className="block text-[11px] font-medium text-blue-800 dark:text-blue-300 mb-1">
                  {t.adminChannelUsername}
                </label>
                <input
                  type="text"
                  placeholder={t.adminChannelUsernamePlaceholder}
                  value={channelUsername}
                  onChange={(e) => setChannelUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-[#18222d] text-xs text-gray-900 dark:text-white rounded-xl border border-blue-200 dark:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[10px] text-blue-600/80 dark:text-blue-400/80 mt-1">
                  💡 Бот должен быть назначен Администратором в канале для публикации.
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="p-2.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{product ? t.adminSave : t.adminCreate}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
