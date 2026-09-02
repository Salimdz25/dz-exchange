import React, { useState } from 'react';
import { Search, Copy, Check, Store, CreditCard, Building2 } from 'lucide-react';
import { ApiResponse, CurrencyItem } from '../types';
import { Language, translations } from '../utils/translations';
import { getCurrencyAsset } from '../utils/currencyAssets';

interface RatesTableProps {
  data: ApiResponse | null;
  theme: 'light' | 'dark';
  onSelectCurrency: (code: string) => void;
  language: Language;
}

export const RatesTable: React.FC<RatesTableProps> = ({ data, theme, onSelectCurrency, language }) => {
  const t = translations[language];
  const isAr = language === 'ar';
  const daUnit = isAr ? 'دج' : 'DA';
  const isDark = theme === 'dark';

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

  const handleCopyRow = (curr: CurrencyItem) => {
    const asset = getCurrencyAsset(curr.code);
    const text = isAr
      ? `🇩🇿 [DinarDZ] ${asset.flag} ${curr.code} :
🏙️ السكوار : ${curr.parallel?.sell.toFixed(1)} دج
🏛️ البنك : ${curr.official.mid?.toFixed(2)} دج`
      : `🇩🇿 [DinarDZ] ${asset.flag} ${curr.code} :
🏙️ Square : ${curr.parallel?.sell.toFixed(1)} DA
🏛️ Bank : ${curr.official.mid?.toFixed(2)} DA`;

    navigator.clipboard.writeText(text);
    setCopiedCode(curr.code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section id="rates-table-section" className="mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-2">
        <div>
          <h2 className={`text-xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.ratesTableTitle}</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{t.ratesTableSubtitle}</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث...' : 'Search currency...'}
            className={`border focus:border-emerald-500/50 rounded-2xl pl-12 pr-6 py-3 text-xs outline-none w-full md:w-64 transition-all ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`}
          />
        </div>
      </div>

      <div className={`rounded-[2.5rem] border overflow-hidden shadow-2xl ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ${
                isDark ? 'bg-slate-950/50 border-slate-800/50' : 'bg-slate-50/50 border-slate-100'
              }`}>
                <th className="py-6 px-8">{t.colCurrency}</th>
                <th className="py-6 px-8">{t.colParallelSell}</th>
                <th className="py-6 px-8">{t.colOfficialMid}</th>
                <th className="py-6 px-8 text-center">{t.colGap}</th>
                <th className="py-6 px-8 text-right">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/30' : 'divide-slate-100'}`}>
              {filteredCurrencies.map((curr) => {
                const asset = getCurrencyAsset(curr.code);
                const parallelSell = curr.parallel?.sell || 0;
                const officialMid = curr.official.mid || 0;
                const gapPercent = officialMid > 0 ? (((parallelSell - officialMid) / officialMid) * 100).toFixed(1) : '0.0';

                return (
                  <tr key={curr.code} className="hover:bg-emerald-500/[0.02] transition-colors group">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform ${
                          isDark ? 'bg-slate-950' : 'bg-slate-100'
                        }`}>
                          <span className="flag-emoji">{asset.flag}</span>
                        </div>
                        <div>
                          <p className={`font-black text-sm tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{curr.code}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{isAr ? curr.nameAr : curr.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <div className="font-mono text-base font-black text-emerald-500">
                        {parallelSell.toFixed(1)} <span className="text-[10px] font-normal text-slate-500">{daUnit}</span>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <div className={`font-mono text-sm font-bold opacity-80 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                        {officialMid.toFixed(2)} <span className="text-[10px] font-normal text-slate-500">{daUnit}</span>
                      </div>
                    </td>
                    <td className="py-5 px-8 text-center">
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        +{gapPercent}%
                      </span>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleCopyRow(curr)} className={`p-2 rounded-lg transition-colors ${
                          isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}>
                          {copiedCode === curr.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => onSelectCurrency(curr.code)}
                          className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-widest cursor-pointer active:scale-95"
                        >
                          {t.btnCalculate}
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
