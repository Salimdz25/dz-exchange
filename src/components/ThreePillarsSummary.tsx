import React from 'react';
import { Store, CreditCard, Building2, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { ApiResponse } from '../types';
import { formatCentimesAlgerien } from '../utils/formatters';
import { Language, translations } from '../utils/translations';

interface ThreePillarsSummaryProps {
  data: ApiResponse | null;
  onSelectCurrency: (code: string) => void;
  language: Language;
}

export const ThreePillarsSummary: React.FC<ThreePillarsSummaryProps> = ({
  data,
  onSelectCurrency,
  language,
}) => {
  if (!data) return null;

  const t = translations[language];
  const isAr = language === 'ar';

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
  const usdSquareSell = usdCurr?.parallel?.sell || 236.5;
  const usdSquareBuy = usdCurr?.parallel?.buy || 234.0;

  const eurOfficialMid = eurCurr?.official?.mid || 145.5;
  const usdOfficialMid = usdCurr?.official?.mid || 133.8;

  const daUnit = isAr ? 'دج' : 'DA';

  return (
    <div className="mb-8">
      {/* 3 Pillars Clean Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* PILIER 1: MARCHÉ PARALLÈLE (SQUARE PORT-SAÏD) */}
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-2 border-emerald-500/40 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 shadow">
              {t.pillar1Badge}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{t.pillar1Title}</span>
                  <span className="text-base">🇩🇿</span>
                </h3>
                <p className="text-xs text-slate-400">{t.pillar1Subtitle}</p>
              </div>
            </div>

            {/* EUR Main row with Flag & Symbol */}
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-3.5 mb-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-200 flex items-center gap-2">
                  <span className="text-xl inline-flex items-center justify-center shadow-sm" title="Zone Euro">🇪🇺</span>
                  <span>{isAr ? 'يورو' : 'Euro'} <span className="text-emerald-400 font-mono font-bold">(EUR €)</span></span>
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                  100 € = {(eurSquareSell * 100).toLocaleString(isAr ? 'ar-DZ' : 'fr-DZ')} {daUnit}
                </span>
              </div>
              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="text-slate-400">
                  {t.buyLabel} <strong className="text-slate-200">{eurSquareBuy.toFixed(1)} {daUnit}</strong>
                </span>
                <span className="text-slate-400">
                  {t.sellLabel} <strong className="text-emerald-400 text-sm font-black">{eurSquareSell.toFixed(1)} {daUnit}</strong>
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 truncate">
                {formatCentimesAlgerien(eurSquareSell * 100, language)}
              </div>
            </div>

            {/* USD Main row with Flag & Symbol */}
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-3.5 mb-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-200 flex items-center gap-2">
                  <span className="text-xl inline-flex items-center justify-center shadow-sm" title="USA">🇺🇸</span>
                  <span>{isAr ? 'دولار أمريكي' : 'Dollar US'} <span className="text-emerald-400 font-mono font-bold">(USD $)</span></span>
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                  100 $ = {(usdSquareSell * 100).toLocaleString(isAr ? 'ar-DZ' : 'fr-DZ')} {daUnit}
                </span>
              </div>
              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="text-slate-400">
                  {t.buyLabel} <strong className="text-slate-200">{usdSquareBuy.toFixed(1)} {daUnit}</strong>
                </span>
                <span className="text-slate-400">
                  {t.sellLabel} <strong className="text-emerald-400 text-sm font-black">{usdSquareSell.toFixed(1)} {daUnit}</strong>
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 truncate">
                {formatCentimesAlgerien(usdSquareSell * 100, language)}
              </div>
            </div>

            {/* Quick mini-list CAD / GBP / SAR with flags */}
            <div className="grid grid-cols-3 gap-1.5 text-[11px] text-center bg-slate-950/40 p-2 rounded-xl border border-slate-800/60">
              <div>
                <span className="text-slate-400 font-medium flex items-center justify-center gap-1">
                  <span>🇨🇦</span> CAD ($)
                </span>
                <span className="font-mono font-bold text-slate-200">{cadCurr?.parallel?.sell.toFixed(1) || '171.0'} {daUnit}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium flex items-center justify-center gap-1">
                  <span>🇬🇧</span> GBP (£)
                </span>
                <span className="font-mono font-bold text-slate-200">{gbpCurr?.parallel?.sell.toFixed(1) || '296.0'} {daUnit}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium flex items-center justify-center gap-1">
                  <span>🇸🇦</span> SAR (﷼)
                </span>
                <span className="font-mono font-bold text-slate-200">{sarCurr?.parallel?.sell.toFixed(1) || '63.5'} {daUnit}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">{t.pillar1HandToHand}</span>
            <button
              onClick={() => onSelectCurrency('EUR')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              {t.btnCalculate} <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* PILIER 2: DEVISES VIRTUELLES & NÉOBANQUES (BARIDIMOB) */}
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-2 border-cyan-500/40 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-cyan-900/80 text-cyan-300 border border-cyan-700/60 shadow">
              {t.pillar2Badge}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{t.pillar2Title}</span>
                  <span className="text-base">💳</span>
                </h3>
                <p className="text-xs text-slate-400">{t.pillar2Subtitle}</p>
              </div>
            </div>

            {/* USDT Tether Binance P2P */}
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-3.5 mb-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-200 flex items-center gap-2">
                  <span className="text-xl">🪙</span>
                  <span>USDT Tether <span className="text-cyan-400 font-mono font-bold">(USD ₮)</span></span>
                </span>
                <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                  100 ₮ = {((usdtItem?.buyDzd || 240.5) * 100).toLocaleString(isAr ? 'ar-DZ' : 'fr-DZ')} {daUnit}
                </span>
              </div>
              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="text-slate-400">
                  {t.clientBuyLabel} <strong className="text-cyan-400 text-sm font-black">{usdtItem?.buyDzd.toFixed(1) || '240.5'} {daUnit}</strong>
                </span>
                <span className="text-slate-400">
                  {t.clientSellLabel} <strong className="text-slate-300">{usdtItem?.sellDzd.toFixed(1) || '238.0'} {daUnit}</strong>
                </span>
              </div>
              <div className="text-[11px] text-cyan-400/80 mt-1 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>{t.pillar2BaridiMobInfo}</span>
              </div>
            </div>

            {/* Wise Euro */}
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-3.5 mb-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-200 flex items-center gap-2">
                  <span className="text-xl">🇪🇺</span>
                  <span>Wise <span className="text-sky-400 font-mono font-bold">({isAr ? 'رصيد يورو €' : 'Solde EUR €'})</span></span>
                </span>
                <span className="text-[11px] font-mono text-sky-400 font-bold bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/40">
                  100 € = {((wiseItem?.buyDzd || 248.5) * 100).toLocaleString(isAr ? 'ar-DZ' : 'fr-DZ')} {daUnit}
                </span>
              </div>
              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="text-slate-400">
                  {t.rechargeLabel} <strong className="text-sky-400 text-sm font-black">{wiseItem?.buyDzd.toFixed(1) || '248.5'} {daUnit}</strong>
                </span>
                <span className="text-slate-400">
                  {t.sellLabel} <strong className="text-slate-300">{wiseItem?.sellDzd.toFixed(1) || '245.0'} {daUnit}</strong>
                </span>
              </div>
            </div>

            {/* Quick Paysera & RedotPay */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-center bg-slate-950/40 p-2 rounded-xl border border-slate-800/60">
              <div>
                <span className="text-slate-400 font-medium flex items-center justify-center gap-1">
                  <span>🇪🇺</span> Paysera (€)
                </span>
                <span className="font-mono font-bold text-amber-400">{payseraItem?.buyDzd.toFixed(1) || '247.0'} {daUnit}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium flex items-center justify-center gap-1">
                  <span>🇺🇸</span> RedotPay ($)
                </span>
                <span className="font-mono font-bold text-rose-400">{redotpayItem?.buyDzd.toFixed(1) || '238.5'} {daUnit}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">{t.pillar2AliExpressInfo}</span>
            <button
              onClick={() => onSelectCurrency('USD')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              {t.btnCalculate} <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* PILIER 3: BANQUE D'ALGÉRIE (OFFICIEL) */}
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-2 border-blue-500/40 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-950 text-blue-300 border border-blue-800/60 shadow">
              {t.pillar3Badge}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{t.pillar3Title}</span>
                  <span className="text-base">🏛️</span>
                </h3>
                <p className="text-xs text-slate-400">{t.pillar3Subtitle}</p>
              </div>
            </div>

            {/* Official EUR */}
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-3.5 mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-200 flex items-center gap-2">
                  <span className="text-xl inline-flex items-center justify-center" title="Union Européenne">🇪🇺</span>
                  <span>{isAr ? 'يورو' : 'Euro'} <span className="text-blue-400 font-mono font-bold">(EUR €)</span></span>
                </span>
                <span className="text-xs font-mono text-blue-400 font-bold bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                  {eurOfficialMid.toFixed(2)} {daUnit}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>100 € = {(eurOfficialMid * 100).toLocaleString(isAr ? 'ar-DZ' : 'fr-DZ')} {daUnit}</span>
                <span className="text-amber-400 font-mono font-semibold">{t.squareGap} +{data.stats.gapEurPercent}%</span>
              </div>
            </div>

            {/* Official USD */}
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-3.5 mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-200 flex items-center gap-2">
                  <span className="text-xl inline-flex items-center justify-center" title="USA">🇺🇸</span>
                  <span>{isAr ? 'دولار أمريكي' : 'Dollar US'} <span className="text-blue-400 font-mono font-bold">(USD $)</span></span>
                </span>
                <span className="text-xs font-mono text-blue-400 font-bold bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                  {usdOfficialMid.toFixed(2)} {daUnit}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>100 $ = {(usdOfficialMid * 100).toLocaleString(isAr ? 'ar-DZ' : 'fr-DZ')} {daUnit}</span>
                <span className="text-amber-400 font-mono font-semibold">{t.squareGap} +{data.stats.gapUsdPercent}%</span>
              </div>
            </div>

            {/* Official info notice */}
            <div className="bg-blue-950/30 border border-blue-800/40 rounded-xl p-3 text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.pillar3BankNotice}</span>
              </div>
              <p className="text-slate-400 leading-tight">
                {t.pillar3BankDesc}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">{t.pillar3DailyFixing}</span>
            <span className="font-mono text-blue-400 font-semibold">{t.pillar3BankCounters}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
