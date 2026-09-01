import React from 'react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduct } from '../i18n/translations';
import { Plus, Minus } from 'lucide-react';
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
      className="group relative bg-white dark:bg-[#18222d] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-xs overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-pointer active:scale-[0.99]"
    >
      {/* Top Image Container */}
      <div className="relative w-full pt-[75%] bg-gray-50 dark:bg-[#233142]/40 overflow-hidden">
        {localized.image_url ? (
          <img
            src={localized.image_url}
            alt={localized.title}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              isOutOfStock ? 'grayscale opacity-60' : ''
            }`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-gray-600 text-xs">
            🌸 Kwiaty
          </div>
        )}

        {/* Status / Category Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {localized.category_name && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-black/50 backdrop-blur-md text-white truncate max-w-[120px]">
              {localized.category_name}
            </span>
          )}

          {isOutOfStock && (
            <span className="ml-auto px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-red-500/90 text-white backdrop-blur-md shadow-xs">
              {t.outOfStock}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h3 className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white line-clamp-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            {localized.title}
          </h3>
          {localized.description && (
            <p className="mt-1 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {localized.description}
            </p>
          )}
        </div>

        {/* Price & Add to Cart button */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          <div>
            <span className="text-xs sm:text-base font-extrabold text-gray-900 dark:text-white">
              {formatCurrency(localized.price)}
            </span>
          </div>

          {/* Stepper / Add button */}
          {isOutOfStock ? (
            <span className="text-[11px] text-gray-400 font-medium">{t.outOfStock}</span>
          ) : quantity > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl p-0.5"
            >
              <button
                onClick={handleDecrement}
                className="w-7 h-7 rounded-lg bg-white dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 flex items-center justify-center shadow-xs active:scale-90 transition-transform"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-300 w-5 text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs active:scale-90 transition-transform"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleIncrement}
              className="w-8 h-8 rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-sm shadow-rose-500/20 active:scale-90 transition-transform"
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
