import React from 'react';
import { Share2, ArrowDownRight, ArrowUpRight, HelpCircle } from 'lucide-react';
import { ApiResponse, CurrencyItem, VirtualNeobankItem, GoldRateItem } from '../types';
import { Language } from '../utils/translations';
import { getCurrencyAsset } from '../utils/currencyAssets';
import { InFeedAdSlot } from './AdSlots';

interface RateListProps {
  activeTab: 'parallel' | 'official' | 'digital' | 'gold';
  data: ApiResponse;
  language: Language;
  theme: 'light' | 'dark';
  onShareRow: (title: string, text: string) => void;
  onOpenHelpDialog: () => void;
  onOpenGoldCalculator: () => void;
}

export const RateList: React.FC<RateListProps> = ({
  activeTab,
  data,
  language,
  theme,
  onShareRow,
  onOpenHelpDialog,
  onOpenGoldCalculator,
}) => {
  const isAr = language === 'ar';
  const isDark = theme === 'dark';
  const daUnit = isAr ? 'دج' : 'DA';

  const formatRate = (val: number, decimals: number = 2) => {
    if (!val || isNaN(val)) return `0,00\u00A0${daUnit}`;
    const formatted = val.toFixed(decimals).replace('.', ',');
    return `${formatted}\u00A0${daUnit}`;
  };

  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-500';
  const rowBorder = isDark ? 'border-slate-800/80' : 'border-slate-200/80';
  const rowHover = isDark ? 'hover:bg-slate-900/60' : 'hover:bg-slate-50';

  // -------------------------------------------------------------------
  // 1. PARALLÈLE TAB
  // -------------------------------------------------------------------
  if (activeTab === 'parallel') {
    const priorityCodes = ['EUR', 'USD', 'GBP', 'CAD', 'CHF', 'AED', 'SAR', 'TRY', 'CNY'];
    const sortedCurrencies = [...data.currencies].sort((a, b) => {
      const idxA = priorityCodes.indexOf(a.code);
      const idxB = priorityCodes.indexOf(b.code);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });

    return (
      <div className="w-full space-y-1">
        {sortedCurrencies.map((curr, index) => {
          const asset = getCurrencyAsset(curr.code);
          const buyVal = curr.parallel?.buy || 0;
          const sellVal = curr.parallel?.sell || 0;

          const shareText = isAr
            ? `🇩🇿 [DZ EXCHANGE] ${asset.flag} ${curr.code} (${curr.nameAr}) - السكوار :
الشراء (Achat) : ${formatRate(buyVal, 2)}
البيع (Vente) : ${formatRate(sellVal, 2)}`
            : `🇩🇿 [DZ EXCHANGE] ${asset.flag} ${curr.code} (${curr.name}) - Square Port-Saïd :
Achat : ${formatRate(buyVal, 2)}
Vente : ${formatRate(sellVal, 2)}`;

          return (
            <React.Fragment key={curr.code}>
              {index === 5 && <InFeedAdSlot language={language} theme={theme} />}

              <div
                className={`flex items-center justify-between py-3.5 px-3 sm:px-4 border-b transition-colors ${rowBorder} ${rowHover} rounded-2xl`}
              >
                {/* Left: Flag + Code + Name */}
                <div
                  onClick={onOpenHelpDialog}
                  className="flex items-center gap-3 shrink-0 cursor-pointer max-w-[38%]"
                >
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-xs ${
                    isDark ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100 border border-slate-200'
                  }`}>
                    <span className="flag-emoji">{asset.flag}</span>
                  </div>
                  <div className="truncate">
                    <div className={`font-mono font-black text-base sm:text-lg leading-tight ${textPrimary}`}>
                      {curr.code}
                    </div>
                    <div className={`text-[11px] font-medium truncate ${textSecondary}`}>
                      {isAr ? curr.nameAr : curr.name}
                    </div>
                  </div>
                </div>

                {/* Center / Right: Achat & Vente columns */}
                <div className="flex items-center gap-3 sm:gap-6 flex-1 justify-end mr-2 ml-2">
                  {/* Achat Column */}
                  <div className="text-right min-w-[70px] sm:min-w-[90px]">
                    <div className={`font-mono font-black text-base sm:text-lg whitespace-nowrap ${textPrimary}`}>
                      {buyVal ? buyVal.toFixed(2).replace('.', ',') : '—'}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {isAr ? 'شراء' : 'Achat'}
                    </div>
                  </div>

                  {/* Vente Column */}
                  <div className="text-right min-w-[70px] sm:min-w-[90px]">
                    <div className="font-mono font-black text-base sm:text-lg text-emerald-500 whitespace-nowrap">
                      {sellVal ? sellVal.toFixed(2).replace('.', ',') : '—'}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {isAr ? 'بيع' : 'Vente'}
                    </div>
                  </div>
                </div>

                {/* Share action button */}
                <button
                  onClick={() => onShareRow(`Cours ${curr.code} Square`, shareText)}
                  className={`p-2.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                    isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-900'
                  }`}
                  title={isAr ? 'مشاركة' : 'Partager'}
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  // -------------------------------------------------------------------
  // 2. OFFICIEL TAB
  // -------------------------------------------------------------------
  if (activeTab === 'official') {
    return (
      <div className="w-full space-y-1">
        {data.currencies.map((curr, index) => {
          const asset = getCurrencyAsset(curr.code);
          const midVal = curr.official.mid || curr.official.sell || 0;
          const isNegative = curr.official.change24h < 0;

          const shareText = isAr
            ? `🇩🇿 [DZ EXCHANGE] ${asset.flag} ${curr.code} (${curr.nameAr}) - البنك الرسمي :
السعر البنكي (Fixing) : ${formatRate(midVal, 2)}`
            : `🇩🇿 [DZ EXCHANGE] ${asset.flag} ${curr.code} (${curr.name}) - Banque d'Algérie :
Taux Moyen (Fixing) : ${formatRate(midVal, 2)}`;

          return (
            <React.Fragment key={curr.code}>
              {index === 5 && <InFeedAdSlot language={language} theme={theme} />}

              <div className={`flex items-center justify-between py-3.5 px-3 sm:px-4 border-b transition-colors ${rowBorder} ${rowHover} rounded-2xl`}>
                {/* Left: Flag + Code + Name */}
                <div className="flex items-center gap-3 shrink-0 max-w-[45%]">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-xs ${
                    isDark ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100 border border-slate-200'
                  }`}>
                    <span className="flag-emoji">{asset.flag}</span>
                  </div>
                  <div className="truncate">
                    <div className={`font-mono font-black text-base sm:text-lg leading-tight ${textPrimary}`}>
                      {curr.code}
                    </div>
                    <div className={`text-[11px] font-medium truncate ${textSecondary}`}>
                      {isAr ? curr.nameAr : curr.name}
                    </div>
                  </div>
                </div>

                {/* Right: Official Rate + Variation */}
                <div className="flex items-center gap-3 flex-1 justify-end mr-2 ml-2">
                  <div className="text-right">
                    <div className="font-mono font-black text-base sm:text-lg text-blue-500 whitespace-nowrap flex items-center justify-end gap-1">
                      <span>{midVal.toFixed(2).replace('.', ',')}</span>
                      {curr.official.change24h !== 0 && (
                        <span className={`text-xs flex items-center ${isNegative ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {isNegative ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {isAr ? 'رسمي (Fixing)' : 'Taux Moyen'}
                    </div>
                  </div>
                </div>

                {/* Share Action */}
                <button
                  onClick={() => onShareRow(`Cours Officiel ${curr.code}`, shareText)}
                  className={`p-2.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                    isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  // -------------------------------------------------------------------
  // 3. DIGITAL TAB
  // -------------------------------------------------------------------
  if (activeTab === 'digital') {
    return (
      <div className="w-full space-y-1">
        {data.virtualRates.map((item, index) => {
          const assetCode = item.id.toUpperCase().includes('USDT') ? 'USDT' : item.id.toUpperCase().includes('USDC') ? 'USD' : item.currency.includes('EUR') ? 'EUR' : 'USD';
          const asset = getCurrencyAsset(assetCode);

          const shareText = isAr
            ? `🇩🇿 [DZ EXCHANGE] ${item.name} (${item.currency}) :
السعر الملاحظ (P2P / digital) : ${formatRate(item.buyDzd, 2)}`
            : `🇩🇿 [DZ EXCHANGE] ${item.name} (${item.currency}) :
Prix observé : ${formatRate(item.buyDzd, 2)}`;

          return (
            <React.Fragment key={item.id}>
              {index === 4 && <InFeedAdSlot language={language} theme={theme} />}

              <div className={`flex items-center justify-between py-3.5 px-3 sm:px-4 border-b transition-colors ${rowBorder} ${rowHover} rounded-2xl`}>
                {/* Left: Logo/Flag + Name + Pair */}
                <div className="flex items-center gap-3 shrink-0 max-w-[50%]">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-xs ${
                    isDark ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100 border border-slate-200'
                  }`}>
                    <span className="flag-emoji">{item.logo || asset.flag}</span>
                  </div>
                  <div className="truncate">
                    <div className={`font-mono font-black text-base sm:text-lg leading-tight ${textPrimary}`}>
                      {item.name}
                    </div>
                    <div className={`text-[11px] font-medium truncate ${textSecondary}`}>
                      {item.currency}
                    </div>
                  </div>
                </div>

                {/* Right: Rate + Label */}
                <div className="flex items-center gap-3 flex-1 justify-end mr-2 ml-2">
                  <div className="text-right">
                    <div className="font-mono font-black text-base sm:text-lg text-cyan-500 whitespace-nowrap">
                      {item.buyDzd.toFixed(2).replace('.', ',')}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {item.labelType === 'p2p' ? (isAr ? 'تداول P2P' : 'Prix P2P') : (isAr ? 'سعر ملاحظ' : 'Prix observé')}
                    </div>
                  </div>
                </div>

                {/* Share Action */}
                <button
                  onClick={() => onShareRow(`Prix Digital ${item.name}`, shareText)}
                  className={`p-2.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                    isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  // -------------------------------------------------------------------
  // 4. OR (GOLD) TAB
  // -------------------------------------------------------------------
  if (activeTab === 'gold') {
    return (
      <div className="w-full space-y-3">
        {/* Top Gold Calculator Button */}
        <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪙</span>
            <div>
              <p className={`text-xs font-black uppercase ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                {isAr ? 'حاسبة أسعار الذهب' : 'Calculateur d\'Or'}
              </p>
              <p className="text-[10px] text-slate-500 font-bold">
                {isAr ? 'تقدير محلي - Cours local observé' : 'Estimation — cours local observé'}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenGoldCalculator}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-widest cursor-pointer shadow-sm transition-all"
          >
            {isAr ? 'حساب' : 'Calculer'}
          </button>
        </div>

        {/* Gold Carat Rows */}
        {data.goldRates.map((gold, index) => {
          const shareText = isAr
            ? `🇩🇿 [DZ EXCHANGE] الذهب عيار ${gold.carat} (${gold.nameAr}) :
السعر : ${formatRate(gold.pricePerGramDzd, 0)} / غرام (par gramme)`
            : `🇩🇿 [DZ EXCHANGE] Or ${gold.name} :
Prix : ${formatRate(gold.pricePerGramDzd, 0)} par gramme`;

          return (
            <React.Fragment key={gold.carat}>
              {index === 2 && <InFeedAdSlot language={language} theme={theme} />}

              <div className={`flex items-center justify-between py-4 px-4 border-b transition-colors ${rowBorder} ${rowHover} rounded-2xl`}>
                {/* Left: Gold Circular Badge + Carats Name */}
                <div className="flex items-center gap-3.5 shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-mono font-black text-lg flex items-center justify-center shadow-md shrink-0">
                    {gold.carat}
                  </div>
                  <div>
                    <div className={`font-mono font-black text-base sm:text-lg leading-tight ${textPrimary}`}>
                      {gold.name}
                    </div>
                    <div className={`text-[11px] font-bold ${textSecondary}`}>
                      {isAr ? gold.nameAr : 'par gramme'}
                    </div>
                  </div>
                </div>

                {/* Right: Gold Price */}
                <div className="flex items-center gap-3 flex-1 justify-end mr-2 ml-2">
                  <div className="text-right">
                    <div className="font-mono font-black text-lg sm:text-2xl text-amber-500 whitespace-nowrap">
                      {gold.pricePerGramDzd.toLocaleString('fr-FR')}&nbsp;{daUnit}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {isAr ? 'للغرام' : 'par gramme'}
                    </div>
                  </div>
                </div>

                {/* Share Action */}
                <button
                  onClick={() => onShareRow(`Prix Or ${gold.name}`, shareText)}
                  className={`p-2.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                    isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return null;
};
