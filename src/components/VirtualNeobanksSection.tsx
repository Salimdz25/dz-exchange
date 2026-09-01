import React, { useState } from 'react';
import { CreditCard, Zap, ShieldCheck, AlertCircle, ShoppingBag, Globe2, ArrowRight, ExternalLink, HelpCircle } from 'lucide-react';
import { VirtualNeobankItem } from '../types';
import { formatCentimesAlgerien, formatNumber } from '../utils/formatters';
import { Language, translations } from '../utils/translations';

interface VirtualNeobanksSectionProps {
  virtualRates: VirtualNeobankItem[];
  onSelectForConvert: (currencyCode: string) => void;
  language: Language;
}

export const VirtualNeobanksSection: React.FC<VirtualNeobanksSectionProps> = ({
  virtualRates,
  onSelectForConvert,
  language,
}) => {
  const t = translations[language];
  const isAr = language === 'ar';
  const daUnit = isAr ? 'دج' : 'DA';

  const [selectedItem, setSelectedItem] = useState<VirtualNeobankItem>(virtualRates[0]);
  const [simAmount, setSimAmount] = useState<number>(50);

  const buyTotalDzd = simAmount * (selectedItem?.buyDzd || 240);

  return (
    <section id="virtual-neobanks-section" className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-1">
            <CreditCard className="w-3.5 h-3.5" />
            <span>{isAr ? 'البنوك الرقمية والأجنبية في الجزائر' : 'Néobanques & Banques Étrangères en Algérie'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {t.virtualSectionTitle}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md">
          {t.virtualSectionSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Cards list */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {virtualRates.map((item) => {
            const isSelected = selectedItem.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`rounded-2xl p-4.5 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{item.logo}</span>
                      <div>
                        <h3 className="text-sm font-bold text-white">{item.name}</h3>
                        <span className="text-[11px] text-slate-400">{item.popularUse}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                      {item.currency} ({item.currencySymbol})
                    </span>
                  </div>

                  <div className="space-y-1.5 my-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{isAr ? 'سعر الشحن (للزبون) :' : 'Recharge / Achat :'}</span>
                      <strong className="text-cyan-400 font-bold text-sm">{item.buyDzd.toFixed(1)} {daUnit}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{isAr ? 'سعر السحب (بيع) :' : 'Retrait / Vente :'}</span>
                      <span className="text-slate-300">{item.sellDzd.toFixed(1)} {daUnit}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{item.paymentMethods.join(' • ')}</span>
                  </span>
                  <span className="text-cyan-400 font-semibold">{isAr ? 'اختيار' : 'Sélectionner'} →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: Simulator & Card info */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedItem.logo}</span>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{selectedItem.name}</span>
                    <span className="text-xs font-normal text-slate-400">({selectedItem.currency})</span>
                  </h3>
                  <p className="text-xs text-cyan-400">{selectedItem.popularUse}</p>
                </div>
              </div>
            </div>

            {/* Quick Recharge Calculator */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isAr ? `محاكاة شحن رصيد ${selectedItem.name} :` : `Simuler une recharge ${selectedItem.name} :`}
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[20, 50, 100, 200].map((v) => (
                  <button
                    key={v}
                    onClick={() => setSimAmount(v)}
                    className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      simAmount === v
                        ? 'bg-cyan-600 text-white shadow'
                        : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {v} {selectedItem.currencySymbol}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 my-3">
                <div className="text-xs text-slate-300 mb-1">
                  {isAr ? `التكلفة بالدينار لشحن ${simAmount} ${selectedItem.currencySymbol} عبر بريدي موب :` : `Coût en Dinars pour recevoir ${simAmount} ${selectedItem.currencySymbol} via BaridiMob :`}
                </div>
                <div className="text-2xl font-black text-cyan-400 font-mono">
                  {buyTotalDzd.toLocaleString(isAr ? 'ar-DZ' : 'fr-DZ')} {daUnit}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {formatCentimesAlgerien(buyTotalDzd, language)}
                </div>
              </div>
            </div>

            {/* Practical notes */}
            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? 'نصائح المعاملات الرقمية الآمنة :' : 'Précautions P2P & BaridiMob :'}</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {isAr
                  ? 'لا ترسل الأموال إلا بعد التأكد من اسم الحساب ومطابقته، واستخدم دائماً منصات P2P الموثوقة (مثل Binance) مع تفعيل نظام الضمان Escrow.'
                  : 'N\'effectuez des virements BaridiMob qu\'avec des tiers de confiance ou via le système séquestre (Escrow) de Binance P2P. Vérifiez le nom exact du titulaire.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectForConvert(selectedItem.currency === 'USDT' ? 'USD' : selectedItem.currency)}
            className="mt-4 w-full py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-950/50 active:scale-95"
          >
            <span>{isAr ? `تحويل ${selectedItem.currency} في المحاكي` : `Calculer en détails avec ${selectedItem.currency}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
