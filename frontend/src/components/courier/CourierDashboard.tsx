import React, { useState, useEffect, useCallback } from 'react';
import type { Order } from '../../types';
import { api } from '../../api';
import { useLanguage } from '../../context/LanguageContext';
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
} from 'lucide-react';
import { hapticImpact, hapticNotification } from '../../utils/telegram';

export const CourierDashboard: React.FC = () => {
  const { t, formatCurrency } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
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

  const handleUpdateStatus = async (orderId: number, status: Order['status']) => {
    try {
      hapticImpact('medium');
      await api.updateOrderStatus(orderId, status);
      hapticNotification('success');
      loadOrders();
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  const activeOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  const displayedOrders = activeTab === 'active' ? activeOrders : completedOrders;

  return (
    <div className="max-w-4xl mx-auto w-full px-3 sm:px-4 py-3 space-y-4 animate-in fade-in duration-200">
      
      {/* Top Courier Stats Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xl flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <Truck className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-extrabold">{t.courierDashboardTitle}</h2>
          </div>
          <p className="text-xs text-indigo-200/80">
            {activeOrders.length} активных доставок • Будьте вежливы с получателями 🌸
          </p>
        </div>

        <button
          onClick={() => {
            hapticImpact('light');
            loadOrders();
          }}
          className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          title="Обновить"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Segmented Tab Controls */}
      <div className="flex items-center bg-gray-200/70 dark:bg-[#1f2c3b] p-1 rounded-2xl">
        <button
          onClick={() => {
            hapticImpact('light');
            setActiveTab('active');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'active'
              ? 'bg-white dark:bg-[#18222d] text-gray-900 dark:text-white shadow-2xs'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {t.courierActiveDeliveries} ({activeOrders.length})
        </button>
        <button
          onClick={() => {
            hapticImpact('light');
            setActiveTab('completed');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-white dark:bg-[#18222d] text-gray-900 dark:text-white shadow-2xs'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {t.courierCompletedDeliveries} ({completedOrders.length})
        </button>
      </div>

      {/* Deliveries List */}
      {displayedOrders.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white dark:bg-[#18222d] rounded-3xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-500 mx-auto">
            <Truck className="w-7 h-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
            {t.courierNoDeliveries}
          </h3>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedOrders.map((order) => {
            const isCurrentlyInDelivery = order.status === 'in_delivery';
            const cleanAddress = (order.address || order.comment || '').split('\n')[0].replace(/^(📞|🤫|💌).*$/, '').trim();

            return (
              <div
                key={order.id}
                className={`p-4 rounded-3xl border transition-all space-y-3.5 ${
                  isCurrentlyInDelivery
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-800 shadow-md ring-1 ring-indigo-500/30'
                    : 'bg-white dark:bg-[#18222d] border-gray-100 dark:border-gray-800 shadow-2xs'
                }`}
              >
                {/* Header: Order ID, Status & Price */}
                <div className="flex items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white">
                      #{order.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'in_delivery'
                          ? 'bg-indigo-500 text-white shadow-xs animate-pulse'
                          : order.status === 'completed'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {order.status === 'in_delivery'
                        ? t.orderInDelivery
                        : order.status === 'completed'
                        ? t.orderCompleted
                        : t.orderPending}
                    </span>
                  </div>

                  <span className="text-xs sm:text-sm font-extrabold text-rose-600 dark:text-rose-400">
                    {formatCurrency(order.total_price)}
                  </span>
                </div>

                {/* Timing & Special Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {(order.delivery_date || order.delivery_time) && (
                    <div className="px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-[#233142] text-[11px] font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>
                        {order.delivery_date || 'Сегодня'} • {order.delivery_time || '14:00'}
                      </span>
                    </div>
                  )}

                  {order.is_surprise && (
                    <div className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-[11px] font-bold flex items-center gap-1 border border-purple-200 dark:border-purple-800">
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>{t.courierSurpriseBadge}</span>
                    </div>
                  )}

                  {order.need_call_recipient && (
                    <div className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{t.courierCallNeededBadge}</span>
                    </div>
                  )}
                </div>

                {/* Recipient details & Address */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-semibold">
                    <span>👤 {order.customer_name}</span>
                    {order.customer_username && (
                      <span className="text-gray-400 text-[11px]">(@{order.customer_username})</span>
                    )}
                  </div>

                  {cleanAddress && (
                    <div className="flex items-start gap-1.5 text-gray-600 dark:text-gray-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{cleanAddress}</span>
                    </div>
                  )}

                  {order.comment && order.comment.includes('💌 Bilecik') && (
                    <div className="p-2 bg-rose-50/70 dark:bg-rose-950/30 rounded-xl text-[11px] text-rose-800 dark:text-rose-300 italic border border-rose-100 dark:border-rose-900/30">
                      {order.comment.split('\n').find((l) => l.includes('💌'))}
                    </div>
                  )}
                </div>

                {/* Items in Bouquet */}
                {order.items && order.items.length > 0 && (
                  <div className="p-2.5 bg-gray-50 dark:bg-[#233142]/60 rounded-2xl space-y-1.5 border border-gray-100 dark:border-gray-800">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      Состав для курьера:
                    </span>
                    <div className="space-y-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300">
                          <span className="truncate max-w-[240px]">
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
                      className="py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all text-center"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Позвонить</span>
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
                      className="py-2.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-500/20 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all text-center"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Google Maps</span>
                    </a>
                  ) : (
                    <div />
                  )}
                </div>

                {/* Bottom Delivery Status Controller */}
                {order.status !== 'completed' && (
                  <div className="pt-1">
                    {order.status !== 'in_delivery' ? (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'in_delivery')}
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <Truck className="w-4 h-4" />
                        <span>{t.courierStartDelivery}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'completed')}
                        className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-500/25 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t.courierMarkDelivered}</span>
                      </button>
                    )}
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
