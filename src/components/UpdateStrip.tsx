import React from 'react';
import { ApiResponse } from '../types';
import { Language } from '../utils/translations';
import { Clock, CheckCircle2, WifiOff } from 'lucide-react';

interface UpdateStripProps {
  data: ApiResponse | null;
  language: Language;
  theme: 'light' | 'dark';
}

export const UpdateStrip: React.FC<UpdateStripProps> = ({ data, language, theme }) => {
  const isAr = language === 'ar';
  const isDark = theme === 'dark';
  const isOffline = !navigator.onLine;

  const source = data?.sourceName || 'Marché observé';
  const time = data?.lastUpdatedFormatted || '08:54';

  return (
    <div className={`w-full py-2 px-4 my-2 rounded-xl text-[11px] font-semibold flex items-center justify-between transition-colors ${
      isDark ? 'bg-slate-900/80 text-slate-400 border border-slate-800' : 'bg-slate-100 text-slate-600 border border-slate-200'
    }`}>
      {isOffline ? (
        <div className="flex items-center gap-1.5 text-amber-500 font-bold mx-auto">
          <WifiOff className="w-3.5 h-3.5" />
          <span>{isAr ? 'وضع دون اتصال — آخر البيانات المتاحة' : 'Mode hors ligne — dernières données disponibles'}</span>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span>
              {isAr
                ? `آخر تحديث : ${time}`
                : `Dernière mise à jour : ${time}`}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>{source}</span>
          </div>
        </div>
      )}
    </div>
  );
};
