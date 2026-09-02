import React, { useState } from 'react';
import { X, Copy, Check, Share2, Send, MessageCircle } from 'lucide-react';
import { Language, translations } from '../utils/translations';

interface ShareSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  shareText: string;
  language: Language;
  theme: 'light' | 'dark';
}

export const ShareSheetModal: React.FC<ShareSheetModalProps> = ({
  isOpen,
  onClose,
  title,
  shareText,
  language,
  theme,
}) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const t = translations[language];
  const isAr = language === 'ar';
  const isDark = theme === 'dark';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
      <div className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl border p-5 shadow-2xl transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/20">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-500" />
            <h3 className="font-black text-sm uppercase tracking-tight">{title || (isAr ? 'مشاركة أسعار الصرف' : 'Partager le cours')}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-500/10 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`my-4 p-3.5 rounded-2xl font-mono text-xs whitespace-pre-wrap leading-relaxed border ${
          isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          {shareText}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleWhatsApp}
            className="py-3 px-4 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleTelegram}
            className="py-3 px-4 rounded-xl bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/30 text-[#229ED9] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Telegram</span>
          </button>

          <button
            onClick={handleCopy}
            className="col-span-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (isAr ? 'تم النسخ !' : 'Copié !') : (isAr ? 'نسخ النص' : 'Copier le texte')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
