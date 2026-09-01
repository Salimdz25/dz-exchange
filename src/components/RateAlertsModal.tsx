import React, { useState } from 'react';
import {
  X,
  Bell,
  BellRing,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Volume2,
  VolumeX,
  Store,
  CreditCard,
  Building2,
  Info,
} from 'lucide-react';
import { ApiResponse, RateAlert } from '../types';
import { formatCentimesAlgerien } from '../utils/formatters';
import { Language, translations } from '../utils/translations';

interface RateAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ApiResponse | null;
  alerts: RateAlert[];
  onAddAlert: (newAlert: Omit<RateAlert, 'id' | 'createdAt' | 'triggered'>) => void;
  onDeleteAlert: (id: string) => void;
  onTestTriggerAlert: (id: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  language: Language;
}

export const RateAlertsModal: React.FC<RateAlertsModalProps> = ({
  isOpen,
  onClose,
  data,
  alerts,
  onAddAlert,
  onDeleteAlert,
  onTestTriggerAlert,
  soundEnabled,
  onToggleSound,
  language,
}) => {
  const t = translations[language];
  const isAr = language === 'ar';
  const daUnit = isAr ? 'دج' : 'DA';

  const [selectedCurrency, setSelectedCurrency] = useState<string>('EUR');
  const [selectedMarket, setSelectedMarket] = useState<'parallel' | 'virtual' | 'official'>('parallel');
  const [condition, setCondition] = useState<'above_or_equal' | 'below_or_equal'>('above_or_equal');
  const [targetRate, setTargetRate] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'active' | 'create'>('active');

  const targetInputId = 'target-rate-input-id';
  const noteInputId = 'note-rate-input-id';

  if (!isOpen || !data) return null;

  // Helper to get current rate for selection
  const getCurrentMarketRate = (currCode: string, market: 'parallel' | 'virtual' | 'official'): number => {
    if (currCode === 'USDT') {
      return data.stats.usdtP2pRate || 240.5;
    }
    if (currCode === 'WISE_EUR') {
      return data.stats.wiseEurRate || 248.5;
    }
    const curr = data.currencies.find((c) => c.code === currCode);
    if (!curr) return 0;

    if (market === 'parallel') {
      return curr.parallel?.sell || 0;
    } else if (market === 'official') {
      return curr.official.mid || 0;
    } else {
      if (currCode === 'USD') return data.stats.usdtP2pRate || 240.5;
      if (currCode === 'EUR') return data.stats.wiseEurRate || 248.5;
      return curr.parallel?.sell || 0;
    }
  };

  const currentRate = getCurrentMarketRate(selectedCurrency, selectedMarket);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const rateNum = parseFloat(targetRate);
    if (isNaN(rateNum) || rateNum <= 0) return;

    onAddAlert({
      currencyCode: selectedCurrency,
      marketType: selectedMarket,
      condition,
      targetRate: rateNum,
      currentRateAtCreation: currentRate,
      note: note.trim() || undefined,
    });

    setTargetRate('');
    setNote('');
    setActiveTab('active');
  };

  const getCurrencyLabel = (code: string) => {
    if (code === 'USDT') return { flag: '🪙', name: 'USDT Tether', code: 'USDT (₮)' };
    if (code === 'WISE_EUR') return { flag: '🇪🇺', name: 'Wise Solde Euro', code: 'Wise (€)' };
    const curr = data.currencies.find((c) => c.code === code);
    return {
      flag: curr?.flag || '🏳️',
      name: isAr ? (curr?.nameAr || curr?.name || code) : (curr?.name || code),
      code: `${curr?.code || code} (${curr?.symbol || ''})`,
    };
  };

  const getMarketLabel = (market: 'parallel' | 'virtual' | 'official') => {
    switch (market) {
      case 'parallel':
        return { label: t.alertMarketSquare, icon: Store, color: 'text-emerald-400', bg: 'bg-emerald-950/60 border-emerald-800/60' };
      case 'virtual':
        return { label: t.alertMarketVirtual, icon: CreditCard, color: 'text-cyan-400', bg: 'bg-cyan-950/60 border-cyan-800/60' };
      case 'official':
        return { label: t.alertMarketOfficial, icon: Building2, color: 'text-blue-400', bg: 'bg-blue-950/60 border-blue-800/60' };
    }
  };

  const quickOffsets = [
    { label: '+1 DA', val: currentRate + 1 },
    { label: '+2.5 DA', val: currentRate + 2.5 },
    { label: '+5 DA', val: currentRate + 5 },
    { label: '-2 DA', val: currentRate - 2 },
    { label: '-5 DA', val: currentRate - 5 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/30 text-amber-400">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{t.alertsModalTitle}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-800 text-amber-300">
                  {alerts.length}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {t.alertsModalSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSound}
              title={soundEnabled ? t.alertSoundOn : t.alertSoundOff}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'active'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>{t.tabMyAlerts} ({alerts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'create'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{t.tabCreateAlert}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'create' ? (
            <form onSubmit={handleCreate} className="space-y-5">
              {/* Currency Selector with EU/Country flags */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {t.alertStep1}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {data.currencies.slice(0, 6).map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setSelectedCurrency(c.code)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        selectedCurrency === c.code
                          ? 'bg-emerald-950/90 border-emerald-500 text-white ring-1 ring-emerald-500/50 shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="text-xl" title={c.country}>{c.flag}</span>
                      <div className="truncate text-left">
                        <div className="font-mono font-bold leading-none">{c.code} ({c.symbol})</div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">{isAr ? (c.nameAr || c.name) : c.name}</div>
                      </div>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSelectedCurrency('USDT')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      selectedCurrency === 'USDT'
                        ? 'bg-cyan-950/90 border-cyan-500 text-white ring-1 ring-cyan-500/50 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">🪙</span>
                    <div className="truncate text-left">
                      <div className="font-mono font-bold leading-none">USDT (₮)</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">Binance P2P</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCurrency('WISE_EUR')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      selectedCurrency === 'WISE_EUR'
                        ? 'bg-sky-950/90 border-sky-500 text-white ring-1 ring-sky-500/50 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">🇪🇺</span>
                    <div className="truncate text-left">
                      <div className="font-mono font-bold leading-none">Wise (€)</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">Solde Euro</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Market selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {t.alertStep2}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMarket('parallel')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedMarket === 'parallel'
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm ring-1 ring-emerald-500/50'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Store className="w-4 h-4 text-emerald-400" />
                    <span>{t.alertMarketSquare}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMarket('virtual')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedMarket === 'virtual'
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-sm ring-1 ring-cyan-500/50'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    <span>{t.alertMarketVirtual}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMarket('official')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedMarket === 'official'
                        ? 'bg-blue-950/80 border-blue-500 text-blue-300 shadow-sm ring-1 ring-blue-500/50'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-blue-400" />
                    <span>{t.alertMarketOfficial}</span>
                  </button>
                </div>
              </div>

              {/* Current reference rate badge */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-400" />
                  <span>{t.alertCurrentRate}</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  1 {selectedCurrency} = {currentRate.toFixed(2)} {daUnit}
                </span>
              </div>

              {/* Trigger Condition */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {t.alertStep3}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCondition('above_or_equal')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      condition === 'above_or_equal'
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/50'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>{t.alertCondAbove}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCondition('below_or_equal')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      condition === 'below_or_equal'
                        ? 'bg-rose-950/80 border-rose-500 text-rose-300 ring-1 ring-rose-500/50'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <TrendingDown className="w-4 h-4 text-rose-400" />
                    <span>{t.alertCondBelow}</span>
                  </button>
                </div>
              </div>

              {/* Target Price input */}
              <div>
                <label htmlFor={targetInputId} className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.alertStep4}
                </label>
                <div className="relative">
                  <input
                    id={targetInputId}
                    type="number"
                    step="0.1"
                    required
                    value={targetRate}
                    onChange={(e) => setTargetRate(e.target.value)}
                    placeholder={t.alertTargetRatePlaceholder}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-lg font-bold text-white font-mono placeholder:text-slate-600 focus:outline-none"
                  />
                  <div className={`absolute top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400 ${isAr ? 'left-4' : 'right-4'}`}>
                    {daUnit}
                  </div>
                </div>

                {/* Quick Target offset buttons */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[11px] text-slate-400 mr-1">{t.alertShortcuts}</span>
                  {quickOffsets.map((q) => (
                    <button
                      key={q.label}
                      type="button"
                      onClick={() => setTargetRate(q.val.toFixed(1))}
                      className="px-2 py-0.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-300 cursor-pointer"
                    >
                      {q.val.toFixed(1)} {daUnit} ({q.label})
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional note */}
              <div>
                <label htmlFor={noteInputId} className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.alertStep5}
                </label>
                <input
                  id={noteInputId}
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t.alertNotePlaceholder}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/60 transition-all cursor-pointer active:scale-95"
              >
                {t.alertBtnSubmit}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto mb-3">
                    <Bell className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">{t.alertEmptyTitle}</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                    {t.alertEmptyDesc}
                  </p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {t.alertBtnCreateFirst}
                  </button>
                </div>
              ) : (
                alerts.map((alert) => {
                  const currInfo = getCurrencyLabel(alert.currencyCode);
                  const marketInfo = getMarketLabel(alert.marketType);
                  const currRate = getCurrentMarketRate(alert.currencyCode, alert.marketType);
                  const MarketIcon = marketInfo.icon;
                  const diff = Math.abs(currRate - alert.targetRate);

                  return (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        alert.triggered
                          ? 'bg-rose-950/30 border-rose-600/80 ring-1 ring-rose-500/40 shadow-lg'
                          : 'bg-slate-950/70 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl" title={currInfo.name}>{currInfo.flag}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm font-mono">{currInfo.code}</span>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${marketInfo.bg} ${marketInfo.color}`}>
                                <MarketIcon className="w-3 h-3" />
                                <span>{marketInfo.label}</span>
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 font-medium mt-0.5">
                              {currInfo.name}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onTestTriggerAlert(alert.id)}
                            title={t.alertTestBtn}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-mono font-medium transition-all cursor-pointer"
                          >
                            {t.alertTestBtn}
                          </button>
                          <button
                            onClick={() => onDeleteAlert(alert.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 text-xs">
                        <div>
                          <span className="text-slate-400 text-[11px] block">{t.alertConditionLabel}</span>
                          <span className="font-semibold text-slate-200 flex items-center gap-1 mt-0.5">
                            {alert.condition === 'above_or_equal' ? (
                              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                            )}
                            <span>{alert.condition === 'above_or_equal' ? '≥ Hausse' : '≤ Baisse'}</span>
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 text-[11px] block">Seuil Cible :</span>
                          <span className="font-mono font-bold text-amber-400 text-sm mt-0.5 block">
                            {alert.targetRate.toFixed(2)} {daUnit}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 text-[11px] block">Cours Actuel :</span>
                          <span className="font-mono font-bold text-slate-200 text-sm mt-0.5 block">
                            {currRate.toFixed(2)} {daUnit}
                          </span>
                        </div>
                      </div>

                      {alert.note && (
                        <p className="text-xs text-slate-400 italic mt-2.5 px-1 flex items-center gap-1.5">
                          <span className="text-slate-500">📝 Note :</span>
                          <span>{alert.note}</span>
                        </p>
                      )}

                      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[11px]">
                          Créée au cours de : <strong className="font-mono text-slate-300">{alert.currentRateAtCreation.toFixed(2)} {daUnit}</strong>
                        </span>
                        {alert.triggered ? (
                          <span className="inline-flex items-center gap-1 text-rose-400 font-bold text-xs animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{t.alertTriggeredBadge}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">
                            {diff < 0.05 ? t.alertGoalReached : `${diff.toFixed(2)} ${daUnit} ${t.alertRemaining}`}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{t.alertFooterNotice}</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {t.alertLocalPersistence}
          </span>
        </div>
      </div>
    </div>
  );
};
