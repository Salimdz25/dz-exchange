import React from 'react';
import { BellRing, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { RateAlert } from '../types';
import { Language, translations } from '../utils/translations';

interface RateAlertBannerProps {
  triggeredAlerts: RateAlert[];
  onDismissAlert: (id: string) => void;
  onOpenAlertsModal: () => void;
  language: Language;
}

export const RateAlertBanner: React.FC<RateAlertBannerProps> = ({
  triggeredAlerts,
  onDismissAlert,
  onOpenAlertsModal,
  language,
}) => {
  if (triggeredAlerts.length === 0) return null;

  const t = translations[language];
  const isAr = language === 'ar';
  const daUnit = isAr ? 'دج' : 'DA';

  const getFlagForCode = (code: string) => {
    switch (code) {
      case 'EUR': return '🇪🇺';
      case 'USD': return '🇺🇸';
      case 'USDT': return '🪙';
      case 'WISE_EUR': return '🇪🇺';
      case 'CAD': return '🇨🇦';
      case 'GBP': return '🇬🇧';
      case 'SAR': return '🇸🇦';
      case 'AED': return '🇦🇪';
      default: return '🇩🇿';
    }
  };

  const getMarketName = (market: string) => {
    if (market === 'parallel') return isAr ? 'في سكوار بورسعيد' : 'au Square Port-Saïd';
    if (market === 'virtual') return isAr ? 'في السوق الرقمي P2P' : 'en Virtuel P2P';
    return isAr ? 'لدى البنك الرسمي' : 'à la Banque Officielle';
  };

  return (
    <div className="mb-6 space-y-2">
      {triggeredAlerts.map((alert) => (
        <div
          key={alert.id}
          className="relative rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-2 border-emerald-500/80 p-4 shadow-xl shadow-emerald-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn"
        >
          {/* Pulsing indicator with flag */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500 text-slate-950 font-bold shrink-0 text-xl shadow-md">
              <span>{getFlagForCode(alert.currencyCode)}</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <BellRing className="w-3.5 h-3.5" />
                  <span>{t.alertBannerHitTitle}</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/80 font-mono text-emerald-300 border border-emerald-700/50">
                  {getFlagForCode(alert.currencyCode)} {alert.currencyCode === 'WISE_EUR' ? 'Wise EUR (€)' : alert.currencyCode} / DZD
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-white mt-0.5">
                {t.alertBannerHitDesc} {alert.targetRate.toFixed(1)} {daUnit} {getMarketName(alert.marketType)} !
              </h4>
              {alert.note && (
                <p className="text-xs text-slate-300 mt-0.5">
                  📝 {isAr ? 'ملاحظة :' : 'Note :'} <em>{alert.note}</em>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={onOpenAlertsModal}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95 shadow"
            >
              <span>{t.alertBannerManageBtn}</span>
              {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => onDismissAlert(alert.id)}
              title="Fermer cette notification"
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
