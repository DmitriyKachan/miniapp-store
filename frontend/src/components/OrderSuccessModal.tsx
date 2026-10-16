import React from 'react';
import type { Order } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Check } from 'lucide-react';
import { hapticImpact } from '../utils/telegram';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  const { t, formatCurrency } = useLanguage();

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white dark:bg-[#181b20] rounded-2xl p-5 text-center space-y-4 border border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <Check className="w-6 h-6 text-zinc-900 dark:text-white" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-medium text-zinc-400">
            {t.orderNumber} #{order.id}
          </span>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
            {t.orderSuccessTitle}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {t.orderSuccessDesc}
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3.5 text-left space-y-2 text-xs border border-zinc-200/60 dark:border-zinc-800">
          <div className="flex justify-between items-center text-zinc-500">
            <span>{t.orderStatus}</span>
            <span className="font-semibold text-zinc-900 dark:text-white">
              {t.orderPending}
            </span>
          </div>
          <div className="flex justify-between items-center text-zinc-500">
            <span>{t.totalToPay}</span>
            <span className="font-bold text-sm text-zinc-900 dark:text-white">
              {formatCurrency(order.total_price)}
            </span>
          </div>
          {order.items && order.items.length > 0 && (
            <div className="border-t border-zinc-200/60 dark:border-zinc-700 pt-2 text-[11px] text-zinc-600 dark:text-zinc-300 space-y-1">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="truncate pr-2">{it.title} × {it.quantity}</span>
                  <span className="shrink-0 font-medium">{formatCurrency(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => {
            hapticImpact('light');
            onClose();
          }}
          className="w-full py-3 px-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-semibold text-xs sm:text-sm cursor-pointer"
        >
          {t.backToShopping}
        </button>
      </div>
    </div>
  );
};
