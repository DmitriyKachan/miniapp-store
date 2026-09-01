import React, { useState } from 'react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { hapticImpact } from '../utils/telegram';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { getItemQuantity, addToCart } = useCart();
  const { t, formatCurrency } = useLanguage();
  const [selectedQty, setSelectedQty] = useState(1);

  if (!product) return null;

  const currentInCart = getItemQuantity(product.id);
  const isOutOfStock = product.in_stock === 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    hapticImpact('medium');
    addToCart(product, selectedQty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-md bg-white dark:bg-[#18222d] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative w-full pt-[70%] bg-gray-100 dark:bg-[#233142]">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.title}
              className={`absolute inset-0 w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-70' : ''}`}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              Brak zdjęcia
            </div>
          )}

          {/* Close button */}
          <button
            onClick={() => {
              hapticImpact('light');
              onClose();
            }}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Category Chip */}
          {product.category_name && (
            <span className="absolute bottom-3.5 left-3.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/50 backdrop-blur-md text-white">
              {product.category_name}
            </span>
          )}
        </div>

        {/* Info & Description */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              {product.title}
            </h2>
            <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 shrink-0">
              {formatCurrency(product.price)}
            </span>
          </div>

          {product.description && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {t.adminDescription}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Stock status */}
          <div className="flex items-center gap-2 pt-1">
            <span
              className={`w-2 h-2 rounded-full ${product.in_stock ? 'bg-emerald-500' : 'bg-red-500'}`}
            />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {product.in_stock ? t.inStock : t.outOfStock}
            </span>
            {currentInCart > 0 && (
              <span className="ml-auto text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
                {t.inCart}: {currentInCart} szt.
              </span>
            )}
          </div>
        </div>

        {/* Footer with quantity stepper and Add button */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#151c24] flex items-center gap-3">
          {!isOutOfStock && (
            <div className="flex items-center gap-2 bg-white dark:bg-[#18222d] border border-gray-200 dark:border-gray-700 rounded-xl p-1 shrink-0">
              <button
                onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-90 transition-transform"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-gray-900 dark:text-white w-6 text-center">
                {selectedQty}
              </span>
              <button
                onClick={() => setSelectedQty(selectedQty + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-90 transition-transform"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`flex-1 py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] ${
              isOutOfStock
                ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {isOutOfStock
                ? t.outOfStock
                : `${t.addToCart} • ${formatCurrency(product.price * selectedQty)}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
