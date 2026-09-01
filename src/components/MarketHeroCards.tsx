import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw, Zap, Shield, Sparkles, Building2, Store, CreditCard } from 'lucide-react';
import { ApiResponse } from '../types';
import { formatCentimesAlgerien } from '../utils/formatters';
import { Language, translations } from '../utils/translations';

interface MarketHeroCardsProps {
  data: ApiResponse | null;
  onSelectForConvert: (currencyCode: string, marketType: string) => void;
  language: Language;
}

export const MarketHeroCards: React.FC<MarketHeroCardsProps> = ({ data, onSelectForConvert, language }) => {
  if (!data) return null;

  const t = translations[language];
  const isAr = language === 'ar';
  const daUnit = isAr ? 'دج' : 'DA';

  const eurCurr = data.currencies.find(c => c.code === 'EUR');
  const usdCurr = data.currencies.find(c => c.code === 'USD');
  const cadCurr = data.currencies.find(c => c.code === 'CAD');
  const gbpCurr = data.currencies.find(c => c.code === 'GBP');
  const sarCurr = data.currencies.find(c => c.code === 'SAR');

  const usdtItem = data.virtualRates.find(v => v.id === 'usdt_binance');
  const wiseItem = data.virtualRates.find(v => v.id === 'wise_eur');
  const payseraItem = data.virtualRates.find(v => v.id === 'paysera_eur');
  const redotpayItem = data.virtualRates.find(v => v.id === 'redotpay_usd');

  const eurSquareSell = eurCurr?.parallel?.sell || 252.5;
  const eurSquareBuy = eurCurr?.parallel?.buy || 250.0;
  const eurOfficialMid = eurCurr?.official?.mid || 145.5;

  const usdSquareSell = usdCurr?.parallel?.sell || 236.5;
  const usdSquareBuy = usdCurr?.parallel?.buy || 234.0;
  const usdOfficialMid = usdCurr?.official?.mid || 133.8;

  return (
    <section className="mb-8">
      {/* Top section header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {isAr ? 'أسعار الصرف اليوم في الجزائر' : 'Cours du Jour en Algérie'}
            </span>
            <span className="text-xs text-slate-400">{isAr ? 'الموازي والبنوك' : 'Marché informel & Bancaire'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {isAr ? 'لوحة المتابعة الشاملة لأسعار الدينار (DZD)' : 'Tableau de Bord des Taux de Change (DZD)'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md">
          {isAr
            ? 'مقارنة فورية بين السعر الرسمي (بنك الجزائر)، وسوق السكوار بورسعيد، والعملات الرقمية P2P عبر بريدي موب.'
            : 'Comparaison instantanée entre le marché officiel (Banque d\'Algérie), le Square Port-Saïd et les devises virtuelles / cryptos (P2P BaridiMob).'}
        </p>
      </div>

      {/* 4 Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: EURO (€) */}
        <div
          id="card-rate-euro"
          className="group relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-5 shadow-xl transition-all duration-300 hover:shadow-emerald-950/30 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl" title="Union Européenne">🇪🇺</span>
                <div>
                  <h3 className="font-extrabold text-white text-lg flex items-center gap-1.5">
                    <span>Euro (€)</span>
                    <span className="text-xs font-mono font-normal text-slate-400">EUR</span>
                  </h3>
                  <span className="text-xs text-emerald-400 font-medium">{t.alertMarketSquare}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                +{data.stats.gapEurPercent}% {isAr ? 'فارق' : 'écart'}
              </span>
            </div>

            {/* Main Price: Square Vente */}
            <div className="my-3">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                {t.colParallelSell} (100 €) :
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                  {(eurSquareSell * 100).toLocaleString(isAr ? 'ar-DZ' : 'fr-DZ')} {daUnit}
                </span>
              </div>
              <p className="text-xs text-emerald-400 font-medium mt-0.5">
                1 € = {eurSquareSell.toFixed(1)} {daUnit} • {formatCentimesAlgerien(eurSquareSell * 100, language)}
              </p>
            </div>

            {/* Secondary Rates Breakdown */}
            <div className="space-y-1.5 pt-3 border-t border-slate-800/80 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Store className="w-3 h-3 text-emerald-400" />
                  <span>{t.colParallelBuy} :</span>
                </span>
                <span className="font-bold">{eurSquareBuy.toFixed(1)} {daUnit}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <CreditCard className="w-3 h-3 text-cyan-400" />
                  <span>Wise (€) Solde :</span>
                </span>
                <span className="text-cyan-300 font-bold">{data.stats.wiseEurRate || 248.5} {daUnit}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Building2 className="w-3 h-3 text-blue-400" />
                  <span>{isAr ? 'بنك الجزائر :' : 'Banque d\'Algérie :'}</span>
                </span>
                <span className="text-blue-300 font-bold">{eurOfficialMid.toFixed(2)} {daUnit}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectForConvert('EUR', 'parallel')}
            className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{t.btnCalculate} (EUR)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* CARD 2: DOLLAR ($) */}
        <div
          id="card-rate-usd"
          className="group relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-5 shadow-xl transition-all duration-300 hover:shadow-emerald-950/30 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl" title="États-Unis">🇺🇸</span>
                <div>
                  <h3 className="font-extrabold text-white text-lg flex items-center gap-1.5">
                    <span>Dollar ($)</span>
                    <span className="text-xs font-mono font-normal text-slate-400">USD</span>
                  </h3>
                  <span className="text-xs text-emerald-400 font-medium">{t.alertMarketSquare}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                +{(((usdSquareSell - usdOfficialMid) / usdOfficialMid) * 100).toFixed(0)}% {isAr ? 'فارق' : 'écart'}
              </span>
            </div>

            {/* Main Price */}
            <div className="my-3">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                {t.colParallelSell} (100 $) :
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                  {(usdSquareSell * 100).toLocaleString(isAr ? 'ar-DZ' : 'fr-DZ')} {daUnit}
                </span>
              </div>
              <p className="text-xs text-emerald-400 font-medium mt-0.5">
                1 $ = {usdSquareSell.toFixed(1)} {daUnit} • {formatCentimesAlgerien(usdSquareSell * 100, language)}
              </p>
            </div>

            {/* Secondary Rates Breakdown */}
            <div className="space-y-1.5 pt-3 border-t border-slate-800/80 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Store className="w-3 h-3 text-emerald-400" />
                  <span>{t.colParallelBuy} :</span>
                </span>
                <span className="font-bold">{usdSquareBuy.toFixed(1)} {daUnit}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <CreditCard className="w-3 h-3 text-cyan-400" />
                  <span>RedotPay ($) :</span>
                </span>
                <span className="text-cyan-300 font-bold">{redotpayItem?.buyDzd.toFixed(1) || 240.0} {daUnit}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Building2 className="w-3 h-3 text-blue-400" />
                  <span>{isAr ? 'بنك الجزائر :' : 'Banque d\'Algérie :'}</span>
                </span>
                <span className="text-blue-300 font-bold">{usdOfficialMid.toFixed(2)} {daUnit}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectForConvert('USD', 'parallel')}
            className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{t.btnCalculate} (USD)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* CARD 3: USDT TETHER (CRYPTO P2P) */}
        <div
          id="card-rate-usdt"
          className="group relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 hover:border-cyan-500/50 p-5 shadow-xl transition-all duration-300 hover:shadow-cyan-950/30 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">🪙</span>
                <div>
                  <h3 className="font-extrabold text-white text-lg flex items-center gap-1.5">
                    <span>USDT Tether</span>
                    <span className="text-xs font-mono font-normal text-slate-400">₮</span>
                  </h3>
                  <span className="text-xs text-cyan-400 font-medium">Binance P2P • CCP</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                100% Virtuel
              </span>
            </div>

            {/* Main Price */}
            <div className="my-3">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                {isAr ? 'سعر الشراء عبر بريدي موب (100 USDT) :' : 'Achat BaridiMob (100 USDT) :'}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono tracking-tight">
                  {((usdtItem?.buyDzd || 240.5) * 100).toLocaleString(isAr ? 'ar-DZ' : 'fr-DZ')} {daUnit}
                </span>
              </div>
              <p className="text-xs text-cyan-300 font-medium mt-0.5">
                1 USDT = {(usdtItem?.buyDzd || 240.5).toFixed(1)} {daUnit}
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-1.5 pt-3 border-t border-slate-800/80 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400 text-[11px]">{isAr ? 'سعر البيع (سحب) :' : 'Retrait Vente :'}</span>
                <span className="font-bold">{(usdtItem?.sellDzd || 238.0).toFixed(1)} {daUnit}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400 text-[11px]">{isAr ? 'وسيلة الدفع :' : 'Méthode :'}</span>
                <span className="text-emerald-400 font-bold">BaridiMob / Hand</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400 text-[11px]">{isAr ? 'السرعة :' : 'Vitesse :'}</span>
                <span className="text-cyan-300 font-bold">Instantané (Escrow)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectForConvert('USD', 'virtual')}
            className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{t.btnCalculate} (USDT)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* CARD 4: WISE / PAYSERA EUR */}
        <div
          id="card-rate-wise"
          className="group relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 hover:border-sky-500/50 p-5 shadow-xl transition-all duration-300 hover:shadow-sky-950/30 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">💳</span>
                <div>
                  <h3 className="font-extrabold text-white text-lg flex items-center gap-1.5">
                    <span>Wise & Paysera</span>
                    <span className="text-xs font-mono font-normal text-slate-400">EUR</span>
                  </h3>
                  <span className="text-xs text-sky-400 font-medium">Cartes Visa/Mastercard</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-950 text-sky-300 border border-sky-800/60">
                Solde Euro
              </span>
            </div>

            {/* Main Price */}
            <div className="my-3">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                {isAr ? 'شحن رصيد 100 € وايز :' : 'Recharge 100 € Solde Wise :'}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-sky-400 font-mono tracking-tight">
                  {((wiseItem?.buyDzd || 248.5) * 100).toLocaleString(isAr ? 'ar-DZ' : 'fr-DZ')} {daUnit}
                </span>
              </div>
              <p className="text-xs text-sky-300 font-medium mt-0.5">
                1 € Wise = {(wiseItem?.buyDzd || 248.5).toFixed(1)} {daUnit}
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-1.5 pt-3 border-t border-slate-800/80 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400 text-[11px]">Paysera (€) :</span>
                <span className="font-bold">{(payseraItem?.buyDzd || 247.0).toFixed(1)} {daUnit}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400 text-[11px]">RedotPay ($) :</span>
                <span className="font-bold">{(redotpayItem?.buyDzd || 240.0).toFixed(1)} {daUnit}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400 text-[11px]">{isAr ? 'الاستخدام :' : 'Usage :'}</span>
                <span className="text-emerald-400 font-bold">AliExpress, Ads, Hotels</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectForConvert('EUR', 'virtual')}
            className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{t.btnCalculate} (Wise)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
