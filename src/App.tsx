import React, { useState, useEffect } from 'react';
import { ApiResponse, RateAlert } from './types';
import { Navbar } from './components/Navbar';
import { SideMenu } from './components/SideMenu';
import { MainTabs, MainTabType } from './components/MainTabs';
import { UpdateStrip } from './components/UpdateStrip';
import { RateList } from './components/RateList';
import { TopAdSlot, BottomAdSlot } from './components/AdSlots';
import { ShareSheetModal } from './components/ShareSheetModal';
import { InfoDialogModal } from './components/InfoDialogModal';
import { GoldCalculatorModal } from './components/GoldCalculatorModal';
import { MultiMarketConverter } from './components/MultiMarketConverter';
import { RateAlertsModal } from './components/RateAlertsModal';
import { HistoricalChartSection } from './components/HistoricalChartSection';
import { MarketInsightsAndGuide } from './components/MarketInsightsAndGuide';
import { AboutAndPrivacyModal } from './components/AboutAndPrivacyModal';
import { Language, translations } from './utils/translations';
import { getRateForAlert } from './utils/rateUtils';
import { AlertCircle, X } from 'lucide-react';

const ALERTS_STORAGE_KEY = 'dinardz_rate_alerts';
const SOUND_STORAGE_KEY = 'dinardz_sound_enabled';
const LANG_STORAGE_KEY = 'dinardz_language';
const THEME_STORAGE_KEY = 'dinardz_theme';

