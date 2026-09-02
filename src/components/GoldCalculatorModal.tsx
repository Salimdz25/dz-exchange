import React, { useState } from 'react';
import { X, Calculator } from 'lucide-react';
import { GoldRateItem } from '../types';
import { Language, translations } from '../utils/translations';
import { formatDZD } from '../utils/formatters';

interface GoldCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  goldRates: GoldRateItem[];
  language: Language;
  theme: 'light' | 'dark';
}

export const GoldCalculatorModal: React.FC<GoldCalculatorModalProps> = ({
  isOpen,
  onClose,
  goldRates,
  language,
  theme,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const isAr = language === 'ar';
  const isDark = theme === 'dark';

  const [grams, setGrams] = useState<number>(10);
  // Default to 18 Carats as primary reference in Algeria
  const [selectedCarat, setSelectedCarat] = useState<number>(18);

  const selectedRate = goldRates.find((g) => g.carat === selectedCarat) || goldRates[0] || { pricePerGramDzd: 24500 };
  const totalValueDzd = grams * selectedRate.pricePerGramDzd;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/20 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base uppercase tracking-tight">{isAr ? 'حاسبة أسعار الذهب' : 'Calculateur d\'Or'}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase">{isAr ? 'حساب القيمة بالدينار الجزائري (عيار 18 مرجع)' : 'Estimation de la valeur en DZD (18K Réf)'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-500/10 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Carat Selector - 18 Carats FIRST */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
              {isAr ? 'اختر عيار الذهب (18 قيراط مرجع الجزائر) :' : 'Sélectionner le Titre (18 Carats Réf) :'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[18, 21, 22, 24].map((carat) => (
                <button
                  key={carat}
                  onClick={() => setSelectedCarat(carat)}
                  className={`py-3 rounded-2xl border text-xs font-mono font-black transition-all cursor-pointer ${
                    selectedCarat === carat
                      ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md'
                      : isDark ? 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {isAr ? `${carat} قيراط` : `${carat}K`} {carat === 18 ? '⭐' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Weight in Grams Input */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
              {isAr ? 'الوزن بالغرام (g) :' : 'Poids en Grammes (g) :'}
            </label>
            <div className="relative">
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={grams || ''}
                onChange={(e) => setGrams(parseFloat(e.target.value) || 0)}
                className={`w-full border rounded-2xl px-5 py-4 text-2xl font-black font-mono outline-none ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500'
                }`}
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 uppercase">
                {isAr ? 'غرام' : 'Grammes'}
              </span>
            </div>
          </div>

          {/* Quick Preset Grams */}
          <div className="flex gap-2">
            {[1, 5, 10, 50, 100].map((g) => (
              <button
                key={g}
                onClick={() => setGrams(g)}
                className={`flex-1 py-1.5 rounded-xl border text-[10px] font-mono font-bold transition-all ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {g}g
              </button>
            ))}
          </div>

          {/* Result Box */}
          <div className={`p-5 rounded-2xl border text-center ${
            isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200 shadow-sm'
          }`}>
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">
              {isAr ? 'القيمة الإجمالية المقدرة' : 'Valeur Totale Estimée'}
            </p>
            <p className="text-3xl font-black font-mono text-amber-500 my-1">
              {formatDZD(totalValueDzd, language)}
            </p>
            <p className="text-[10px] text-slate-500 font-semibold">
              {isAr ? `بسعر ${selectedRate.pricePerGramDzd.toLocaleString()} دج / غرام (${selectedCarat} قيراط)` : `Basé sur ${selectedRate.pricePerGramDzd.toLocaleString()} DA / gramme (${selectedCarat} Carats)`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
