import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Copy,
  Check,
  Store,
  CreditCard,
  Building2,
  HelpCircle,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { ApiResponse, CurrencyItem } from '../types';
import {
  formatDZD,
  formatNumber,
  formatCentimesAlgerien,
  calculateBaridimobFee,
} from '../utils/formatters';
import { Language, translations } from '../utils/translations';

interface MultiMarketConverterProps {
  data: ApiResponse | null;
  selectedCurrencyCode: string;
  selectedMarketType: string;
  onCurrencyChange: (code: string) => void;
  language: Language;
}

export const MultiMarketConverter: React.FC<MultiMarketConverterProps> = ({
  data,
  selectedCurrencyCode,
  selectedMarketType,
  onCurrencyChange,
  language,
}) => {
  const t = translations[language];
  const isAr = language === 'ar';
  const daUnit = isAr ? 'دج' : 'DA';

  const [amount, setAmount] = useState<number>(100);
  const [direction, setDirection] = useState<'foreign_to_dzd' | 'dzd_to_foreign'>('foreign_to_dzd');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [includeBaridimobFee, setIncludeBaridimobFee] = useState<boolean>(true);

  if (!data) return null;

  const currentCurrency =
    data.currencies.find((c) => c.code === selectedCurrencyCode) || data.currencies[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Rates calculation
  const parallelSell = currentCurrency.parallel?.sell || 250;
  const parallelBuy = currentCurrency.parallel?.buy || 248;
  const officialSell = currentCurrency.official.sell || 146;
  const officialBuy = currentCurrency.official.buy || 145;
  const officialMid = currentCurrency.official.mid || (officialSell + officialBuy) / 2;

  // Virtual / P2P rate approximation
  const isEur = currentCurrency.code === 'EUR';
  const isUsd = currentCurrency.code === 'USD';
  const virtualBuyRate = isEur
    ? data.stats.wiseEurRate || 248.5
    : isUsd
    ? data.stats.usdtP2pRate || 240.5
    : parallelSell * 0.98;

  const virtualSellRate = isEur
    ? (data.stats.wiseEurRate || 248.5) - 3.5
    : isUsd
    ? (data.stats.usdtP2pRate || 240.5) - 2.5
    : parallelBuy * 0.98;

  // Output calculations
  let calculatedParallelSell = 0;
  let calculatedOfficial = 0;
  let calculatedVirtual = 0;

  if (direction === 'foreign_to_dzd') {
    calculatedParallelSell = amount * parallelSell;
    calculatedOfficial = amount * officialMid;
    calculatedVirtual = amount * virtualBuyRate;
  } else {
    calculatedParallelSell = amount / parallelSell;
    calculatedOfficial = amount / officialMid;
    calculatedVirtual = amount / virtualBuyRate;
  }

  const dzdValueForBaridimob =
    direction === 'foreign_to_dzd' ? calculatedVirtual : amount;
  const baridimobFee = calculateBaridimobFee(dzdValueForBaridimob);
  const netVirtualDzd =
    direction === 'foreign_to_dzd'
      ? calculatedVirtual - (includeBaridimobFee ? baridimobFee : 0)
      : (amount - (includeBaridimobFee ? baridimobFee : 0)) / virtualBuyRate;

  // Preset buttons
  const foreignPresets = [50, 100, 200, 500, 1000, 2000];
  const dzdPresets = [10000, 25000, 50000, 100000, 200000, 500000];

  const presets = direction === 'foreign_to_dzd' ? foreignPresets : dzdPresets;

  const amountInputId = 'converter-amount-input-id';
  const feeCheckboxId = 'converter-fee-checkbox-id';

  return (
    <section id="multi-market-converter" className="mb-10">
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                {t.converterTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              {t.converterSubtitle}
            </p>
          </div>
        </div>

        {/* Direction Switch Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => {
              setDirection('foreign_to_dzd');
              if (amount > 5000) setAmount(100);
            }}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              direction === 'foreign_to_dzd'
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40 shadow-lg'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <span className="text-lg">{currentCurrency.flag}</span>
            <span>{t.dirForeignToDzd}</span>
          </button>

          <button
            onClick={() => {
              setDirection('dzd_to_foreign');
              if (amount < 1000) setAmount(50000);
            }}
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              direction === 'dzd_to_foreign'
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40 shadow-lg'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <span className="text-lg">🇩🇿</span>
            <span>{t.dirDzdToForeign}</span>
          </button>
        </div>

        {/* Input & Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-8">
          {/* Amount Input */}
          <div className="md:col-span-6">
            <label htmlFor={amountInputId} className="block text-xs font-medium text-slate-300 mb-1.5">
              {t.labelAmount}
            </label>
            <div className="relative">
              <input
                id={amountInputId}
                type="number"
                min="1"
                step="any"
                value={amount || ''}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                placeholder="Ex: 100"
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-2xl px-4 py-3.5 text-xl font-bold text-white font-mono placeholder:text-slate-600 focus:outline-none transition-all shadow-inner"
              />
              <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-sm font-bold text-slate-300 font-mono ${isAr ? 'left-4' : 'right-4'}`}>
                <span>{direction === 'foreign_to_dzd' ? currentCurrency.flag : '🇩🇿'}</span>
                <span>{direction === 'foreign_to_dzd' ? `${currentCurrency.code} (${currentCurrency.symbol})` : daUnit}</span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              {presets.map((presetVal) => (
                <button
                  key={presetVal}
                  onClick={() => setAmount(presetVal)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                    amount === presetVal
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {presetVal.toLocaleString(isAr ? 'ar-DZ' : 'fr-DZ')}{' '}
                  {direction === 'foreign_to_dzd' ? currentCurrency.code : daUnit}
                </button>
              ))}
            </div>
          </div>

          {/* Currency selector */}
          <div className="md:col-span-6">
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span>{t.labelChooseCurrency}</span>
              <span className="text-[11px] text-slate-400">
                {t.labelSelected} <strong className="text-emerald-400">{currentCurrency.flag} {isAr ? (currentCurrency.nameAr || currentCurrency.name) : currentCurrency.name} ({currentCurrency.symbol})</strong>
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {data.currencies.slice(0, 8).map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => onCurrencyChange(curr.code)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    curr.code === selectedCurrencyCode
                      ? 'bg-emerald-950/90 border-emerald-500 text-white ring-1 ring-emerald-500/50 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <span className="text-xl shrink-0" title={curr.country}>{curr.flag}</span>
                  <div className="truncate text-left">
                    <div className="font-mono font-bold leading-none">{curr.code} ({curr.symbol})</div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{isAr ? curr.nameAr : curr.country.split(' ')[0]}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Postal Fee Toggle */}
            <div className="mt-2.5 flex items-center justify-between bg-slate-950/40 p-2 rounded-xl border border-slate-800/60">
              <label htmlFor={feeCheckboxId} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  id={feeCheckboxId}
                  type="checkbox"
                  checked={includeBaridimobFee}
                  onChange={(e) => setIncludeBaridimobFee(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                />
                <span>{t.labelBaridiMobFee}</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                ~{baridimobFee} {daUnit} ({t.labelBaridiMobFeeDesc})
              </span>
            </div>
          </div>
        </div>

        {/* 3 RESULTS CARDS IN PARALLEL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Square Port-Said */}
          <div className="rounded-2xl bg-gradient-to-b from-emerald-950/40 via-slate-950 to-slate-950 border-2 border-emerald-500/40 p-5 relative shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🇩🇿</span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-emerald-400" />
                    <span>{t.resSquareTitle}</span>
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {t.resSquareBadge}
                </span>
              </div>

              <div className="mb-3">
                <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                  <span>{direction === 'foreign_to_dzd' ? t.valInDinars : t.amountObtained}</span>
                  <span className="text-sm">{currentCurrency.flag}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
                  {direction === 'foreign_to_dzd'
                    ? formatDZD(calculatedParallelSell, language)
                    : `${formatNumber(calculatedParallelSell, 2, language)} ${currentCurrency.symbol}`}
                </div>
                {direction === 'foreign_to_dzd' && (
                  <div className="text-xs text-slate-400 mt-1">
                    {formatCentimesAlgerien(calculatedParallelSell, language)}
                  </div>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                <div className="flex justify-between">
                  <span>{t.rateApplied}</span>
                  <span className="font-mono text-slate-200 font-semibold flex items-center gap-1">
                    <span>{currentCurrency.flag}</span>
                    <span>1 {currentCurrency.code} = {parallelSell.toFixed(1)} {daUnit}</span>
                  </span>
                </div>
                {includeBaridimobFee && (
                  <div className="flex justify-between text-amber-400">
                    <span>{isAr ? 'صافي بدون رسوم بريدية' : 'Net en espèces physiques'}</span>
                    <span className="font-mono font-semibold">{isAr ? '0 دج مصاريف' : '0 DA frais'}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => handleCopy(
                direction === 'foreign_to_dzd'
                  ? `${currentCurrency.flag} ${amount} ${currentCurrency.code} = ${formatNumber(calculatedParallelSell, 2, language)} ${daUnit} au Square Port-Saïd`
                  : `${amount} ${daUnit} = ${formatNumber(calculatedParallelSell, 2, language)} ${currentCurrency.code} ${currentCurrency.flag} au Square`,
                'copy-square'
              )}
              className="mt-4 w-full py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              {copiedId === 'copy-square' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'copy-square' ? t.copiedText : t.btnCopyResult}</span>
            </button>
          </div>

          {/* Card 2: Official Bank */}
          <div className="rounded-2xl bg-gradient-to-b from-blue-950/40 via-slate-950 to-slate-950 border border-blue-800/50 p-5 relative shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏛️</span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    <span>{t.resBankTitle}</span>
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-950 text-blue-300 border border-blue-800/50">
                  {t.resBankBadge}
                </span>
              </div>

              <div className="mb-3">
                <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                  <span>{direction === 'foreign_to_dzd' ? t.valAtBank : t.valOfficialTheory}</span>
                  <span className="text-sm">{currentCurrency.flag}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono tracking-tight">
                  {direction === 'foreign_to_dzd'
                    ? formatDZD(calculatedOfficial, language)
                    : `${formatNumber(calculatedOfficial, 2, language)} ${currentCurrency.symbol}`}
                </div>
                {direction === 'foreign_to_dzd' && (
                  <div className="text-xs text-slate-400 mt-1">
                    {formatCentimesAlgerien(calculatedOfficial, language)}
                  </div>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                <div className="flex justify-between">
                  <span>{t.rateOfficialMid}</span>
                  <span className="font-mono text-slate-200 font-semibold flex items-center gap-1">
                    <span>{currentCurrency.flag}</span>
                    <span>1 {currentCurrency.code} = {officialMid.toFixed(2)} {daUnit}</span>
                  </span>
                </div>
                <div className="flex justify-between text-amber-400/90 font-medium">
                  <span>{t.gapWithSquare}</span>
                  <span className="font-mono font-semibold">
                    -{Math.abs(calculatedParallelSell - calculatedOfficial).toLocaleString(isAr ? 'ar-DZ' : 'fr-DZ', { maximumFractionDigits: 0 })} {daUnit}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(
                direction === 'foreign_to_dzd'
                  ? `${currentCurrency.flag} ${amount} ${currentCurrency.code} = ${formatNumber(calculatedOfficial, 2, language)} ${daUnit} (Banque d'Algérie)`
                  : `${amount} ${daUnit} = ${formatNumber(calculatedOfficial, 2, language)} ${currentCurrency.code} ${currentCurrency.flag} (Banque d'Algérie)`,
                'copy-bank'
              )}
              className="mt-4 w-full py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              {copiedId === 'copy-bank' ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'copy-bank' ? t.copiedText : t.btnCopyResult}</span>
            </button>
          </div>

          {/* Card 3: Virtual / P2P / Baridimob */}
          <div className="rounded-2xl bg-gradient-to-b from-sky-950/40 via-slate-950 to-slate-950 border border-sky-800/50 p-5 relative shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{isEur ? '🇪🇺' : isUsd ? '🇺🇸' : '💳'}</span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-sky-400" />
                    <span>{isEur ? 'Wise / Paysera (Euro)' : isUsd ? 'USDT Binance / RedotPay' : t.resVirtualTitle}</span>
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-950 text-sky-300 border border-sky-800/50">
                  {t.resVirtualBadge}
                </span>
              </div>

              <div className="mb-3">
                <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                  <span>{direction === 'foreign_to_dzd' ? t.valBaridiMobRecharge : t.valDigitalNet}</span>
                  <span className="text-sm">{isEur ? '🇪🇺' : isUsd ? '🪙' : '🌐'}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-sky-400 font-mono tracking-tight">
                  {direction === 'foreign_to_dzd'
                    ? formatDZD(netVirtualDzd, language)
                    : `${formatNumber(netVirtualDzd, 2, language)} ${currentCurrency.symbol}`}
                </div>
                {direction === 'foreign_to_dzd' && (
                  <div className="text-xs text-slate-400 mt-1">
                    {formatCentimesAlgerien(netVirtualDzd, language)}
                  </div>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                <div className="flex justify-between">
                  <span>{t.rateApplied}</span>
                  <span className="font-mono text-slate-200 font-semibold">
                    1 {currentCurrency.code} = {virtualBuyRate.toFixed(1)} {daUnit}
                  </span>
                </div>
                {includeBaridimobFee && (
                  <div className="flex justify-between text-sky-400/90 font-medium">
                    <span>{isAr ? 'خصم عمولة بريدي موب :' : 'Frais BaridiMob déduits :'}</span>
                    <span className="font-mono font-semibold">-{baridimobFee} {daUnit}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => handleCopy(
                direction === 'foreign_to_dzd'
                  ? `${currentCurrency.flag} ${amount} ${currentCurrency.code} = ${formatNumber(netVirtualDzd, 2, language)} ${daUnit} (Net BaridiMob)`
                  : `${amount} ${daUnit} = ${formatNumber(netVirtualDzd, 2, language)} ${currentCurrency.code} ${currentCurrency.flag} (Net Digital)`,
                'copy-virtual'
              )}
              className="mt-4 w-full py-2 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 text-sky-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              {copiedId === 'copy-virtual' ? <Check className="w-3.5 h-3.5 text-sky-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'copy-virtual' ? t.copiedText : t.btnCopyResult}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
