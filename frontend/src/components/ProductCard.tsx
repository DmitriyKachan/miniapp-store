import React from 'react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduct } from '../i18n/translations';
import { Plus, Minus, Sparkles } from 'lucide-react';
import { hapticImpact } from '../utils/telegram';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { getItemQuantity, addToCart, updateQuantity } = useCart();
  const { t, language, formatCurrency } = useLanguage();
  const localized = getLocalizedProduct(product, language);
  const quantity = getItemQuantity(product.id);
  const isOutOfStock = product.in_stock === 0;

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    hapticImpact('light');
    if (quantity === 0) {
      addToCart(localized, 1);
    } else {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    hapticImpact('light');
    updateQuantity(product.id, quantity - 1);
  };

  return (
    <div
      onClick={() => onOpenDetails(localized)}
      className="group relative bg-white dark:bg-[#141a24] rounded-3xl border border-stone-200/60 dark:border-white/5 shadow-xs hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer active:scale-[0.98]"
    >
      {/* Top Image Container */}
      <div className="relative w-full pt-[96%] bg-stone-100 dark:bg-slate-800/60 overflow-hidden">
        {localized.image_url ? (
          <img
            src={localized.image_url}
            alt={localized.title}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108 ${
              isOutOfStock ? 'grayscale opacity-60' : ''
            }`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-300 dark:text-stone-600 text-xs">
            🌸 Flowers Lviv
          </div>
        )}

        {/* Subtle Gradient Overlay on image for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none gap-1">
          {localized.category_name ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md text-white/95 truncate max-w-[120px] shadow-xs">
              {localized.category_name}
            </span>
          ) : <span />}

          {isOutOfStock ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-stone-900/80 text-rose-300 backdrop-blur-md shadow-xs border border-rose-500/30">
              {t.outOfStock}
            </span>
          ) : product.price >= 2500 ? (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-400 text-stone-950 backdrop-blur-md shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>LUX</span>
            </span>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white line-clamp-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors leading-snug">
            {localized.title}
          </h3>
          {localized.description && (
            <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
              {localized.description}
            </p>
          )}
        </div>

        {/* Price & Add to Cart button */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400 dark:text-stone-500">
              Ціна
            </div>
            <div className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white tracking-tight">
              {formatCurrency(localized.price)}
            </div>
          </div>

          {/* Stepper / Add button */}
          {isOutOfStock ? (
            <span className="text-[11px] text-stone-400 font-medium">{t.outOfStock}</span>
          ) : quantity > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 bg-rose-500/10 dark:bg-rose-950/40 border border-rose-500/25 rounded-2xl p-1"
            >
              <button
                onClick={handleDecrement}
                className="w-7 h-7 rounded-xl bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-300 flex items-center justify-center shadow-xs active:scale-90 transition-transform cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-black text-rose-600 dark:text-rose-400 w-5 text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs active:scale-90 transition-transform cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleIncrement}
              className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-500/25 active:scale-90 transition-transform cursor-pointer"
              aria-label="Add to cart"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
