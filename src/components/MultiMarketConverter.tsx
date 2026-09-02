import React, { useState } from 'react';
import { Copy, Check, Store, CreditCard, Building2 } from 'lucide-react';
import { ApiResponse } from '../types';
import { formatDZD, formatNumber } from '../utils/formatters';
import { Language, translations } from '../utils/translations';
import { getCurrencyAsset } from '../utils/currencyAssets';

interface MultiMarketConverterProps {
  data: ApiResponse | null;
  theme: 'light' | 'dark';
  selectedCurrencyCode: string;
  onCurrencyChange: (code: string) => void;
  language: Language;
}

export const MultiMarketConverter: React.FC<MultiMarketConverterProps> = ({
  data,
  theme,
  selectedCurrencyCode,
  onCurrencyChange,
  language,
}) => {
  const t = translations[language];
  const isAr = language === 'ar';
  const daUnit = isAr ? 'دج' : 'DA';
  const isDark = theme === 'dark';

  const [amount, setAmount] = useState<number>(100);
  const [direction, setDirection] = useState<'foreign_to_dzd' | 'dzd_to_foreign'>('foreign_to_dzd');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!data) return null;

  const currentCurrency = data.currencies.find((c) => c.code === selectedCurrencyCode) || data.currencies[0];
  const asset = getCurrencyAsset(currentCurrency.code);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Rates calculation
  const parallelSell = currentCurrency.parallel?.sell || 276;
  const officialMid = currentCurrency.official.mid || 154;
  const isEur = currentCurrency.code === 'EUR';
  const isUsd = currentCurrency.code === 'USD';

  // Digital rates are higher than physical
  const virtualBuyRate = isEur ? data.stats.wiseEurRate || 284.5 : isUsd ? data.stats.usdtP2pRate || 242.5 : parallelSell * 1.02;

  let calculatedParallelSell = direction === 'foreign_to_dzd' ? amount * parallelSell : amount / parallelSell;
  let calculatedOfficial = direction === 'foreign_to_dzd' ? amount * officialMid : amount / officialMid;
  let calculatedVirtual = direction === 'foreign_to_dzd' ? amount * virtualBuyRate : amount / virtualBuyRate;

  const inputBg = isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-inner';
  const cardBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';

  return (
    <section id="multi-market-converter" className="mb-12">
      <div className={`rounded-[2.5rem] border p-8 shadow-2xl ${cardBg}`}>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.converterTitle}</h2>
            <p className="text-sm text-slate-500">{t.converterSubtitle}</p>
          </div>

          {/* Clean Direction Switcher */}
          <div className={`flex p-1 rounded-2xl border mb-8 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
            <button
              onClick={() => setDirection('foreign_to_dzd')}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${direction === 'foreign_to_dzd' ? (isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900 shadow-md') : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t.dirForeignToDzd.split('→')[0]}
            </button>
            <button
              onClick={() => setDirection('dzd_to_foreign')}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${direction === 'dzd_to_foreign' ? (isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900 shadow-md') : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t.dirDzdToForeign.split('→')[0]}
            </button>
          </div>

          {/* Main Input Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end mb-10">
            <div className="md:col-span-7">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">{t.labelAmount}</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className={`w-full border focus:border-emerald-500 rounded-2xl px-6 py-5 text-2xl font-black font-mono transition-all outline-none ${inputBg} ${isDark ? 'text-white' : 'text-slate-900'}`}
                />
                <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-2 font-black text-slate-400 ${isAr ? 'left-6' : 'right-6'}`}>
                  <span className="flag-emoji">{direction === 'foreign_to_dzd' ? asset.flag : '🇩🇿'}</span>
                  <span>{direction === 'foreign_to_dzd' ? currentCurrency.code : daUnit}</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="grid grid-cols-4 gap-2">
                {data.currencies.slice(0, 4).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => onCurrencyChange(c.code)}
                    className={`aspect-square rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer ${c.code === selectedCurrencyCode ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-lg' : isDark ? 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-400 shadow-sm'}`}
                  >
                    <span className="flag-emoji text-xl mb-1">{getCurrencyAsset(c.code).flag}</span>
                    <span className="text-[10px] font-black">{c.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-6 rounded-3xl border ${isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100 shadow-sm'}`}>
              <div className="flex items-center gap-2 text-emerald-500 mb-4">
                <Store className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">{t.resSquareTitle}</span>
              </div>
              <div className={`text-xl font-black font-mono mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {direction === 'foreign_to_dzd' ? formatDZD(calculatedParallelSell, language) : `${formatNumber(calculatedParallelSell, 1, language)} ${currentCurrency.symbol}`}
              </div>
              <div className="text-[10px] text-slate-500 font-bold">{t.resSquareBadge}</div>
            </div>

            <div className={`p-6 rounded-3xl border ${isDark ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-cyan-50 border-cyan-100 shadow-sm'}`}>
              <div className="flex items-center gap-2 text-cyan-500 mb-4">
                <CreditCard className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? 'يورو/دولار رقمي' : 'Digital / Wise'}</span>
              </div>
              <div className={`text-xl font-black font-mono mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {direction === 'foreign_to_dzd' ? formatDZD(calculatedVirtual, language) : `${formatNumber(calculatedVirtual, 1, language)} ${currentCurrency.symbol}`}
              </div>
              <div className="text-[10px] text-slate-500 font-bold">{t.resVirtualBadge}</div>
            </div>

            <div className={`p-6 rounded-3xl border ${isDark ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-100 shadow-sm'}`}>
              <div className="flex items-center gap-2 text-blue-500 mb-4">
                <Building2 className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">{t.resBankTitle}</span>
              </div>
              <div className={`text-xl font-black font-mono mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {direction === 'foreign_to_dzd' ? formatDZD(calculatedOfficial, language) : `${formatNumber(calculatedOfficial, 1, language)} ${currentCurrency.symbol}`}
              </div>
              <div className="text-[10px] text-slate-500 font-bold">{t.resBankBadge}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
