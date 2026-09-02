import React from 'react';
import { Language } from '../utils/translations';

export type MainTabType = 'parallel' | 'official' | 'digital' | 'gold';

interface MainTabsProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  language: Language;
  theme: 'light' | 'dark';
}

export const MainTabs: React.FC<MainTabsProps> = ({
  activeTab,
  onTabChange,
  language,
  theme,
}) => {
  const isAr = language === 'ar';
  const isDark = theme === 'dark';

  const tabs: { id: MainTabType; fr: string; ar: string }[] = [
    { id: 'parallel', fr: 'Parallèle', ar: 'الموازي' },
    { id: 'official', fr: 'Officiel', ar: 'الرسمي' },
    { id: 'digital', fr: 'Digital', ar: 'الرقمي' },
    { id: 'gold', fr: 'Or', ar: 'الذهب' },
  ];

  return (
    <div className={`w-full border-b sticky top-14 z-30 transition-colors duration-300 ${
      isDark ? 'bg-slate-950/95 border-slate-800' : 'bg-white/95 border-slate-200'
    } backdrop-blur-md`}>
      <div className="max-w-xl mx-auto grid grid-cols-4 text-center px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-3 px-1 text-xs sm:text-sm font-extrabold transition-all relative cursor-pointer border-b-2 ${
                isActive
                  ? 'border-emerald-500 text-emerald-500'
                  : isDark
                  ? 'border-transparent text-slate-400 hover:text-slate-200'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{isAr ? tab.ar : tab.fr}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