export default function App() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<MainTabType>('parallel');
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false);

  // Modals state
  const [activeModal, setActiveModal] = useState<'converter' | 'gold_calc' | 'history' | 'alerts' | 'news' | 'about' | 'privacy' | 'methodology' | null>(null);
  const [isHelpInfoOpen, setIsHelpInfoOpen] = useState<boolean>(false);
  const [shareSheetData, setShareSheetData] = useState<{ title: string; text: string } | null>(null);

  // Theme state: 'light' or 'dark' (Default: 'light')
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

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPwa = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
        setCanInstallPwa(false);
      });
    }
  };

  const handleToggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'ar' : 'fr');
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, language);
    } catch (e) {}
  }, [language]);

  // Rate Alerts State
  const [alerts, setAlerts] = useState<RateAlert[]>(() => {
    try {
      const saved = localStorage.getItem(ALERTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
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

  useEffect(() => {
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
    } catch (e) {}
  }, [alerts]);

  const evaluateAlerts = (currentData: ApiResponse) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) => {
        const currentRate = getRateForAlert(currentData, alert.currencyCode, alert.marketType);
        const meetsCondition =
          alert.condition === 'above_or_equal'
            ? currentRate >= alert.targetRate
            : currentRate <= alert.targetRate;
        return { ...alert, triggered: meetsCondition };
      })
    );
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
    } catch (err: any) {
      console.error(err);
      setError(isAr ? 'حدث خطأ أثناء مزامنة البيانات. يرجى إعادة المحاولة.' : 'Erreur de synchronisation des données.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleShareRow = (title: string, text: string) => {
    if (navigator.share) {
      navigator.share({ title, text }).catch(() => {
        setShareSheetData({ title, text });
      });
    } else {
      setShareSheetData({ title, text });
    }
  };

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      lang={language}
      className={`min-h-screen flex flex-col selection:bg-emerald-500 selection:text-white transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      } font-sans antialiased`}
    >
      {/* 1. Compact App Bar */}
      <Navbar
        isLoading={isLoading}
        theme={theme}
        language={language}
        onOpenMenu={() => setIsSideMenuOpen(true)}
        onRefresh={() => fetchRates(true)}
      />

      {/* 2. Four Primary Horizontal Tabs */}
      <MainTabs
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        language={language}
        theme={theme}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-xl mx-auto px-3 sm:px-4 py-3">
        {/* Error notification if any */}
        {error && (
          <div className={`mb-3 p-3 rounded-2xl border text-xs flex items-center justify-between gap-2 ${
            theme === 'dark' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-600'
          }`}>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => fetchRates(true)} className="px-3 py-1 rounded-xl bg-rose-500 text-white font-bold text-[10px] uppercase">
              {isAr ? 'إعادة' : 'Réessayer'}
            </button>
          </div>
        )}

        {/* 3. Last-Update Information Strip */}
        <UpdateStrip data={data} language={language} theme={theme} />

        {/* 4. Top Advertising Slot */}
        <TopAdSlot language={language} theme={theme} />

        {/* 5. Rate List (Main Content for Active Tab) */}
        {data ? (
          <RateList
            activeTab={activeTab}
            data={data}
            language={language}
            theme={theme}
            onShareRow={handleShareRow}
            onOpenHelpDialog={() => setIsHelpInfoOpen(true)}
            onOpenGoldCalculator={() => setActiveModal('gold_calc')}
          />
        ) : (
          <div className="py-20 text-center text-slate-400 font-bold text-xs">
            {isLoading ? (isAr ? 'جاري تحميل الأسعار...' : 'Chargement des cours en direct...') : (isAr ? 'لا توجد بيانات' : 'Données indisponibles')}
          </div>
        )}

        {/* 6. Bottom Advertising Slot */}
        <BottomAdSlot language={language} theme={theme} />
      </main>

      {/* Minimal Footer Area */}
      <footer className={`py-6 px-4 border-t text-center text-[10px] font-semibold text-slate-400 ${
        theme === 'dark' ? 'border-slate-900 bg-slate-950/80' : 'border-slate-200 bg-white/80'
      }`}>
        <p className="mb-1">DZ EXCHANGE • Taux de Change Algérie</p>
        <p className="opacity-60">{isAr ? 'جميع حقوق النشر محفوظة' : 'Données indicatives issues des observations du marché'}</p>
      </footer>

      {/* Side Drawer Menu */}
      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenModal={(modal) => setActiveModal(modal)}
        onInstallPwa={handleInstallPwa}
        canInstallPwa={canInstallPwa}
      />

      {/* Achat vs Vente Info Dialog Modal */}
      <InfoDialogModal
        isOpen={isHelpInfoOpen}
        onClose={() => setIsHelpInfoOpen(false)}
        language={language}
        theme={theme}
      />

      {/* Share Sheet Modal */}
      <ShareSheetModal
        isOpen={!!shareSheetData}
        onClose={() => setShareSheetData(null)}
        title={shareSheetData?.title || ''}
        shareText={shareSheetData?.text || ''}
        language={language}
        theme={theme}
      />

      {/* Gold Calculator Modal */}
      <GoldCalculatorModal
        isOpen={activeModal === 'gold_calc'}
        onClose={() => setActiveModal(null)}
        goldRates={data?.goldRates || []}
        language={language}
        theme={theme}
      />

      {/* Converter Modal */}
      {activeModal === 'converter' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className={`relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-2 border ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-500/10 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <MultiMarketConverter
              data={data}
              theme={theme}
              selectedCurrencyCode="EUR"
              onCurrencyChange={() => {}}
              language={language}
            />
          </div>
        </div>
      )}

      {/* Rate Alerts Modal */}
      <RateAlertsModal
        isOpen={activeModal === 'alerts'}
        onClose={() => setActiveModal(null)}
        data={data}
        alerts={alerts}
        onAddAlert={(newAlert) => {
          const alertItem: RateAlert = { ...newAlert, id: `alert-${Date.now()}`, createdAt: Date.now(), triggered: false };
          setAlerts(prev => [alertItem, ...prev]);
        }}
        onDeleteAlert={(id) => setAlerts(prev => prev.filter(a => a.id !== id))}
        onClearAllAlerts={() => setAlerts([])}
        onTestTriggerAlert={(id) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, triggered: true } : a))}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(v => !v)}
        language={language}
      />

      {/* History Modal */}
      {activeModal === 'history' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-4 border ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-500/10 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <HistoricalChartSection data={data} theme={theme} language={language} />
          </div>
        </div>
      )}

      {/* News & Guide Modal */}
      {activeModal === 'news' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-4 border ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-500/10 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <MarketInsightsAndGuide insights={data?.insights || []} theme={theme} language={language} />
          </div>
        </div>
      )}

      {/* About & Privacy Modals */}
      <AboutAndPrivacyModal
        type={activeModal === 'about' ? 'about' : activeModal === 'privacy' ? 'privacy' : activeModal === 'methodology' ? 'methodology' : null}
        onClose={() => setActiveModal(null)}
        language={language}
        theme={theme}
      />
    </div>
  );
}
