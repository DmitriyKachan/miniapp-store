import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartView } from './components/CartView';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CourierDashboard } from './components/courier/CourierDashboard';
import { AIFloristModal } from './components/AIFloristModal';
import type { Category, Product, Order } from './types';
import { api } from './api';
import { getLocalizedProduct } from './i18n/translations';
import { ShoppingBag, ArrowRight, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { hapticImpact, getTelegramWebApp } from './utils/telegram';

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
  const [isAIFloristOpen, setIsAIFloristOpen] = useState(false);
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
      setError(err.message || 'Błąd ładowania danych');
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
    <div className="min-h-screen bg-[#fcf9f9] dark:bg-[#0f141c] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors pb-24">
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
        <main className="max-w-4xl mx-auto w-full px-3 sm:px-4 py-3 flex-1 flex flex-col space-y-4">
          
          {/* AI-Florist Assistant Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white p-4 sm:p-5 shadow-lg shadow-rose-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1 z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                <span>Smart Assistant</span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold leading-tight">
                {t.aiFloristBannerTitle}
              </h2>
              <p className="text-[11px] sm:text-xs text-rose-100 max-w-sm">
                {t.aiFloristBannerSubtitle}
              </p>
            </div>

            <button
              onClick={() => {
                hapticImpact('medium');
                setIsAIFloristOpen(true);
              }}
              className="z-10 px-4 py-2.5 rounded-2xl bg-white text-rose-600 hover:bg-rose-50 font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>{t.aiFloristOpenButton}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Decorative background blurs */}
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute right-20 -bottom-8 w-24 h-24 bg-pink-400/20 rounded-full blur-xl pointer-events-none" />
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
                className="px-3 py-1 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{t.retry}</span>
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-3 border-rose-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-gray-400">{t.loadingCatalog}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="py-20 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-[#18222d] flex items-center justify-center text-rose-400 mx-auto">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {t.emptyProductsTitle}
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                {searchQuery
                  ? `${t.emptyProductsDesc}: «${searchQuery}»`
                  : t.emptyProductsDesc}
              </p>
              {(searchQuery || selectedCategoryId !== null) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategoryId(null);
                  }}
                  className="mt-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  {t.resetFilters}
                </button>
              )}
            </div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
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
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-40 animate-in slide-in-from-bottom-6 duration-300">
          <button
            onClick={() => {
              hapticImpact('medium');
              setIsCartOpen(true);
            }}
            className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white p-4 rounded-2xl shadow-xl shadow-rose-500/25 flex items-center justify-between active:scale-[0.99] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xs">
                {totalCount}
              </div>
              <span className="text-sm font-semibold">{t.cart}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold tracking-wide">
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

      {/* AI-Florist Modal */}
      {isAIFloristOpen && (
        <AIFloristModal
          products={products}
          onClose={() => setIsAIFloristOpen(false)}
          onOpenProduct={(p) => {
            setIsAIFloristOpen(false);
            setSelectedProduct(p);
          }}
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
      <AuthProvider>
        <CartProvider>
          <ShopContent />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
