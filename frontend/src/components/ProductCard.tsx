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
      className="group bg-white dark:bg-[#181b20] rounded-2xl border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
    >
      {/* Image */}
      <div className="relative w-full aspect-square bg-zinc-100 dark:bg-zinc-800/60 overflow-hidden">
        {localized.image_url ? (
          <img
            src={localized.image_url}
            alt={localized.title}
            loading="lazy"
            className={`w-full h-full object-cover ${
              isOutOfStock ? 'grayscale opacity-50' : ''
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-6">
            <img src="./logo.png" alt="Flowers Lviv" className="w-10 h-10 object-contain opacity-40" />
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-900/80 text-white backdrop-blur-xs">
              {t.outOfStock}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <h3 className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1 leading-snug">
            {localized.title}
          </h3>
          {localized.description && (
            <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
              {localized.description}
            </p>
          )}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <span className="text-sm font-bold text-zinc-900 dark:text-white">
            {formatCurrency(localized.price)}
          </span>

          {isOutOfStock ? (
            <span className="text-[11px] text-zinc-400">{t.outOfStock}</span>
          ) : quantity > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5"
            >
              <button
                onClick={handleDecrement}
                className="w-6 h-6 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-semibold text-zinc-900 dark:text-white w-4 text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-6 h-6 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleIncrement}
              className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
              aria-label="Додати в кошик"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
