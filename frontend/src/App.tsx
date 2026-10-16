import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartView } from './components/CartView';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CourierDashboard } from './components/courier/CourierDashboard';
import type { Category, Product, Order } from './types';
import { api } from './api';
import { getLocalizedProduct } from './i18n/translations';
import { ShoppingBag, ArrowRight, RefreshCw, AlertCircle, Clock, Truck, ExternalLink } from 'lucide-react';
import { hapticImpact, getTelegramWebApp, openExternalLink } from './utils/telegram';

const ShopContent: React.FC = () => {
  const { mode } = useAuth();
  const { totalCount, totalPrice } = useCart();
  const { t, language, formatCurrency } = useLanguage();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals & Navigation state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [successfulOrder, setSuccessfulOrder] = useState<Order | null>(null);

  const handledDeepLinkRef = useRef<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const [catsData, prodsData] = await Promise.all([
        api.getCategories(),
        api.getProducts(),
      ]);
      setCategories(catsData);
      setProducts(prodsData);

      // Check Deep Linking (startapp=p_{id} or ?product={id})
      const tg = getTelegramWebApp();
      const startParam = tg?.initDataUnsafe?.start_param;
      const urlParams = new URLSearchParams(window.location.search);
      const queryParam = urlParams.get('startapp') || urlParams.get('product');

      const targetParam = startParam || queryParam;
      if (targetParam && handledDeepLinkRef.current !== targetParam) {
        handledDeepLinkRef.current = targetParam;
        const prodId = parseInt(targetParam.replace('p_', ''), 10);
        if (!isNaN(prodId)) {
          const match = prodsData.find((p) => p.id === prodId);
          if (match) {
            setSelectedProduct(match);
          }
        }
      }
    } catch (err: any) {
      console.error('Failed to load shop data:', err);
      setError(err.message || 'Помилка завантаження даних');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredProducts = products
    .map((p) => getLocalizedProduct(p, language))
    .filter((p) => {
      const matchesCategory =
        selectedCategoryId === null || p.category_id === selectedCategoryId;
      const matchesSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  return (
    <div
      className="min-h-screen min-h-[100dvh] w-full max-w-full overflow-x-hidden bg-[#f8f8f9] dark:bg-[#0f1115] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans"
      style={{
        paddingBottom:
          mode === 'buyer' && totalCount > 0
            ? 'calc(6rem + env(safe-area-inset-bottom, 16px))'
            : 'calc(2.5rem + env(safe-area-inset-bottom, 16px))',
      }}
    >
      {/* Top Header */}
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Mode View Switcher: Admin / Courier / Buyer */}
      {mode === 'admin' ? (
        <AdminDashboard
          categories={categories}
          products={products}
          onRefreshData={loadData}
        />
      ) : mode === 'courier' ? (
        <CourierDashboard />
      ) : (
        <main className="max-w-4xl mx-auto w-full px-3.5 sm:px-6 py-3.5 flex-1 flex flex-col space-y-3.5">
          {/* Compact Info Bar */}
          <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#181b20] border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>10:00 – 20:00</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Доставка від 60 хв</span>
              </span>
            </div>

            <button
              onClick={() => {
                hapticImpact('light');
                openExternalLink('https://www.instagram.com/flowers___lviv/');
              }}
              className="text-zinc-900 dark:text-zinc-200 font-medium hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>Instagram</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </button>
          </div>

          {/* Categories Horizontal Scroll */}
          <CategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center justify-between gap-3 text-xs text-red-600 dark:text-red-400">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={loadData}
                className="px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.retry}</span>
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-2.5">
              <div className="w-6 h-6 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-zinc-400">{t.loadingCatalog}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center space-y-3 bg-white dark:bg-[#181b20] rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-6">
              <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mx-auto">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {t.emptyProductsTitle}
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  {searchQuery
                    ? `${t.emptyProductsDesc}: «${searchQuery}»`
                    : t.emptyProductsDesc}
                </p>
              </div>
              {(searchQuery || selectedCategoryId !== null) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategoryId(null);
                  }}
                  className="mt-1 px-3.5 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-900 dark:text-zinc-200 rounded-lg hover:bg-zinc-200/70 transition-colors cursor-pointer"
                >
                  {t.resetFilters}
                </button>
              )}
            </div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3.5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetails={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}
        </main>
      )}

      {/* Floating Bottom Cart Bar */}
      {mode === 'buyer' && totalCount > 0 && !isCartOpen && (
        <div
          className="fixed left-3.5 right-3.5 max-w-md mx-auto z-40"
          style={{
            bottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <button
            onClick={() => {
              hapticImpact('medium');
              setIsCartOpen(true);
            }}
            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-3.5 rounded-xl shadow-lg flex items-center justify-between active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-white/15 dark:bg-zinc-900/10 flex items-center justify-center font-semibold text-xs">
                {totalCount}
              </span>
              <span className="text-sm font-semibold">Кошик</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">
                {formatCurrency(totalPrice)}
              </span>
              <ArrowRight className="w-4 h-4 opacity-75" />
            </div>
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Cart View Drawer */}
      {isCartOpen && (
        <CartView
          onClose={() => setIsCartOpen(false)}
          onOrderSuccess={(order) => {
            setIsCartOpen(false);
            setSuccessfulOrder(order);
          }}
        />
      )}

      {/* Order Success Modal */}
      {successfulOrder && (
        <OrderSuccessModal
          order={successfulOrder}
          onClose={() => setSuccessfulOrder(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>
            <ShopContent />
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </LanguageProvider>
  );
}
