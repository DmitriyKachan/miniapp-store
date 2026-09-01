import React, { useState } from 'react';
import type { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { getLocalizedProduct } from '../i18n/translations';
import { X, Sparkles, ShoppingBag, ArrowRight, ArrowLeft, Check, RotateCcw } from 'lucide-react';
import { hapticImpact, hapticNotification } from '../utils/telegram';

interface AIFloristModalProps {
  products: Product[];
  onClose: () => void;
  onOpenProduct: (product: Product) => void;
}

export const AIFloristModal: React.FC<AIFloristModalProps> = ({ products, onClose, onOpenProduct }) => {
  const { t, language, formatCurrency } = useLanguage();
  const { addToCart, getItemQuantity } = useCart();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('love');
  const [selectedBudget, setSelectedBudget] = useState<string>('mid');
  const [selectedPalette, setSelectedPalette] = useState<string>('pastel');

  const occasions = [
    { id: 'love', label: t.occLove, icon: '❤️' },
    { id: 'birthday', label: t.occBirthday, icon: '🎂' },
    { id: 'mom', label: t.occMom, icon: '👩' },
    { id: 'wedding', label: t.occWedding, icon: '💍' },
    { id: 'sorry', label: t.occSorry, icon: '🥺' },
    { id: 'just', label: t.occJustBecause, icon: '✨' },
  ];

  const budgets = [
    { id: 'budget', label: t.budgetUnder200, min: 0, max: 200, icon: '🌸' },
    { id: 'mid', label: t.budget200To350, min: 200, max: 350, icon: '💐' },
    { id: 'lux', label: t.budget350To500, min: 350, max: 500, icon: '🌹' },
    { id: 'vip', label: t.budgetVip, min: 500, max: 9999, icon: '👑' },
  ];

  const palettes = [
    { id: 'pastel', label: t.palettePastel, color: 'from-pink-100 to-rose-200' },
    { id: 'red', label: t.paletteRed, color: 'from-red-500 to-rose-700 text-white' },
    { id: 'yellow', label: t.paletteYellow, color: 'from-amber-200 to-yellow-300' },
    { id: 'mixed', label: t.paletteMixed, color: 'from-purple-200 via-pink-200 to-amber-200' },
  ];

  // Filter recommendations based on budget and context
  const getRecommendations = (): Product[] => {
    const budgetConf = budgets.find((b) => b.id === selectedBudget) || budgets[1];
    
    // Filter products within budget range
    let filtered = products.filter(
      (p) => p.price >= budgetConf.min && p.price <= budgetConf.max
    );

    // If too few in range, fallback to top products sorted by relevance
    if (filtered.length === 0) {
      filtered = [...products].sort((a, b) => Math.abs(a.price - budgetConf.min) - Math.abs(b.price - budgetConf.min));
    }

    // Sort or tailor by palette
    if (selectedPalette === 'red') {
      filtered = filtered.sort((a) => (a.title.toLowerCase().includes('róż') || a.title.toLowerCase().includes('czerwon') ? -1 : 1));
    } else if (selectedPalette === 'yellow') {
      filtered = filtered.sort((a) => (a.title.toLowerCase().includes('słonecz') || a.title.toLowerCase().includes('żółt') ? -1 : 1));
    }

    return filtered.slice(0, 3);
  };

  const handleNext = () => {
    hapticImpact('light');
    if (step < 3) {
      setStep((prev) => (prev + 1) as any);
    } else {
      hapticNotification('success');
      setStep(4);
    }
  };

  const handlePrev = () => {
    hapticImpact('light');
    if (step > 1) {
      setStep((prev) => (prev - 1) as any);
    }
  };

  const recommendations = step === 4 ? getRecommendations() : [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full sm:max-w-lg bg-white dark:bg-[#18222d] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-rose-50/80 to-pink-50/50 dark:from-rose-950/20 dark:to-[#18222d]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                {t.aiFloristModalTitle}
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {step < 4 ? `Шаг ${step} из 3` : 'Результат подбора'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              hapticImpact('light');
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        {step < 4 && (
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-1">
            <div
              className="bg-rose-600 h-1 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* STEP 1: Occasion */}
          {step === 1 && (
            <div className="space-y-3 animate-in fade-in">
              <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                {t.aiFloristStep1}
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                {occasions.map((occ) => (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => {
                      hapticImpact('light');
                      setSelectedOccasion(occ.id);
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      selectedOccasion === occ.id
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 shadow-sm ring-1 ring-rose-500'
                        : 'bg-white dark:bg-[#233142] border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{occ.icon}</span>
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      {occ.label.replace(/^.*? /, '')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Budget */}
          {step === 2 && (
            <div className="space-y-3 animate-in fade-in">
              <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                {t.aiFloristStep2}
              </h4>
              <div className="space-y-2">
                {budgets.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      hapticImpact('light');
                      setSelectedBudget(b.id);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      selectedBudget === b.id
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 shadow-sm ring-1 ring-rose-500'
                        : 'bg-white dark:bg-[#233142] border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{b.icon}</span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                        {b.label}
                      </span>
                    </div>
                    {selectedBudget === b.id && <Check className="w-4 h-4 text-rose-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Palette */}
          {step === 3 && (
            <div className="space-y-3 animate-in fade-in">
              <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                {t.aiFloristStep3}
              </h4>
              <div className="space-y-2">
                {palettes.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      hapticImpact('light');
                      setSelectedPalette(p.id);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      selectedPalette === p.id
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 shadow-sm ring-1 ring-rose-500'
                        : 'bg-white dark:bg-[#233142] border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${p.color} border border-black/10`} />
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                        {p.label}
                      </span>
                    </div>
                    {selectedPalette === p.id && <Check className="w-4 h-4 text-rose-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Results */}
          {step === 4 && (
            <div className="space-y-3.5 animate-in fade-in">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  <span>{t.aiFloristResultsTitle}</span>
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {t.aiFloristResultsSubtitle}
                </p>
              </div>

              <div className="space-y-2.5">
                {recommendations.map((prod) => {
                  const localized = getLocalizedProduct(prod, language);
                  const qty = getItemQuantity(prod.id);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => onOpenProduct(localized)}
                      className="p-3 bg-white dark:bg-[#233142] rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-xs flex items-center gap-3 hover:border-rose-300 transition-all cursor-pointer active:scale-[0.99]"
                    >
                      <img
                        src={localized.image_url}
                        alt={localized.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                          Идеальное совпадение ✨
                        </span>
                        <h5 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mt-1 line-clamp-1">
                          {localized.title}
                        </h5>
                        <p className="text-xs font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">
                          {formatCurrency(localized.price)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          hapticImpact('medium');
                          addToCart(localized, 1);
                        }}
                        className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 shadow-xs active:scale-95 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{qty > 0 ? `В корзине (${qty})` : 'Выбрать'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#151c24] flex items-center justify-between gap-3">
          {step > 1 && step < 4 && (
            <button
              type="button"
              onClick={handlePrev}
              className="py-3 px-4 bg-gray-100 dark:bg-[#233142] text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.aiFloristBack}</span>
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-md shadow-rose-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{step === 3 ? 'Показать букеты ✨' : t.aiFloristNext}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-full flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-4 bg-gray-100 dark:bg-[#233142] text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.aiFloristRestart}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold text-center shadow-md cursor-pointer"
              >
                {t.aiFloristClose}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
