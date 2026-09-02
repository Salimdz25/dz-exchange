import React from 'react';
import { ApiResponse } from '../types';
import { Language, translations } from '../utils/translations';
import { getCurrencyAsset } from '../utils/currencyAssets';

interface MarketHeroCardsProps {
  data: ApiResponse | null;
  theme: 'light' | 'dark';
  onSelectForConvert: (currencyCode: string) => void;
  language: Language;
}

export const MarketHeroCards: React.FC<MarketHeroCardsProps> = ({ data, theme, onSelectForConvert, language }) => {
  if (!data) return null;

  const t = translations[language];
  const isAr = language === 'ar';
  const daUnit = isAr ? 'دج' : 'DA';
  const isDark = theme === 'dark';

  const items = [
    { code: 'EUR', label: 'Euro' },
    { code: 'USD', label: 'Dollar' },
    { code: 'USDT', label: 'USDT' },
    { code: 'WISE_EUR', label: 'Wise' }
  ];

  return (
    <section className="mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-2">
        <h2 className={`text-xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{isAr ? 'لمحة عن السوق' : 'Market Overview'}</h2>
        <div className={`h-px flex-1 hidden md:block mx-4 ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`} />
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{t.ratesTableSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const asset = getCurrencyAsset(item.code);
          const curr = data.currencies.find(c => c.code === (item.code === 'WISE_EUR' ? 'EUR' : item.code));

          let price = 0;
          if (item.code === 'USDT') price = data.stats.usdtP2pRate;
          else if (item.code === 'WISE_EUR') price = data.stats.wiseEurRate;
          else price = curr?.parallel?.sell || 0;

          return (
            <div key={item.code} className={`p-6 rounded-[2.5rem] border transition-all group ${
              isDark ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/30' : 'bg-white border-slate-200 shadow-sm hover:border-emerald-500/30 hover:shadow-xl'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
                  <span className="flag-emoji">{asset.flag}</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.code}</p>
                  <p className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{isAr ? asset.name : item.label}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-widest">{t.resSquareTitle}</p>
                <div className={`text-3xl font-black font-mono leading-none flex items-baseline gap-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {price.toFixed(1)} <span className="text-sm font-normal text-slate-500">{daUnit}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectForConvert(item.code === 'WISE_EUR' ? 'EUR' : item.code)}
                className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                  isDark ? 'bg-slate-950 text-slate-500 group-hover:bg-emerald-500 group-hover:text-slate-950' : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-500 group-hover:text-white'
                }`}
              >
                {t.btnCalculate}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
