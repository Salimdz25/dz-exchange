import React from 'react';
import { BellRing, X } from 'lucide-react';
import { ApiResponse, RateAlert } from '../types';
import { Language, translations } from '../utils/translations';
import { getCurrencyAsset } from '../utils/currencyAssets';
import { getRateForAlert } from '../utils/rateUtils';

interface RateAlertBannerProps {
  data: ApiResponse | null;
  triggeredAlerts: RateAlert[];
  onDismissAlert: (id: string) => void;
  onOpenAlertsModal: () => void;
  language: Language;
}

export const RateAlertBanner: React.FC<RateAlertBannerProps> = ({
  data,
  triggeredAlerts,
  onDismissAlert,
  onOpenAlertsModal,
  language,
}) => {
  if (triggeredAlerts.length === 0 || !data) return null;

  const t = translations[language];
  const isAr = language === 'ar';
  const daUnit = isAr ? 'دج' : 'DA';

  const getMarketName = (market: string) => {
    if (market === 'parallel') return isAr ? 'في السكوار' : 'au Square';
    if (market === 'virtual') return isAr ? 'في P2P' : 'en P2P';
    return isAr ? 'رسمي' : 'Officiel';
  };

  return (
    <div className="mb-8 space-y-3">
      {triggeredAlerts.map((alert) => {
        const asset = getCurrencyAsset(alert.currencyCode);
        return (
          <div
            key={alert.id}
            className="relative rounded-3xl bg-emerald-500 text-slate-950 p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-inner">
                {asset.flag}
              </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <BellRing className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{t.alertBannerHitTitle}</span>
              </div>
              <h4 className="text-sm font-bold leading-tight opacity-80">
                {alert.currencyCode} : {alert.targetRate.toFixed(1)} {daUnit} atteint !
              </h4>
              <p className="mt-1.5 flex items-baseline gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider opacity-70">{isAr ? 'السعر الحالي :' : 'Prix actuel :'}</span>
                <span className="text-2xl font-black font-mono tracking-tighter">{getRateForAlert(data!, alert.currencyCode, alert.marketType).toFixed(1)} <span className="text-xs font-normal opacity-70">{daUnit}</span></span>
              </p>
            </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAlertsModal}
                className="px-6 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-black uppercase tracking-widest active:scale-95 transition-all"
              >
                {t.alertBannerManageBtn}
              </button>

              <button
                onClick={() => onDismissAlert(alert.id)}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
