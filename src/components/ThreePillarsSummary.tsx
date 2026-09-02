import React from 'react';
import { Store, CreditCard, Building2, ArrowUpRight } from 'lucide-react';
import { ApiResponse } from '../types';
import { Language, translations } from '../utils/translations';
import { getCurrencyAsset } from '../utils/currencyAssets';

interface ThreePillarsSummaryProps {
  data: ApiResponse | null;
  theme: 'light' | 'dark';
  onSelectCurrency: (code: string) => void;
  language: Language;
}

export const ThreePillarsSummary: React.FC<ThreePillarsSummaryProps> = ({
  data,
  theme,
  onSelectCurrency,
  language,
}) => {
  if (!data) return null;

  const t = translations[language];
  const isAr = language === 'ar';
  const daUnit = isAr ? 'دج' : 'DA';
  const isDark = theme === 'dark';

  const eur = getCurrencyAsset('EUR');
  const usd = getCurrencyAsset('USD');
  const usdt = getCurrencyAsset('USDT');

  const eurSquare = data.currencies.find(c => c.code === 'EUR')?.parallel?.sell || 276;
  const usdSquare = data.currencies.find(c => c.code === 'USD')?.parallel?.sell || 238;

  const cardClass = `group relative rounded-3xl border p-6 shadow-xl transition-all overflow-hidden ${
    isDark ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50' : 'bg-white border-slate-200 hover:border-emerald-500/50'
  }`;

  const innerBoxClass = `p-4 rounded-2xl border ${
    isDark ? 'bg-slate-950/50 border-slate-800/50' : 'bg-slate-50 border-slate-100 shadow-inner'
  }`;

  const labelClass = `text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`;
  const priceClass = `text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`;

  return (
    <div className="mb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PILIER 1: CASH / SQUARE */}
        <div className={cardClass}>
          <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl transition-all ${isDark ? 'bg-emerald-500/5 group-hover:bg-emerald-500/10' : 'bg-emerald-500/10 group-hover:bg-emerald-500/20'}`} />

          <div className="flex items-center gap-4 mb-6 text-emerald-500">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.pillar1Title}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.pillar1Subtitle}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className={innerBoxClass}>
              <div className="flex items-center justify-between mb-1">
                <span className={`flex items-center gap-2 ${labelClass}`}>
                  <span className="flag-emoji text-xl">{eur.flag}</span> {isAr ? 'يورو' : 'Euro'}
                </span>
                <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">{t.sellLabel.split(':')[0]}</span>
              </div>
              <div className={priceClass}>
                {eurSquare.toFixed(1)} <span className="text-sm font-normal text-slate-500">{daUnit}</span>
              </div>
            </div>

            <div className={innerBoxClass}>
              <div className="flex items-center justify-between mb-1">
                <span className={`flex items-center gap-2 ${labelClass}`}>
                  <span className="flag-emoji text-xl">{usd.flag}</span> {isAr ? 'دولار' : 'Dollar'}
                </span>
                <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">{t.sellLabel.split(':')[0]}</span>
              </div>
              <div className={priceClass}>
                {usdSquare.toFixed(1)} <span className="text-sm font-normal text-slate-500">{daUnit}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectCurrency('EUR')}
            className={`w-full mt-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <span>{t.btnCalculate}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* PILIER 2: DIGITAL / P2P */}
        <div className={cardClass.replace('emerald', 'cyan')}>
          <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl transition-all ${isDark ? 'bg-cyan-500/5 group-hover:bg-cyan-500/10' : 'bg-cyan-500/10 group-hover:bg-cyan-500/20'}`} />

          <div className="flex items-center gap-4 mb-6 text-cyan-500">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'}`}>
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.pillar2Title}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.pillar2Subtitle.split('&')[0]}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className={innerBoxClass}>
              <div className="flex items-center justify-between mb-1">
                <span className={`flex items-center gap-2 ${labelClass}`}>
                  <span className="flag-emoji text-xl">{usdt.flag}</span> USDT Tether
                </span>
                <span className="text-[9px] font-black text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded uppercase">Crypto</span>
              </div>
              <div className={priceClass}>
                {data.stats.usdtP2pRate?.toFixed(1)} <span className="text-sm font-normal text-slate-500">{daUnit}</span>
              </div>
            </div>

            <div className={innerBoxClass}>
              <div className="flex items-center justify-between mb-1">
                <span className={`flex items-center gap-2 ${labelClass}`}>
                  <span className="flag-emoji text-xl">{getCurrencyAsset('EUR').flag}</span> Wise / Paysera
                </span>
                <span className="text-[9px] font-black text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded uppercase">Digital</span>
              </div>
              <div className={priceClass}>
                {data.stats.wiseEurRate?.toFixed(1)} <span className="text-sm font-normal text-slate-500">{daUnit}</span>
              </div>
              <p className={`text-[10px] mt-1 font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{isAr ? 'يورو رقمي (أغلى من الورق)' : 'Euro Numérique (Premium)'}</p>
            </div>
          </div>

          <button
            onClick={() => onSelectCurrency('USD')}
            className={`w-full mt-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <span>{t.btnCalculate}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* PILIER 3: OFFICIAL BANK */}
        <div className={cardClass.replace('emerald', 'blue')}>
          <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl transition-all ${isDark ? 'bg-blue-500/5 group-hover:bg-blue-500/10' : 'bg-blue-500/10 group-hover:bg-blue-500/20'}`} />

          <div className="flex items-center gap-4 mb-6 text-blue-500">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.pillar3Title}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.pillar3Subtitle}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className={innerBoxClass}>
              <div className="flex items-center justify-between mb-1">
                <span className={`flex items-center gap-2 ${labelClass}`}>
                  <span className="flag-emoji text-xl">{eur.flag}</span> Euro EUR
                </span>
                <span className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded uppercase">Fixing</span>
              </div>
              <div className={priceClass}>
                {data.stats.officialEurToDzd?.toFixed(2)} <span className="text-sm font-normal text-slate-500">{daUnit}</span>
              </div>
            </div>

            <div className={innerBoxClass}>
              <div className="flex items-center justify-between mb-1">
                <span className={`flex items-center gap-2 ${labelClass}`}>
                  <span className="flag-emoji text-xl">{usd.flag}</span> Dollar USD
                </span>
                <span className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded uppercase">Fixing</span>
              </div>
              <div className={priceClass}>
                {data.stats.officialUsdToDzd?.toFixed(2)} <span className="text-sm font-normal text-slate-500">{daUnit}</span>
              </div>
            </div>
          </div>

          <div className={`mt-6 pt-4 border-t flex items-center justify-between text-[9px] font-black uppercase tracking-widest ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
            <span>{t.pillar3DailyFixing}</span>
            <span className="text-blue-500">{t.pillar3BankCounters}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
