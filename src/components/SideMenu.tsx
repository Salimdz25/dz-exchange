import React from 'react';
import {
  X,
  ListFilter,
  ArrowRightLeft,
  Coins,
  History,
  Bell,
  Newspaper,
  Languages,
  Sun,
  Moon,
  Download,
  Info,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { Language, translations } from '../utils/translations';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onToggleLanguage: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenModal: (modalName: 'converter' | 'gold_calc' | 'history' | 'alerts' | 'news' | 'about' | 'privacy') => void;
  onInstallPwa?: () => void;
  canInstallPwa?: boolean;
}

export const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  language,
  onToggleLanguage,
  theme,
  onToggleTheme,
  onOpenModal,
  onInstallPwa,
  canInstallPwa,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const isAr = language === 'ar';
  const isDark = theme === 'dark';

  const menuItems = [
    { id: 'rates', labelFr: 'Taux de change', labelAr: 'أسعار الصرف', icon: ListFilter, action: () => onClose() },
    { id: 'converter', labelFr: 'Convertisseur', labelAr: 'محول العملات', icon: ArrowRightLeft, action: () => { onClose(); onOpenModal('converter'); } },
    { id: 'gold_calc', labelFr: 'Calculateur d\'Or', labelAr: 'حاسبة الذهب', icon: Coins, action: () => { onClose(); onOpenModal('gold_calc'); } },
    { id: 'history', labelFr: 'Historique', labelAr: 'السجل والتطور', icon: History, action: () => { onClose(); onOpenModal('history'); } },
    { id: 'alerts', labelFr: 'Alertes & Notifications', labelAr: 'التنبيهات والإشعارات', icon: Bell, action: () => { onClose(); onOpenModal('alerts'); } },
    { id: 'news', labelFr: 'Actualités & Guide', labelAr: 'الأخبار والدليل', icon: Newspaper, action: () => { onClose(); onOpenModal('news'); } },
  ];

  return (
    <div className="fixed inset-0 z-50 flex animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Drawer Container */}
      <div className={`relative w-80 max-w-[85vw] h-full shadow-2xl flex flex-col justify-between z-10 transition-transform ${
        isDark ? 'bg-slate-900 border-r border-slate-800 text-white' : 'bg-white border-r border-slate-200 text-slate-900'
      }`}>
        {/* Drawer Header */}
        <div>
          <div className={`p-5 border-b flex items-center justify-between ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-100'
          }`}>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="DZ EXCHANGE" className="w-9 h-9 rounded-xl shadow-md" onError={(e) => (e.currentTarget.style.display = 'none')} />
              <div>
                <h2 className="font-black text-base tracking-tight leading-none">
                  DZ <span className="text-emerald-500">EXCHANGE</span>
                </h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                  {isAr ? 'أسعار الصرف الجزائر' : 'Taux de Change Algérie'}
                </p>
              </div>
            </div>

            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-500/10 text-slate-400 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`w-full py-3 px-4 rounded-2xl flex items-center gap-3.5 text-xs font-bold transition-all cursor-pointer ${
                    item.id === 'rates'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="flex-1 text-left rtl:text-right">{isAr ? item.labelAr : item.labelFr}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Drawer Actions */}
        <div className={`p-4 border-t space-y-2 ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/50'}`}>
          {/* Quick Toggles */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onToggleLanguage}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-xs'
              }`}
            >
              <Languages className="w-4 h-4 text-emerald-500" />
              <span>{isAr ? 'Français' : 'العربية'}</span>
            </button>

            <button
              onClick={onToggleTheme}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                isDark ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-white border-slate-200 text-slate-800 shadow-xs'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{isDark ? 'Clair' : 'Sombre'}</span>
            </button>
          </div>

          {canInstallPwa && onInstallPwa && (
            <button
              onClick={() => { onClose(); onInstallPwa(); }}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{isAr ? 'تثبيت التطبيق PWA' : 'Installer l\'application'}</span>
            </button>
          )}

          <div className="flex items-center justify-around pt-2 text-[10px] font-bold text-slate-400">
            <button onClick={() => { onClose(); onOpenModal('privacy'); }} className="hover:underline cursor-pointer">
              {isAr ? 'الخصوصية' : 'Confidentialité'}
            </button>
            <span>•</span>
            <button onClick={() => { onClose(); onOpenModal('about'); }} className="hover:underline cursor-pointer">
              {isAr ? 'حول' : 'À propos'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
