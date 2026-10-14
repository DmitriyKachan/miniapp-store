import React, { useState } from 'react';
import type { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { getLocalizedProduct } from '../i18n/translations';
import { X, Sparkles, ShoppingBag, ArrowRight, ArrowLeft, RotateCcw, CheckCircle2 } from 'lucide-react';
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
    { id: 'love', label: t.occLove, icon: '❤️', hint: 'Róże, romantyzm, pasja' },
    { id: 'birthday', label: t.occBirthday, icon: '🎂', hint: 'Eksplozja kolorów, radość' },
    { id: 'mom', label: t.occMom, icon: '👩', hint: 'Ciepłe pastele, szacunek' },
    { id: 'wedding', label: t.occWedding, icon: '💍', hint: 'Biel, luksus, elegancja' },
    { id: 'sorry', label: t.occSorry, icon: '🥺', hint: 'Delikatność, przeprosiny' },
    { id: 'just', label: t.occJustBecause, icon: '✨', hint: 'Świeżość bez okazji' },
  ];

  const budgets = [
    { id: 'budget', label: t.budgetUnder200, min: 0, max: 200, icon: '🌸', desc: 'Uroczy i zgrabny upominek' },
    { id: 'mid', label: t.budget200To350, min: 200, max: 350, icon: '💐', desc: 'Bestseller kwiaciarni' },
    { id: 'lux', label: t.budget350To500, min: 350, max: 500, icon: '🌹', desc: 'Bogata, okazała kompozycja' },
    { id: 'vip', label: t.budgetVip, min: 500, max: 9999, icon: '👑', desc: 'Ekskluzywny bukiet Grand Luxury' },
  ];

  const palettes = [
    { id: 'pastel', label: t.palettePastel, color: 'from-pink-200 via-rose-200 to-amber-100', desc: 'Pudrowy róż, krem i eustoma' },
    { id: 'red', label: t.paletteRed, color: 'from-red-600 via-rose-600 to-rose-900', desc: 'Głęboka czerwień i aksamit' },
    { id: 'yellow', label: t.paletteYellow, color: 'from-amber-300 via-yellow-400 to-orange-300', desc: 'Ciepłe słoneczniki i promienie' },
    { id: 'mixed', label: t.paletteMixed, color: 'from-purple-300 via-pink-300 to-sky-300', desc: 'Bogata feeria barw i styl prowansalski' },
  ];

  // Smart Recommendation Scoring Algorithm
  const getRecommendations = (): Product[] => {
    const budgetConf = budgets.find((b) => b.id === selectedBudget) || budgets[1];
    
    // Only consider flower bouquets and compositions
    const flowerProducts = products.filter((p) => p.category_id <= 3);

    const scored = flowerProducts.map((product) => {
      let score = 0;
      const text = `${product.title} ${product.description}`.toLowerCase();

      // 1. Budget Score (up to 40 points)
      if (product.price >= budgetConf.min && product.price <= budgetConf.max) {
        score += 40;
      } else {
        const diff = Math.abs(product.price - (budgetConf.min + budgetConf.max) / 2);
        score += Math.max(0, 30 - diff / 15);
      }

      // 2. Palette Score (up to 30 points)
      if (selectedPalette === 'red') {
        if (text.includes('czerwon') || text.includes('красн') || text.includes('червон') || text.includes('pasja') || text.includes('страст') || text.includes('bordo') || text.includes('red')) {
          score += 30;
        }
      } else if (selectedPalette === 'yellow') {
        if (text.includes('słonecz') || text.includes('подсолнух') || text.includes('соняшник') || text.includes('żółt') || text.includes('желт') || text.includes('жовт') || text.includes('tulipan') || text.includes('тюльпан')) {
          score += 30;
        }
      } else if (selectedPalette === 'pastel') {
        if (text.includes('różow') || text.includes('розов') || text.includes('рожев') || text.includes('pudrow') || text.includes('пудров') || text.includes('pastel') || text.includes('krem') || text.includes('piwon') || text.includes('пион') || text.includes('eustom')) {
          score += 30;
        }
      } else if (selectedPalette === 'mixed') {
        if (text.includes('miks') || text.includes('микс') || text.includes('мікс') || text.includes('lawend') || text.includes('лаванд') || text.includes('prowans') || text.includes('прованс') || text.includes('hortensj') || text.includes('гортенз')) {
          score += 30;
        }
      }

      // 3. Occasion Score (up to 30 points)
      if (selectedOccasion === 'love') {
        if (text.includes('róż') || text.includes('роз') || text.includes('троянд') || text.includes('velvet') || text.includes('love') || text.includes('serce') || text.includes('romantic')) {
          score += 25;
        }
      } else if (selectedOccasion === 'wedding') {
        if (text.includes('luxury') || text.includes('101') || text.includes('51') || text.includes('imperator') || text.includes('luksus') || text.includes('śmietankow')) {
          score += 25;
        }
      } else if (selectedOccasion === 'mom') {
        if (text.includes('kosz') || text.includes('корзин') || text.includes('кошик') || text.includes('prowans') || text.includes('hortensj') || text.includes('гортенз') || text.includes('baśń') || text.includes('сказка')) {
          score += 25;
        }
      } else if (selectedOccasion === 'birthday') {
        if (text.includes('flower box') || text.includes('bubbles') || text.includes('box') || text.includes('poranek') || text.includes('magia') || text.includes('obłok')) {
          score += 25;
        }
      } else if (selectedOccasion === 'sorry') {
        if (text.includes('czyst') || text.includes('lili') || text.includes('лилии') || text.includes('лілій') || text.includes('mondial') || text.includes('inspiracj')) {
          score += 25;
        }
      } else if (selectedOccasion === 'just') {
        if (text.includes('słonecz') || text.includes('tulipan') || text.includes('promien') || text.includes('lawend')) {
          score += 25;
        }
      }

      return { product, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 4).map((s) => s.product);
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
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="w-full sm:max-w-lg bg-white dark:bg-[#141a24] rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-300 border border-stone-200/50 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-rose-50/30 dark:bg-slate-800/20">
          <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-slate-600" />
        </div>

        {/* Top Header */}
        <div className="px-5 py-4 border-b border-stone-200/60 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-rose-500/10 via-pink-500/5 to-amber-500/5 dark:from-rose-950/30 dark:to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-black text-stone-900 dark:text-white uppercase tracking-tight">
                  {t.aiFloristModalTitle}
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400">
                  Concierge
                </span>
              </div>
              <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 mt-0.5">
                {step < 4 ? `Krok ${step} z 3: Personalizacja kompozycji` : 'Perfekcyjnie dobrane bukiety'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              hapticImpact('light');
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        {step < 4 && (
          <div className="w-full bg-stone-100 dark:bg-slate-800 h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-rose-600 via-pink-500 to-amber-400 h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 no-scrollbar">
          
          {/* STEP 1: Occasion */}
          {step === 1 && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-black text-stone-900 dark:text-white">
                  {t.aiFloristStep1}
                </h4>
                <p className="text-xs text-stone-500">Dla kogo i z jakiego powodu tworzymy ten bukiet?</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {occasions.map((occ) => {
                  const isSel = selectedOccasion === occ.id;
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => {
                        hapticImpact('light');
                        setSelectedOccasion(occ.id);
                      }}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-1.5 transition-all cursor-pointer active:scale-95 ${
                        isSel
                          ? 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-500 shadow-sm ring-2 ring-rose-500/30'
                          : 'bg-white dark:bg-slate-800/60 border-stone-200/60 dark:border-white/5 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{occ.icon}</span>
                        {isSel && <CheckCircle2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 dark:text-white leading-tight">
                          {occ.label.replace(/^.*? /, '')}
                        </div>
                        <div className="text-[10px] text-stone-400 mt-0.5 leading-snug">
                          {occ.hint}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Budget */}
          {step === 2 && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-black text-stone-900 dark:text-white">
                  {t.aiFloristStep2}
                </h4>
                <p className="text-xs text-stone-500">Wybierz przedział cenowy dla swojej kompozycji</p>
              </div>

              <div className="space-y-2.5">
                {budgets.map((b) => {
                  const isSel = selectedBudget === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        hapticImpact('light');
                        setSelectedBudget(b.id);
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer active:scale-98 ${
                        isSel
                          ? 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-500 shadow-sm ring-2 ring-rose-500/30'
                          : 'bg-white dark:bg-slate-800/60 border-stone-200/60 dark:border-white/5 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{b.icon}</span>
                        <div>
                          <span className="text-xs sm:text-sm font-extrabold text-stone-900 dark:text-white block">
                            {b.label}
                          </span>
                          <span className="text-[11px] text-stone-400 mt-0.5 block">
                            {b.desc}
                          </span>
                        </div>
                      </div>
                      {isSel && <CheckCircle2 className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Palette */}
          {step === 3 && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-black text-stone-900 dark:text-white">
                  {t.aiFloristStep3}
                </h4>
                <p className="text-xs text-stone-500">W jakiej tonacji kolorystycznej ma być bukiet?</p>
              </div>

              <div className="space-y-2.5">
                {palettes.map((p) => {
                  const isSel = selectedPalette === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        hapticImpact('light');
                        setSelectedPalette(p.id);
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer active:scale-98 ${
                        isSel
                          ? 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-500 shadow-sm ring-2 ring-rose-500/30'
                          : 'bg-white dark:bg-slate-800/60 border-stone-200/60 dark:border-white/5 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${p.color} shadow-sm border border-black/10 shrink-0`} />
                        <div>
                          <span className="text-xs sm:text-sm font-extrabold text-stone-900 dark:text-white block">
                            {p.label}
                          </span>
                          <span className="text-[11px] text-stone-400 mt-0.5 block">
                            {p.desc}
                          </span>
                        </div>
                      </div>
                      {isSel && <CheckCircle2 className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Results */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-amber-500/10 border border-rose-200 dark:border-rose-900/30">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider">
                    {t.aiFloristResultsTitle}
                  </h4>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                  «Florysta wyselekcjonował poniższe bukiety na podstawie Twojego nastroju, wybranej palety oraz budżetu. Świeże kwiaty gotowe do wysyłki!»
                </p>
              </div>

              <div className="space-y-3">
                {recommendations.map((prod) => {
                  const localized = getLocalizedProduct(prod, language);
                  const qty = getItemQuantity(prod.id);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => onOpenProduct(localized)}
                      className="p-3.5 bg-white dark:bg-slate-800/70 rounded-3xl border border-stone-200/60 dark:border-white/5 shadow-xs flex items-center gap-3.5 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
                    >
                      <img
                        src={localized.image_url}
                        alt={localized.title}
                        className="w-18 h-18 rounded-2xl object-cover shrink-0 border border-stone-100 dark:border-white/5"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400">
                          98% Dopasowania ✨
                        </span>
                        <h5 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white mt-1 line-clamp-1">
                          {localized.title}
                        </h5>
                        <p className="text-xs font-black text-rose-600 dark:text-rose-400 mt-0.5">
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
                        className="px-3.5 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-2xl text-xs font-extrabold shrink-0 flex items-center gap-1.5 shadow-md shadow-rose-500/20 active:scale-95 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{qty > 0 ? `W koszyku (${qty})` : 'Wybierz'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 border-t border-stone-200/60 dark:border-white/10 bg-stone-50/80 dark:bg-[#0f141c]/90 backdrop-blur-md flex items-center justify-between gap-3">
          {step > 1 && step < 4 && (
            <button
              type="button"
              onClick={handlePrev}
              className="py-3 px-4 bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-300 border border-stone-200/60 dark:border-white/5 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.aiFloristBack}</span>
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-4 px-5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{step === 3 ? 'Pokaż idealne bukiety ✨' : t.aiFloristNext}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-full flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3.5 px-4 bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-300 border border-stone-200/60 dark:border-white/5 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.aiFloristRestart}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 px-5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-2xl text-xs font-black text-center shadow-lg shadow-rose-500/25 cursor-pointer active:scale-[0.98] transition-transform"
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
