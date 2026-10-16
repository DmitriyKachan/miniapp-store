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

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [productModalState, setProductModalState] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({
    isOpen: false,
    product: null,
  });

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
          message: 'Букет опубліковано в канал',
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
    <div className="max-w-4xl mx-auto w-full px-3.5 sm:px-6 py-3.5 space-y-3.5 pb-24">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center bg-zinc-200/70 dark:bg-zinc-800 p-1 rounded-xl">
          <button
            onClick={() => {
              hapticImpact('light');
              setActiveTab('products');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'bg-white dark:bg-[#181b20] text-zinc-900 dark:text-white shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Товари ({products.length})
          </button>

          <button
            onClick={() => {
              hapticImpact('light');
              setActiveTab('orders');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white dark:bg-[#181b20] text-zinc-900 dark:text-white shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Замовлення
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              hapticImpact('light');
              setIsCategoryModalOpen(true);
            }}
            className="h-9 px-3 bg-white dark:bg-[#181b20] text-zinc-700 dark:text-zinc-200 rounded-xl text-xs font-medium flex items-center gap-1.5 border border-zinc-200/80 dark:border-zinc-800 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Категорії</span>
          </button>

          <button
            onClick={() => {
              hapticImpact('medium');
              setProductModalState({ isOpen: true, product: null });
            }}
            className="h-9 px-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Додати</span>
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <OrdersList />
      ) : (
        <div className="space-y-3">
          {/* Search & Refresh */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Пошук букета..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white dark:bg-[#181b20] border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 placeholder:text-zinc-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 cursor-pointer"
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
              title="Оновити"
              className="h-9 w-9 bg-white dark:bg-[#181b20] border border-zinc-200/80 dark:border-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                hapticImpact('light');
                setSelectedCategoryFilter(null);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                selectedCategoryFilter === null
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold'
                  : 'bg-white dark:bg-[#181b20] text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800'
              }`}
            >
              Усі ({products.length})
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
                  className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold'
                      : 'bg-white dark:bg-[#181b20] text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800'
                  }`}
                >
                  {c.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Products List */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-2 bg-white dark:bg-[#181b20] rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-6">
              <Package className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto" />
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Товари відсутні</h3>
              <p className="text-xs text-zinc-400">
                {searchQuery ? `Нічого не знайдено за запитом «${searchQuery}»` : 'Додайте перший букет до каталогу'}
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#181b20] rounded-2xl border border-zinc-200/80 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 sm:p-3.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0">
                      {prod.image_url ? (
                        <img
                          src={prod.image_url}
                          alt={prod.title}
                          className={`w-full h-full object-cover ${
                            prod.in_stock === 0 ? 'grayscale opacity-50' : ''
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <img src="./logo.png" alt="" className="w-6 h-6 object-contain opacity-40" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white truncate">
                          {prod.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-200">
                          {formatCurrency(prod.price)}
                        </span>
                        <button
                          onClick={() => handleToggleStock(prod)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-medium inline-flex items-center gap-1 cursor-pointer ${
                            prod.in_stock === 1
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              prod.in_stock === 1 ? 'bg-emerald-500' : 'bg-zinc-400'
                            }`}
                          />
                          <span>{prod.in_stock === 1 ? 'В наявності' : 'Немає'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openPublishModal(prod)}
                      className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
                      title="Опублікувати в канал"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setProductModalState({ isOpen: true, product: prod })}
                      className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
                      title="Редагувати"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setProductToDelete(prod)}
                      className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-red-600 flex items-center justify-center cursor-pointer"
                      title="Видалити"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white dark:bg-[#181b20] rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Видалити букет?
              </h3>
              <p className="text-xs text-zinc-500">
                «{productToDelete.title}» буде видалено з каталогу.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProductToDelete(null)}
                className="py-2.5 px-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Скасувати
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="py-2.5 px-3 bg-red-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                {isDeleting ? '...' : 'Видалити'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {publishModal.isOpen && publishModal.product && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full sm:max-w-sm bg-white dark:bg-[#181b20] rounded-t-2xl sm:rounded-2xl p-5 space-y-4 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Публікація в Telegram
              </h3>
              <button
                onClick={() => setPublishModal((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-500">
                Канал або група:
              </label>
              <input
                type="text"
                placeholder="@flowers_lviv або ID групи"
                value={publishModal.channelId}
                onChange={(e) => setPublishModal((prev) => ({ ...prev, channelId: e.target.value }))}
                className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none"
              />
            </div>

            {publishModal.message && (
              <div
                className={`p-3 rounded-xl text-xs ${
                  publishModal.isSuccess
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300'
                }`}
              >
                {publishModal.message}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPublishModal((prev) => ({ ...prev, isOpen: false }))}
                className="py-2.5 px-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Закрити
              </button>

              <button
                type="button"
                disabled={publishModal.isPublishing}
                onClick={executePublish}
                className="py-2.5 px-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {publishModal.isPublishing ? '...' : 'Опублікувати'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isCategoryModalOpen && (
        <CategoryManagerModal
          categories={categories}
          onClose={() => setIsCategoryModalOpen(false)}
          onRefresh={onRefreshData}
        />
      )}

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
