import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { RegionalMarket } from '../types';
import { Language, translations } from '../utils/translations';

interface RegionalSquareMarketsProps {
  markets: RegionalMarket[];
  theme: 'light' | 'dark';
  language: Language;
}

export const RegionalSquareMarkets: React.FC<RegionalSquareMarketsProps> = ({ markets, theme, language }) => {
  const t = translations[language];
  const isAr = language === 'ar';
  const isDark = theme === 'dark';

  const getRegionalLabel = (city: string) => {
    switch (city) {
      case 'Alger': return { city: t.cityAlger, location: t.locAlger };
      case 'Oran': return { city: t.cityOran, location: t.locOran };
      case 'Constantine': return { city: t.cityConstantine, location: t.locConstantine };
      case 'Sétif': return { city: t.citySetif, location: t.locSetif };
      case 'Annaba': return { city: t.cityAnnaba, location: t.locAnnaba };
      case 'Tizi Ouzou': return { city: t.cityTiziOuzou, location: t.locTiziOuzou };
      case 'Béjaïa': return { city: t.cityBejaia, location: t.locBejaia };
      case 'Batna': return { city: t.cityBatna, location: t.locBatna };
      default: return { city, location: '' };
    }
  };

  return (
    <section id="regional-markets-section" className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8 px-2">
        <div>
          <h2 className={`text-xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t.regionalSectionTitle}
          </h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
            {t.regionalSectionSubtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {markets.map((market) => {
          const region = getRegionalLabel(market.city);

          return (
            <div
              key={market.city}
              className={`rounded-[2rem] border p-6 shadow-lg flex flex-col justify-between transition-all ${
                isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-emerald-500/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{region.city}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    market.liquidity === 'high'
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}>
                    {isAr ? 'سيولة عالية' : 'Liquide'}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-6 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{region.location || market.locationName}</span>
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={`rounded-2xl p-3 border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="text-[9px] font-black text-slate-500 uppercase mb-2 flex items-center gap-1">
                      <span className="flag-emoji">🇪🇺</span>
                      <span>EURO</span>
                    </div>
                    <div className={`text-lg font-black font-mono leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {market.eurSell.toFixed(1)}
                    </div>
                  </div>

                  <div className={`rounded-2xl p-3 border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="text-[9px] font-black text-slate-500 uppercase mb-2 flex items-center gap-1">
                      <span className="flag-emoji">🇺🇸</span>
                      <span>USD</span>
                    </div>
                    <div className={`text-lg font-black font-mono leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {market.usdSell.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-4 border-t border-slate-100/10">
                <span className="flex items-center gap-1 font-bold uppercase">
                  <Clock className="w-3 h-3" />
                  <span>{isAr ? 'نشاط مستمر' : market.lastActivity}</span>
                </span>
                <span className="text-emerald-500 font-black uppercase tracking-tighter">{isAr ? 'مطابق' : 'Sync OK'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
