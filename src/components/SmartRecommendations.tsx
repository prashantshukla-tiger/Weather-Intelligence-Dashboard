import React from 'react';
import { SmartRecommendation, WeatherForecastResponse } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import {
  Sparkles,
  Footprints,
  Car,
  Shirt,
  Coffee,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface SmartRecommendationsProps {
  recommendations: SmartRecommendation[];
  weather: WeatherForecastResponse;
  cityName: string;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  recommendations,
  weather,
  cityName,
}) => {
  const current = weather.current_weather;
  const todayPrecip = weather.daily.precipitation_sum[0] ?? 0;
  const todayMaxTemp = weather.daily.temperature_2m_max[0] ?? current.temperature;
  const todayWind = weather.daily.windspeed_10m_max[0] ?? current.windspeed;

  // Calculate Activity Scores
  const runningScore = (() => {
    let score = 100;
    if (todayMaxTemp > 32) score -= (todayMaxTemp - 32) * 8;
    if (todayMaxTemp < 5) score -= (5 - todayMaxTemp) * 7;
    if (todayPrecip > 1) score -= todayPrecip * 12;
    if (todayWind > 25) score -= (todayWind - 25) * 2;
    return Math.max(10, Math.min(100, Math.round(score)));
  })();

  const commuteScore = (() => {
    let score = 95;
    if ([45, 48].includes(current.weathercode)) score -= 35; // fog
    if ([95, 96, 99].includes(current.weathercode)) score -= 40; // storm
    if (todayPrecip > 5) score -= 25;
    if (todayWind > 30) score -= 15;
    return Math.max(15, Math.min(100, Math.round(score)));
  })();

  const laundryScore = (() => {
    let score = 90;
    if (todayPrecip > 0.5) score -= 60;
    if (todayMaxTemp > 25 && todayPrecip === 0) score += 10;
    if (todayWind > 10 && todayPrecip === 0) score += 5;
    return Math.max(10, Math.min(100, Math.round(score)));
  })();

  const diningScore = (() => {
    let score = 85;
    if (todayPrecip > 0.5) score -= 50;
    if (todayMaxTemp > 34 || todayMaxTemp < 14) score -= 30;
    if (todayWind > 24) score -= 20;
    return Math.max(10, Math.min(100, Math.round(score)));
  })();

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'Optimal', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 55) return { label: 'Moderate', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { label: 'Unfavorable', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  };

  const getSeverityStyle = (severity: SmartRecommendation['severity']) => {
    switch (severity) {
      case 'warning':
        return {
          border: 'border-rose-500/40 bg-gradient-to-br from-rose-950/30 to-slate-900',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          iconColor: 'text-rose-400',
        };
      case 'advisory':
        return {
          border: 'border-amber-500/40 bg-gradient-to-br from-amber-950/30 to-slate-900',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          iconColor: 'text-amber-400',
        };
      case 'favorable':
        return {
          border: 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 to-slate-900',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          iconColor: 'text-emerald-400',
        };
      case 'info':
      default:
        return {
          border: 'border-sky-500/30 bg-gradient-to-br from-sky-950/20 to-slate-900',
          badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
          iconColor: 'text-sky-400',
        };
    }
  };

  return (
    <section id="smart-recommendations" className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
          <Sparkles className="w-3.5 h-3.5" /> Decision Engine
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Smart Planning Recommendations
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Contextual daily guidance synthesized from precipitation, temperature, wind shear, and atmospheric pressure in {cityName}
        </p>
      </div>

      {/* Dynamic Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec) => {
          const style = getSeverityStyle(rec.severity);
          return (
            <div
              key={rec.id}
              className={`rounded-2xl border p-5 shadow-xl transition-all relative overflow-hidden flex flex-col justify-between ${style.border}`}
            >
              <div>
                {/* Header: Icon, Title, and Category */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 shrink-0">
                    <WeatherIcon name={rec.icon} className={`w-5 h-5 ${style.iconColor}`} />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border font-mono ${style.badge}`}
                  >
                    {rec.severity}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">{rec.title}</h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5 tabular-nums">
                  {rec.subtitle}
                </p>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {rec.message}
                </p>
              </div>

              {/* Actionable tip block */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Practical Guidance:
                </span>
                <span className="text-slate-200">{rec.actionableTip}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Suitability Matrix */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 p-5 sm:p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
          <Footprints className="w-4 h-4 text-sky-400" />
          Activity & Lifestyle Compatibility Index
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Running / Outdoor Fitness */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5 text-sky-400" /> Running & Cardio
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  getScoreBadge(runningScore).color
                }`}
              >
                {getScoreBadge(runningScore).label}
              </span>
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-white">
              {runningScore}/100
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {runningScore >= 75
                ? 'Ideal conditions for training and tempo runs.'
                : 'Consider early morning or indoor treadmill session.'}
            </p>
          </div>

          {/* Commute Safety */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-blue-400" /> Road Commute
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  getScoreBadge(commuteScore).color
                }`}
              >
                {getScoreBadge(commuteScore).label}
              </span>
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-white">
              {commuteScore}/100
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {commuteScore >= 80
                ? 'Dry pavements with standard transit flow.'
                : 'Pavement slickness or reduced visibility; drive with caution.'}
            </p>
          </div>

          {/* Laundry Drying */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-emerald-400" /> Laundry Line Drying
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  getScoreBadge(laundryScore).color
                }`}
              >
                {getScoreBadge(laundryScore).label}
              </span>
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-white">
              {laundryScore}/100
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {laundryScore >= 75
                ? 'Quick evaporative rate; suitable for outdoor line drying.'
                : 'Risk of dampness or rain exposure; dry indoors.'}
            </p>
          </div>

          {/* Outdoor Dining / Leisure */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-amber-400" /> Patio & Leisure
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  getScoreBadge(diningScore).color
                }`}
              >
                {getScoreBadge(diningScore).label}
              </span>
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-white">
              {diningScore}/100
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {diningScore >= 75
                ? 'Pleasant ambient atmosphere for open-air venues.'
                : 'Indoor seating recommended due to weather conditions.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
