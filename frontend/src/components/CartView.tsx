import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';
import { api, UPSELL_ACCESSORIES } from '../api';
import type { Order, Product } from '../types';
import { getLocalizedProduct } from '../i18n/translations';
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  ShoppingBag,
  AlertCircle,
  Check,
  Calendar,
  Clock,
  PhoneCall,
  EyeOff,
  Gift,
  ChevronRight,
} from 'lucide-react';
import { hapticImpact, hapticNotification } from '../utils/telegram';

interface CartViewProps {
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

// Delivery time intervals from 10:00 to 20:00 (Flowers Lviv studio schedule)
const TIME_SLOTS = [
  '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

export const CartView: React.FC<CartViewProps> = ({ onClose, onOrderSuccess }) => {
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, totalPrice, totalCount } = useCart();
  const { user } = useAuth();
  const { t, language, formatCurrency } = useLanguage();
  const { showNotification } = useNotification();

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [customerName, setCustomerName] = useState(
    user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : ''
  );
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [cardMessage, setCardMessage] = useState('');

  // Delivery timing & Surprise states
  const [deliveryDate, setDeliveryDate] = useState(todayStr);
  const [deliveryTime, setDeliveryTime] = useState('14:00');
  const [isSurprise, setIsSurprise] = useState(false);
  const [needCallRecipient, setNeedCallRecipient] = useState(false);

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

      // Format comment with special badges
      let fullComment = address.trim();
      if (needCallRecipient) {
        fullComment += '\n📞 [Уточнити точну адресу у одержувача телефоном]';
      }
      if (isSurprise) {
        fullComment += '\n🤫 [СЮРПРИЗ: Не розкривати ім\'я замовника до вручення]';
      }
      if (cardMessage.trim()) {
        fullComment += `\n💌 Листівка: "${cardMessage.trim()}"`;
      }

      const newOrder = await api.createOrder({
        telegram_user_id: user ? String(user.id) : '',
        customer_name: customerName.trim(),
        customer_username: user?.username || '',
        phone: phone.trim(),
        address: address.trim(),
        comment: fullComment,
        delivery_date: deliveryDate,
        delivery_time: deliveryTime,
        is_surprise: isSurprise,
        need_call_recipient: needCallRecipient,
        items: itemsPayload,
        total_price: totalPrice,
      });

      showNotification(
        `Нове замовлення #${newOrder.id}!`,
        `Клієнт ${customerName} оформив замовлення на ${formatCurrency(totalPrice)}. Флорист може розпочинати збірку!`,
        'florist'
      );
      showNotification(
        `Замовлення #${newOrder.id} успішно оформлено!`,
        `Дякуємо! Флористи вже розпочали підготовку вашого букета.`,
        'client'
      );

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
    <div className="fixed inset-0 z-50 bg-[#faf7f5] dark:bg-[#0b0f17] flex flex-col animate-in slide-in-from-right duration-250">
      {/* Top Navigation */}
      <div className="sticky top-0 z-20 bg-white/85 dark:bg-[#141a24]/85 backdrop-blur-xl border-b border-stone-200/60 dark:border-white/5 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => {
            hapticImpact('light');
            onClose();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToCatalog}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold text-stone-900 dark:text-white uppercase tracking-wider">
            {t.cart}
          </span>
          <span className="text-xs font-black px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            {totalCount}
          </span>
        </div>

