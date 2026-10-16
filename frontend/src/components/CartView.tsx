import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../api';
import type { Order, Product } from '../types';
import { getLocalizedProduct } from '../i18n/translations';
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  AlertCircle,
  Check,
  Clock,
} from 'lucide-react';
import { hapticImpact, hapticNotification } from '../utils/telegram';

interface CartViewProps {
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

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

  const [deliveryDate, setDeliveryDate] = useState(todayStr);
  const [deliveryTime, setDeliveryTime] = useState('14:00');
  const [isSurprise, setIsSurprise] = useState(false);
  const [needCallRecipient, setNeedCallRecipient] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [upsellProducts, setUpsellProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.getProducts({ in_stock_only: true })
      .then((all) => {
        const accessories = all.filter(
          (p) =>
            p.category_id === 5 ||
            p.category_name?.toLowerCase().includes('подарун') ||
            p.category_name?.toLowerCase().includes('аксесуар')
        );
        setUpsellProducts(accessories);
      })
      .catch(() => {});
  }, []);

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
        `Нове замовлення #${newOrder.id}`,
        `Клієнт ${customerName} оформив замовлення на ${formatCurrency(totalPrice)}.`,
        'florist'
      );
      showNotification(
        `Замовлення #${newOrder.id} оформлено`,
        `Дякуємо! Ми вже готуємо ваше замовлення.`,
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
    <div className="fixed inset-0 z-50 bg-[#f8f8f9] dark:bg-[#0f1115] flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-white dark:bg-[#181b20] border-b border-zinc-200/80 dark:border-zinc-800 px-4 h-14 flex items-center justify-between">
        <button
          onClick={() => {
            hapticImpact('light');
            onClose();
          }}
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад</span>
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-zinc-900 dark:text-white">
            {t.cart}
          </span>
          {totalCount > 0 && (
            <span className="text-xs text-zinc-400">({totalCount})</span>
          )}
        </div>

        {cart.length > 0 ? (
          <button
            onClick={() => {
              hapticImpact('medium');
              clearCart();
            }}
            className="text-xs font-medium text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            {t.clearCart}
          </button>
        ) : (
          <div className="w-12" />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 max-w-xl mx-auto w-full space-y-4 pb-28 no-scrollbar">
        {cart.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                {t.cartEmptyTitle}
              </h3>
              <p className="text-xs text-zinc-500 max-w-xs">
                {t.cartEmptyDesc}
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-semibold cursor-pointer"
            >
              {t.goToCatalog}
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="bg-white dark:bg-[#181b20] rounded-2xl border border-zinc-200/80 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">
              {cart.map((item) => {
                const localized = getLocalizedProduct(item.product, language);
                return (
                  <div
                    key={item.product.id}
                    className="p-3 flex items-center gap-3"
                  >
                    <div className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0">
                      {localized.image_url ? (
                        <img
                          src={localized.image_url}
                          alt={localized.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <img src="./logo.png" alt="" className="w-6 h-6 object-contain opacity-40" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white truncate">
                        {localized.title}
                      </h4>
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-200 mt-0.5">
                        {formatCurrency(localized.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-md bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 flex items-center justify-center cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-semibold text-zinc-900 dark:text-white w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 text-zinc-400 hover:text-red-500 transition-colors shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Upsells (if any in database) */}
            {upsellProducts.length > 0 && (
              <div className="bg-white dark:bg-[#181b20] rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-3.5 space-y-2.5">
                <h4 className="text-xs font-semibold text-zinc-900 dark:text-white">
                  {t.upsellTitle}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {upsellProducts.map((acc) => {
                    const localizedAcc = getLocalizedProduct(acc, language);
                    const inCart = cart.some((c) => c.product.id === acc.id);
                    return (
                      <div
                        key={acc.id}
                        className="p-2.5 rounded-xl border border-zinc-200/70 dark:border-zinc-800 flex items-center justify-between gap-2.5"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                          {localizedAcc.image_url && (
                            <img src={localizedAcc.image_url} alt={localizedAcc.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-zinc-900 dark:text-white truncate">
                            {localizedAcc.title}
                          </p>
                          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                            {formatCurrency(localizedAcc.price)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddUpsell(acc)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1 cursor-pointer ${
                            inCart
                              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                              : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                          }`}
                        >
                          {inCart ? <Check className="w-3.5 h-3.5" /> : <span>+</span>}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Delivery Date & Time */}
            <div className="bg-white dark:bg-[#181b20] rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-4 space-y-3">
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-white">
                {t.deliveryTimingTitle}
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryDate(todayStr)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    deliveryDate === todayStr
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white font-semibold'
                      : 'bg-transparent text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  {t.today}
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryDate(tomorrowStr)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    deliveryDate === tomorrowStr
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white font-semibold'
                      : 'bg-transparent text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  {t.tomorrow}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-zinc-500 mb-1 block">
                    {t.deliveryDateLabel}
                  </label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full h-10 px-3 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl text-xs font-medium text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-500 mb-1 block">
                    {t.deliveryTimeLabel}
                  </label>
                  <div className="relative">
                    <select
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="w-full h-10 px-3 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl text-xs font-medium text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 focus:outline-none appearance-none pr-8 cursor-pointer"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    <Clock className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isSurprise}
                    onChange={(e) => setIsSurprise(e.target.checked)}
                    className="w-4 h-4 rounded accent-zinc-900 dark:accent-white cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-zinc-700 dark:text-zinc-300">
                    {t.surpriseDeliveryTitle}
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={needCallRecipient}
                    onChange={(e) => setNeedCallRecipient(e.target.checked)}
                    className="w-4 h-4 rounded accent-zinc-900 dark:accent-white cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-zinc-700 dark:text-zinc-300">
                    {t.needCallRecipientTitle}
                  </span>
                </label>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleCheckout} className="space-y-4">
              <div className="bg-white dark:bg-[#181b20] rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-4 space-y-3">
                <h3 className="text-xs font-semibold text-zinc-900 dark:text-white">
                  {t.contactInfo}
                </h3>

                <div>
                  <label className="block text-[11px] text-zinc-500 mb-1">
                    {t.customerName} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.customerNamePlaceholder}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 focus:outline-none placeholder:text-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-500 mb-1">
                    {t.phoneNumber}
                  </label>
                  <input
                    type="tel"
                    placeholder={t.phoneNumberPlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 focus:outline-none placeholder:text-zinc-400"
                  />
                </div>

                {!needCallRecipient && (
                  <div>
                    <label className="block text-[11px] text-zinc-500 mb-1">
                      {t.addressComment}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={t.addressCommentPlaceholder}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 focus:outline-none placeholder:text-zinc-400 resize-none"
                    />
                    <p className="mt-1 text-[11px] text-zinc-400">
                      {t.pickupInfo}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] text-zinc-500 mb-1">
                    {t.cardMessage}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={t.cardMessagePlaceholder}
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 focus:outline-none placeholder:text-zinc-400 resize-none"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white dark:bg-[#181b20] rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-4 space-y-2">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>{t.itemsInOrder}</span>
                  <span>{totalCount} шт.</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>{t.delivery}</span>
                  <span className="text-zinc-900 dark:text-zinc-200 font-medium">{t.freeDelivery}</span>
                </div>
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-2 flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">{t.totalToPay}</span>
                  <span className="text-lg font-bold text-zinc-900 dark:text-white">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Bottom Checkout Bar */}
              <div className="fixed bottom-0 left-0 right-0 p-3.5 bg-white/95 dark:bg-[#181b20]/95 backdrop-blur-md border-t border-zinc-200/80 dark:border-zinc-800 z-30">
                <div className="max-w-xl mx-auto">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-semibold text-sm flex items-center justify-between active:scale-[0.99] transition-transform disabled:opacity-60 cursor-pointer"
                  >
                    <span>{t.proceedToCheckout}</span>
                    <span className="font-bold">
                      {isSubmitting ? '...' : formatCurrency(totalPrice)}
                    </span>
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
