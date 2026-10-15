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
  SlidersHorizontal,
  Send,
  CheckCircle2,
  X,
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
  const { t, formatCurrency } = useLanguage();
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
      alert(err.message || 'Error');
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm(`${t.adminDeleteConfirm} «${product.title}»?`)) return;

    try {
      hapticImpact('heavy');
      await api.deleteProduct(product.id);
      hapticNotification('success');
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Error');
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
          message: 'Букет успішно опубліковано в канал із кнопкою замовлення!',
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
        message: err.message || 'Помилка',
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
    <div className="max-w-4xl mx-auto w-full px-3.5 sm:px-6 py-4 space-y-5 animate-in fade-in duration-200 pb-20">
      
      {/* Top Header & Metrics Cards */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-950 via-stone-900 to-stone-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/30 border border-rose-400/40 flex items-center justify-center text-rose-300">
                <Package className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">Панель флориста Flowers Lviv</h2>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Студія на Топольній
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div
              onClick={() => setActiveTab('products')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-rose-500/20 border-rose-400/50 shadow-inner'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Букетів</div>
              <div className="text-lg sm:text-2xl font-black mt-0.5">{products.length}</div>
            </div>

            <div
              onClick={() => setIsCategoryModalOpen(true)}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Категорій</div>
              <div className="text-lg sm:text-2xl font-black mt-0.5">{categories.length}</div>
            </div>

            <div
              onClick={() => setActiveTab('orders')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-emerald-500/20 border-emerald-400/50 shadow-inner'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Замовлення</div>
              <div className="text-lg sm:text-2xl font-black mt-0.5 text-emerald-300">Керувати</div>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex items-center bg-stone-200/60 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-stone-200/40 dark:border-white/5">
        <button
          onClick={() => {
            hapticImpact('light');
            setActiveTab('products');
          }}
          className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'bg-white dark:bg-[#141a24] text-stone-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          {t.adminProducts} ({products.length})
        </button>
        <button
          onClick={() => {
            hapticImpact('light');
            setActiveTab('orders');
          }}
          className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-white dark:bg-[#141a24] text-stone-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          {t.adminOrdersTitle}
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'orders' ? (
        <OrdersList />
      ) : (
        <div className="space-y-4">
          
          {/* Action buttons bar */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                hapticImpact('light');
                setIsCategoryModalOpen(true);
              }}
              className="py-3 px-4 bg-white dark:bg-[#141a24] text-stone-800 dark:text-stone-200 border border-stone-200/60 dark:border-white/5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all cursor-pointer hover:border-indigo-400"
            >
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>{t.adminManageCategories}</span>
            </button>

            <button
              onClick={() => {
                hapticImpact('medium');
                setProductModalState({ isOpen: true, product: null });
              }}
              className="py-3 px-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-rose-500/25 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.adminAddProduct}</span>
            </button>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#141a24] border border-stone-200/60 dark:border-white/5 rounded-2xl text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-2xs placeholder:text-stone-400"
              />
            </div>

            <div className="relative">
              <select
                value={selectedCategoryFilter || ''}
                onChange={(e) =>
                  setSelectedCategoryFilter(e.target.value ? Number(e.target.value) : null)
                }
                className="w-full sm:w-auto px-4 py-2.5 bg-white dark:bg-[#141a24] border border-stone-200/60 dark:border-white/5 rounded-2xl text-xs font-bold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 appearance-none pr-9 cursor-pointer shadow-2xs"
              >
                <option value="">{t.allCategories} ({categories.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400" />
            </div>
          </div>

          {/* Products Mobile Card List */}
          {filteredProducts.length === 0 ? (
            <div className="py-14 text-center text-stone-400 text-xs bg-white dark:bg-[#141a24] rounded-3xl border border-stone-200/60 dark:border-white/5">
              {t.emptyProductsTitle}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 bg-white dark:bg-[#141a24] rounded-3xl border border-stone-200/60 dark:border-white/5 shadow-xs space-y-3 hover:border-rose-200 dark:hover:border-rose-900/40 transition-all"
                >
                  {/* Top info row */}
                  <div className="flex items-start gap-3.5">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-stone-200/60 dark:border-white/5">
                      {prod.image_url ? (
                        <img
                          src={prod.image_url}
                          alt={prod.title}
                          className={`w-full h-full object-cover ${
                            prod.in_stock === 0 ? 'grayscale opacity-60' : ''
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                          🌸
                        </div>
                      )}
                    </div>

                    {/* Title, Category & Price */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {prod.category_name && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400">
                            {prod.category_name}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white mt-1 line-clamp-1">
                        {prod.title}
                      </h4>
                      <p className="text-xs sm:text-sm font-black text-rose-600 dark:text-rose-400 mt-0.5">
                        {formatCurrency(prod.price)}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="border-t border-stone-100 dark:border-white/5 pt-2.5 flex items-center justify-between gap-2">
                    {/* Stock status toggle button */}
                    <button
                      onClick={() => handleToggleStock(prod)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                        prod.in_stock === 1
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/25'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          prod.in_stock === 1 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                        }`}
                      />
                      <span>{prod.in_stock === 1 ? t.inStock : t.outOfStock}</span>
                    </button>

                    {/* Channel, Edit & Delete Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openPublishModal(prod)}
                        className="px-3 py-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-sky-500/20 transition-colors active:scale-95 cursor-pointer border border-sky-500/20"
                        title="Опублікувати в Telegram-канал"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">В канал</span>
                        <span className="sm:hidden">TG</span>
                      </button>

                      <button
                        onClick={() => setProductModalState({ isOpen: true, product: prod })}
                        className="px-3 py-1.5 bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-stone-200 dark:hover:bg-slate-700 transition-colors active:scale-95 cursor-pointer border border-stone-200/50 dark:border-white/5"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>Редагувати</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(prod)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-500/10 rounded-xl transition-colors active:scale-95 cursor-pointer"
                        title="Видалити"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Publish to Channel / Group Interactive Modal */}
      {publishModal.isOpen && publishModal.product && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full sm:max-w-md bg-white dark:bg-[#141a24] rounded-t-[32px] sm:rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom duration-300 border border-stone-200/50 dark:border-white/10">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-white/5">
              <h3 className="text-sm sm:text-base font-black text-stone-900 dark:text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-500" />
                <span>Публікація в Telegram-канал</span>
              </h3>
              <button
                onClick={() => setPublishModal((prev) => ({ ...prev, isOpen: false }))}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Telegram Post Mockup */}
            <div className="bg-[#0f141c] text-white rounded-2xl p-3.5 space-y-2.5 border border-slate-800 shadow-md">
              <div className="text-[10px] uppercase font-bold text-sky-400 flex items-center gap-1">
                <span>Прев'ю публікації в Telegram:</span>
              </div>
              <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-800">
                <img
                  src={publishModal.product.image_url}
                  alt={publishModal.product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h5 className="font-bold text-xs sm:text-sm text-white">{publishModal.product.title}</h5>
                <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">{publishModal.product.description}</p>
                <div className="text-xs font-black text-rose-400 mt-1">Ціна: {formatCurrency(publishModal.product.price)}</div>
              </div>
              {/* Telegram Native Inline Button */}
              <div className="pt-1">
                <div className="w-full py-2 bg-sky-500/20 text-sky-300 text-xs font-bold text-center rounded-xl border border-sky-500/40">
                  🛍 Замовити цей букет • {formatCurrency(publishModal.product.price)}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                ID групи / каналу (або @username)
              </label>
              <input
                type="text"
                value={publishModal.channelId}
                onChange={(e) =>
                  setPublishModal((prev) => ({ ...prev, channelId: e.target.value }))
                }
                placeholder="-5431810394 або @flowers___lviv"
                className="w-full px-4 py-2.5 bg-stone-50 dark:bg-slate-800 text-xs sm:text-sm text-stone-900 dark:text-white rounded-2xl border border-stone-200/60 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono shadow-inner"
              />
            </div>

            {publishModal.message && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                  publishModal.isSuccess
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                    : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/25'
                }`}
              >
                {publishModal.isSuccess && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{publishModal.message}</span>
              </div>
            )}

            <button
              onClick={executePublish}
              disabled={publishModal.isPublishing}
              className="w-full py-4 px-5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70"
            >
              {publishModal.isPublishing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Опублікувати в каналі</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Categories Manager Modal */}
      {isCategoryModalOpen && (
        <CategoryManagerModal
          categories={categories}
          onClose={() => setIsCategoryModalOpen(false)}
          onRefresh={onRefreshData}
        />
      )}

      {/* Product Create/Edit Form Modal */}
      {productModalState.isOpen && (
        <ProductFormModal
          product={productModalState.product}
          categories={categories}
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
