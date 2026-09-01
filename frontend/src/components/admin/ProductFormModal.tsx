import React, { useState, useRef, useEffect } from 'react';
import type { Product, Category } from '../../types';
import { api, DEFAULT_GROUP_ID } from '../../api';
import { useLanguage } from '../../context/LanguageContext';
import { autoTranslateAll } from '../../utils/translator';
import { X, Upload, Check, AlertCircle, Send, Sparkles, Languages } from 'lucide-react';
import { hapticImpact, hapticNotification } from '../../utils/telegram';

interface ProductFormModalProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

type LangTab = 'ru' | 'pl' | 'ua';

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  categories,
  onClose,
  onSuccess,
}) => {
  const { t } = useLanguage();
  const [activeLangTab, setActiveLangTab] = useState<LangTab>('ru');

  // Multilingual Title
  const [titleRu, setTitleRu] = useState(product?.title_ru || product?.title || '');
  const [titlePl, setTitlePl] = useState(product?.title_pl || (product?.title_ru ? '' : product?.title || ''));
  const [titleUa, setTitleUa] = useState(product?.title_ua || '');

  // Multilingual Description
  const [descRu, setDescRu] = useState(product?.description_ru || product?.description || '');
  const [descPl, setDescPl] = useState(product?.description_pl || (product?.description_ru ? '' : product?.description || ''));
  const [descUa, setDescUa] = useState(product?.description_ua || '');

  const [categoryId, setCategoryId] = useState<number>(
    product?.category_id || (categories.length > 0 ? categories[0].id : 1)
  );
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [imageUrl, setImageUrl] = useState(product?.image_url || '');
  const [inStock, setInStock] = useState(product ? product.in_stock === 1 : true);

  // Auto-post to channel toggle
  const [publishToChannel, setPublishToChannel] = useState(false);
  const [channelUsername, setChannelUsername] = useState(DEFAULT_GROUP_ID);

  const [isTranslating, setIsTranslating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = api.getSavedChannel();
    if (saved) setChannelUsername(saved);
  }, []);

  const handleAutoTranslate = async () => {
    try {
      setIsTranslating(true);
      hapticImpact('medium');

      // Determine current source text based on active tab
      let sourceTitle = titleRu;
      let sourceDesc = descRu;
      let sourceLang: LangTab = 'ru';

      if (activeLangTab === 'pl' && titlePl) {
        sourceTitle = titlePl;
        sourceDesc = descPl;
        sourceLang = 'pl';
      } else if (activeLangTab === 'ua' && titleUa) {
        sourceTitle = titleUa;
        sourceDesc = descUa;
        sourceLang = 'ua';
      } else if (!sourceTitle) {
        sourceTitle = titlePl || titleUa;
        sourceDesc = descPl || descUa;
        sourceLang = titlePl ? 'pl' : 'ua';
      }

      if (!sourceTitle.trim()) {
        setError('Сначала введите название на текущем языке');
        return;
      }

      const [translatedTitles, translatedDescs] = await Promise.all([
        autoTranslateAll(sourceTitle, sourceLang),
        sourceDesc.trim() ? autoTranslateAll(sourceDesc, sourceLang) : Promise.resolve({ ru: '', pl: '', ua: '' }),
      ]);

      if (translatedTitles.ru) setTitleRu(translatedTitles.ru);
      if (translatedTitles.pl) setTitlePl(translatedTitles.pl);
      if (translatedTitles.ua) setTitleUa(translatedTitles.ua);

      if (translatedDescs.ru) setDescRu(translatedDescs.ru);
      if (translatedDescs.pl) setDescPl(translatedDescs.pl);
      if (translatedDescs.ua) setDescUa(translatedDescs.ua);

      hapticNotification('success');
    } catch (err: any) {
      console.warn('Auto translate error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

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

    const mainTitle = titleRu || titlePl || titleUa;
    if (!mainTitle.trim()) {
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
        title: titlePl || titleRu || titleUa,
        title_ru: titleRu.trim() || mainTitle.trim(),
        title_pl: titlePl.trim() || mainTitle.trim(),
        title_ua: titleUa.trim() || mainTitle.trim(),
        description: descPl || descRu || descUa,
        description_ru: descRu.trim() || (descPl || descUa),
        description_pl: descPl.trim() || (descRu || descUa),
        description_ua: descUa.trim() || (descRu || descPl),
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
          
          {/* Language Tabs & Auto-Translate button */}
          <div className="space-y-2 bg-gray-50 dark:bg-[#233142]/50 p-2.5 rounded-2xl border border-gray-200/60 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-rose-500" />
                <span>Язык описания букета:</span>
              </span>

              <button
                type="button"
                onClick={handleAutoTranslate}
                disabled={isTranslating}
                className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-lg text-[11px] font-bold flex items-center gap-1 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                {isTranslating ? (
                  <div className="w-3 h-3 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3 text-rose-500" />
                )}
                <span>✨ Авто-перевод на все языки</span>
              </button>
            </div>

            {/* Segmented language tab buttons */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#18222d] p-1 rounded-xl border border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setActiveLangTab('ru')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeLangTab === 'ru'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                🇷🇺 Русский {titleRu ? '✓' : ''}
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('pl')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeLangTab === 'pl'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                🇵🇱 Polski {titlePl ? '✓' : ''}
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('ua')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeLangTab === 'ua'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                🇺🇦 Українська {titleUa ? '✓' : ''}
              </button>
            </div>

            {/* Active Language Inputs */}
            {activeLangTab === 'ru' && (
              <div className="space-y-2 pt-1">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Название на русском (RU) *
                  </label>
                  <input
                    type="text"
                    placeholder="Например: Букет «Розовая Магия» Премиум"
                    value={titleRu}
                    onChange={(e) => setTitleRu(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#18222d] text-xs text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Описание и состав цветов (RU)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Пышная авторская композиция из роз, эустомы..."
                    value={descRu}
                    onChange={(e) => setDescRu(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#18222d] text-xs text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:border-rose-500 focus:outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {activeLangTab === 'pl' && (
              <div className="space-y-2 pt-1">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Nazwa bukietu po polsku (PL)
                  </label>
                  <input
                    type="text"
                    placeholder="Np: Bukiet «Różowa Magia» Premium"
                    value={titlePl}
                    onChange={(e) => setTitlePl(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#18222d] text-xs text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Opis i skład bukietu (PL)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Puszysta kompozycja z róż gałązkowych, eustomy..."
                    value={descPl}
                    onChange={(e) => setDescPl(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#18222d] text-xs text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:border-rose-500 focus:outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {activeLangTab === 'ua' && (
              <div className="space-y-2 pt-1">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Назва букету українською (UA)
                  </label>
                  <input
                    type="text"
                    placeholder="Наприклад: Букет «Рожева Магія» Преміум"
                    value={titleUa}
                    onChange={(e) => setTitleUa(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#18222d] text-xs text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Опис та склад квітів (UA)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Пишна авторська композиція з троянд, еустоми..."
                    value={descUa}
                    onChange={(e) => setDescUa(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#18222d] text-xs text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:border-rose-500 focus:outline-none resize-none"
                  />
                </div>
              </div>
            )}
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
                className="px-3 py-2 bg-gray-100 dark:bg-[#233142] text-gray-700 dark:text-gray-300 rounded-xl text-xs font-medium hover:bg-gray-200 dark:hover:bg-[#2e3f53] flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
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
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 cursor-pointer"
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
                className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer"
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
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
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
                  className="w-full px-3 py-2 bg-white dark:bg-[#18222d] text-xs text-gray-900 dark:text-white rounded-xl border border-blue-200 dark:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
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
