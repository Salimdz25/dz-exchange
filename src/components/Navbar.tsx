import React from 'react';
import { Menu, RefreshCw } from 'lucide-react';
import { Language } from '../utils/translations';

interface NavbarProps {
  isLoading: boolean;
  theme: 'light' | 'dark';
  language: Language;
  onOpenMenu: () => void;
  onRefresh: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isLoading,
  theme,
  language,
  onOpenMenu,
  onRefresh,
}) => {
  const isAr = language === 'ar';
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 h-14 border-b backdrop-blur-md transition-colors duration-300 ${
      isDark ? 'bg-slate-950/90 border-slate-800/80 text-white' : 'bg-white/90 border-slate-200/80 text-slate-900'
    } shadow-xs`}>
      <div className="max-w-xl mx-auto h-full px-4 flex items-center justify-between">
        {/* Hamburger Menu (Start side) */}
        <button
          onClick={onOpenMenu}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
          }`}
          title={isAr ? 'القائمة' : 'Menu'}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center: Brand */}
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="DZ EXCHANGE"
            className="w-9 h-9 rounded-xl shadow-xs object-cover"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <h1 className="text-lg sm:text-xl font-black tracking-tight leading-none">
            DZ <span className="text-emerald-500">EXCHANGE</span>
          </h1>
        </div>

        {/* End side: Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
          title={isAr ? 'تحديث' : 'Actualiser'}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </header>
  );
};
