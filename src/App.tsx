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
import { AlertCircle, Sparkles, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { Language, translations } from './utils/translations';
import { getRateForAlert } from './utils/rateUtils';

const ALERTS_STORAGE_KEY = 'dinardz_rate_alerts';
const SOUND_STORAGE_KEY = 'dinardz_sound_enabled';
const LANG_STORAGE_KEY = 'dinardz_language';
const THEME_STORAGE_KEY = 'dinardz_theme';

export default function App() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('EUR');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState<boolean>(false);
  const [refreshNotification, setRefreshNotification] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');

  // Theme state: 'light' or 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return (saved === 'dark' || saved === 'light') ? saved : 'light';
    } catch {
      return 'light';
    }
  });

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
    setLanguage(prev => prev === 'fr' ? 'ar' : 'fr');
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Persist theme
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {}
  }, [theme]);

  // Persist language
  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, language);
    } catch (e) {}
  }, [language]);

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
          targetRate: 278.0,
          currentRateAtCreation: 276.0,
          note: 'Alerte hausse Euro Square Port-Saïd',
          createdAt: Date.now() - 86400000,
          triggered: false,
        },
        {
          id: 'default-alert-usdt',
          currencyCode: 'USDT',
          marketType: 'virtual',
          condition: 'above_or_equal',
          targetRate: 242.0,
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

  // Persist sound preference
  useEffect(() => {
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, JSON.stringify(soundEnabled));
    } catch (e) {}
  }, [soundEnabled]);

  const audioContextRef = useRef<AudioContext | null>(null);

  // Play synthesized chime when alert triggers
  const playAlertChime = async () => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioContextRef.current = new AudioCtx();
        }
      }

      const ctx = audioContextRef.current;
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

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
      console.log('Audio chime not supported or muted', e);
    }
  };

  // Persist alerts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
    } catch (e) {}
  }, [alerts]);

  // Evaluate alerts against fresh data
  const evaluateAlerts = (currentData: ApiResponse) => {
    let hasNewlyTriggered = false;

    setAlerts((prevAlerts) => {
      const updated = prevAlerts.map((alert) => {
        const currentRate = getRateForAlert(currentData, alert.currencyCode, alert.marketType);

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

      return updated;
    });

    if (hasNewlyTriggered) {
      setTimeout(() => playAlertChime(), 100);
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
      evaluateAlerts(payload);
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

    // Auto-cleanup for old default alerts that are causing confusion
    setAlerts(prev => prev.filter(alert => {
      const isOldDefaultEur = alert.id === 'default-alert-eur' && alert.targetRate < 260;
      return !isOldDefaultEur;
    }));
  }, []);

  const handleAddAlert = (newAlertData: Omit<RateAlert, 'id' | 'createdAt' | 'triggered'>) => {
    const newAlert: RateAlert = {
      ...newAlertData,
      id: `alert-${Date.now()}`,
      createdAt: Date.now(),
      triggered: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    if (data) {
      evaluateAlerts(data);
    }
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDismissTriggeredAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, triggered: false } : a)));
  };

  const handleTestTriggerAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, triggered: true } : a)));
    playAlertChime();
  };

  const handleClearAllAlerts = () => {
    if (window.confirm(isAr ? 'هل تريد حذف جميع التنبيهات؟' : 'Voulez-vous supprimer toutes les alertes ?')) {
      setAlerts([]);
    }
  };

  const handleToggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const handleSelectForConvert = (currencyCode: string) => {
    setSelectedCurrencyCode(currencyCode);
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
      className={`min-h-screen flex flex-col selection:bg-emerald-500 selection:text-white transition-colors duration-500 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      } ${isAr ? 'font-sans' : 'font-sans'}`}
    >
      <Navbar
        data={data}
        isLoading={isLoading}
        theme={theme}
        onToggleTheme={handleToggleTheme}
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

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">
        {error && (
          <div className={`mb-8 p-4 rounded-3xl border text-sm flex items-center justify-between gap-4 backdrop-blur-sm ${
            theme === 'dark' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-600'
          }`}>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <span className="font-bold">{error}</span>
            </div>
            <button onClick={() => fetchRates(true)} className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-black uppercase">
              {isAr ? 'إعادة' : 'Retry'}
            </button>
          </div>
        )}

        <RateAlertBanner
          data={data}
          triggeredAlerts={triggeredAlerts}
          onDismissAlert={handleDismissTriggeredAlert}
          onOpenAlertsModal={() => setIsAlertsModalOpen(true)}
          language={language}
        />

        {/* HERO: Essential Rates */}
        <div className="mb-12">
          <ThreePillarsSummary
            data={data}
            theme={theme}
            onSelectCurrency={(code) => handleSelectForConvert(code)}
            language={language}
          />
        </div>

        {/* MAIN TOOL: Converter */}
        <MultiMarketConverter
          data={data}
          theme={theme}
          selectedCurrencyCode={selectedCurrencyCode}
          onCurrencyChange={(code) => setSelectedCurrencyCode(code)}
          language={language}
        />

        {/* PROGRESSIVE DISCLOSURE: Detailed Sections */}
        {viewMode === 'detailed' && data ? (
          <div className={`space-y-12 animate-fadeIn mt-12 pt-12 border-t ${theme === 'dark' ? 'border-slate-900' : 'border-slate-200'}`}>
            <MarketHeroCards data={data} theme={theme} onSelectForConvert={handleSelectForConvert} language={language} />
            <RatesTable data={data} theme={theme} onSelectCurrency={handleSelectForConvert} language={language} />
            <HistoricalChartSection data={data} theme={theme} language={language} />
            <VirtualNeobanksSection data={data} theme={theme} onSelectForConvert={handleSelectForConvert} language={language} />
            <RegionalSquareMarkets markets={data.regionalMarkets} theme={theme} language={language} />
            <MarketInsightsAndGuide insights={data.insights} theme={theme} language={language} />
          </div>
        ) : viewMode === 'simple' && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setViewMode('detailed')}
              className={`group flex flex-col items-center gap-4 py-8 px-12 rounded-[2.5rem] border transition-all ${
                theme === 'dark' ? 'bg-slate-900/50 border-slate-800 hover:border-emerald-500/30' : 'bg-white border-slate-200 shadow-xl hover:border-emerald-500/50'
              }`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                theme === 'dark' ? 'bg-slate-950 text-emerald-500' : 'bg-emerald-500 text-white'
              } group-hover:scale-110`}>
                <ChevronDown className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className={`text-sm font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t.btnShowDetails}</p>
                <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">{t.moreDetailsDesc.split('(')[0]}</p>
              </div>
            </button>
          </div>
        )}
      </main>

      <footer className={`mt-20 border-t py-12 px-6 ${theme === 'dark' ? 'border-slate-900' : 'border-slate-200'}`}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="DZ EXCHANGE" className="w-8 h-8 rounded-lg opacity-80" onError={(e) => (e.currentTarget.style.display = 'none')} />
            <div>
              <p className={`font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>DZ EXCHANGE</p>
              <p className="text-[10px] font-bold text-slate-500">{t.footerRights.split('•')[1]}</p>
            </div>
          </div>
          <p className="text-[10px] leading-relaxed text-center md:text-right max-w-md font-medium text-slate-500">{t.footerDisclaimer}</p>
        </div>
      </footer>

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
        onClearAllAlerts={handleClearAllAlerts}
        onTestTriggerAlert={handleTestTriggerAlert}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        language={language}
      />
    </div>
  );
}
