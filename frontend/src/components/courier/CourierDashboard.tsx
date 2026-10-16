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
  Navigation,
  RefreshCw,
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
          `Кур'єр прийняв замовлення #${orderId}`,
          'Кур\'єр вирушив за адресою',
          'courier'
        );
      } else if (status === 'completed') {
        showNotification(
          `Замовлення #${orderId} доставлено`,
          'Кур\'єр підтвердив вручення',
          'courier'
        );
      }
    } catch (err: any) {
      alert(err.message || 'Помилка оновлення статусу');
    }
  };

  const activeOrders = orders.filter(
    (o) => o.status === 'ready_for_pickup' || o.status === 'in_delivery' || o.status === 'assembling' || o.status === 'pending'
  );
  const completedOrders = orders.filter((o) => o.status === 'completed');

  const displayedOrders = activeTab === 'to_deliver' ? activeOrders : completedOrders;

  return (
    <div className="max-w-4xl mx-auto w-full px-3.5 sm:px-6 py-3.5 space-y-3.5 pb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center bg-zinc-200/70 dark:bg-zinc-800 p-1 rounded-xl">
          <button
            onClick={() => {
              hapticImpact('light');
              setActiveTab('to_deliver');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'to_deliver'
                ? 'bg-white dark:bg-[#181b20] text-zinc-900 dark:text-white shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Активні ({activeOrders.length})
          </button>
          <button
            onClick={() => {
              hapticImpact('light');
              setActiveTab('completed');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-white dark:bg-[#181b20] text-zinc-900 dark:text-white shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Доставлені ({completedOrders.length})
          </button>
        </div>

        <button
          onClick={() => {
            hapticImpact('light');
            loadOrders();
          }}
          className="h-9 w-9 rounded-xl bg-white dark:bg-[#181b20] border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 cursor-pointer"
          title="Оновити"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Deliveries List */}
      {displayedOrders.length === 0 ? (
        <div className="py-16 text-center space-y-2 bg-white dark:bg-[#181b20] rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-6">
          <Truck className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            {t.courierNoDeliveries}
          </h3>
        </div>
      ) : (
        <div className="space-y-2.5">
          {displayedOrders.map((order) => {
            const cleanAddress = (order.address || order.comment || '')
              .split('\n')[0]
              .replace(/^(📞|🤫|💌).*$/, '')
              .trim();

            return (
              <div
                key={order.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#181b20] border border-zinc-200/80 dark:border-zinc-800 space-y-3"
              >
                <div className="flex items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      #{order.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {order.status === 'in_delivery'
                        ? 'У дорозі'
                        : order.status === 'ready_for_pickup'
                        ? 'Готовий до видачі'
                        : order.status === 'assembling'
                        ? 'Складається'
                        : order.status === 'completed'
                        ? 'Доставлено'
                        : 'Нове'}
                    </span>
                  </div>

                  <span className="text-sm font-bold text-zinc-900 dark:text-white">
                    {formatCurrency(order.total_price)}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                  <div className="flex items-center gap-2 font-medium text-zinc-900 dark:text-white">
                    <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{order.customer_name}</span>
                  </div>

                  {(order.delivery_date || order.delivery_time) && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>
                        {order.delivery_date || 'Сьогодні'} • {order.delivery_time || '14:00'}
                      </span>
                    </div>
                  )}

                  {cleanAddress && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                      <span>{cleanAddress}</span>
                    </div>
                  )}
                </div>

                {/* Quick Call & Map */}
                {(order.phone || cleanAddress) && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {order.phone ? (
                      <a
                        href={`tel:${order.phone.replace(/\s+/g, '')}`}
                        onClick={() => hapticImpact('light')}
                        className="py-2 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium flex items-center justify-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Дзвінок</span>
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
                        className="py-2 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium flex items-center justify-center gap-1.5"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Карта</span>
                      </a>
                    ) : (
                      <div />
                    )}
                  </div>
                )}

                {order.status === 'ready_for_pickup' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'in_delivery')}
                    className="w-full py-2.5 px-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Вирушити на доставку
                  </button>
                )}

                {order.status === 'in_delivery' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'completed')}
                    className="w-full py-2.5 px-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Підтвердити доставку
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
