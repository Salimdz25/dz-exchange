import React, { useState, useEffect, useRef } from 'react';
import { ApiResponse, RateAlert } from './types';
import { Navbar } from './components/Navbar';
import { MarketHeroCards } from './components/MarketHeroCards';
import { MultiMarketConverter } from './components/MultiMarketConverter';
import { RatesTable } from './components/RatesTable';
import { HistoricalChartSection } from './components/HistoricalChartSection';
import { VirtualNeobanksSection } from './components/VirtualNeobanksSection';
import { RegionalSquareMarkets } from './components/RegionalSquareMarkets';
import { MarketInsightsAndGuide } from './components/MarketInsightsAndGuide';
import { ShareBulletinModal } from './components/ShareBulletinModal';
import { RateAlertsModal } from './components/RateAlertsModal';
import { RateAlertBanner } from './components/RateAlertBanner';
import { ThreePillarsSummary } from './components/ThreePillarsSummary';
import { AlertCircle, RefreshCw, Sparkles, Heart, Shield, Layers, LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react';
import { Language, translations } from './utils/translations';

const ALERTS_STORAGE_KEY = 'dinardz_rate_alerts';
const SOUND_STORAGE_KEY = 'dinardz_sound_enabled';
const LANG_STORAGE_KEY = 'dinardz_language';

export default function App() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('EUR');
  const [selectedMarketType, setSelectedMarketType] = useState<string>('parallel');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState<boolean>(false);
  const [refreshNotification, setRefreshNotification] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');

  // Language state: 'fr' or 'ar'
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      return (saved === 'ar' || saved === 'fr') ? saved : 'fr';
    } catch {
      return 'fr';
    }
  });

  const t = translations[language];
  const isAr = language === 'ar';

  const handleToggleLanguage = () => {
    const nextLang: Language = language === 'fr' ? 'ar' : 'fr';
    setLanguage(nextLang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, nextLang);
    } catch (e) {}
  };

  // Rate Alerts State
  const [alerts, setAlerts] = useState<RateAlert[]>(() => {
    try {
      const saved = localStorage.getItem(ALERTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [
        {
          id: 'default-alert-eur',
          currencyCode: 'EUR',
          marketType: 'parallel',
          condition: 'above_or_equal',
          targetRate: 253.0,
          currentRateAtCreation: 252.5,
          note: 'Alerte hausse Euro Square Port-Saïd',
          createdAt: Date.now() - 86400000,
          triggered: false,
        },
        {
          id: 'default-alert-usdt',
          currencyCode: 'USDT',
          marketType: 'virtual',
          condition: 'above_or_equal',
          targetRate: 240.0,
          currentRateAtCreation: 240.5,
          note: 'Objectif achat USDT P2P BaridiMob',
          createdAt: Date.now() - 43200000,
          triggered: true,
        },
      ];
    } catch {
      return [];
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SOUND_STORAGE_KEY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const audioContextRef = useRef<AudioContext | null>(null);

  // Play synthesized chime when alert triggers
  const playAlertChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.12); // A5
      osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.25); // D6

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.75);
    } catch (e) {
      console.log('Audio chime not supported or muted');
    }
  };

  // Evaluate alerts against fresh data
  const evaluateAlerts = (currentData: ApiResponse, currentAlerts: RateAlert[]) => {
    let hasNewlyTriggered = false;
    const updated = currentAlerts.map((alert) => {
      let currentRate = 0;
      if (alert.currencyCode === 'USDT') {
        currentRate = currentData.stats.usdtP2pRate || 240.5;
      } else if (alert.currencyCode === 'WISE_EUR') {
        currentRate = currentData.stats.wiseEurRate || 248.5;
      } else {
        const curr = currentData.currencies.find((c) => c.code === alert.currencyCode);
        if (curr) {
          if (alert.marketType === 'parallel') {
            currentRate = curr.parallel?.sell || 0;
          } else if (alert.marketType === 'official') {
            currentRate = curr.official.mid || 0;
          } else {
            currentRate = curr.parallel?.sell || 0;
          }
        }
      }

      const meetsCondition =
        alert.condition === 'above_or_equal'
          ? currentRate >= alert.targetRate
          : currentRate <= alert.targetRate;

      if (meetsCondition && !alert.triggered) {
        hasNewlyTriggered = true;
      }

      return {
        ...alert,
        triggered: meetsCondition,
      };
    });

    setAlerts(updated);
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}

    if (hasNewlyTriggered) {
      playAlertChime();
    }
  };

  const fetchRates = async (isManual = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = isManual ? '/api/refresh' : '/api/rates';
      const method = isManual ? 'POST' : 'GET';
      const res = await fetch(endpoint, { method });
      if (!res.ok) throw new Error(isAr ? 'تعذر تحميل الأسعار' : 'Impossible de charger les cours');
      const json = await res.json();
      const payload: ApiResponse = isManual ? json.data : json;
      setData(payload);
      evaluateAlerts(payload, alerts);
      if (isManual) {
        setRefreshNotification(isAr ? 'تم تحديث الأسعار بنجاح !' : 'Taux actualisés avec succès !');
        setTimeout(() => setRefreshNotification(null), 3000);
      }
    } catch (err: any) {
      console.error(err);
      setError(isAr ? 'حدث خطأ أثناء مزامنة البيانات. يرجى إعادة المحاولة.' : 'Erreur lors de la synchronisation des données. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleAddAlert = (newAlertData: Omit<RateAlert, 'id' | 'createdAt' | 'triggered'>) => {
    const newAlert: RateAlert = {
      ...newAlertData,
      id: `alert-${Date.now()}`,
      createdAt: Date.now(),
      triggered: false,
    };
    const updated = [newAlert, ...alerts];
    setAlerts(updated);
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
    if (data) {
      evaluateAlerts(data, updated);
    }
  };

  const handleDeleteAlert = (id: string) => {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const handleDismissTriggeredAlert = (id: string) => {
    const updated = alerts.map((a) => (a.id === id ? { ...a, triggered: false } : a));
    setAlerts(updated);
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const handleTestTriggerAlert = (id: string) => {
    const updated = alerts.map((a) => (a.id === id ? { ...a, triggered: true } : a));
    setAlerts(updated);
    playAlertChime();
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, JSON.stringify(nextVal));
    } catch (e) {}
  };

  const handleSelectForConvert = (currencyCode: string, marketType: string = 'parallel') => {
    setSelectedCurrencyCode(currencyCode);
    setSelectedMarketType(marketType);
    const elem = document.getElementById('multi-market-converter');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToConverter = () => {
    const elem = document.getElementById('multi-market-converter');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const triggeredAlerts = alerts.filter((a) => a.triggered);

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      lang={language}
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white ${
        isAr ? 'font-sans' : ''
      }`}
    >
      {/* Toast Notification */}
      {refreshNotification && (
        <div className={`fixed top-20 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce ${isAr ? 'left-4' : 'right-4'}`}>
          <Sparkles className="w-4 h-4" />
          <span>{refreshNotification}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        data={data}
        isLoading={isLoading}
        onRefresh={() => fetchRates(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onScrollToConverter={handleScrollToConverter}
        onOpenAlertsModal={() => setIsAlertsModalOpen(true)}
        alertsCount={alerts.length}
        triggeredCount={triggeredAlerts.length}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(v => v === 'simple' ? 'detailed' : 'simple')}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs sm:text-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchRates(true)}
              className="px-3 py-1.5 rounded-lg bg-rose-800 hover:bg-rose-700 text-white font-medium text-xs cursor-pointer"
            >
              {isAr ? 'إعادة المحاولة' : 'Réessayer'}
            </button>
          </div>
        )}

        {/* Visual Rate Alert Banner when a target is hit */}
        <RateAlertBanner
          triggeredAlerts={triggeredAlerts}
          onDismissAlert={handleDismissTriggeredAlert}
          onOpenAlertsModal={() => setIsAlertsModalOpen(true)}
          language={language}
        />

        {/* 1. SIMPLE VIEW : THE 3 CORE PILLARS OF THE ALGERIAN MARKET */}
        <ThreePillarsSummary
          data={data}
          onSelectCurrency={(code) => handleSelectForConvert(code, 'parallel')}
          language={language}
        />

        {/* 2. SIMULTANEOUS MULTI-MARKET CURRENCY CONVERTER */}
        <MultiMarketConverter
          data={data}
          selectedCurrencyCode={selectedCurrencyCode}
          selectedMarketType={selectedMarketType}
          onCurrencyChange={(code) => setSelectedCurrencyCode(code)}
          language={language}
        />

        {/* TOGGLE TO VIEW ADVANCED / DETAILED SECTIONS */}
        <div className="my-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>
                {viewMode === 'simple'
                  ? (isAr ? 'هل تريد استكشاف المزيد من التفاصيل والبيانات ؟' : 'Envie d\'explorer plus de détails ?')
                  : (isAr ? 'وضع العرض المفصل والشامل مفعل' : 'Mode Vue Complète Activé')}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {viewMode === 'simple'
                ? (isAr
                    ? 'جداول الأسعار الكاملة لـ 13 عملة، الرسوم البيانية التاريخية، أسعار السكوار بالولايات ودليل السوق.'
                    : 'Tableaux de cotations complètes (13 devises), graphiques d\'évolution, bourses régionales par wilaya et guides.')
                : (isAr
                    ? 'جميع البيانات التفصيلية والإحصائية لأسواق الصرف معروضة بالكامل أدناه.'
                    : 'Toutes les données approfondies du marché algérien sont affichées ci-dessous.')}
            </p>
          </div>

          <button
            onClick={() => setViewMode(v => v === 'simple' ? 'detailed' : 'simple')}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700 active:scale-95 shrink-0"
          >
            <span>
              {viewMode === 'simple'
                ? (isAr ? 'عرض جميع التفاصيل' : 'Afficher tous les détails')
                : (isAr ? 'إخفاء التفاصيل' : 'Masquer les détails')}
            </span>
            {viewMode === 'simple' ? <ChevronDown className="w-4 h-4 text-emerald-400" /> : <ChevronUp className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

        {/* DETAILED SECTIONS (VISIBLE IN DETAILED MODE) */}
        {viewMode === 'detailed' && (
          <div className="space-y-10 animate-fadeIn">
            {/* Detailed Hero Breakdown Cards */}
            <MarketHeroCards
              data={data}
              onSelectForConvert={handleSelectForConvert}
              language={language}
            />

            {/* Detailed Rates Table */}
            <RatesTable
              data={data}
              onSelectCurrency={(code) => handleSelectForConvert(code, 'parallel')}
              language={language}
            />

            {/* Historical Evolution Charts */}
            <HistoricalChartSection
              data={data}
              language={language}
            />

            {/* Virtual Neobanks & Crypto */}
            {data && (
              <VirtualNeobanksSection
                virtualRates={data.virtualRates}
                onSelectForConvert={handleSelectForConvert}
                language={language}
              />
            )}

            {/* Regional Square Markets across Algerian Cities */}
            {data && (
              <RegionalSquareMarkets
                markets={data.regionalMarkets}
                language={language}
              />
            )}

            {/* Insights, Factors & Practical Guide */}
            {data && (
              <MarketInsightsAndGuide
                insights={data.insights}
                language={language}
              />
            )}
          </div>
        )}
      </main>

      {/* Share Bulletin Modal */}
      <ShareBulletinModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={data}
        language={language}
      />

      {/* Rate Alerts Modal */}
      <RateAlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        data={data}
        alerts={alerts}
        onAddAlert={handleAddAlert}
        onDeleteAlert={handleDeleteAlert}
        onTestTriggerAlert={handleTestTriggerAlert}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        language={language}
      />

      {/* Footer */}
      <footer className="mt-12 bg-slate-950 border-t border-slate-900 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇩🇿</span>
            <span className="font-bold text-slate-200">{isAr ? 'دينار ديزاد - أسعار الصرف' : 'DinarDZ Exchange Tracker'}</span>
            <span className="text-slate-600">|</span>
            <span>{isAr ? 'الجزائر • أسعار الصرف لحظة بلحظة' : 'Algérie • Taux de Change Temps Réel'}</span>
          </div>

          <p className="text-center md:text-right text-slate-400 max-w-xl">
            {isAr
              ? 'تنبيه : أسعار السوق الموازي (سكوار بورسعيد) والعملات الرقمية معروضة لأغراض إعلامية استرشادية وفقاً لمتوسط المعاملات الرائجة في السوق ومنصات P2P.'
              : 'Avertissement : Les cours du marché parallèle (Square Port-Saïd) et des devises virtuelles sont donnés à titre indicatif selon les moyennes constatées sur les places d\'échange et plateformes P2P.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
