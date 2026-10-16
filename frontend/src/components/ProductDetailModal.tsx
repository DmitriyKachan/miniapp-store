import React, { useState } from 'react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduct } from '../i18n/translations';
import { X, Plus, Minus } from 'lucide-react';
import { hapticImpact } from '../utils/telegram';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { getItemQuantity, addToCart } = useCart();
  const { t, language, formatCurrency } = useLanguage();
  const [selectedQty, setSelectedQty] = useState(1);

  if (!product) return null;

  const localized = getLocalizedProduct(product, language);
  const currentInCart = getItemQuantity(localized.id);
  const isOutOfStock = localized.in_stock === 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    hapticImpact('medium');
    addToCart(localized, selectedQty);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs"
    >
      <div
        className="w-full sm:max-w-md bg-white dark:bg-[#181b20] rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[90vh] flex flex-col border border-zinc-200 dark:border-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative w-full aspect-square max-h-[46vh] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          {localized.image_url ? (
            <img
              src={localized.image_url}
              alt={localized.title}
              className={`w-full h-full object-cover ${
                isOutOfStock ? 'grayscale opacity-60' : ''
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-6">
              <img src="./logo.png" alt="Flowers Lviv" className="w-16 h-16 object-contain opacity-40" />
            </div>
          )}

          <button
            onClick={() => {
              hapticImpact('light');
              onClose();
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-3 no-scrollbar">
          <div className="flex items-start justify-between gap-3">
            <div>
              {localized.category_name && (
                <span className="text-[11px] font-medium text-zinc-400 block mb-0.5">
                  {localized.category_name}
                </span>
              )}
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white leading-snug">
                {localized.title}
              </h2>
            </div>
            <div className="text-lg font-bold text-zinc-900 dark:text-white shrink-0">
              {formatCurrency(localized.price)}
            </div>
          </div>

          {localized.description && (
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
              {localized.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  localized.in_stock ? 'bg-emerald-500' : 'bg-zinc-400'
                }`}
              />
              <span>{localized.in_stock ? t.inStock : t.outOfStock}</span>
            </span>
            {currentInCart > 0 && (
              <span className="font-medium text-zinc-900 dark:text-zinc-200">
                {t.inCart}: {currentInCart}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#181b20] flex items-center gap-2.5">
          {!isOutOfStock && (
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 shrink-0">
              <button
                onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-700 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-zinc-900 dark:text-white w-6 text-center">
                {selectedQty}
              </span>
              <button
                onClick={() => setSelectedQty(selectedQty + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center transition-colors cursor-pointer ${
              isOutOfStock
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 active:scale-[0.99]'
            }`}
          >
            {isOutOfStock
              ? t.outOfStock
              : `${t.addToCart} • ${formatCurrency(localized.price * selectedQty)}`}
          </button>
        </div>
      </div>
    </div>
  );
};