        {cart.length > 0 ? (
          <button
            onClick={() => {
              hapticImpact('medium');
              clearCart();
            }}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
          >
            {t.clearCart}
          </button>
        ) : (
          <div className="w-12" />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-xl mx-auto w-full space-y-5 pb-36 no-scrollbar">
        {cart.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-rose-500/10 dark:bg-rose-950/30 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-inner">
              <ShoppingBag className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white">
                {t.cartEmptyTitle}
              </h3>
              <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                {t.cartEmptyDesc}
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-3 px-7 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-rose-500/25 hover:from-rose-500 hover:to-pink-500 transition-all cursor-pointer active:scale-95"
            >
              {t.goToCatalog}
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="space-y-2.5">
              <div className="text-[11px] uppercase font-bold tracking-wider text-stone-400 dark:text-stone-500 px-1">
                Обрані букети
              </div>
              {cart.map((item) => {
                const localized = getLocalizedProduct(item.product, language);
                return (
                  <div
                    key={item.product.id}
                    className="p-3.5 bg-white dark:bg-[#141a24] rounded-2xl border border-stone-200/60 dark:border-white/5 shadow-xs flex items-center gap-3.5 transition-all hover:border-rose-200 dark:hover:border-rose-900/40"
                  >
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-xl bg-stone-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-stone-100 dark:border-white/5">
                      {localized.image_url ? (
                        <img
                          src={localized.image_url}
                          alt={localized.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">
                          🌸 Flowers Lviv
                        </div>
                      )}
                    </div>

                    {/* Title and Price */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white line-clamp-1">
                        {localized.title}
                      </h4>
                      <p className="text-xs font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                        {formatCurrency(localized.price)}
                      </p>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-1 bg-stone-100 dark:bg-slate-800/80 rounded-xl p-1 shrink-0 border border-stone-200/40 dark:border-white/5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-[#141a24] text-stone-700 dark:text-stone-300 flex items-center justify-center shadow-xs active:scale-90 transition-transform cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black text-stone-900 dark:text-white w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs active:scale-90 transition-transform cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-stone-400 hover:text-red-500 transition-colors shrink-0 cursor-pointer"
                      title="Видалити"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* UPSELL RECOMMENDATIONS: "Доповнити букет 🎁" */}
            <div className="bg-gradient-to-br from-rose-500/5 via-pink-500/5 to-amber-500/5 rounded-3xl border border-rose-200/60 dark:border-rose-900/30 p-4 space-y-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <Gift className="w-4 h-4" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider">{t.upsellTitle}</h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">{t.upsellSubtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {UPSELL_ACCESSORIES.map((acc) => {
                  const localizedAcc = getLocalizedProduct(acc, language);
                  const inCart = cart.some((c) => c.product.id === acc.id);
                  return (
                    <div
                      key={acc.id}
                      className="p-3 bg-white dark:bg-[#141a24] rounded-2xl border border-stone-200/50 dark:border-white/5 flex items-center justify-between gap-2.5 shadow-2xs hover:shadow-sm transition-shadow"
                    >
                      <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-stone-100 dark:bg-slate-800">
                        <img src={localizedAcc.image_url} alt={localizedAcc.title} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-900 dark:text-white line-clamp-1">
                          {localizedAcc.title}
                        </p>
                        <p className="text-xs font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">
                          {localizedAcc.price === 0
                            ? 'Безкоштовно 🎁'
                            : formatCurrency(localizedAcc.price)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddUpsell(acc)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                          inCart
                            ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                            : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                        }`}
                      >
                        {inCart ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
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

            {/* Delivery Timing & Date Picker Card */}
            <div className="bg-white dark:bg-[#141a24] rounded-3xl border border-stone-200/60 dark:border-white/5 p-4 sm:p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                  <span>{t.deliveryTimingTitle}</span>
                </h3>
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  Гарантія пунктуальності
                </span>
              </div>

              {/* Quick Date Tabs */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryDate(todayStr)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    deliveryDate === todayStr
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-stone-300 border-stone-200/60 dark:border-white/5'
                  }`}
                >
                  {t.today} ({todayStr.slice(5)})
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryDate(tomorrowStr)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    deliveryDate === tomorrowStr
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-stone-300 border-stone-200/60 dark:border-white/5'
                  }`}
                >
                  {t.tomorrow} ({tomorrowStr.slice(5)})
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1.5 block">
                    {t.deliveryDateLabel}
                  </label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full h-11 px-3.5 bg-stone-50 dark:bg-slate-800/80 rounded-2xl text-xs font-bold text-stone-900 dark:text-white border border-stone-200/60 dark:border-white/5 focus:border-rose-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1.5 block">
                    {t.deliveryTimeLabel}
                  </label>
                  <div className="relative">
                    <select
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="w-full h-11 px-3.5 bg-stone-50 dark:bg-slate-800/80 rounded-2xl text-xs font-bold text-stone-900 dark:text-white border border-stone-200/60 dark:border-white/5 focus:border-rose-500 focus:outline-none transition-colors appearance-none pr-8 cursor-pointer"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    <Clock className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400" />
                  </div>
                </div>
              </div>

              {/* Special options (Surprise & Call Recipient) */}
              <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-white/5">
                <label className="p-3 rounded-2xl bg-stone-50/70 dark:bg-slate-800/50 border border-stone-200/60 dark:border-white/5 flex items-start gap-3 cursor-pointer select-none hover:bg-stone-100/60 dark:hover:bg-slate-800 transition-colors">
                  <input
                    type="checkbox"
                    checked={isSurprise}
                    onChange={(e) => setIsSurprise(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer shrink-0 accent-rose-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                      <EyeOff className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span>{t.surpriseDeliveryTitle}</span>
                    </span>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                      {t.surpriseDeliveryDesc}
                    </p>
                  </div>
                </label>

                <label className="p-3 rounded-2xl bg-stone-50/70 dark:bg-slate-800/50 border border-stone-200/60 dark:border-white/5 flex items-start gap-3 cursor-pointer select-none hover:bg-stone-100/60 dark:hover:bg-slate-800 transition-colors">
                  <input
                    type="checkbox"
                    checked={needCallRecipient}
                    onChange={(e) => setNeedCallRecipient(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer shrink-0 accent-rose-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{t.needCallRecipientTitle}</span>
                    </span>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                      {t.needCallRecipientDesc}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Customer Details Form */}
            <form onSubmit={handleCheckout} className="space-y-4">
              <div className="bg-white dark:bg-[#141a24] rounded-3xl border border-stone-200/60 dark:border-white/5 p-4 sm:p-5 space-y-3.5 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  {t.contactInfo}
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {t.customerName} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.customerNamePlaceholder}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 dark:bg-slate-800/80 rounded-2xl text-xs sm:text-sm text-stone-900 dark:text-white border border-stone-200/60 dark:border-white/5 focus:border-rose-500 focus:outline-none transition-colors placeholder:text-stone-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {t.phoneNumber}
                  </label>
                  <input
                    type="tel"
                    placeholder={t.phoneNumberPlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 dark:bg-slate-800/80 rounded-2xl text-xs sm:text-sm text-stone-900 dark:text-white border border-stone-200/60 dark:border-white/5 focus:border-rose-500 focus:outline-none transition-colors placeholder:text-stone-400"
                  />
                </div>

                {!needCallRecipient && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      {t.addressComment}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={t.addressCommentPlaceholder}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-slate-800/80 rounded-2xl text-xs sm:text-sm text-stone-900 dark:text-white border border-stone-200/60 dark:border-white/5 focus:border-rose-500 focus:outline-none transition-colors placeholder:text-stone-400 resize-none"
                    />
                    <div className="mt-2 p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/30 text-[11px] text-amber-800 dark:text-amber-200 flex items-center gap-1.5 font-medium">
                      <span>📍</span>
                      <span>{t.pickupInfo}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    💌 {t.cardMessage}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={t.cardMessagePlaceholder}
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl text-xs sm:text-sm text-stone-900 dark:text-white border border-rose-200/60 dark:border-rose-900/30 focus:border-rose-500 focus:outline-none transition-colors placeholder:text-stone-400 resize-none italic"
                  />
                </div>
              </div>

              {/* Order Summary & Pricing breakdown */}
              <div className="bg-white dark:bg-[#141a24] rounded-3xl border border-stone-200/60 dark:border-white/5 p-4 sm:p-5 space-y-2.5 shadow-xs">
                <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span>{t.itemsInOrder}</span>
                  <span className="font-bold text-stone-700 dark:text-stone-300">
                    {totalCount} шт.
                  </span>
                </div>
                <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span>{t.delivery}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t.freeDelivery}</span>
                </div>
                <div className="border-t border-dashed border-stone-200 dark:border-white/10 pt-2.5 flex justify-between items-baseline">
                  <span className="text-sm font-black text-stone-900 dark:text-white">{t.totalToPay}</span>
                  <span className="text-xl font-black text-rose-600 dark:text-rose-400">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>

              {error && (
                <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-2xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Floating Bottom Checkout Button */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-[#0b0f17]/90 backdrop-blur-xl border-t border-stone-200/60 dark:border-white/5 z-30">
                <div className="max-w-xl mx-auto">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-2xl font-black text-sm sm:text-base shadow-xl shadow-rose-500/25 flex items-center justify-between active:scale-[0.99] transition-all disabled:opacity-70 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      <span>{t.proceedToCheckout}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-black text-base">
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>{formatCurrency(totalPrice)}</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
