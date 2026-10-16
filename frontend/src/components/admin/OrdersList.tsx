import React, { useState, useEffect } from 'react';
import type { Order, OrderStatus } from '../../types';
import { api } from '../../api';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import {
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  MessageSquare,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { hapticImpact } from '../../utils/telegram';

export const OrdersList: React.FC = () => {
  const { t, formatCurrency } = useLanguage();
  const { showNotification } = useNotification();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      api.getOrders().then((data) => setOrders(data)).catch(() => {});
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      hapticImpact('medium');
      await api.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      if (newStatus === 'assembling') {
        showNotification(
          `Замовлення #${orderId} в роботі`,
          'Флорист почав складати букет',
          'florist'
        );
      } else if (newStatus === 'ready_for_pickup') {
        showNotification(
          `Замовлення #${orderId} готове`,
          'Очікує на кур’єра',
          'courier'
        );
      } else if (newStatus === 'completed') {
        showNotification(
          `Замовлення #${orderId} доставлено`,
          'Букет вручено одержувачу',
          'client'
        );
      }
    } catch (err: any) {
      alert(err.message || 'Помилка');
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'assembling':
        return { text: 'Складання', cls: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300' };
      case 'ready_for_pickup':
        return { text: 'До видачі', cls: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' };
      case 'in_delivery':
        return { text: 'У дорозі', cls: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400' };
      case 'completed':
        return { text: 'Доставлено', cls: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' };
      case 'cancelled':
        return { text: 'Скасовано', cls: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400' };
      default:
        return { text: 'Нове', cls: 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' };
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  return (
    <div className="space-y-3">
      {/* Filter Row */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {[
            { key: 'all', label: 'Усі' },
            { key: 'pending', label: 'Нові' },
            { key: 'assembling', label: 'Складання' },
            { key: 'ready_for_pickup', label: 'До видачі' },
            { key: 'in_delivery', label: 'У дорозі' },
            { key: 'completed', label: 'Доставлені' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                hapticImpact('light');
                setStatusFilter(tab.key);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === tab.key
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold'
                  : 'bg-white dark:bg-[#181b20] text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            hapticImpact('light');
            fetchOrders();
          }}
          className="h-8 w-8 rounded-lg bg-white dark:bg-[#181b20] border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {isLoading ? (
        <div className="py-16 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 text-center text-zinc-400 text-xs bg-white dark:bg-[#181b20] rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
          {t.adminNoOrders}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredOrders.map((order) => {
            const isExpanded = expandedId === order.id;
            const badge = getStatusLabel(order.status);
            return (
              <div
                key={order.id}
                className="bg-white dark:bg-[#181b20] rounded-2xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white">
                        #{order.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${badge.cls}`}>
                        {badge.text}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate">
                      {order.customer_name || 'Клієнт'} • {new Date(order.created_at).toLocaleString('uk-UA')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="font-bold text-sm text-zinc-900 dark:text-white">
                      {formatCurrency(order.total_price)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                </div>

                {/* Quick next step button */}
                {(order.status === 'pending' || order.status === 'assembling') && (
                  <div className="px-3.5 sm:px-4 pb-3">
                    {order.status === 'pending' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(order.id, 'assembling');
                        }}
                        className="w-full py-2 px-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Прийняти в роботу
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(order.id, 'ready_for_pickup');
                        }}
                        className="w-full py-2 px-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Готово до видачі кур’єру
                      </button>
                    )}
                  </div>
                )}

                {isExpanded && (
                  <div className="p-3.5 sm:p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-3 text-xs">
                    <div className="space-y-1.5 text-zinc-600 dark:text-zinc-300">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="font-medium">
                          {order.customer_name} {order.customer_username && `(@${order.customer_username})`}
                        </span>
                      </div>
                      {order.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{order.phone}</span>
                        </div>
                      )}
                      {(order.delivery_date || order.delivery_time) && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Доставка: {order.delivery_date || 'Сьогодні'} о {order.delivery_time || '14:00'}</span>
                        </div>
                      )}
                      {order.comment && (
                        <div className="flex items-start gap-2 pt-1">
                          <MessageSquare className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" />
                          <span className="whitespace-pre-line">{order.comment}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
                      {order.items && order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-1">
                          <span className="text-zinc-800 dark:text-zinc-200">
                            {item.title} × {item.quantity}
                          </span>
                          <span className="font-semibold text-zinc-900 dark:text-white">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 flex items-center gap-1.5 flex-wrap">
                      {(['pending', 'assembling', 'ready_for_pickup', 'in_delivery', 'completed', 'cancelled'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(order.id, st)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium cursor-pointer ${
                            order.status === st
                              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold'
                              : 'bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          {st === 'pending' && 'Нове'}
                          {st === 'assembling' && 'Складання'}
                          {st === 'ready_for_pickup' && 'Готовий'}
                          {st === 'in_delivery' && 'У дорозі'}
                          {st === 'completed' && 'Вручено'}
                          {st === 'cancelled' && 'Скасовано'}
                        </button>
                      ))}
                    </div>
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
