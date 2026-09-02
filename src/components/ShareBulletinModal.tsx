import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { ApiResponse } from '../types';
import { formatCentimesAlgerien } from '../utils/formatters';
import { Language, translations } from '../utils/translations';
import { getCurrencyAsset } from '../utils/currencyAssets';

interface ShareBulletinModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ApiResponse | null;
  language: Language;
}

export const ShareBulletinModal: React.FC<ShareBulletinModalProps> = ({
  isOpen,
  onClose,
  data,
  language,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !data) return null;

  const t = translations[language];
  const isAr = language === 'ar';
  const daUnit = isAr ? 'دج' : 'DA';

  const eurCurr = data.currencies.find(c => c.code === 'EUR');
  const usdCurr = data.currencies.find(c => c.code === 'USD');
  const cadCurr = data.currencies.find(c => c.code === 'CAD');
  const gbpCurr = data.currencies.find(c => c.code === 'GBP');
  const sarCurr = data.currencies.find(c => c.code === 'SAR');
  const aedCurr = data.currencies.find(c => c.code === 'AED');

  const usdtItem = data.virtualRates.find(v => v.id === 'usdt_binance');
  const wiseItem = data.virtualRates.find(v => v.id === 'wise_eur');
  const payseraItem = data.virtualRates.find(v => v.id === 'paysera_eur');

  const todayStr = new Date().toLocaleDateString(isAr ? 'ar-DZ' : 'fr-DZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const bulletinText = isAr
    ? `🇩🇿 النشرة اليومية لأسعار صرف الدينار الجزائري (DZD)
📅 التاريخ : ${todayStr}
🕒 التوقيت : ${data.lastUpdatedFormatted}

━━━━━━━━━━━━━━━━━━━━━
🏙️ الركيزة 1 : السوق الموازي (السكوار)
${getCurrencyAsset('EUR').flag} 100 يورو EURO :
   • بيع : ${((eurCurr?.parallel?.sell || 276.0) * 100).toLocaleString('ar-DZ')} دج
   • شراء : ${((eurCurr?.parallel?.buy || 274.0) * 100).toLocaleString('ar-DZ')} دج

${getCurrencyAsset('USD').flag} 100 دولار DOLLAR :
   • بيع : ${((usdCurr?.parallel?.sell || 238.0) * 100).toLocaleString('ar-DZ')} دج
   • شراء : ${((usdCurr?.parallel?.buy || 235.0) * 100).toLocaleString('ar-DZ')} دج

━━━━━━━━━━━━━━━━━━━━━
💳 الركيزة 2 : العملات الرقمية (بريدي موب)
${getCurrencyAsset('USDT').flag} 1 USDT (Binance) : ${data.stats.usdtP2pRate.toFixed(1)} دج
${getCurrencyAsset('WISE_EUR').flag} 1 EUR (Wise) : ${data.stats.wiseEurRate.toFixed(1)} دج

━━━━━━━━━━━━━━━━━━━━━
🏛️ الركيزة 3 : بنك الجزائر (رسمي)
${getCurrencyAsset('EUR').flag} 1 يورو EUR : ${data.stats.officialEurToDzd.toFixed(2)} دج
📊 الفارق : +${data.stats.gapEurPercent}%`
    : `🇩🇿 BULLETIN DES TAUX DE CHANGE (DZD)
📅 Date : ${todayStr}
🕒 Heure : ${data.lastUpdatedFormatted}

━━━━━━━━━━━━━━━━━━━━━
🏙️ PILIER 1 : MARCHÉ PARALLÈLE (SQUARE)
${getCurrencyAsset('EUR').flag} 100 EURO (€) :
   • Vente : ${((eurCurr?.parallel?.sell || 276.0) * 100).toLocaleString('fr-DZ')} DA
   • Achat : ${((eurCurr?.parallel?.buy || 274.0) * 100).toLocaleString('fr-DZ')} DA

${getCurrencyAsset('USD').flag} 100 DOLLAR ($) :
   • Vente : ${((usdCurr?.parallel?.sell || 238.0) * 100).toLocaleString('fr-DZ')} DA
   • Achat : ${((usdCurr?.parallel?.buy || 235.0) * 100).toLocaleString('fr-DZ')} DA

━━━━━━━━━━━━━━━━━━━━━
💳 PILIER 2 : DEVISES VIRTUELLES (P2P)
${getCurrencyAsset('USDT').flag} 1 USDT (Binance) : ${data.stats.usdtP2pRate.toFixed(1)} DA
${getCurrencyAsset('WISE_EUR').flag} 1 EUR (Wise) : ${data.stats.wiseEurRate.toFixed(1)} DA

━━━━━━━━━━━━━━━━━━━━━
🏛️ PILIER 3 : BANQUE D'ALGÉRIE (OFFICIEL)
${getCurrencyAsset('EUR').flag} 1 EUR : ${data.stats.officialEurToDzd.toFixed(2)} DA
📊 Écart Square : +${data.stats.gapEurPercent}%`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bulletinText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(bulletinText)}`;
    window.open(url, '_blank');
  };

  const handleShareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(bulletinText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-lg font-bold text-white">{t.bulletinModalTitle}</h3>
              <p className="text-xs text-slate-400">{t.bulletinModalSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text Preview */}
        <div className="my-4 overflow-y-auto rounded-2xl bg-slate-950 p-4 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
          {bulletinText}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-950/50"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
            <span>{copied ? t.bulletinCopiedBtn : t.bulletinCopyBtn}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="px-4 py-2.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleShareTelegram}
            className="px-4 py-2.5 rounded-xl bg-[#229ED9]/20 hover:bg-[#229ED9]/30 border border-[#229ED9]/40 text-[#229ED9] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Telegram</span>
          </button>
        </div>
      </div>
    </div>
  );
};
