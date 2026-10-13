import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  TooltipItem,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { DailyForecast, TempUnit } from '../types/weather';
import { convertTemp, getWeatherCondition } from '../utils/weatherCodes';
import { TrendingUp, Layers, ArrowUp, ArrowDown } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TemperatureTrendChartProps {
  daily: DailyForecast;
  unit: TempUnit;
}

export const TemperatureTrendChart: React.FC<TemperatureTrendChartProps> = ({ daily, unit }) => {
  const [viewFilter, setViewFilter] = useState<'both' | 'high' | 'low'>('both');

  const dates = daily.time.slice(0, 7);
  const labels = useMemo(() => {
    return dates.map((dateStr, i) => {
      const d = new Date(dateStr + 'T00:00:00');
      const dayName = i === 0 ? 'Today' : new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d);
      const dayNum = d.getDate();
      return `${dayName} (${dayNum})`;
    });
  }, [dates]);

  const maxTemps = useMemo(() => {
    return daily.temperature_2m_max.slice(0, 7).map((t) => convertTemp(t, unit));
  }, [daily.temperature_2m_max, unit]);

  const minTemps = useMemo(() => {
    return daily.temperature_2m_min.slice(0, 7).map((t) => convertTemp(t, unit));
  }, [daily.temperature_2m_min, unit]);

  const weatherConditions = useMemo(() => {
    return daily.weathercode.slice(0, 7).map((c) => getWeatherCondition(c));
  }, [daily.weathercode]);

  const precipSums = daily.precipitation_sum.slice(0, 7);

  const datasets = useMemo(() => {
    const list = [];

    if (viewFilter === 'both' || viewFilter === 'high') {
      list.push({
        label: `Max Temperature (°${unit})`,
        data: maxTemps,
        borderColor: '#f97316', // Orange-500
        backgroundColor: 'rgba(249, 115, 22, 0.12)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#f97316',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      });
    }

    if (viewFilter === 'both' || viewFilter === 'low') {
      list.push({
        label: `Min Temperature (°${unit})`,
        data: minTemps,
        borderColor: '#06b6d4', // Cyan-500
        backgroundColor: 'rgba(6, 182, 212, 0.12)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      });
    }

    return list;
  }, [viewFilter, maxTemps, minTemps, unit]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false, // Custom segmented filter buttons used instead
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          title: (items: TooltipItem<'line'>[]) => {
            if (!items.length) return '';
            const idx = items[0].dataIndex;
            const dateStr = dates[idx];
            const d = new Date(dateStr + 'T00:00:00');
            return d.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            });
          },
          label: (item: TooltipItem<'line'>) => {
            return ` ${item.dataset.label}: ${item.raw}°${unit}`;
          },
          afterBody: (items: TooltipItem<'line'>[]) => {
            if (!items.length) return '';
            const idx = items[0].dataIndex;
            const cond = weatherConditions[idx];
            const precip = precipSums[idx] ?? 0;
            return [
              `Condition: ${cond.label}`,
              `Precipitation: ${precip.toFixed(1)} mm`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.06)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: "'JetBrains Mono', monospace",
            size: 11,
          },
          callback: (value) => `${value}°`,
        },
      },
    },
  };

  return (
    <section
      id="trend-chart"
      className="rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-2xl p-6 sm:p-8 space-y-6"
    >
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
            <TrendingUp className="w-3.5 h-3.5" /> Thermal Analytics
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            7-Day Temperature Trend
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Trajectory curves for maximum daytime heating and overnight radiative cooling
          </p>
        </div>

        {/* View Mode Segmented Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg border border-slate-700/80 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setViewFilter('both')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              viewFilter === 'both'
                ? 'bg-sky-500/20 text-sky-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Combined View
          </button>
          <button
            onClick={() => setViewFilter('high')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              viewFilter === 'high'
                ? 'bg-orange-500/20 text-orange-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowUp className="w-3 h-3 text-orange-400" /> Highs Only
          </button>
          <button
            onClick={() => setViewFilter('low')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              viewFilter === 'low'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDown className="w-3 h-3 text-cyan-400" /> Lows Only
          </button>
        </div>
      </div>

      {/* Chart Canvas Container */}
      <div className="h-72 sm:h-80 w-full relative">
        <Line data={{ labels, datasets }} options={options} />
      </div>

      {/* Metric Summary Footnotes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
        <div className="text-xs">
          <span className="text-slate-400 block">Peak Expected High</span>
          <span className="text-base font-bold text-orange-400 font-mono tabular-nums">
            {Math.max(...maxTemps)}°{unit}
          </span>
        </div>
        <div className="text-xs">
          <span className="text-slate-400 block">Lowest Minimum Low</span>
          <span className="text-base font-bold text-cyan-400 font-mono tabular-nums">
            {Math.min(...minTemps)}°{unit}
          </span>
        </div>
        <div className="text-xs">
          <span className="text-slate-400 block">Max Diurnal Range</span>
          <span className="text-base font-bold text-white font-mono tabular-nums">
            {Math.round(
              Math.max(...maxTemps.map((max, i) => max - minTemps[i])) * 10
            ) / 10}
            °{unit}
          </span>
        </div>
        <div className="text-xs">
          <span className="text-slate-400 block">Average High Temp</span>
          <span className="text-base font-bold text-slate-200 font-mono tabular-nums">
            {Math.round(
              (maxTemps.reduce((a, b) => a + b, 0) / maxTemps.length) * 10
            ) / 10}
            °{unit}
          </span>
        </div>
      </div>
    </section>
  );
};
