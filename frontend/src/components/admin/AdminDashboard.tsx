import React, { useState } from 'react';
import type { Product, Category } from '../../types';
import { api, DEFAULT_GROUP_ID } from '../../api';
import { CategoryManagerModal } from './CategoryManagerModal';
import { ProductFormModal } from './ProductFormModal';
import { OrdersList } from './OrdersList';
import { useLanguage } from '../../context/LanguageContext';
import {
  Package,
  Layers,
  Plus,
  Edit2,
  Trash2,
  Search,
  Send,
  X,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { hapticImpact, hapticNotification } from '../../utils/telegram';

interface AdminDashboardProps {
  categories: Category[];
  products: Product[];
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  categories,
  products,
  onRefreshData,
}) => {
  const { formatCurrency } = useLanguage();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | null>(null);

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [productModalState, setProductModalState] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({
    isOpen: false,
    product: null,
  });

  // Dedicated in-app delete confirmation modal state (100% reliable on iOS/Telegram)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Channel publish modal
  const [publishModal, setPublishModal] = useState<{
    isOpen: boolean;
    product: Product | null;
    channelId: string;
    isPublishing: boolean;
    message: string;
    isSuccess: boolean;
  }>({
    isOpen: false,
    product: null,
    channelId: DEFAULT_GROUP_ID,
    isPublishing: false,
    message: '',
    isSuccess: false,
  });

  const handleToggleStock = async (product: Product) => {
    try {
      hapticImpact('light');
      await api.toggleProductStock(product.id);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Помилка зміни статусу');
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      hapticImpact('heavy');
      await api.deleteProduct(productToDelete.id);
      hapticNotification('success');
      setProductToDelete(null);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Помилка видалення букета');
    } finally {
      setIsDeleting(false);
    }
  };

  const openPublishModal = (product: Product) => {
    hapticImpact('light');
    const saved = api.getSavedChannel() || DEFAULT_GROUP_ID;
    setPublishModal({
      isOpen: true,
      product,
      channelId: saved,
      isPublishing: false,
      message: '',
      isSuccess: false,
    });
  };

  const executePublish = async () => {
    if (!publishModal.product) return;

    try {
      setPublishModal((prev) => ({ ...prev, isPublishing: true, message: '' }));
      hapticImpact('medium');

      const res = await api.publishToChannel(publishModal.product, publishModal.channelId.trim());
      if (res.success) {
        hapticNotification('success');
        setPublishModal((prev) => ({
          ...prev,
          isPublishing: false,
          isSuccess: true,
          message: 'Букет успішно опубліковано в канал із кнопкою швидкого замовлення!',
        }));
      } else {
        hapticNotification('error');
        setPublishModal((prev) => ({
          ...prev,
          isPublishing: false,
          isSuccess: false,
          message: res.message || 'Помилка відправлення в Telegram',
        }));
      }
    } catch (err: any) {
      setPublishModal((prev) => ({
        ...prev,
        isPublishing: false,
        isSuccess: false,
        message: err.message || 'Помилка публікації',
      }));
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategoryFilter === null || p.category_id === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto w-full px-3.5 sm:px-6 py-3 space-y-4 animate-in fade-in duration-200 pb-24">
      
      {/* Sleek Top Header & Fast Actions */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#141a24] border border-stone-200/60 dark:border-white/5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-500/25 shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-stone-900 dark:text-white tracking-tight">
                Панель флориста
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/40">
                Топольна, 4В
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Керування вітриною, букетами та замовленнями Flowers Lviv
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              hapticImpact('light');
              setIsCategoryModalOpen(true);
            }}
            className="flex-1 sm:flex-initial py-2.5 px-3.5 bg-white hover:bg-[#f5f2eb] dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-800 dark:text-stone-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 border border-[#e8e4da] dark:border-white/5 shadow-2xs"
          >
            <Layers className="w-4 h-4 text-[#6e809f] shrink-0" />
            <span>Категорії ({categories.length})</span>
          </button>

          <button
            onClick={() => {
              hapticImpact('medium');
              setProductModalState({ isOpen: true, product: null });
            }}
            className="flex-1 sm:flex-initial py-2.5 px-4 bg-[#131d33] hover:bg-[#1a2846] text-white rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-[#131d33]/25 transition-all cursor-pointer active:scale-95 shrink-0 border border-[#2b3c5c]"
          >
            <Plus className="w-4 h-4 text-[#c5a880] shrink-0" />
            <span className="font-brand-serif tracking-wider uppercase">Додати букет</span>
          </button>
        </div>
      </div>

      {/* Segmented Tab Switcher (Bouquets vs Orders) */}
      <div className="flex items-center bg-stone-200/70 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-stone-200/40 dark:border-white/5">
        <button
          onClick={() => {
            hapticImpact('light');
            setActiveTab('products');
          }}
          className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'products'
              ? 'bg-white dark:bg-[#141a24] text-stone-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <span>🌸 Букети</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold">
            {products.length}
          </span>
        </button>

        <button
          onClick={() => {
            hapticImpact('light');
            setActiveTab('orders');
          }}
          className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-white dark:bg-[#141a24] text-stone-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <span>📋 Усі замовлення</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'orders' ? (
        <OrdersList />
      ) : (
        <div className="space-y-3.5">
          
          {/* Search bar with quick refresh */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Пошук за назвою або складом букета..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-[#141a24] border border-stone-200/60 dark:border-white/5 rounded-2xl text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/40 shadow-2xs placeholder:text-stone-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                hapticImpact('light');
                onRefreshData();
              }}
              title="Оновити каталог"
              className="p-3 bg-white dark:bg-[#141a24] border border-stone-200/60 dark:border-white/5 rounded-2xl text-stone-600 dark:text-stone-300 hover:text-rose-600 hover:border-rose-300 active:scale-90 transition-all cursor-pointer shadow-2xs shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Category Filter Chips Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => {
                hapticImpact('light');
                setSelectedCategoryFilter(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer active:scale-95 ${
                selectedCategoryFilter === null
                  ? 'bg-[#131d33] text-white shadow-xs'
                  : 'bg-white dark:bg-[#141a24] text-stone-700 dark:text-stone-300 border border-[#e8e4da] dark:border-white/5 hover:border-[#131d33]/20'
              }`}
            >
              Усі букети ({products.length})
            </button>

            {categories.map((c) => {
              const isSelected = selectedCategoryFilter === c.id;
              const count = products.filter((p) => p.category_id === c.id).length;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    hapticImpact('light');
                    setSelectedCategoryFilter(isSelected ? null : c.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#131d33] text-white shadow-xs'
                      : 'bg-white dark:bg-[#141a24] text-stone-700 dark:text-stone-300 border border-[#e8e4da] dark:border-white/5 hover:border-[#131d33]/20'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className={`text-[10px] font-black ${isSelected ? 'text-[#c5a880]' : 'text-stone-400'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Products List */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-2 bg-white dark:bg-[#141a24] rounded-3xl border border-stone-200/60 dark:border-white/5 p-6 shadow-xs">
              <Package className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto" />
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">Букети не знайдено</h3>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                {searchQuery ? `Немає букетів за запитом «${searchQuery}»` : 'У цій категорії поки немає букетів'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3.5 sm:p-4 bg-white dark:bg-[#141a24] rounded-3xl border border-stone-200/60 dark:border-white/5 shadow-xs hover:border-rose-200 dark:hover:border-rose-900/40 transition-all space-y-3"
                >
                  {/* Top info row */}
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-stone-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-stone-200/60 dark:border-white/5 relative">
                      {prod.image_url ? (
                        <img
                          src={prod.image_url}
                          alt={prod.title}
                          className={`w-full h-full object-cover ${
                            prod.in_stock === 0 ? 'grayscale opacity-60' : ''
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-[#faf8f5]">
                          <img src="./logo.png" alt="Flowers Lviv" className="w-7 h-7 object-contain opacity-60" />
                        </div>
                      )}
                    </div>

                    {/* Title, Category & Price */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        {prod.category_name && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#131d33]/10 dark:bg-white/10 text-[#131d33] dark:text-[#f8fafc]">
                            {prod.category_name}
                          </span>
                        )}

                        <span className="text-sm sm:text-base font-black text-[#131d33] dark:text-[#f8fafc] ml-auto">
                          {formatCurrency(prod.price)}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white mt-1 line-clamp-2 leading-snug">
                        {prod.title}
                      </h4>

                      {/* Compact Stock Status Pill */}
                      <div className="mt-2">
                        <button
                          onClick={() => handleToggleStock(prod)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all inline-flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                            prod.in_stock === 1
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25'
                              : 'bg-stone-100 dark:bg-slate-800 text-stone-500 dark:text-stone-400 border border-stone-200/60 dark:border-white/5'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              prod.in_stock === 1 ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
                            }`}
                          />
                          <span>{prod.in_stock === 1 ? 'В наявності' : 'Закінчився'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Bar with generous touch targets */}
                  <div className="border-t border-stone-100 dark:border-white/5 pt-2.5 flex items-center justify-end gap-2">
                    {/* Channel Publish Button */}
                    <button
                      onClick={() => openPublishModal(prod)}
                      className="px-3 py-2 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/30 dark:hover:bg-sky-900/40 text-sky-700 dark:text-sky-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer border border-sky-300/40 dark:border-sky-800/40"
                      title="Опублікувати букет у Telegram-канал"
                    >
                      <Send className="w-3.5 h-3.5 text-sky-500" />
                      <span>У канал</span>
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => setProductModalState({ isOpen: true, product: prod })}
                      className="px-3 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-700 dark:text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer border border-stone-200/50 dark:border-white/5"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#131d33] dark:text-[#a5b9d8]" />
                      <span>Редагувати</span>
                    </button>

                    {/* Delete Button (triggers in-app confirm modal) */}
                    <button
                      onClick={() => setProductToDelete(prod)}
                      className="px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer border border-red-200/60 dark:border-red-900/40"
                      title="Видалити букет"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Видалити</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* IN-APP DELETE CONFIRMATION MODAL (100% Reliable across all Telegram clients) */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white dark:bg-[#141a24] rounded-3xl p-5 shadow-2xl border border-stone-200/60 dark:border-white/10 space-y-4 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-stone-900 dark:text-white">
                  Видалити букет?
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Букет зникне з вітрини магазину
                </p>
              </div>
            </div>

            {/* Bouquet snippet */}
            <div className="p-3 bg-stone-50 dark:bg-slate-800/60 rounded-2xl border border-stone-200/50 dark:border-white/5 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-stone-200 dark:bg-slate-700 overflow-hidden shrink-0">
                {productToDelete.image_url ? (
                  <img
                    src={productToDelete.image_url}
                    alt={productToDelete.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs">🌸</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate">
                  {productToDelete.title}
                </h4>
                <p className="text-xs font-black text-[#131d33] dark:text-[#f8fafc] mt-0.5">
                  {formatCurrency(productToDelete.price)}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Ви дійсно бажаєте видалити цей букет? Цю дію не можна буде скасувати.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProductToDelete(null)}
                className="py-3 px-4 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-800 dark:text-stone-200 rounded-2xl text-xs font-bold transition-all cursor-pointer active:scale-95"
              >
                Скасувати
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-red-500/25 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Видалити</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish to Channel / Group Interactive Modal */}
      {publishModal.isOpen && publishModal.product && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full sm:max-w-md bg-white dark:bg-[#141a24] rounded-t-[32px] sm:rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom duration-300 border border-stone-200/50 dark:border-white/10">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-stone-900 dark:text-white">
                    Публікація в Telegram-канал
                  </h3>
                  <p className="text-[11px] text-stone-400">Пост з фото, ціною та кнопкою замовлення</p>
                </div>
              </div>

              <button
                onClick={() => setPublishModal((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Product mini preview */}
            <div className="p-3 bg-stone-50 dark:bg-slate-800/50 rounded-2xl border border-stone-200/60 dark:border-white/5 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-stone-200 dark:bg-slate-700 overflow-hidden shrink-0">
                {publishModal.product.image_url ? (
                  <img
                    src={publishModal.product.image_url}
                    alt={publishModal.product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs">🌸</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate">
                  {publishModal.product.title}
                </h4>
                <p className="text-xs font-black text-[#131d33] dark:text-[#f8fafc] mt-0.5">
                  {formatCurrency(publishModal.product.price)}
                </p>
              </div>
            </div>

            {/* Channel target input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Telegram-канал або група:
              </label>
              <input
                type="text"
                placeholder="@flowers_lviv або ID групи"
                value={publishModal.channelId}
                onChange={(e) => setPublishModal((prev) => ({ ...prev, channelId: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-slate-800 text-xs sm:text-sm text-stone-900 dark:text-white rounded-xl border border-stone-200/60 dark:border-white/10 focus:border-sky-500 focus:outline-none"
              />
              <p className="text-[11px] text-stone-400 leading-tight">
                Бот повинен бути адміністратором вашого каналу або групи з правом публікації.
              </p>
            </div>

            {publishModal.message && (
              <div
                className={`p-3 rounded-2xl text-xs font-medium flex items-center gap-2 ${
                  publishModal.isSuccess
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200'
                    : 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-200'
                }`}
              >
                <span>{publishModal.message}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPublishModal((prev) => ({ ...prev, isOpen: false }))}
                className="flex-1 py-3 px-4 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-800 dark:text-stone-200 rounded-2xl text-xs font-bold transition-all cursor-pointer"
              >
                Закрити
              </button>

              <button
                type="button"
                disabled={publishModal.isPublishing}
                onClick={executePublish}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
              >
                {publishModal.isPublishing ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Опублікувати</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      {isCategoryModalOpen && (
        <CategoryManagerModal
          categories={categories}
          onClose={() => setIsCategoryModalOpen(false)}
          onRefresh={onRefreshData}
        />
      )}

      {/* Product Create/Edit Modal */}
      {productModalState.isOpen && (
        <ProductFormModal
          categories={categories}
          product={productModalState.product}
          onClose={() => setProductModalState({ isOpen: false, product: null })}
          onSuccess={() => {
            setProductModalState({ isOpen: false, product: null });
            onRefreshData();
          }}
        />
      )}
    </div>
  );
};
