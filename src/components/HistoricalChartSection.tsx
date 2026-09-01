import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, BarChart3, Calendar, Layers, Sparkles } from 'lucide-react';
import { ApiResponse } from '../types';
import { Language, translations } from '../utils/translations';

interface HistoricalChartSectionProps {
  data: ApiResponse | null;
  language: Language;
}

export const HistoricalChartSection: React.FC<HistoricalChartSectionProps> = ({ data, language }) => {
  const t = translations[language];
  const isAr = language === 'ar';
  const daUnit = isAr ? 'دج' : 'DA';

  const [selectedCurrency, setSelectedCurrency] = useState<'EUR' | 'USD' | 'USDT'>('EUR');
  const [chartType, setChartType] = useState<'rates' | 'spread'>('rates');
  const [timeRange, setTimeRange] = useState<'7d' | '15d' | '30d'>('30d');

  if (!data || !data.historical || data.historical.length === 0) return null;

  // Filter based on range
  const count = timeRange === '7d' ? 7 : timeRange === '15d' ? 15 : 30;
  const chartData = data.historical.slice(-count);

  const isEur = selectedCurrency === 'EUR';
  const isUsd = selectedCurrency === 'USD';

  // Calculate statistics
  const squareValues = chartData.map(d => isEur ? d.parallelEur : isUsd ? d.parallelUsd : d.virtualUsdt);
  const officialValues = chartData.map(d => isEur ? d.officialEur : d.officialUsd);

  const maxSquare = Math.max(...squareValues);
  const minSquare = Math.min(...squareValues);
  const currentSquare = squareValues[squareValues.length - 1];
  const firstSquare = squareValues[0];
  const changeVal = currentSquare - firstSquare;
  const changePct = Number(((changeVal / firstSquare) * 100).toFixed(2));

  return (
    <section id="historical-chart-section" className="mb-10">
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{isAr ? 'الرسوم البيانية والتاريخية' : 'Graphique & Tendances Historiques'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {t.chartTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {t.chartSubtitle}
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Currency selector */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setSelectedCurrency('EUR')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  selectedCurrency === 'EUR' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇪🇺</span>
                <span>EUR (€)</span>
              </button>
              <button
                onClick={() => setSelectedCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  selectedCurrency === 'USD' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇺🇸</span>
                <span>USD ($)</span>
              </button>
              <button
                onClick={() => setSelectedCurrency('USDT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  selectedCurrency === 'USDT' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🪙</span>
                <span>USDT (₮)</span>
              </button>
            </div>

            {/* Time range */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  timeRange === '7d' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isAr ? '7 أيام' : '7J'}
              </button>
              <button
                onClick={() => setTimeRange('15d')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  timeRange === '15d' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isAr ? '15 يوماً' : '15J'}
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  timeRange === '30d' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isAr ? '30 يوماً' : '30J'}
              </button>
            </div>
          </div>
        </div>

        {/* Mini stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">{isAr ? 'السعر الحالي (السكوار) :' : 'Dernier cours (Square) :'}</span>
            <span className="text-lg font-black text-emerald-400 font-mono">{currentSquare.toFixed(2)} {daUnit}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">{isAr ? `تغير آخر ${count} يوماً :` : `Variation sur ${count} jours :`}</span>
            <span className={`text-lg font-black font-mono flex items-center gap-1 ${changeVal >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              <TrendingUp className={`w-4 h-4 ${changeVal < 0 ? 'rotate-180' : ''}`} />
              <span>{changeVal >= 0 ? `+${changeVal.toFixed(2)}` : changeVal.toFixed(2)} {daUnit} ({changePct}%)</span>
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">{isAr ? 'أعلى سعر مسجل :' : 'Plus haut (Max) :'}</span>
            <span className="text-lg font-black text-amber-400 font-mono">{maxSquare.toFixed(2)} {daUnit}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">{isAr ? 'أدنى سعر مسجل :' : 'Plus bas (Min) :'}</span>
            <span className="text-lg font-black text-slate-300 font-mono">{minSquare.toFixed(2)} {daUnit}</span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSquare" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOfficial" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="formattedDate" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
                formatter={(val: any) => [`${Number(val).toFixed(2)} ${daUnit}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

              <Area
                type="monotone"
                dataKey={isEur ? 'parallelEur' : isUsd ? 'parallelUsd' : 'virtualUsdt'}
                name={isEur ? t.chartLegendParallelEur : isUsd ? (isAr ? 'دولار السكوار' : 'Dollar Square') : t.chartLegendUsdt}
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSquare)"
              />

              {selectedCurrency !== 'USDT' && (
                <Area
                  type="monotone"
                  dataKey={isEur ? 'officialEur' : 'officialUsd'}
                  name={isEur ? t.chartLegendOfficialEur : (isAr ? 'دولار بنك الجزائر' : 'Dollar Banque d\'Algérie')}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorOfficial)"
                />
              )}

              {isEur && (
                <Line
                  type="monotone"
                  dataKey="virtualWiseEur"
                  name={t.chartLegendVirtualWise}
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};
