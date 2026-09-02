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
    { code: 'EUR', label: 'Euro', badgeColor: 'from-emerald-500/20 via-emerald-500/5 to-transparent' },
    { code: 'USD', label: 'Dollar', badgeColor: 'from-blue-500/20 via-blue-500/5 to-transparent' },
    { code: 'USDT', label: 'USDT Tether', badgeColor: 'from-cyan-500/20 via-cyan-500/5 to-transparent' },
    { code: 'WISE_EUR', label: 'Wise Euro', badgeColor: 'from-lime-500/20 via-lime-500/5 to-transparent' }
  ];

  return (
    <section className="mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-2">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-7 rounded-full bg-emerald-500 shadow-sm" />
          <h2 className={`text-xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{isAr ? 'لمحة عن السوق' : 'Market Overview'}</h2>
        </div>
        <div className={`h-px flex-1 hidden md:block mx-4 ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`} />
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{t.ratesTableSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item) => {
          const asset = getCurrencyAsset(item.code);
          const curr = data.currencies.find(c => c.code === (item.code === 'WISE_EUR' ? 'EUR' : item.code));

          let price = 0;
          let buyPrice = 0;
          if (item.code === 'USDT') {
            price = data.stats.usdtP2pRate;
            buyPrice = price - 1.5;
          } else if (item.code === 'WISE_EUR') {
            price = data.stats.wiseEurRate;
            buyPrice = price;
          } else {
            price = curr?.parallel?.sell || 0;
            buyPrice = curr?.parallel?.buy || 0;
          }

          return (
            <div
              key={item.code}
              className={`relative overflow-hidden p-6 rounded-[2.5rem] border transition-all duration-300 group hover:-translate-y-1 ${
                isDark
                  ? 'glass-card-dark hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10'
                  : 'glass-card-light hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10'
              }`}
            >
              {/* Background Ambient Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.badgeColor} opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-13 h-13 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-md ${
                    isDark ? 'bg-slate-950/80 border border-slate-800' : 'bg-slate-100 border border-slate-200'
                  }`}>
                    {asset.logoSvg ? asset.logoSvg : <span className="flag-emoji">{asset.flag}</span>}
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {item.code}
                    </span>
                    <p className={`text-xs font-bold mt-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{isAr ? asset.name : item.label}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-widest">{t.resSquareTitle}</p>
                  <div className={`text-3xl sm:text-4xl font-black font-mono leading-none flex items-baseline gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {price.toFixed(1)} <span className="text-xs font-semibold text-slate-500">{daUnit}</span>
                  </div>
                  {buyPrice > 0 && (
                    <p className="text-[10px] font-medium text-slate-400 mt-2 font-mono">
                      {isAr ? `الشراء: ${buyPrice.toFixed(1)} دج` : `Achat: ${buyPrice.toFixed(1)} DA`}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onSelectForConvert(item.code === 'WISE_EUR' ? 'EUR' : item.code)}
                  className={`w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer shadow-sm active:scale-95 ${
                    isDark
                      ? 'bg-slate-950/80 text-slate-400 border border-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 group-hover:border-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-500/20'
                      : 'bg-slate-100 text-slate-600 border border-slate-200 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-500/20'
                  }`}
                >
                  {t.btnCalculate}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
