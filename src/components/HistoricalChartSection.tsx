import React, { useState } from 'react';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { ApiResponse } from '../types';
import { Language, translations } from '../utils/translations';
import { getCurrencyAsset } from '../utils/currencyAssets';

interface HistoricalChartSectionProps {
  data: ApiResponse | null;
  theme: 'light' | 'dark';
  language: Language;
}

export const HistoricalChartSection: React.FC<HistoricalChartSectionProps> = ({ data, theme, language }) => {
  const t = translations[language];
  const isAr = language === 'ar';
  const daUnit = isAr ? 'دج' : 'DA';
  const isDark = theme === 'dark';

  const [selectedCurrency, setSelectedCurrency] = useState<'EUR' | 'USD' | 'USDT'>('EUR');
  const [timeRange, setTimeRange] = useState<'7d' | '15d' | '30d'>('30d');

  if (!data || !data.historical || data.historical.length === 0) return null;

  const count = timeRange === '7d' ? 7 : timeRange === '15d' ? 15 : 30;
  const chartData = data.historical.slice(-count);

  const isEur = selectedCurrency === 'EUR';
  const isUsd = selectedCurrency === 'USD';

  const squareValues = chartData.map(d => isEur ? d.parallelEur : isUsd ? d.parallelUsd : d.virtualUsdt);
  const currentSquare = squareValues[squareValues.length - 1];
  const firstSquare = squareValues[0];
  const changeVal = currentSquare - firstSquare;
  const changePct = Number(((changeVal / firstSquare) * 100).toFixed(2));

  return (
    <section id="historical-chart-section" className="mb-12">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-2">
        <div>
          <h2 className={`text-xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.chartTitle}</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{t.chartSubtitle}</p>
        </div>

        <div className={`flex p-1 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
           {['EUR', 'USD', 'USDT'].map((code) => (
             <button
               key={code}
               onClick={() => setSelectedCurrency(code as any)}
               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                 selectedCurrency === code
                   ? (isDark ? 'bg-slate-800 text-white shadow-lg' : 'bg-emerald-500 text-white shadow-md')
                   : (isDark ? 'text-slate-50 text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')
               }`}
             >
               {code}
             </button>
           ))}
        </div>
      </div>

      <div className={`rounded-[2.5rem] border p-8 shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
         <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 border-b pb-8 ${isDark ? 'border-slate-800/50' : 'border-slate-100'}`}>
            <div>
               <p className="text-[9px] font-black text-slate-500 uppercase mb-1 tracking-widest">{isAr ? 'السعر الحالي' : 'Latest'}</p>
               <p className={`text-xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentSquare.toFixed(1)} <span className="text-[10px] font-normal text-slate-500">{daUnit}</span></p>
            </div>
            <div>
               <p className="text-[9px] font-black text-slate-500 uppercase mb-1 tracking-widest">{isAr ? 'التغير' : 'Change'}</p>
               <p className={`text-xl font-black font-mono ${changeVal >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                 {changeVal >= 0 ? '+' : ''}{changePct}%
               </p>
            </div>
            <div className="hidden md:block">
               <p className="text-[9px] font-black text-slate-500 uppercase mb-1 tracking-widest">{isAr ? 'الأعلى' : 'High'}</p>
               <p className="text-xl font-black text-amber-500 font-mono">{Math.max(...squareValues).toFixed(1)}</p>
            </div>
            <div className="hidden md:block">
               <p className="text-[9px] font-black text-slate-500 uppercase mb-1 tracking-widest">{isAr ? 'الأدنى' : 'Low'}</p>
               <p className={`text-xl font-black font-mono ${isDark ? 'text-slate-300' : 'text-slate-400'}`}>{Math.min(...squareValues).toFixed(1)}</p>
            </div>
         </div>

         <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                      borderRadius: '1rem',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      color: isDark ? '#f8fafc' : '#0f172a'
                    }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Area type="monotone" dataKey={isEur ? 'parallelEur' : isUsd ? 'parallelUsd' : 'virtualUsdt'} stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorPrice)" />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>
    </section>
  );
};
