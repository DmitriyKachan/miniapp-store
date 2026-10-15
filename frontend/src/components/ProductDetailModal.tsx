import React, { useState } from 'react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduct } from '../i18n/translations';
import { X, Plus, Minus, ShoppingBag, Sparkles, Heart, Droplets } from 'lucide-react';
import { hapticImpact } from '../utils/telegram';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { getItemQuantity, addToCart } = useCart();
  const { t, language, formatCurrency } = useLanguage();
  const [selectedQty, setSelectedQty] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md transition-all animate-in fade-in duration-200"
    >
      <div
        className="w-full sm:max-w-md bg-white dark:bg-[#141a24] rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-300 border border-stone-200/50 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-stone-100/50 dark:bg-slate-800/40">
          <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-slate-600" />
        </div>

        {/* Hero image container */}
        <div className="relative w-full pt-[85%] bg-[#f5f2eb] dark:bg-slate-800 overflow-hidden">
          {localized.image_url ? (
            <img
              src={localized.image_url}
              alt={localized.title}
              className={`absolute inset-0 w-full h-full object-cover ${
                isOutOfStock ? 'grayscale opacity-70' : ''
              }`}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#faf8f5]">
              <img src="./logo.png" alt="Flowers Lviv Logo" className="w-20 h-20 object-contain" />
              <span className="font-brand-serif text-xs tracking-widest text-[#6e809f] uppercase mt-2">Flowers Lviv Atelier</span>
            </div>
          )}

          {/* Action pills top */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
            {localized.category_name ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white shadow-xs">
                {localized.category_name}
              </span>
            ) : <span />}

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  hapticImpact('light');
                  setIsLiked(!isLiked);
                }}
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer active:scale-90"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#c5a880] text-[#c5a880]' : 'text-white'}`} />
              </button>

              <button
                onClick={() => {
                  hapticImpact('light');
                  onClose();
                }}
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Info & Description Body */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-4 no-scrollbar">
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-brand-serif text-xl sm:text-2xl font-bold text-[#131d33] dark:text-white leading-tight">
                {localized.title}
              </h2>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#131d33] dark:text-[#f8fafc] tracking-tight">
              {formatCurrency(localized.price)}
            </div>
          </div>

          {/* Boutique guarantees */}
          <div className="grid grid-cols-2 gap-2 py-1">
            <div className="p-2.5 rounded-2xl bg-[#131d33]/5 dark:bg-white/5 border border-[#131d33]/10 dark:border-white/10 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c5a880] shrink-0" />
              <span className="text-[11px] font-bold text-[#131d33] dark:text-[#f1f5f9]">
                {t.fastDeliveryBadge}
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#6e809f]/10 dark:bg-[#6e809f]/20 border border-[#6e809f]/20 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#6e809f] shrink-0" />
              <span className="text-[11px] font-bold text-[#131d33] dark:text-[#f1f5f9]">
                {t.chrysalFreeBadge}
              </span>
            </div>
          </div>

          {localized.description && (
            <div className="space-y-1.5 pt-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#6e809f]">
                Склад та опис букету
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                {localized.description}
              </p>
            </div>
          )}

          {/* Stock status indicator */}
          <div className="flex items-center gap-2 pt-1 border-t border-[#e8e4da] dark:border-white/5">
            <span
              className={`w-2 h-2 rounded-full ${
                localized.in_stock ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
              }`}
            />
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              {localized.in_stock ? t.inStock : t.outOfStock}
            </span>
            {currentInCart > 0 && (
              <span className="ml-auto text-xs font-bold text-[#131d33] dark:text-[#f1f5f9] bg-[#131d33]/10 dark:bg-white/10 px-2.5 py-1 rounded-xl">
                {t.inCart}: {currentInCart}
              </span>
            )}
          </div>
        </div>

        {/* Footer with quantity stepper and Add button */}
        <div className="p-4 border-t border-[#e8e4da] dark:border-white/10 bg-[#faf8f5] dark:bg-[#0f141c]/90 backdrop-blur-md flex items-center gap-3">
          {!isOutOfStock && (
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-[#e8e4da] dark:border-white/10 rounded-2xl p-1 shrink-0 shadow-xs">
              <button
                onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-700 dark:text-stone-200 hover:bg-[#f5f2eb] dark:hover:bg-slate-700 active:scale-90 transition-transform cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-black text-stone-900 dark:text-white w-7 text-center">
                {selectedQty}
              </span>
              <button
                onClick={() => setSelectedQty(selectedQty + 1)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-700 dark:text-stone-200 hover:bg-[#f5f2eb] dark:hover:bg-slate-700 active:scale-90 transition-transform cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`flex-1 py-4 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-[0.98] cursor-pointer ${
              isOutOfStock
                ? 'bg-stone-200 dark:bg-slate-800 text-stone-400 cursor-not-allowed shadow-none'
                : 'bg-[#131d33] hover:bg-[#1a2846] text-white shadow-[#131d33]/25 border border-[#2b3c5c]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#c5a880]" />
            <span>
              {isOutOfStock
                ? t.outOfStock
                : `${t.addToCart} • ${formatCurrency(localized.price * selectedQty)}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
