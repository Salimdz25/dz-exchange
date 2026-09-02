import React from 'react';
import { X, ShieldCheck, Info, FileText } from 'lucide-react';
import { Language } from '../utils/translations';

interface AboutAndPrivacyModalProps {
  type: 'about' | 'privacy' | 'methodology' | null;
  onClose: () => void;
  language: Language;
  theme: 'light' | 'dark';
}

export const AboutAndPrivacyModal: React.FC<AboutAndPrivacyModalProps> = ({
  type,
  onClose,
  language,
  theme,
}) => {
  if (!type) return null;

  const isAr = language === 'ar';
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl transition-all max-h-[85vh] overflow-y-auto ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/20 mb-4">
          <div className="flex items-center gap-2">
            {type === 'about' && <Info className="w-5 h-5 text-emerald-500" />}
            {type === 'privacy' && <ShieldCheck className="w-5 h-5 text-emerald-500" />}
            {type === 'methodology' && <FileText className="w-5 h-5 text-emerald-500" />}
            <h3 className="font-black text-sm uppercase tracking-tight">
              {type === 'about' && (isAr ? 'حول التطبيق' : 'À propos de DZ EXCHANGE')}
              {type === 'privacy' && (isAr ? 'سياسة الخصوصية' : 'Politique de Confidentialité')}
              {type === 'methodology' && (isAr ? 'منهجية جمع الأسعار' : 'Méthodologie & Sources')}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-500/10 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs leading-relaxed text-slate-500 font-medium">
          {type === 'about' && (
            <>
              <p>
                {isAr
                  ? 'DZ EXCHANGE هو تطبيق مستقل يهدف إلى تقديم متابعة دقيقة وشفافة لأسعار صرف الدينار الجزائري (DZD) مقابل العملات الأجنبية الرئيسية، الذهب، والعملات الرقمية.'
                  : 'DZ EXCHANGE est une application indépendante dédiée au suivi en temps réel des cours du Dinar Algérien (DZD) sur le marché parallèle (Square Port-Saïd), officiel (Banque d\'Algérie), numérique (P2P) et l\'or.'}
              </p>
              <p className="font-bold text-emerald-500">
                Version : 2.5.0 (PWA) • Algérie
              </p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <p>
                {isAr
                  ? 'نحن نحترم خصوصيتك بالكامل. لا نقوم بجمع أو حفظ أي بيانات شخصية أو رقم هاتف على خوادمنا. جميع التنبيهات والتفضيلات تنشأ وتُحفظ محلياً على جهازك.'
                  : 'Nous respectons votre vie privée. Aucune donnée personnelle, nom ou numéro de téléphone n\'est collecté ou revendu. Toutes vos configurations d\'alertes et préférences de thème restent stockées localement sur votre appareil.'}
              </p>
            </>
          )}

          {type === 'methodology' && (
            <>
              <p>
                {isAr
                  ? 'يتم تحديث الأسعار بانتظام بناءً على التجميع الميداني والملاحظات في سوق السكوار بورسعيد، البورصات الرسمية، ومنصات التداول الرقمي P2P.'
                  : 'Les cours sont consolidés régulièrement à partir d\'observations du marché parallèle (Square Port-Saïd), des publications officielles et des transactions P2P observées sur les plateformes virtuelles.'}
              </p>
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-widest cursor-pointer shadow-md"
        >
          {isAr ? 'إغلاق' : 'Fermer'}
        </button>
      </div>
    </div>
  );
};
