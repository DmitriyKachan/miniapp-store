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
  Sparkles,
  PackageCheck,
  Truck,
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
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      hapticImpact('medium');
      await api.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      // Trigger test notifications for all roles
      if (newStatus === 'assembling') {
        showNotification(
          `Заказ #${orderId} принят флористом`,
          'Флорист начал сборку свежей композиции',
          'florist'
        );
        showNotification(
          `Ваш заказ #${orderId} собирается!`,
          'Флорист подбирает самые свежие цветы для вашего букета',
          'client'
        );
      } else if (newStatus === 'ready_for_pickup') {
        showNotification(
          `Заказ #${orderId} собран!`,
          'Букет готов к выдаче. Курьер получил уведомление о заборе.',
          'florist'
        );
        showNotification(
          `Новый заказ #${orderId} к забору!`,
          'Букет готов и ждет курьера в мастерской.',
          'courier'
        );
      } else if (newStatus === 'in_delivery') {
        showNotification(
          `Курьер в пути к получателю`,
          `Заказ #${orderId} передан курьеру и доставляется по адресу.`,
          'client'
        );
      } else if (newStatus === 'completed') {
        showNotification(
          `Заказ #${orderId} успешно доставлен!`,
          'Букет вручен получателю в руки.',
          'client'
        );
      }
    } catch (err: any) {
      alert(err.message || 'Error');
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'assembling':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            {t.orderAssembling}
          </span>
        );
      case 'ready_for_pickup':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            {t.orderReadyForPickup}
          </span>
        );
      case 'in_delivery':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            {t.orderInDelivery}
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {t.orderCompleted}
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-500/20">
            {t.orderCancelled}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            {t.orderPending}
          </span>
        );
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter Chips */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-1.5 min-w-max">
          {[
            { key: 'all', label: t.allCategories },
            { key: 'pending', label: 'Nowe' },
            { key: 'assembling', label: 'Układanie' },
            { key: 'ready_for_pickup', label: 'Do odbioru' },
            { key: 'in_delivery', label: 'W dostawie' },
            { key: 'completed', label: 'Doręczone' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                hapticImpact('light');
                setStatusFilter(tab.key);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                statusFilter === tab.key
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/25'
                  : 'bg-white dark:bg-[#141a24] text-stone-600 dark:text-stone-300 border border-stone-200/60 dark:border-white/5 hover:border-stone-300'
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
          className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline shrink-0 flex items-center gap-1.5 cursor-pointer px-2 py-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Odśwież</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-16 flex items-center justify-center">
          <div className="w-7 h-7 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 text-center text-stone-400 text-xs bg-white dark:bg-[#141a24] rounded-3xl border border-stone-200/60 dark:border-white/5">
          {t.adminNoOrders}
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredOrders.map((order) => {
            const isExpanded = expandedId === order.id;
            return (
              <div
                key={order.id}
                className="bg-white dark:bg-[#141a24] rounded-3xl border border-stone-200/60 dark:border-white/5 shadow-xs overflow-hidden transition-all space-y-2 hover:border-stone-300 dark:hover:border-white/10"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-stone-900 dark:text-white">
                        {t.orderNumber} #{order.id}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate font-medium">
                      {order.customer_name || 'Klient'} • {new Date(order.created_at).toLocaleString('pl-PL')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-black text-sm sm:text-base text-rose-600 dark:text-rose-400">
                      {formatCurrency(order.total_price)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400" />
                    )}
                  </div>
                </div>

                {/* Primary Florist Workflow Action Buttons */}
                <div className="px-4 sm:px-5 pb-3.5 flex items-center gap-2 flex-wrap">
                  {order.status === 'pending' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(order.id, 'assembling');
                      }}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 active:scale-98 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Przyjmij zamówienie i zacznij układanie</span>
                    </button>
                  )}

                  {order.status === 'assembling' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(order.id, 'ready_for_pickup');
                      }}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
                    >
                      <PackageCheck className="w-4 h-4" />
                      <span>Bukiet gotowy! Powiadom kuriera o odbiorze</span>
                    </button>
                  )}

                  {order.status === 'ready_for_pickup' && (
                    <div className="flex-1 py-2.5 px-4 bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded-2xl text-xs font-bold flex items-center gap-2 border border-amber-500/20">
                      <Truck className="w-4 h-4" />
                      <span>Bukiet oczekuje na odbiór przez kuriera w atelier</span>
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t border-stone-100 dark:border-white/5 bg-stone-50/70 dark:bg-slate-800/40 space-y-3.5 text-xs">
                    {/* Customer info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-600 dark:text-stone-300">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        <span className="font-bold">{order.customer_name} {order.customer_username && `(@${order.customer_username})`}</span>
                      </div>
                      {order.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          <span className="font-semibold">{order.phone}</span>
                        </div>
                      )}
                      {(order.delivery_date || order.delivery_time) && (
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <Clock className="w-3.5 h-3.5 text-rose-500" />
                          <span className="font-bold">Termin: {order.delivery_date || 'Dziś'} o godz. {order.delivery_time || '14:00'}</span>
                        </div>
                      )}
                      {order.comment && (
                        <div className="flex items-start gap-2 sm:col-span-2 p-2.5 bg-white dark:bg-[#141a24] rounded-2xl border border-stone-200/50 dark:border-white/5">
                          <MessageSquare className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                          <span className="italic leading-relaxed">{order.comment}</span>
                        </div>
                      )}
                    </div>

                    {/* Ordered Items Breakdown */}
                    <div className="space-y-1.5 pt-1">
                      <h5 className="font-black uppercase tracking-wider text-[10px] text-stone-400 dark:text-stone-500">{t.adminOrderItems}</h5>
                      {order.items && order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#141a24] border border-stone-200/50 dark:border-white/5"
                        >
                          <span className="font-bold text-stone-800 dark:text-stone-200">
                            {item.title} × {item.quantity}
                          </span>
                          <span className="font-black text-stone-900 dark:text-white">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Manual Status Changer */}
                    <div className="pt-2.5 flex items-center justify-between gap-2 flex-wrap border-t border-stone-200/60 dark:border-white/5">
                      <span className="font-bold text-stone-500">Status ręczny:</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {(['pending', 'assembling', 'ready_for_pickup', 'in_delivery', 'completed', 'cancelled'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleStatusChange(order.id, st)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                              order.status === st
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-stone-200/80 dark:bg-slate-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300'
                            }`}
                          >
                            {st === 'pending' && 'Nowy'}
                            {st === 'assembling' && 'Układanie'}
                            {st === 'ready_for_pickup' && 'Gotowy'}
                            {st === 'in_delivery' && 'W trasie'}
                            {st === 'completed' && 'Doręczony'}
                            {st === 'cancelled' && 'Anulowany'}
                          </button>
                        ))}
                      </div>
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
