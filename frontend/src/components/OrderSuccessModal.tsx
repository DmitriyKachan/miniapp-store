import React from 'react';
import type { Order } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { hapticImpact } from '../utils/telegram';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  const { t, formatCurrency } = useLanguage();

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-[#18222d] rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
        
        {/* Animated Checkmark Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            {t.orderNumber} #{order.id}
          </span>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1.5">
            {t.orderSuccessTitle}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
            {t.orderSuccessDesc}
          </p>
        </div>

        {/* Order Details Brief */}
        <div className="bg-gray-50 dark:bg-[#233142]/50 rounded-2xl p-3.5 text-left space-y-2 text-xs">
          <div className="flex justify-between text-gray-500 dark:text-gray-400">
            <span>{t.orderStatus}</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{t.orderPending}</span>
          </div>
          <div className="flex justify-between text-gray-500 dark:text-gray-400">
            <span>{t.totalToPay}</span>
            <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(order.total_price)}</span>
          </div>
          {order.items && order.items.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700/60 pt-2 text-[11px] text-gray-500 dark:text-gray-400 space-y-1">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="truncate pr-2">{it.title} x{it.quantity}</span>
                  <span className="shrink-0 font-medium">{formatCurrency(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            hapticImpact('light');
            onClose();
          }}
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t.backToShopping}</span>
        </button>
      </div>
    </div>
  );
};
