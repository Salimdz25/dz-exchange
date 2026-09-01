import React from 'react';
import { RefreshCw, Share2, Sparkles, Clock, Globe, ArrowRightLeft, Bell, Layers, LayoutGrid, Languages } from 'lucide-react';
import { ApiResponse } from '../types';
import { Language, translations } from '../utils/translations';

interface NavbarProps {
  data: ApiResponse | null;
  isLoading: boolean;
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

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
      {/* Top Banner Ticker with Country & EU Flags */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border-b border-emerald-900/30 px-3 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">
            <span className="flex items-center gap-1 font-semibold text-emerald-400 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {t.liveBadge}
            </span>
            {data && (
              <>
                <span className="shrink-0 text-slate-200 flex items-center gap-1">
                  <span>🇪🇺</span>
                  <span className="text-slate-400">{t.square100Eur}</span>{' '}
                  <strong className="text-emerald-400 font-mono">
                    {data.stats.parallelEurSell
                      ? `${(data.stats.parallelEurSell * 100).toLocaleString(isAr ? 'ar-DZ' : 'fr-DZ')} ${isAr ? 'دج' : 'DA'}`
                      : isAr ? '25,250 دج' : '25 250 DA'}
                  </strong>
                </span>
                <span className="text-slate-600">|</span>
                <span className="shrink-0 text-slate-200 flex items-center gap-1">
                  <span>🇺🇸</span>
                  <span className="text-slate-400">{t.square100Usd}</span>{' '}
                  <strong className="text-emerald-400 font-mono">
                    {data.stats.parallelUsdSell
                      ? `${(data.stats.parallelUsdSell * 100).toLocaleString(isAr ? 'ar-DZ' : 'fr-DZ')} ${isAr ? 'دج' : 'DA'}`
                      : isAr ? '23,650 دج' : '23 650 DA'}
                  </strong>
                </span>
                <span className="text-slate-600">|</span>
                <span className="shrink-0 text-slate-200 flex items-center gap-1">
                  <span>🪙</span>
                  <span className="text-slate-400">{t.usdtP2p}</span>{' '}
                  <strong className="text-cyan-400 font-mono">
                    {data.stats.usdtP2pRate ? `${data.stats.usdtP2pRate.toFixed(2)} ${isAr ? 'دج' : 'DA'}` : isAr ? '240.50 دج' : '240.50 DA'}
                  </strong>
                </span>
                <span className="text-slate-600">|</span>
                <span className="shrink-0 text-slate-200 flex items-center gap-1">
                  <span>🇪🇺</span>
                  <span className="text-slate-400">{t.wiseEur}</span>{' '}
                  <strong className="text-sky-400 font-mono">
                    {data.stats.wiseEurRate ? `${data.stats.wiseEurRate.toFixed(2)} ${isAr ? 'دج' : 'DA'}` : isAr ? '248.50 دج' : '248.50 DA'}
                  </strong>
                </span>
                <span className="text-slate-600">|</span>
                <span className="shrink-0 text-slate-300">
                  <span className="text-slate-400">{t.parallelGap}</span>{' '}
                  <strong className="text-amber-400 font-mono">+{data.stats.gapEurPercent}%</strong>
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-xs shrink-0 ml-auto">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.lastUpdated} {data?.lastUpdatedFormatted || t.dailyUpdate}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-900 border border-emerald-500/30 shadow-lg shadow-emerald-950/50 shrink-0">
              <span className="text-xl">🇩🇿</span>
              <span className="absolute -bottom-1 -right-1 bg-slate-900 border border-emerald-500/40 rounded-full px-1 text-[9px] font-bold text-emerald-400">
                DA
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  {isAr ? (
                    <>دينار<span className="text-emerald-400">ديزاد</span></>
                  ) : (
                    <>Dinar<span className="text-emerald-400">DZ</span></>
                  )}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-md bg-emerald-900/40 text-emerald-300 border border-emerald-700/40">
                  {t.threePillarsBadge}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Language Switcher (FR / AR) */}
            <button
              id="nav-btn-language"
              onClick={onToggleLanguage}
              title={t.switchLangTitle}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-bold text-emerald-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95 ring-1 ring-emerald-500/20"
            >
              <Languages className="w-4 h-4 text-emerald-400" />
              <span className="font-mono">{isAr ? '🇫🇷 Français' : '🇩🇿 العربية'}</span>
            </button>

            {/* Simple / Detailed View Mode Toggle */}
            <button
              id="nav-btn-viewmode"
              onClick={onToggleViewMode}
              title={viewMode === 'simple' ? t.btnDetailedView : t.btnSimpleView}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer shadow-sm ${
                viewMode === 'simple'
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  : 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
              }`}
            >
              {viewMode === 'simple' ? (
                <>
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span className="hidden md:inline">{t.btnDetailedView}</span>
                </>
              ) : (
                <>
                  <LayoutGrid className="w-4 h-4 text-emerald-400" />
                  <span className="hidden md:inline">{t.btnSimpleView}</span>
                </>
              )}
            </button>

            {/* Alert Notification Button */}
            <button
              id="nav-btn-alerts"
              onClick={onOpenAlertsModal}
              title="Alertes de taux"
              className="relative inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-medium text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Bell className={`w-4 h-4 ${triggeredCount > 0 ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
              <span className="hidden sm:inline">{t.btnAlerts}</span>
              {alertsCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold font-mono ${
                    triggeredCount > 0 ? 'bg-rose-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {alertsCount}
                </span>
              )}
            </button>

            {/* Converter Shortcut */}
            <button
              id="nav-btn-converter"
              onClick={onScrollToConverter}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-medium text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
              <span className="hidden lg:inline">{t.btnSimulator}</span>
            </button>

            {/* Daily Share Bulletin */}
            <button
              id="nav-btn-share"
              onClick={onOpenShareModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-medium text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span className="hidden md:inline">{t.btnBulletin}</span>
            </button>

            {/* Refresh Live Rates */}
            <button
              id="nav-btn-refresh"
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-medium shadow-md shadow-emerald-950/60 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{t.btnRefresh}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
