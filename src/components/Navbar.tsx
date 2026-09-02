import { RefreshCw, Share2, Clock, Bell, LayoutGrid, Languages, Activity, Sun, Moon } from 'lucide-react';
import { ApiResponse } from '../types';
import { Language, translations } from '../utils/translations';
import { getCurrencyAsset } from '../utils/currencyAssets';

interface NavbarProps {
  data: ApiResponse | null;
  isLoading: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onRefresh: () => void;
  onOpenShareModal: () => void;
  onScrollToConverter: () => void;
  onOpenAlertsModal: () => void;
  alertsCount: number;
  triggeredCount: number;
  viewMode: 'simple' | 'detailed';
  onToggleViewMode: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  data,
  isLoading,
  theme,
  onToggleTheme,
  onRefresh,
  onOpenShareModal,
  onScrollToConverter,
  onOpenAlertsModal,
  alertsCount,
  triggeredCount,
  viewMode,
  onToggleViewMode,
  language,
  onToggleLanguage,
}) => {
  const t = translations[language];
  const isAr = language === 'ar';

  const eur = getCurrencyAsset('EUR');
  const usd = getCurrencyAsset('USD');
  const usdt = getCurrencyAsset('USDT');

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 ${
      theme === 'dark' ? 'bg-slate-950/80 border-slate-900' : 'bg-white/80 border-slate-200'
    } shadow-2xl`}>
      {/* Ultra-minimal Live Ticker */}
      <div className={`border-b px-4 py-1.5 overflow-hidden ${
        theme === 'dark' ? 'bg-slate-900/50 border-slate-900' : 'bg-slate-100 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] sm:text-xs text-slate-400">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar whitespace-nowrap">
            <div className="flex items-center gap-1.5 text-emerald-500 font-bold shrink-0">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="uppercase tracking-tighter">{t.liveBadge}</span>
            </div>

            {data && (
              <div className="flex items-center gap-4">
                <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span className="flag-emoji">{eur.flag}</span>
                  <span className="font-mono">1€ = <span className="text-emerald-500 font-bold">{data.stats.parallelEurSell?.toFixed(1)}</span></span>
                </span>
                <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span className="flag-emoji">{usd.flag}</span>
                  <span className="font-mono">1$ = <span className="text-emerald-500 font-bold">{data.stats.parallelUsdSell?.toFixed(1)}</span></span>
                </span>
                <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span className="flag-emoji">{usdt.flag}</span>
                  <span className="font-mono">USDT = <span className="text-cyan-500 font-bold">{data.stats.usdtP2pRate?.toFixed(1)}</span></span>
                </span>
                <div className={`h-3 w-px ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />
                <span className="flex items-center gap-1 text-amber-600">
                  <Activity className="w-3 h-3" />
                  <span className="font-bold">+{data.stats.gapEurPercent}%</span>
                </span>
              </div>
            )}
          </div>

          <div className={`hidden md:flex items-center gap-2 opacity-60 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            <Clock className="w-3 h-3" />
            <span>{data?.lastUpdatedFormatted}</span>
          </div>
        </div>
      </div>

      {/* Clean Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Simplified Brand */}
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="DZ EXCHANGE" className="w-9 h-9 rounded-xl shadow-lg border border-slate-200/10" onError={(e) => (e.currentTarget.style.display = 'none')} />
          <div>
            <h1 className={`text-lg font-black tracking-tight leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              DZ <span className="text-emerald-500">EXCHANGE</span>
            </h1>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.appSubtitle.split('•')[0]}</span>
          </div>
        </div>

        {/* Dynamic Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl border transition-all active:scale-95 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
            title={theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Language toggle: Icon only on small screens */}
          <button
            onClick={onToggleLanguage}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all active:scale-95"
            title={t.switchLangTitle}
          >
            <div className="flex items-center gap-2 text-xs font-bold">
              <Languages className="w-4 h-4 text-emerald-500" />
              <span className="hidden sm:inline">{isAr ? 'FR' : 'AR'}</span>
            </div>
          </button>

          {/* View Mode toggle */}
          <button
            onClick={onToggleViewMode}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl border transition-all active:scale-95 ${
              viewMode === 'simple'
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold">
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline">{viewMode === 'simple' ? t.btnDetailedView : t.btnSimpleView}</span>
            </div>
          </button>

          <div className="w-px h-6 bg-slate-800 mx-1 hidden sm:block" />

          {/* Alert Button */}
          <button
            onClick={onOpenAlertsModal}
            className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all active:scale-95"
          >
            <Bell className={`w-4 h-4 ${triggeredCount > 0 ? 'text-rose-500 animate-pulse' : 'text-amber-500'}`} />
            {alertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-emerald-500 text-slate-950 text-[9px] font-black rounded-full shadow-lg">
                {alertsCount}
              </span>
            )}
          </button>

          {/* Share Button */}
          <button
            onClick={onOpenShareModal}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4 text-cyan-500" />
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
