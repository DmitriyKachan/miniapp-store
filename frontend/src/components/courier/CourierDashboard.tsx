import React, { useState, useEffect, useCallback } from 'react';
import type { Order, OrderStatus } from '../../types';
import { api } from '../../api';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import {
  Truck,
  MapPin,
  Phone,
  Clock,
  EyeOff,
  PhoneCall,
  CheckCircle2,
  Navigation,
  RefreshCw,
  Sparkles,
  User,
} from 'lucide-react';
import { hapticImpact } from '../../utils/telegram';

export const CourierDashboard: React.FC = () => {
  const { t, formatCurrency } = useLanguage();
  const { showNotification } = useNotification();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'to_deliver' | 'completed'>('to_deliver');
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.getOrders();
      setOrders(data);
    } catch (e) {
      console.warn('Failed to load courier orders:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleUpdateStatus = async (orderId: number, status: OrderStatus) => {
    try {
      hapticImpact('medium');
      await api.updateOrderStatus(orderId, status);
      loadOrders();

      if (status === 'in_delivery') {
        showNotification(
          `Курьер принял заказ #${orderId}`,
          'Букет забран из мастерской, курьер выехал к получателю',
          'courier'
        );
        showNotification(
          `Ваш букет уже едет к вам!`,
          `Курьер выехал по указанному адресу доставки.`,
          'client'
        );
      } else if (status === 'completed') {
        showNotification(
          `Заказ #${orderId} успешно доставлен!`,
          'Курьер подтвердил вручение букета получателю.',
          'courier'
        );
        showNotification(
          `Букет успешно доставлен!`,
          'Получатель принял цветы. Спасибо за ваш заказ!',
          'client'
        );
      }
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  // Orders relevant to courier
  const activeOrders = orders.filter(
    (o) => o.status === 'ready_for_pickup' || o.status === 'in_delivery' || o.status === 'assembling' || o.status === 'pending'
  );
  const completedOrders = orders.filter((o) => o.status === 'completed');

  const displayedOrders = activeTab === 'to_deliver' ? activeOrders : completedOrders;

  return (
    <div className="max-w-4xl mx-auto w-full px-3.5 sm:px-6 py-4 space-y-4 animate-in fade-in duration-200 pb-20">
      
      {/* Top Courier Stats Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-stone-950 text-white shadow-xl flex items-center justify-between border border-indigo-500/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <Truck className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight">Strefa Kuriera (Express)</h2>
          </div>
          <p className="text-xs text-indigo-200/80 font-medium">
            {activeOrders.filter((o) => o.status === 'ready_for_pickup' || o.status === 'in_delivery').length} gotowe do natychmiastowego doręczenia
          </p>
        </div>

        <button
          onClick={() => {
            hapticImpact('light');
            loadOrders();
          }}
          className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer active:scale-90"
          title="Odśwież"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Segmented Tab Controls */}
      <div className="flex items-center bg-stone-200/60 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-stone-200/40 dark:border-white/5">
        <button
          onClick={() => {
            hapticImpact('light');
            setActiveTab('to_deliver');
          }}
          className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeTab === 'to_deliver'
              ? 'bg-white dark:bg-[#141a24] text-stone-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          Do doręczenia ({activeOrders.length})
        </button>
        <button
          onClick={() => {
            hapticImpact('light');
            setActiveTab('completed');
          }}
          className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-white dark:bg-[#141a24] text-stone-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          Doręczone ({completedOrders.length})
        </button>
      </div>

      {/* Deliveries List */}
      {displayedOrders.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white dark:bg-[#141a24] rounded-3xl border border-stone-200/60 dark:border-white/5 p-8 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-500 mx-auto">
            <Truck className="w-8 h-8" />
          </div>
          <h3 className="text-sm sm:text-base font-black text-stone-900 dark:text-white">
            {t.courierNoDeliveries}
          </h3>
          <p className="text-xs text-stone-400">Brak aktywnych tras w tym momencie</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {displayedOrders.map((order) => {
            const isCurrentlyInDelivery = order.status === 'in_delivery';
            const isReadyForPickup = order.status === 'ready_for_pickup';
            const cleanAddress = (order.address || order.comment || '').split('\n')[0].replace(/^(📞|🤫|💌).*$/, '').trim();

            return (
              <div
                key={order.id}
                className={`p-4 sm:p-5 rounded-3xl border transition-all space-y-3.5 ${
                  isCurrentlyInDelivery
                    ? 'bg-indigo-500/10 dark:bg-indigo-950/30 border-indigo-500/40 shadow-lg ring-2 ring-indigo-500/20'
                    : isReadyForPickup
                    ? 'bg-amber-500/10 dark:bg-amber-950/20 border-amber-500/30 shadow-xs'
                    : 'bg-white dark:bg-[#141a24] border-stone-200/60 dark:border-white/5 shadow-xs'
                }`}
              >
                {/* Header: Order ID, Status & Price */}
                <div className="flex items-center justify-between gap-2 border-b border-stone-100 dark:border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-stone-900 dark:text-white">
                      Zamówienie #{order.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        order.status === 'in_delivery'
                          ? 'bg-indigo-600 text-white shadow-xs animate-pulse'
                          : order.status === 'ready_for_pickup'
                          ? 'bg-amber-500 text-white font-black'
                          : order.status === 'assembling'
                          ? 'bg-purple-600 text-white'
                          : order.status === 'completed'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-400 text-white'
                      }`}
                    >
                      {order.status === 'in_delivery'
                        ? 'W drodze do klienta'
                        : order.status === 'ready_for_pickup'
                        ? 'Do odbioru w atelier'
                        : order.status === 'assembling'
                        ? 'Florysta układa bukiet'
                        : order.status === 'completed'
                        ? 'Doręczone'
                        : 'Nowe'}
                    </span>
                  </div>

                  <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                    {formatCurrency(order.total_price)}
                  </span>
                </div>

                {/* Timing & Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {(order.delivery_date || order.delivery_time) && (
                    <div className="px-3 py-1 rounded-xl bg-stone-100 dark:bg-slate-800 text-[11px] font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 border border-stone-200/50 dark:border-white/5">
                      <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>
                        {order.delivery_date || 'Dziś'} • {order.delivery_time || '14:00'}
                      </span>
                    </div>
                  )}

                  {order.is_surprise && (
                    <div className="px-3 py-1 rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-300 text-[11px] font-bold flex items-center gap-1.5 border border-purple-500/25">
                      <EyeOff className="w-3.5 h-3.5 shrink-0" />
                      <span>Niespodzianka (Anonim)</span>
                    </div>
                  )}

                  {order.need_call_recipient && (
                    <div className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1.5 border border-emerald-500/25">
                      <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                      <span>Ustalić adres tel.</span>
                    </div>
                  )}
                </div>

                {/* Recipient details & Address */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold">
                    <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{order.customer_name}</span>
                    {order.customer_username && (
                      <span className="text-stone-400 text-[11px] font-normal">(@{order.customer_username})</span>
                    )}
                  </div>

                  {cleanAddress && (
                    <div className="flex items-start gap-1.5 text-stone-600 dark:text-stone-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span className="leading-snug font-medium">{cleanAddress}</span>
                    </div>
                  )}

                  {order.comment && order.comment.includes('💌 Bilecik') && (
                    <div className="p-2.5 bg-rose-50/70 dark:bg-rose-950/20 rounded-2xl text-[11px] text-rose-800 dark:text-rose-300 italic border border-rose-200/50 dark:border-rose-900/30">
                      {order.comment.split('\n').find((l) => l.includes('💌'))}
                    </div>
                  )}
                </div>

                {/* Items in Bouquet */}
                {order.items && order.items.length > 0 && (
                  <div className="p-3 bg-stone-50 dark:bg-slate-800/60 rounded-2xl space-y-1.5 border border-stone-200/50 dark:border-white/5">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      Zawartość zamówienia:
                    </span>
                    <div className="space-y-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs text-stone-700 dark:text-stone-300">
                          <span className="truncate max-w-[240px] font-medium">
                            • {it.title}
                          </span>
                          <span className="font-bold">x{it.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons: Map Navigator & Call */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {order.phone ? (
                    <a
                      href={`tel:${order.phone.replace(/\s+/g, '')}`}
                      onClick={() => hapticImpact('light')}
                      className="py-2.5 px-3 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all text-center cursor-pointer hover:bg-emerald-500/20"
                    >
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>Zadzwoń</span>
                    </a>
                  ) : (
                    <div />
                  )}

                  {cleanAddress ? (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => hapticImpact('light')}
                      className="py-2.5 px-3 rounded-2xl bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/25 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all text-center cursor-pointer hover:bg-sky-500/20"
                    >
                      <Navigation className="w-3.5 h-3.5 shrink-0" />
                      <span>Nawiguj (Mapy)</span>
                    </a>
                  ) : (
                    <div />
                  )}
                </div>

                {/* Bottom Delivery Lifecycle Flow Action Buttons */}
                {order.status === 'ready_for_pickup' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'in_delivery')}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Odbierz bukiet z atelier i ruszaj w trasę</span>
                  </button>
                )}

                {order.status === 'in_delivery' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'completed')}
                    className="w-full py-4 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Potwierdź doręczenie bukietu odbiorcy!</span>
                  </button>
                )}

                {(order.status === 'pending' || order.status === 'assembling') && (
                  <div className="py-2.5 px-3 bg-stone-100 dark:bg-slate-800 text-stone-500 dark:text-stone-400 text-xs rounded-2xl flex items-center justify-center gap-1.5 border border-stone-200/40 dark:border-white/5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-spin" />
                    <span>Florysta przygotowuje bukiet. Powiadomimy Cię o gotowości do odbioru.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
