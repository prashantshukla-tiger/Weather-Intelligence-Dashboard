import React, { useState } from 'react';
import { DailyForecast, TempUnit } from '../types/weather';
import { getWeatherCondition, formatTemp } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';
import { Droplets, Wind, Calendar, ChevronRight, X } from 'lucide-react';

interface ForecastGridProps {
  daily: DailyForecast;
  unit: TempUnit;
}

export const ForecastGrid: React.FC<ForecastGridProps> = ({ daily, unit }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  // Calculate absolute min and max across all 7 days for the visual temperature scale bars
  const allMaxTemps = daily.temperature_2m_max;
  const allMinTemps = daily.temperature_2m_min;
  const overallMax = Math.max(...allMaxTemps);
  const overallMin = Math.min(...allMinTemps);
  const tempRange = Math.max(overallMax - overallMin, 1);

  const formatDayName = (dateStr: string, index: number) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    const date = new Date(dateStr + 'T00:00:00');
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  };

  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  const selectedDay = selectedDayIndex !== null ? {
    date: daily.time[selectedDayIndex],
    weathercode: daily.weathercode[selectedDayIndex],
    maxTemp: daily.temperature_2m_max[selectedDayIndex],
    minTemp: daily.temperature_2m_min[selectedDayIndex],
    precip: daily.precipitation_sum[selectedDayIndex],
    wind: daily.windspeed_10m_max[selectedDayIndex],
    condition: getWeatherCondition(daily.weathercode[selectedDayIndex]),
  } : null;

  return (
    <section id="forecast-section" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
            <Calendar className="w-3.5 h-3.5" /> Extended Horizon
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            7-Day Daily Forecast
          </h2>
        </div>
        <div className="text-xs text-slate-400">
          Click any day to inspect detailed meteorological metrics
        </div>
      </div>

      {/* 7-Day Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {daily.time.slice(0, 7).map((dateStr, index) => {
          const code = daily.weathercode[index];
          const condition = getWeatherCondition(code);
          const maxTemp = daily.temperature_2m_max[index];
          const minTemp = daily.temperature_2m_min[index];
          const precip = daily.precipitation_sum[index] ?? 0;
          const wind = daily.windspeed_10m_max[index] ?? 0;
          const isSelected = selectedDayIndex === index;
          const isToday = index === 0;

          // Bar scale calculations
          const barLeftPercent = Math.max(0, Math.min(100, ((minTemp - overallMin) / tempRange) * 100));
          const barWidthPercent = Math.max(10, Math.min(100 - barLeftPercent, ((maxTemp - minTemp) / tempRange) * 100));

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDayIndex(index)}
              className={`text-left rounded-xl p-4 transition-all border flex flex-col justify-between group ${
                isSelected
                  ? 'bg-slate-800/90 border-sky-500 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/50'
                  : isToday
                  ? 'bg-slate-900/90 border-slate-700/90 hover:border-slate-600 hover:bg-slate-800/60'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              {/* Day & Date Header */}
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${isToday ? 'text-sky-400' : 'text-white'}`}>
                    {formatDayName(dateStr, index)}
                  </span>
                  {isToday && (
                    <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">
                      Now
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {formatDateShort(dateStr)}
                </div>
              </div>

              {/* Weather Icon and Label */}
              <div className="my-3.5 flex flex-col items-center text-center">
                <div className="p-2.5 rounded-xl bg-slate-800/60 group-hover:scale-105 transition-transform">
                  <WeatherIcon
                    name={condition.iconName}
                    className="w-8 h-8 text-sky-400"
                  />
                </div>
                <span className="text-xs font-medium text-slate-300 mt-2 line-clamp-1">
                  {condition.label}
                </span>
              </div>

              {/* High & Low Temps */}
              <div className="space-y-2 mt-auto pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                  <span className="text-rose-400 font-semibold">{formatTemp(maxTemp, unit)}</span>
                  <span className="text-slate-400 font-medium">{formatTemp(minTemp, unit)}</span>
                </div>

                {/* Relative Temperature Range Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-cyan-500 to-rose-500"
                    style={{
                      left: `${barLeftPercent}%`,
                      width: `${barWidthPercent}%`,
                    }}
                  />
                </div>

                {/* Secondary Indicators: Rain & Wind */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1 font-mono tabular-nums">
                    <Droplets className={`w-3 h-3 ${precip > 0 ? 'text-blue-400' : 'text-slate-500'}`} />
                    {precip.toFixed(1)}mm
                  </span>
                  <span className="flex items-center gap-1 font-mono tabular-nums">
                    <Wind className="w-3 h-3 text-slate-500" />
                    {Math.round(wind)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Inspection Modal/Drawer */}
      {selectedDay && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-sky-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
              <WeatherIcon name={selectedDay.condition.iconName} className="w-10 h-10 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {new Date(selectedDay.date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  WMO #{selectedDay.weathercode}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                {selectedDay.condition.label} — {selectedDay.condition.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="font-mono tabular-nums">
              <span className="text-xs text-slate-400 block">Temperature Range</span>
              <span className="font-bold text-white">
                <span className="text-rose-400">{formatTemp(selectedDay.maxTemp, unit)}</span>
                {' / '}
                <span className="text-cyan-400">{formatTemp(selectedDay.minTemp, unit)}</span>
              </span>
            </div>

            <div className="font-mono tabular-nums">
              <span className="text-xs text-slate-400 block">Precipitation Sum</span>
              <span className="font-bold text-blue-400">{selectedDay.precip.toFixed(1)} mm</span>
            </div>

            <div className="font-mono tabular-nums">
              <span className="text-xs text-slate-400 block">Max Wind Gust</span>
              <span className="font-bold text-slate-300">{Math.round(selectedDay.wind)} km/h</span>
            </div>

            <button
              onClick={() => setSelectedDayIndex(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close detailed inspection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
