import React from 'react';
import type { Order } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, ShoppingBag, Sparkles } from 'lucide-react';
import { hapticImpact } from '../utils/telegram';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  const { t, formatCurrency } = useLanguage();

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-[#141a24] rounded-[32px] p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200 border border-stone-200/50 dark:border-white/10">
        
        {/* Animated Celebration Icon */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500/20 via-pink-500/20 to-emerald-500/20 flex items-center justify-center ring-8 ring-rose-500/10">
            <CheckCircle2 className="w-10 h-10 text-rose-600 dark:text-rose-400" />
          </div>
          <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1 animate-bounce" />
        </div>

        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-[#131d33]/10 dark:bg-white/10 text-[#131d33] dark:text-[#f1f5f9] text-xs font-black uppercase tracking-wider border border-[#131d33]/20">
            {t.orderNumber} #{order.id}
          </span>
          <h3 className="font-brand-serif text-xl sm:text-2xl font-bold text-[#131d33] dark:text-white mt-2 leading-tight">
            {t.orderSuccessTitle}
          </h3>
          <p className="text-xs text-[#6e809f] dark:text-[#8fa0ba] mt-1 leading-relaxed">
            {t.orderSuccessDesc}
          </p>
        </div>

        {/* Order Details Receipt Card */}
        <div className="bg-[#faf8f5] dark:bg-[#131b2d] rounded-2xl p-4 text-left space-y-2.5 text-xs border border-[#e8e4da] dark:border-white/5">
          <div className="flex justify-between items-center text-stone-500 dark:text-stone-400">
            <span>{t.orderStatus}</span>
            <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-[#c5a880]/20 text-[#131d33] dark:text-[#c5a880]">
              {t.orderPending}
            </span>
          </div>
          <div className="flex justify-between items-center text-stone-500 dark:text-stone-400">
            <span>{t.totalToPay}</span>
            <span className="font-black text-base text-[#131d33] dark:text-white">{formatCurrency(order.total_price)}</span>
          </div>
          {order.items && order.items.length > 0 && (
            <div className="border-t border-dashed border-[#e8e4da] dark:border-white/10 pt-2.5 text-[11px] text-stone-600 dark:text-stone-300 space-y-1">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="truncate pr-2 font-medium">{it.title} x{it.quantity}</span>
                  <span className="shrink-0 font-bold">{formatCurrency(it.price * it.quantity)}</span>
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
          className="w-full py-4 px-5 bg-[#131d33] hover:bg-[#1a2846] text-white rounded-2xl font-black text-sm shadow-lg shadow-[#131d33]/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer border border-[#2b3c5c]"
        >
          <ShoppingBag className="w-4 h-4 text-[#c5a880]" />
          <span>{t.backToShopping}</span>
        </button>
      </div>
    </div>
  );
};
