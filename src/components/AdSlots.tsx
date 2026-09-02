import React, { useState, useEffect } from 'react';
import { Language } from '../utils/translations';

interface AdSlotProps {
  type: 'top' | 'infeed' | 'bottom';
  language: Language;
  theme: 'light' | 'dark';
}

export const AdSlot: React.FC<AdSlotProps> = ({ type, language, theme }) => {
  const [adBlocked, setAdBlocked] = useState(false);
  const isAr = language === 'ar';
  const isDark = theme === 'dark';

  useEffect(() => {
    // Check if adsense or ad blocker is present
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbygoogle';
    document.body.appendChild(testAd);
    setTimeout(() => {
      if (testAd.offsetHeight === 0) {
        setAdBlocked(true);
      }
      testAd.remove();
    }, 100);
  }, []);

  if (adBlocked) return null;

  const minHeight = type === 'top' ? 'min-h-[60px]' : type === 'infeed' ? 'min-h-[80px]' : 'min-h-[90px]';

  return (
    <div className={`w-full my-3 flex flex-col items-center justify-center rounded-xl border border-dashed transition-all ${minHeight} ${
      isDark ? 'bg-slate-900/40 border-slate-800/80 text-slate-500' : 'bg-slate-100/60 border-slate-300/80 text-slate-400'
    }`}>
      <span className="text-[9px] uppercase tracking-widest font-semibold opacity-60 mb-1">
        {isAr ? 'إعلان' : 'Annonce'}
      </span>
      {/* AdSense slot placeholder */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', textAlign: 'center' }}
        data-ad-layout={type === 'infeed' ? 'in-article' : undefined}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export const TopAdSlot: React.FC<{ language: Language; theme: 'light' | 'dark' }> = (props) => (
  <AdSlot type="top" {...props} />
);

export const InFeedAdSlot: React.FC<{ language: Language; theme: 'light' | 'dark' }> = (props) => (
  <AdSlot type="infeed" {...props} />
);

export const BottomAdSlot: React.FC<{ language: Language; theme: 'light' | 'dark' }> = (props) => (
  <AdSlot type="bottom" {...props} />
);
