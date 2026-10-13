import React from 'react';
import { CloudSun, RotateCw, Navigation, Compass } from 'lucide-react';
import { TempUnit } from '../types/weather';

interface TopBarProps {
  unit: TempUnit;
  onToggleUnit: () => void;
  onRefresh: () => void;
  onUseCurrentLocation: () => void;
  isLoading: boolean;
  isLocating: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  unit,
  onToggleUnit,
  onRefresh,
  onUseCurrentLocation,
  isLoading,
  isLocating,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070c18]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
            <CloudSun className="w-5 h-5" />
          </div>
          <a
            href="/"
            className="text-lg font-bold tracking-tight text-white whitespace-nowrap hover:text-sky-300 transition-colors"
          >
            Weather Intelligence
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a
            href="#current-weather"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Overview
          </a>
          <a
            href="#forecast-section"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            7-Day Forecast
          </a>
          <a
            href="#trend-chart"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Temperature Trends
          </a>
          <a
            href="#smart-recommendations"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Smart Intelligence
          </a>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Unit Toggle Button */}
          <button
            onClick={onToggleUnit}
            title={`Switch to ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
            className="flex items-center px-2.5 py-1.5 text-xs font-semibold rounded-md border border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700/80 transition-colors whitespace-nowrap"
          >
            <span className={unit === 'C' ? 'text-sky-400 font-bold' : 'text-slate-400'}>°C</span>
            <span className="mx-1 text-slate-600">/</span>
            <span className={unit === 'F' ? 'text-sky-400 font-bold' : 'text-slate-400'}>°F</span>
          </button>

          {/* Current Geolocation Trigger */}
          <button
            onClick={onUseCurrentLocation}
            disabled={isLocating || isLoading}
            title="Detect My Location"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700/80 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            <Navigation className={`w-3.5 h-3.5 text-sky-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">My Location</span>
          </button>

          {/* Data Refresh */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh weather data"
            className="p-2 text-slate-300 hover:text-white rounded-md border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 disabled:opacity-50 transition-colors shrink-0"
            aria-label="Refresh telemetry"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
