import React, { useState } from 'react';
import { Search, ArrowUpDown, TrendingUp, TrendingDown, ArrowUpRight, Copy, Check, Info, ShieldCheck, Building2, Store, CreditCard, Sparkles } from 'lucide-react';
import { ApiResponse, CurrencyItem, VirtualNeobankItem } from '../types';
import { formatCentimesAlgerien, formatNumber } from '../utils/formatters';
import { Language, translations } from '../utils/translations';

interface RatesTableProps {
  data: ApiResponse | null;
  onSelectCurrency: (code: string) => void;
  language: Language;
}

export const RatesTable: React.FC<RatesTableProps> = ({ data, onSelectCurrency, language }) => {
  const t = translations[language];
  const isAr = language === 'ar';
  const daUnit = isAr ? 'دج' : 'DA';

  const [activeTab, setActiveTab] = useState<'all' | 'parallel' | 'official' | 'virtual' | 'arbitrage'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!data) return null;

  const filteredCurrencies = data.currencies.filter((curr) => {
    const q = searchQuery.toLowerCase();
    return (
      curr.code.toLowerCase().includes(q) ||
      curr.name.toLowerCase().includes(q) ||
      curr.nameAr.includes(q) ||
      curr.country.toLowerCase().includes(q)
    );
  });

  const filteredVirtuals = data.virtualRates.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.currency.toLowerCase().includes(q) ||
      item.popularUse.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleCopyRow = (curr: CurrencyItem) => {
    const text = isAr
      ? `🇩🇿 [دينار ديزاد] سعر ${curr.nameAr || curr.name} (${curr.code}) :
🏛️ بنك الجزائر : ${curr.official.mid?.toFixed(2)} دج
🏙️ شراء السكوار : ${curr.parallel?.buy.toFixed(1)} دج | بيع : ${curr.parallel?.sell.toFixed(1)} دج
💰 100 ${curr.code} = ${((curr.parallel?.sell || 0) * 100).toLocaleString('ar-DZ')} دج (${formatCentimesAlgerien((curr.parallel?.sell || 0) * 100, 'ar')})`
      : `🇩🇿 [DinarDZ] Cours ${curr.name} (${curr.code}) :
🏛️ Officiel Banque : ${curr.official.mid?.toFixed(2)} DA
🏙️ Square Achat : ${curr.parallel?.buy.toFixed(1)} DA | Vente : ${curr.parallel?.sell.toFixed(1)} DA
💰 100 ${curr.code} = ${((curr.parallel?.sell || 0) * 100).toLocaleString('fr-DZ')} DA (${formatCentimesAlgerien((curr.parallel?.sell || 0) * 100, 'fr')})`;

    navigator.clipboard.writeText(text);
    setCopiedCode(curr.code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section id="rates-table-section" className="mb-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>{t.ratesTableTitle}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {data.currencies.length} {isAr ? 'عملة' : 'Devises'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t.ratesTableSubtitle}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث عن دولة، عملة، يورو، دولار...' : 'Rechercher pays, devise, EUR, USD...'}
            className={`w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
          />
          <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-3' : 'left-3'}`} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 ${isAr ? 'left-3' : 'right-3'}`}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 no-scrollbar">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          {isAr ? 'الكل (13 عملة + رقمي)' : 'Tous les Marchés (13 Devises)'}
        </button>

        <button
          onClick={() => setActiveTab('parallel')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'parallel'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Store className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isAr ? 'سكوار بورسعيد' : 'Square Port-Saïd'}</span>
        </button>

        <button
          onClick={() => setActiveTab('virtual')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'virtual'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isAr ? 'العملات الرقمية وبريدي موب' : 'Virtuel & BaridiMob'}</span>
        </button>

        <button
          onClick={() => setActiveTab('official')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'official'
              ? 'bg-blue-950 text-blue-300 border border-blue-500'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span>{isAr ? 'بنك الجزائر (رسمي)' : 'Banque d\'Algérie'}</span>
        </button>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">{t.colCurrency}</th>
                <th className="py-3.5 px-4">{t.colParallelBuy}</th>
                <th className="py-3.5 px-4">{t.colParallelSell}</th>
                <th className="py-3.5 px-4">{t.colOfficialMid}</th>
                <th className="py-3.5 px-4 text-center">{t.colGap}</th>
                <th className="py-3.5 px-4 text-right">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredCurrencies.map((curr) => {
                const parallelBuy = curr.parallel?.buy || 0;
                const parallelSell = curr.parallel?.sell || 0;
                const officialMid = curr.official.mid || 0;
                const gapPercent = officialMid > 0 ? (((parallelSell - officialMid) / officialMid) * 100).toFixed(1) : '0.0';
                const isHighlight = curr.code === 'EUR' || curr.code === 'USD';

                return (
                  <tr
                    key={curr.code}
                    className={`hover:bg-slate-800/50 transition-colors ${
                      isHighlight ? 'bg-slate-900/60' : ''
                    }`}
                  >
                    {/* Currency & Flag */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl shrink-0" title={curr.country}>{curr.flag}</span>
                        <div>
                          <div className="font-bold text-white font-mono flex items-center gap-1.5">
                            <span>{curr.code}</span>
                            <span className="text-slate-400 font-sans text-[11px]">({curr.symbol})</span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {isAr ? curr.nameAr : curr.name} • {isAr ? curr.nameAr : curr.country}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Square Achat */}
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-200">
                      {parallelBuy > 0 ? (
                        <div>
                          <span>{parallelBuy.toFixed(1)} {daUnit}</span>
                          <div className="text-[10px] text-slate-400">
                            100 = {(parallelBuy * 100).toLocaleString(isAr ? 'ar-DZ' : 'fr-DZ')} {daUnit}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Square Vente */}
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {parallelSell > 0 ? (
                        <div>
                          <span>{parallelSell.toFixed(1)} {daUnit}</span>
                          <div className="text-[10px] text-slate-400">
                            100 = {(parallelSell * 100).toLocaleString(isAr ? 'ar-DZ' : 'fr-DZ')} {daUnit}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Official Mid */}
                    <td className="py-3.5 px-4 font-mono font-medium text-blue-400">
                      <div>
                        <span>{officialMid.toFixed(2)} {daUnit}</span>
                        <div className="text-[10px] text-slate-400">
                          100 = {(officialMid * 100).toLocaleString(isAr ? 'ar-DZ' : 'fr-DZ')} {daUnit}
                        </div>
                      </div>
                    </td>

                    {/* Gap % */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-950/60 text-amber-400 border border-amber-800/40">
                        +{gapPercent}%
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleCopyRow(curr)}
                          title={isAr ? 'نسخ أسعار العملة' : 'Copier les taux de cette devise'}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                        >
                          {copiedCode === curr.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => onSelectCurrency(curr.code)}
                          title={isAr ? 'تحويل في المحاكي' : 'Calculer dans le simulateur'}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <span>{t.btnCalculate}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
