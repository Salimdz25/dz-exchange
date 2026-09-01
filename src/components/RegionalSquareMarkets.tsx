import React from 'react';
import { MapPin, Clock, ShieldAlert, Sparkles, Activity } from 'lucide-react';
import { RegionalMarket } from '../types';
import { Language, translations } from '../utils/translations';

interface RegionalSquareMarketsProps {
  markets: RegionalMarket[];
  language: Language;
}

export const RegionalSquareMarkets: React.FC<RegionalSquareMarketsProps> = ({ markets, language }) => {
  const t = translations[language];
  const isAr = language === 'ar';
  const daUnit = isAr ? 'دج' : 'DA';

  const cityNamesAr: Record<string, { city: string; location: string }> = {
    'Alger (Square Port-Saïd)': { city: 'الجزائر العاصمة', location: 'ساحة بورسعيد (السكوار)' },
    'Oran (Place d\'Armes / Medina)': { city: 'وهران الباهية', location: 'ساحة أول نوفمبر / المدينة الجديدة' },
    'Constantine (Bab El Oued / Centre)': { city: 'قسنطينة', location: 'باب الوادي / وسط المدينة' },
    'Sétif (Ain Fouara / Marché)': { city: 'سطيف العالي', location: 'محيط عين الفوارة والسوق' },
    'Annaba (Cours de la Révolution)': { city: 'عنابة', location: 'شارع الثورة (الكور)' },
    'Tizi Ouzou (Grand Boulevard)': { city: 'تيزي وزو', location: 'الشارع الرئيسي ووسط المدينة' },
    'Béjaïa (Place du 1er Novembre)': { city: 'بجاية', location: 'ساحة أول نوفمبر والميناء' },
    'Batna (Aures Market)': { city: 'باتنة', location: 'سوق الأوراس ووسط المدينة' },
  };

  return (
    <section id="regional-markets-section" className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{isAr ? 'بورصات السكوار في الولايات' : 'Bourses Informelles Régionales'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {t.regionalSectionTitle}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          {t.regionalSectionSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {markets.map((market) => {
          const arInfo = cityNamesAr[market.city];
          const displayCity = isAr && arInfo ? arInfo.city : market.city;
          const displayLoc = isAr && arInfo ? arInfo.location : market.locationName;

          return (
            <div
              key={market.city}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-5 shadow-lg flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <h3 className="text-base font-bold text-white">{displayCity}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    market.liquidity === 'high'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                      : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                  }`}>
                    {isAr
                      ? `السيولة : ${market.liquidity === 'high' ? 'عالية' : 'متوسطة'}`
                      : `Liquidité : ${market.liquidity === 'high' ? 'Élevée' : 'Moyenne'}`}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{displayLoc}</span>
                </p>

                {/* Rates grid */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800">
                    <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1">
                      <span>🇪🇺</span>
                      <span>{isAr ? 'يورو (€)' : 'Euro (€)'}</span>
                    </div>
                    <div className="flex justify-between items-baseline font-mono">
                      <span className="text-slate-300">{isAr ? 'شراء' : 'Ach'} : {market.eurBuy.toFixed(1)}</span>
                      <span className="text-emerald-400 font-bold">{isAr ? 'بيع' : 'Ven'} : {market.eurSell.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800">
                    <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1">
                      <span>🇺🇸</span>
                      <span>{isAr ? 'دولار ($)' : 'Dollar ($)'}</span>
                    </div>
                    <div className="flex justify-between items-baseline font-mono">
                      <span className="text-slate-300">{isAr ? 'شراء' : 'Ach'} : {market.usdBuy.toFixed(1)}</span>
                      <span className="text-emerald-400 font-bold">{isAr ? 'بيع' : 'Ven'} : {market.usdSell.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{isAr ? 'نشاط مستمر' : market.lastActivity}</span>
                </span>
                <span className="text-emerald-400 font-mono text-[10px] font-semibold">{isAr ? 'متطابق مع السكوار' : 'Conforme Square'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
