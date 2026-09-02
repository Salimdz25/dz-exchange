import React from 'react';
import { X, HelpCircle, ArrowRightLeft } from 'lucide-react';
import { Language } from '../utils/translations';

interface InfoDialogModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  theme: 'light' | 'dark';
}

export const InfoDialogModal: React.FC<InfoDialogModalProps> = ({
  isOpen,
  onClose,
  language,
  theme,
}) => {
  if (!isOpen) return null;

  const isAr = language === 'ar';
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/20 mb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-500" />
            <h3 className="font-black text-sm uppercase tracking-tight">
              {isAr ? 'مفهوم أسعار الشراء والبيع' : 'Achat vs Vente (Explication)'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-500/10 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs leading-relaxed">
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <h4 className="font-bold text-emerald-500 mb-1 flex items-center gap-1.5">
              <span>Achat (الشراء)</span>
            </h4>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              {isAr
                ? 'الشراء: السعر الذي يشتري به الصراف عملتك الأجنبية مقابل الدينار (أي عندما تبيع أنت يورو أو دولار للصراف).'
                : 'Achat : Prix auquel le cambiste achète votre devise étrangère contre des Dinars (lorsque vous vendez vos Euros/Dollars au cambiste).'}
            </p>
          </div>

          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <h4 className="font-bold text-blue-500 mb-1 flex items-center gap-1.5">
              <span>Vente (البيع)</span>
            </h4>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              {isAr
                ? 'البيع: السعر الذي يبيع لك به الصراف العملة الأجنبية مقابل الدينار (أي عندما تشتري أنت يورو أو دولار من الصراف).'
                : 'Vente : Prix auquel le cambiste vous vend la devise étrangère contre des Dinars (lorsque vous achetez des Euros/Dollars au cambiste).'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-widest cursor-pointer shadow-md"
        >
          {isAr ? 'حسناً، فهمت' : 'J\'ai compris'}
        </button>
      </div>
    </div>
  );
};
