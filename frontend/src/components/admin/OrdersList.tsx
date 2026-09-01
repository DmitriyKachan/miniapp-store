import React, { useState, useEffect } from 'react';
import type { Order } from '../../types';
import { api } from '../../api';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronDown, ChevronUp, User, Phone, MessageSquare } from 'lucide-react';
import { hapticImpact, hapticNotification } from '../../utils/telegram';

export const OrdersList: React.FC = () => {
  const { t, formatCurrency } = useLanguage();
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

  const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
    try {
      hapticImpact('medium');
      await api.updateOrderStatus(orderId, newStatus);
      hapticNotification('success');
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err: any) {
      alert(err.message || 'Error');
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {t.orderPaid}
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            {t.orderCompleted}
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-500/20">
            {t.orderCancelled}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-500/20">
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
            { key: 'pending', label: t.orderPending.split('/')[0].trim() },
            { key: 'paid', label: t.orderPaid },
            { key: 'completed', label: t.orderCompleted },
            { key: 'cancelled', label: t.orderCancelled },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                hapticImpact('light');
                setStatusFilter(tab.key);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                statusFilter === tab.key
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#18222d] text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={fetchOrders}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline shrink-0"
        >
          Odśwież
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-12 text-center text-gray-400 text-xs bg-white dark:bg-[#18222d] rounded-2xl border border-gray-100 dark:border-gray-800">
          {t.adminNoOrders}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const isExpanded = expandedId === order.id;
            return (
              <div
                key={order.id}
                className="bg-white dark:bg-[#18222d] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs overflow-hidden transition-all"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-[#233142]/40 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900 dark:text-white">
                        {t.orderNumber} #{order.id}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {order.customer_name || 'Brak danych'} • {new Date(order.created_at).toLocaleString('pl-PL')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                      {formatCurrency(order.total_price)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#151c24] space-y-3 text-xs">
                    {/* Customer info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>{order.customer_name} {order.customer_username && `(@${order.customer_username})`}</span>
                      </div>
                      {order.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{order.phone}</span>
                        </div>
                      )}
                      {order.comment && (
                        <div className="flex items-start gap-2 sm:col-span-2">
                          <MessageSquare className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                          <span className="italic">{order.comment}</span>
                        </div>
                      )}
                    </div>

                    {/* Ordered Items Breakdown */}
                    <div className="space-y-1.5 pt-1">
                      <h5 className="font-semibold text-gray-700 dark:text-gray-300">{t.adminOrderItems}</h5>
                      {order.items && order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#18222d] border border-gray-200/50 dark:border-gray-700/50"
                        >
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {item.title} × {item.quantity}
                          </span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Status Changer Buttons */}
                    <div className="pt-2 flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium text-gray-500">{t.adminChangeStatus}</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {(['pending', 'paid', 'completed', 'cancelled'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleStatusChange(order.id, st)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                              order.status === st
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                            }`}
                          >
                            {st === 'pending' && t.orderPending.split('/')[0].trim()}
                            {st === 'paid' && t.orderPaid}
                            {st === 'completed' && t.orderCompleted}
                            {st === 'cancelled' && t.orderCancelled}
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
