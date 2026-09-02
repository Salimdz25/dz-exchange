import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { ApiResponse } from '../types';
import { Language, translations } from '../utils/translations';
import { getCurrencyAsset } from '../utils/currencyAssets';

interface VirtualNeobanksSectionProps {
  data: ApiResponse;
  theme: 'light' | 'dark';
  onSelectForConvert: (currencyCode: string) => void;
  language: Language;
}

export const VirtualNeobanksSection: React.FC<VirtualNeobanksSectionProps> = ({
  data,
  theme,
  onSelectForConvert,
  language,
}) => {
  const t = translations[language];
  const isAr = language === 'ar';
  const daUnit = isAr ? 'دج' : 'DA';
  const isDark = theme === 'dark';
  const virtualRates = data.virtualRates;

  const [selectedId, setSelectedId] = useState<string>(virtualRates[0]?.id || 'wise_eur');
  const selectedItem = virtualRates.find(v => v.id === selectedId) || virtualRates[0];

  return (
    <section id="virtual-neobanks-section" className="mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-2">
        <div>
          <h2 className={`text-xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.virtualSectionTitle}</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{t.virtualSectionSubtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {virtualRates.map((item) => {
            const asset = getCurrencyAsset(item.id);
            const isSelected = selectedId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`p-6 rounded-[2rem] border transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500/50 shadow-xl'
                    : isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-cyan-500/30 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
                    {asset.logoSvg ? asset.logoSvg : <span className="flag-emoji">{asset.flag}</span>}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.name}</p>
                    <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>{item.currency}</p>
                  </div>
                </div>

                <div className="mb-4">
                   <p className="text-[9px] font-black text-slate-500 uppercase mb-1 tracking-widest">{isAr ? 'سعر الشحن' : 'Recharge'}</p>
                   <div className={`text-2xl font-black font-mono leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                     {item.buyDzd.toFixed(1)} <span className="text-xs font-normal text-slate-500">{daUnit}</span>
                   </div>
                </div>

                <div className="flex items-center gap-2 opacity-60">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{isAr ? 'تحويل فوري P2P' : 'Transfert Instantané'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {selectedItem && (
          <div className={`lg:col-span-4 p-8 rounded-[2.5rem] border shadow-2xl flex flex-col justify-between ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
             <div>
                <div className="flex items-center gap-4 mb-8">
                   <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-3xl shadow-inner ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
                      {getCurrencyAsset(selectedItem.id).logoSvg ? getCurrencyAsset(selectedItem.id).logoSvg : <span className="flag-emoji">{getCurrencyAsset(selectedItem.id).flag}</span>}
                   </div>
                   <div>
                      <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedItem.name}</h3>
                      <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">{selectedItem.popularUse.split(',')[0]}</p>
                   </div>
                </div>

                <div className="space-y-4 mb-8">
                   <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-1">{isAr ? 'نصيحة أمان' : 'Security Tip'}</p>
                      <div className="flex gap-3">
                         <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                         <p className="text-[10px] text-slate-400 leading-relaxed">{isAr ? 'استخدم دائماً منصات P2P الموثوقة مع نظام الضمان.' : 'Use trusted P2P platforms with escrow protection.'}</p>
                      </div>
                   </div>
                </div>
             </div>

             <button
               onClick={() => onSelectForConvert(selectedItem.currency.includes('USDT') ? 'USD' : selectedItem.currency.split(' ')[0])}
               className="w-full py-4 rounded-2xl bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-[0.2em] transition-all hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
             >
               {t.btnCalculate}
             </button>
          </div>
        )}
      </div>
    </section>
  );
};
