import React from 'react';
import {
  Wind,
  Droplets,
  Thermometer,
  Compass,
  ArrowUp,
  ArrowDown,
  CloudRain,
  MapPin,
  Clock,
  Activity,
} from 'lucide-react';
import { GeoLocation, WeatherForecastResponse, TempUnit } from '../types/weather';
import { getWeatherCondition, formatTemp, formatSpeed } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  location: GeoLocation;
  weather: WeatherForecastResponse;
  unit: TempUnit;
  lastUpdated: Date;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  location,
  weather,
  unit,
  lastUpdated,
}) => {
  const current = weather.current_weather;
  const condition = getWeatherCondition(current.weathercode);
  const todayMax = weather.daily.temperature_2m_max[0] ?? current.temperature;
  const todayMin = weather.daily.temperature_2m_min[0] ?? current.temperature;
  const todayPrecip = weather.daily.precipitation_sum[0] ?? 0;
  const humidity = weather.current?.relative_humidity_2m;
  const apparentTemp = weather.current?.apparent_temperature;

  // Wind direction compass calculation
  const getWindDirectionLabel = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(lastUpdated);

  return (
    <div
      id="current-weather"
      className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-2xl p-6 sm:p-8 transition-all"
    >
      {/* Ambient Radial Gradient Glow */}
      <div
        className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none bg-gradient-to-br ${condition.bgGradient}`}
      />

      {/* Header Row: City, Country & Coordinates */}
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-sm font-medium">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>
              {[location.admin1, location.country].filter(Boolean).join(', ')}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            {location.name}
          </h1>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400 font-mono tabular-nums">
            <span>Lat: {location.latitude.toFixed(2)}°</span>
            <span aria-hidden="true">·</span>
            <span>Lon: {location.longitude.toFixed(2)}°</span>
            {location.timezone && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">{location.timezone}</span>
              </>
            )}
          </div>
        </div>

        {/* WMO Weather Code & Last Updated Badge */}
        <div className="flex flex-col sm:items-end gap-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800/90 border border-slate-700/80 text-xs">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400 font-mono">WMO Code:</span>
            <span className="text-white font-semibold font-mono tabular-nums">
              #{current.weathercode}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Updated {formattedTime}</span>
          </div>
        </div>
      </div>

      {/* Core Weather Presentation */}
      <div className="relative z-10 py-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left: Giant Temperature and Condition Details */}
        <div className="md:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 shadow-inner flex items-center justify-center shrink-0">
            <WeatherIcon
              name={condition.iconName}
              className="w-16 h-16 sm:w-20 sm:h-20 text-sky-400"
            />
          </div>

          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-7xl font-black text-white tracking-tighter tabular-nums font-mono">
                {formatTemp(current.temperature, unit)}
              </span>
            </div>

            <div className="mt-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
                {condition.label}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-0.5 leading-relaxed">
                {condition.description}
              </p>
            </div>

            {/* Today's High & Low Range */}
            <div className="mt-3 flex items-center gap-4 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1 text-rose-400 font-medium">
                <ArrowUp className="w-4 h-4" /> High: {formatTemp(todayMax, unit)}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1 text-cyan-400 font-medium">
                <ArrowDown className="w-4 h-4" /> Low: {formatTemp(todayMin, unit)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Key Telemetry Grid */}
        <div className="md:col-span-5 grid grid-cols-2 gap-3">
          {/* Wind Speed & Direction */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-sky-400" /> Wind Velocity
              </span>
              <span className="font-mono text-slate-400 font-medium">
                {getWindDirectionLabel(current.winddirection)}
              </span>
            </div>
            <div className="text-lg font-bold text-white font-mono tabular-nums">
              {formatSpeed(current.windspeed, 'kmh')}
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-mono">
              Vector: {Math.round(current.winddirection)}°
            </div>
          </div>

          {/* Feels Like / Apparent Temp */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Feels Like
              </span>
            </div>
            <div className="text-lg font-bold text-white font-mono tabular-nums">
              {apparentTemp !== undefined ? formatTemp(apparentTemp, unit) : formatTemp(current.temperature, unit)}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {apparentTemp !== undefined && apparentTemp > current.temperature ? 'Humidity index elevated' : 'Thermal balance normal'}
            </div>
          </div>

          {/* Precipitation Sum */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-blue-400" /> Precipitation
              </span>
            </div>
            <div className="text-lg font-bold text-white font-mono tabular-nums">
              {todayPrecip.toFixed(1)} mm
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {todayPrecip > 0 ? 'Accumulation active' : 'Zero precipitation'}
            </div>
          </div>

          {/* Humidity */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Humidity
              </span>
            </div>
            <div className="text-lg font-bold text-white font-mono tabular-nums">
              {humidity !== undefined ? `${Math.round(humidity)}%` : '--'}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {humidity ? (humidity > 70 ? 'High moisture' : humidity < 30 ? 'Dry air' : 'Optimal range') : 'Station data'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
