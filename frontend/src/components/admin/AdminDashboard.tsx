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
  ShoppingBag,
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
          message: 'Букет успешно опубликован в группу с интерактивной кнопкой!',
        }));
      } else {
        hapticNotification('error');
        setPublishModal((prev) => ({
          ...prev,
          isPublishing: false,
          isSuccess: false,
          message: res.message || 'Ошибка отправки в Telegram',
        }));
      }
    } catch (err: any) {
      setPublishModal((prev) => ({
        ...prev,
        isPublishing: false,
        isSuccess: false,
        message: err.message || 'Ошибка',
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
    <div className="max-w-4xl mx-auto w-full px-3 sm:px-4 py-3 space-y-4 animate-in fade-in duration-200">
      
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div
          onClick={() => setActiveTab('products')}
          className={`p-2.5 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            activeTab === 'products'
              ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 shadow-2xs'
              : 'bg-white dark:bg-[#18222d] border-gray-100 dark:border-gray-800'
          }`}
        >
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
            <Package className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px] sm:text-xs font-semibold truncate">{t.adminProducts}</span>
          </div>
          <p className="text-base sm:text-xl font-extrabold text-gray-900 dark:text-white mt-1">
            {products.length}
          </p>
        </div>

        <div
          onClick={() => setIsCategoryModalOpen(true)}
          className="p-2.5 sm:p-3.5 rounded-2xl bg-white dark:bg-[#18222d] border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px] sm:text-xs font-semibold truncate">{t.adminCategories}</span>
          </div>
          <p className="text-base sm:text-xl font-extrabold text-gray-900 dark:text-white mt-1">
            {categories.length}
          </p>
        </div>

        <div
          onClick={() => setActiveTab('orders')}
          className={`p-2.5 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            activeTab === 'orders'
              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 shadow-2xs'
              : 'bg-white dark:bg-[#18222d] border-gray-100 dark:border-gray-800'
          }`}
        >
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px] sm:text-xs font-semibold truncate">{t.adminOrders}</span>
          </div>
          <p className="text-base sm:text-xl font-extrabold text-gray-900 dark:text-white mt-1 truncate">
            {t.adminOrdersTitle.split(' ')[0]}
          </p>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex items-center bg-gray-200/70 dark:bg-[#1f2c3b] p-1 rounded-2xl">
        <button
          onClick={() => {
            hapticImpact('light');
            setActiveTab('products');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'products'
              ? 'bg-white dark:bg-[#18222d] text-gray-900 dark:text-white shadow-2xs'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {t.adminProducts} ({products.length})
        </button>
        <button
          onClick={() => {
            hapticImpact('light');
            setActiveTab('orders');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'orders'
              ? 'bg-white dark:bg-[#18222d] text-gray-900 dark:text-white shadow-2xs'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {t.adminOrdersTitle}
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'orders' ? (
        <OrdersList />
      ) : (
        <div className="space-y-3">
          
          {/* Action buttons on mobile */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                hapticImpact('light');
                setIsCategoryModalOpen(true);
              }}
              className="py-2.5 px-3 bg-white dark:bg-[#18222d] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700/60 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs active:scale-[0.98] transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t.adminManageCategories}</span>
            </button>

            <button
              onClick={() => {
                hapticImpact('medium');
                setProductModalState({ isOpen: true, product: null });
              }}
              className="py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-rose-500/20 active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t.adminAddProduct}</span>
            </button>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#18222d] border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="relative">
              <select
                value={selectedCategoryFilter || ''}
                onChange={(e) =>
                  setSelectedCategoryFilter(e.target.value ? Number(e.target.value) : null)
                }
                className="w-full sm:w-auto px-3 py-2 bg-white dark:bg-[#18222d] border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 appearance-none pr-8"
              >
                <option value="">{t.allCategories} ({categories.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>

          {/* Products Mobile Card List */}
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs bg-white dark:bg-[#18222d] rounded-2xl border border-gray-100 dark:border-gray-800">
              {t.emptyProductsTitle}
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 bg-white dark:bg-[#18222d] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xs space-y-2.5"
                >
                  {/* Top info row */}
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-[#233142] overflow-hidden shrink-0">
                      {prod.image_url ? (
                        <img
                          src={prod.image_url}
                          alt={prod.title}
                          className={`w-full h-full object-cover ${
                            prod.in_stock === 0 ? 'grayscale opacity-60' : ''
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                          Kwiaty
                        </div>
                      )}
                    </div>

                    {/* Title, Category & Price */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {prod.category_name && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                            {prod.category_name}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mt-1 line-clamp-1">
                        {prod.title}
                      </h4>
                      <p className="text-xs sm:text-sm font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">
                        {formatCurrency(prod.price)}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="border-t border-gray-100 dark:border-gray-800/80 pt-2 flex items-center justify-between gap-2">
                    {/* Stock status toggle button */}
                    <button
                      onClick={() => handleToggleStock(prod)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1.5 active:scale-95 ${
                        prod.in_stock === 1
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-500/20'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          prod.in_stock === 1 ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                      />
                      <span>{prod.in_stock === 1 ? t.inStock : t.outOfStock}</span>
                    </button>

                    {/* Channel, Edit & Delete Action Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openPublishModal(prod)}
                        className="px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-semibold flex items-center gap-1 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors active:scale-95"
                        title="Opublikuj w grupie/kanale"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>В группу</span>
                      </button>

                      <button
                        onClick={() => setProductModalState({ isOpen: true, product: prod })}
                        className="px-2.5 py-1.5 bg-gray-100 dark:bg-[#233142] text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-[#2e3f53] transition-colors active:scale-95"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>Edytuj</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(prod)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors active:scale-95"
                        title="Usuń"
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full sm:max-w-md bg-white dark:bg-[#18222d] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 space-y-4 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Send className="w-4 h-4 text-blue-500" />
                <span>Публикация в группу / канал</span>
              </h3>
              <button
                onClick={() => setPublishModal((prev) => ({ ...prev, isOpen: false }))}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Product Preview Card */}
            <div className="p-3 bg-gray-50 dark:bg-[#233142]/60 rounded-2xl flex items-center gap-3">
              <img
                src={publishModal.product.image_url}
                alt={publishModal.product.title}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {publishModal.product.title}
                </h4>
                <p className="text-xs font-extrabold text-rose-600 dark:text-rose-400">
                  {formatCurrency(publishModal.product.price)}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Куда отправить (ID группы или @username канала)
              </label>
              <input
                type="text"
                value={publishModal.channelId}
                onChange={(e) =>
                  setPublishModal((prev) => ({ ...prev, channelId: e.target.value }))
                }
                placeholder="-5431810394 или @kanal"
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#233142] text-xs sm:text-sm text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            {publishModal.message && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  publishModal.isSuccess
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-500/20'
                }`}
              >
                {publishModal.isSuccess && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{publishModal.message}</span>
              </div>
            )}

            <button
              onClick={executePublish}
              disabled={publishModal.isPublishing}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70"
            >
              {publishModal.isPublishing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Опубликовать прямо сейчас</span>
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
