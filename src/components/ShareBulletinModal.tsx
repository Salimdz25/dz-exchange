import React, { useState } from 'react';
import { X, Copy, Check, Share2, Sparkles, Send, Download } from 'lucide-react';
import { ApiResponse } from '../types';
import { formatCentimesAlgerien } from '../utils/formatters';
import { Language, translations } from '../utils/translations';

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
🏙️ الركيزة 1 : السوق الموازي (سكوار بورسعيد)
🇪🇺 100 يورو EURO (€) :
   • بيع (للزبون) : ${((eurCurr?.parallel?.sell || 252.5) * 100).toLocaleString('ar-DZ')} دج (${formatCentimesAlgerien((eurCurr?.parallel?.sell || 252.5) * 100, 'ar')})
   • شراء (من الزبون) : ${((eurCurr?.parallel?.buy || 250.0) * 100).toLocaleString('ar-DZ')} دج

🇺🇸 100 دولار DOLLAR ($) :
   • بيع (للزبون) : ${((usdCurr?.parallel?.sell || 236.5) * 100).toLocaleString('ar-DZ')} دج (${formatCentimesAlgerien((usdCurr?.parallel?.sell || 236.5) * 100, 'ar')})
   • شراء (من الزبون) : ${((usdCurr?.parallel?.buy || 234.0) * 100).toLocaleString('ar-DZ')} دج

🇨🇦 100 دولار كندي CAD : ${((cadCurr?.parallel?.sell || 171.0) * 100).toLocaleString('ar-DZ')} دج
🇬🇧 100 باوند GBP : ${((gbpCurr?.parallel?.sell || 296.0) * 100).toLocaleString('ar-DZ')} دج
🇸🇦 100 ريال سعودي SAR (عمرة/حج) : ${((sarCurr?.parallel?.sell || 63.5) * 100).toLocaleString('ar-DZ')} دج
🇦🇪 100 درهم إماراتي AED : ${((aedCurr?.parallel?.sell || 65.0) * 100).toLocaleString('ar-DZ')} دج

━━━━━━━━━━━━━━━━━━━━━
💳 الركيزة 2 : العملات الرقمية والنئوبنوك (بريدي موب)
🪙 1 USDT (بينانس P2P) : ${usdtItem?.buyDzd.toFixed(1) || '240.5'} دج
🇪🇺 1 يورو وايز Wise (€) : ${wiseItem?.buyDzd.toFixed(1) || '248.5'} دج
🇪🇺 1 يورو بايسيرا Paysera (€) : ${payseraItem?.buyDzd.toFixed(1) || '247.0'} دج

━━━━━━━━━━━━━━━━━━━━━
🏛️ الركيزة 3 : بنك الجزائر (السعر الرسمي بين البنوك)
🇪🇺 1 يورو EUR : ${eurCurr?.official.mid?.toFixed(2) || '145.50'} دج
🇺🇸 1 دولار USD : ${usdCurr?.official.mid?.toFixed(2) || '133.80'} دج
📊 الفارق بين السكوار والرسمي : +${data.stats.gapEurPercent}%

📲 تابعوا التحديثات المباشرة لحظة بلحظة على DinarDZ Exchange Tracker`
    : `🇩🇿 BULLETIN DES TAUX DE CHANGE DINAR (DZD)
📅 Date : ${todayStr}
🕒 Heure : ${data.lastUpdatedFormatted}

━━━━━━━━━━━━━━━━━━━━━
🏙️ PILIER 1 : MARCHÉ PARALLÈLE (SQUARE PORT-SAÏD)
🇪🇺 100 EURO (€) :
   • Vente (Client) : ${((eurCurr?.parallel?.sell || 252.5) * 100).toLocaleString('fr-DZ')} DA (${formatCentimesAlgerien((eurCurr?.parallel?.sell || 252.5) * 100, 'fr')})
   • Achat (Cambiste) : ${((eurCurr?.parallel?.buy || 250.0) * 100).toLocaleString('fr-DZ')} DA

🇺🇸 100 DOLLAR ($) :
   • Vente (Client) : ${((usdCurr?.parallel?.sell || 236.5) * 100).toLocaleString('fr-DZ')} DA (${formatCentimesAlgerien((usdCurr?.parallel?.sell || 236.5) * 100, 'fr')})
   • Achat (Cambiste) : ${((usdCurr?.parallel?.buy || 234.0) * 100).toLocaleString('fr-DZ')} DA

🇨🇦 100 CAD : ${((cadCurr?.parallel?.sell || 171.0) * 100).toLocaleString('fr-DZ')} DA
🇬🇧 100 GBP : ${((gbpCurr?.parallel?.sell || 296.0) * 100).toLocaleString('fr-DZ')} DA
🇸🇦 100 SAR (Omra/Hadj) : ${((sarCurr?.parallel?.sell || 63.5) * 100).toLocaleString('fr-DZ')} DA
🇦🇪 100 AED (Dubaï) : ${((aedCurr?.parallel?.sell || 65.0) * 100).toLocaleString('fr-DZ')} DA

━━━━━━━━━━━━━━━━━━━━━
💳 PILIER 2 : DEVISES VIRTUELLES & NÉOBANQUES (BARIDIMOB)
🪙 1 USDT (Binance P2P) : ${usdtItem?.buyDzd.toFixed(1) || '240.5'} DA
🇪🇺 1 EURO Wise (€) : ${wiseItem?.buyDzd.toFixed(1) || '248.5'} DA
🇪🇺 1 EURO Paysera (€) : ${payseraItem?.buyDzd.toFixed(1) || '247.0'} DA

━━━━━━━━━━━━━━━━━━━━━
🏛️ PILIER 3 : BANQUE D'ALGÉRIE (OFFICIEL INTERBANCAIRE)
🇪🇺 1 EUR : ${eurCurr?.official.mid?.toFixed(2) || '145.50'} DA
🇺🇸 1 USD : ${usdCurr?.official.mid?.toFixed(2) || '133.80'} DA
📊 Écart Square vs Officiel : +${data.stats.gapEurPercent}%

📲 Suivez les cours en direct sur DinarDZ Exchange Tracker`;

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
