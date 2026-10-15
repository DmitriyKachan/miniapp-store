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
import { ShoppingBag, ArrowRight, RefreshCw, AlertCircle, MapPin, Clock, Truck, ExternalLink } from 'lucide-react';
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
    <div className="min-h-screen bg-[#faf7f5] dark:bg-[#0b0f17] text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors pb-28">
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
        <main className="max-w-4xl mx-auto w-full px-3.5 sm:px-6 py-4 flex-1 flex flex-col space-y-4">
          
          {/* Flowers Lviv Brand & Atelier Showcase Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-900 via-rose-800 to-pink-900 text-white p-5 sm:p-6 shadow-xl shadow-rose-900/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-rose-400/25">
            <div className="space-y-2 z-10 max-w-lg">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[10px] font-black tracking-widest uppercase text-white shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Flowers Lviv Atelier</span>
              </div>
              <h2 className="text-base sm:text-xl font-black tracking-tight leading-snug">
                Свіжі авторські букети та доставка квітів по Львову
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-rose-100 font-medium">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>вул. Топольна, 4В</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>10:00 – 20:00</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>від 60 хв</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                hapticImpact('light');
                openExternalLink('https://www.instagram.com/flowers___lviv/');
              }}
              className="z-10 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-pink-400 text-stone-950 hover:brightness-105 font-black text-xs sm:text-sm shadow-xl active:scale-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>@flowers___lviv</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-950" />
            </button>

            {/* Decorative background glows */}
            <div className="absolute -right-8 -top-8 w-44 h-44 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute right-32 -bottom-10 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Categories Horizontal Scroll */}
          <CategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 rounded-2xl flex items-center justify-between gap-3 text-xs text-red-600 dark:text-red-400">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={loadData}
                className="px-3.5 py-1.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.retry}</span>
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading ? (
            <div className="py-28 flex flex-col items-center justify-center space-y-3">
              <div className="w-9 h-9 border-3 border-rose-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-stone-400 font-medium">{t.loadingCatalog}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="py-24 text-center space-y-3.5 bg-white dark:bg-[#141a24] rounded-3xl border border-stone-200/60 dark:border-white/5 p-8 shadow-xs">
              <div className="w-16 h-16 rounded-3xl bg-rose-500/10 dark:bg-rose-950/40 flex items-center justify-center text-rose-500 mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-stone-900 dark:text-white">
                  {t.emptyProductsTitle}
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
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
                  className="mt-2 px-4 py-2 bg-stone-100 dark:bg-slate-800 text-xs font-bold text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  {t.resetFilters}
                </button>
              )}
            </div>
          ) : (
            /* Products Grid with optimal responsive spacing */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
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
        <div className="fixed bottom-5 left-4 right-4 max-w-md mx-auto z-40 animate-in slide-in-from-bottom-8 duration-300">
          <button
            onClick={() => {
              hapticImpact('medium');
              setIsCartOpen(true);
            }}
            className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white p-4 rounded-3xl shadow-2xl shadow-rose-600/35 flex items-center justify-between active:scale-[0.99] transition-all cursor-pointer border border-white/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/25 flex items-center justify-center font-black text-xs backdrop-blur-xs">
                {totalCount}
              </div>
              <span className="text-sm font-bold tracking-tight">{t.cart}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight">
                {formatCurrency(totalPrice)}
              </span>
              <ArrowRight className="w-4 h-4" />
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
