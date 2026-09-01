import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api, UPSELL_ACCESSORIES } from '../api';
import type { Order, Product } from '../types';
import { getLocalizedProduct } from '../i18n/translations';
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, ShoppingBag, AlertCircle, Sparkles, Check } from 'lucide-react';
import { hapticImpact, hapticNotification } from '../utils/telegram';

interface CartViewProps {
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CartView: React.FC<CartViewProps> = ({ onClose, onOrderSuccess }) => {
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, totalPrice, totalCount } = useCart();
  const { user } = useAuth();
  const { t, language, formatCurrency } = useLanguage();

  const [customerName, setCustomerName] = useState(
    user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : ''
  );
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [cardMessage, setCardMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAddUpsell = (product: Product) => {
    hapticImpact('light');
    const localized = getLocalizedProduct(product, language);
    addToCart(localized, 1);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!customerName.trim()) {
      setError(t.errorNameRequired);
      hapticNotification('warning');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      hapticImpact('heavy');

      const itemsPayload = cart.map((item) => {
        const localized = getLocalizedProduct(item.product, language);
        return {
          id: localized.id,
          title: localized.title,
          price: localized.price,
          quantity: item.quantity,
          image_url: localized.image_url,
        };
      });

      // Combine address and card message
      let fullComment = address.trim();
      if (cardMessage.trim()) {
        fullComment += `\n💌 Bilecik: "${cardMessage.trim()}"`;
      }

      const newOrder = await api.createOrder({
        telegram_user_id: user ? String(user.id) : '',
        customer_name: customerName.trim(),
        customer_username: user?.username || '',
        phone: phone.trim(),
        comment: fullComment,
        items: itemsPayload,
        total_price: totalPrice,
      });

      hapticNotification('success');
      clearCart();
      onOrderSuccess(newOrder);
    } catch (err: any) {
      setError(err.message || t.errorOrderFailed);
      hapticNotification('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] dark:bg-[#0f141c] flex flex-col animate-in slide-in-from-right duration-200">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#18222d]/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => {
            hapticImpact('light');
            onClose();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToCatalog}</span>
        </button>

        <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
          <span>{t.cart}</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            {totalCount}
          </span>
        </h2>

        {cart.length > 0 ? (
          <button
            onClick={() => {
              hapticImpact('medium');
              clearCart();
            }}
            className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            {t.clearCart}
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 max-w-xl mx-auto w-full space-y-4">
        {cart.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-[#18222d] flex items-center justify-center text-rose-500">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t.cartEmptyTitle}</h3>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
              {t.cartEmptyDesc}
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-rose-700 transition-colors cursor-pointer"
            >
              {t.goToCatalog}
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="space-y-2">
              {cart.map((item) => {
                const localized = getLocalizedProduct(item.product, language);
                return (
                  <div
                    key={item.product.id}
                    className="p-3 bg-white dark:bg-[#18222d] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xs flex items-center gap-3"
                  >
                    {/* Item Image */}
                    <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-[#233142] overflow-hidden shrink-0">
                      {localized.image_url ? (
                        <img
                          src={localized.image_url}
                          alt={localized.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          🌸 Kwiaty
                        </div>
                      )}
                    </div>

                    {/* Title and Price */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {localized.title}
                      </h4>
                      <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                        {formatCurrency(localized.price)}
                      </p>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#233142]/60 rounded-xl p-1 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-white dark:bg-[#18222d] text-gray-700 dark:text-gray-300 flex items-center justify-center shadow-2xs active:scale-90 transition-transform cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-gray-900 dark:text-white w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-2xs active:scale-90 transition-transform cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0 cursor-pointer"
                      title="Usuń"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* UPSELL RECOMMENDATIONS: "Coś do bukietu? 🎁" */}
            <div className="bg-gradient-to-br from-rose-50/70 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-950/10 rounded-2xl border border-rose-100 dark:border-rose-900/30 p-3.5 space-y-2.5">
              <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
                <Sparkles className="w-4 h-4" />
                <div>
                  <h4 className="text-xs font-bold">{t.upsellTitle}</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{t.upsellSubtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {UPSELL_ACCESSORIES.map((acc) => {
                  const localizedAcc = getLocalizedProduct(acc, language);
                  const inCart = cart.some((c) => c.product.id === acc.id);
                  return (
                    <div
                      key={acc.id}
                      className="p-2.5 bg-white dark:bg-[#18222d] rounded-xl border border-rose-100/60 dark:border-gray-800 flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800">
                        <img src={localizedAcc.image_url} alt={localizedAcc.title} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-gray-900 dark:text-white line-clamp-1">
                          {localizedAcc.title}
                        </p>
                        <p className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400">
                          {localizedAcc.price === 0 ? (language === 'pl' ? 'Gratis' : (language === 'ua' ? 'Безкоштовно' : 'Бесплатно')) : formatCurrency(localizedAcc.price)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddUpsell(acc)}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                          inCart
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                            : 'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs active:scale-95'
                        }`}
                      >
                        {inCart ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>{t.addedToOrder}</span>
                          </>
                        ) : (
                          <span>{t.addToOrder}</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Details Form */}
            <form onSubmit={handleCheckout} className="space-y-3.5">
              <div className="bg-white dark:bg-[#18222d] rounded-2xl border border-gray-100 dark:border-gray-800 p-3.5 sm:p-4 space-y-3 shadow-2xs">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {t.contactInfo}
                </h3>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.customerName}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.customerNamePlaceholder}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#233142]/60 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white border border-transparent focus:border-rose-500 focus:outline-none transition-colors placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.phoneNumber}
                  </label>
                  <input
                    type="tel"
                    placeholder={t.phoneNumberPlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#233142]/60 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white border border-transparent focus:border-rose-500 focus:outline-none transition-colors placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.addressComment}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={t.addressCommentPlaceholder}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-[#233142]/60 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white border border-transparent focus:border-rose-500 focus:outline-none transition-colors placeholder:text-gray-400 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    💌 {t.cardMessage}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={t.cardMessagePlaceholder}
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value)}
                    className="w-full px-3.5 py-2 bg-rose-50/50 dark:bg-[#233142]/40 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white border border-rose-200/50 dark:border-rose-900/30 focus:border-rose-500 focus:outline-none transition-colors placeholder:text-gray-400 resize-none italic"
                  />
                </div>
              </div>

              {/* Order Summary & Pricing breakdown */}
              <div className="bg-white dark:bg-[#18222d] rounded-2xl border border-gray-100 dark:border-gray-800 p-3.5 sm:p-4 space-y-2 shadow-2xs">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{t.itemsInOrder}</span>
                  <span>{totalCount} szt.</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{t.delivery}</span>
                  <span className="text-emerald-500 font-semibold">{t.freeDelivery}</span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-800 pt-2 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{t.totalToPay}</span>
                  <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Checkout / Pay Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-2xl font-bold text-base shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2.5 active:scale-[0.99] transition-all disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>{t.proceedToCheckout} • {formatCurrency(totalPrice)}</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
