import React, { useState, useEffect, useCallback } from 'react';
import { GeoLocation, WeatherForecastResponse, TempUnit } from './types/weather';
import { fetchWeatherForecast } from './services/weatherApi';
import { generateSmartRecommendations } from './utils/recommendations';
import { TopBar } from './components/TopBar';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { ForecastGrid } from './components/ForecastGrid';
import { TemperatureTrendChart } from './components/TemperatureTrendChart';
import { SmartRecommendations } from './components/SmartRecommendations';
import { ErrorAlert } from './components/ErrorAlert';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { Cloud, ShieldCheck, ExternalLink, Globe2 } from 'lucide-react';

const DEFAULT_CITY: GeoLocation = {
  id: 1264527,
  name: 'Chennai',
  latitude: 13.0878,
  longitude: 80.2785,
  country: 'India',
  country_code: 'IN',
  admin1: 'Tamil Nadu',
  timezone: 'Asia/Kolkata',
};

export default function App() {
  const [currentCity, setCurrentCity] = useState<GeoLocation>(() => {
    try {
      const saved = localStorage.getItem('weather_saved_city');
      return saved ? JSON.parse(saved) : DEFAULT_CITY;
    } catch {
      return DEFAULT_CITY;
    }
  });

  const [unit, setUnit] = useState<TempUnit>(() => {
    try {
      const saved = localStorage.getItem('weather_temp_unit');
      return saved === 'F' ? 'F' : 'C';
    } catch {
      return 'C';
    }
  });

  const [weatherData, setWeatherData] = useState<WeatherForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLocating, setIsLocating] = useState(false);

  // Fetch forecast data
  const loadForecast = useCallback(async (city: GeoLocation) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await fetchWeatherForecast(city.latitude, city.longitude);
      setWeatherData(data);
      setLastUpdated(new Date());

      try {
        localStorage.setItem('weather_saved_city', JSON.stringify(city));
      } catch {
        // ignore
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve meteorological telemetry.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadForecast(currentCity);
  }, [currentCity, loadForecast]);

  // Unit switch
  const handleToggleUnit = () => {
    const nextUnit: TempUnit = unit === 'C' ? 'F' : 'C';
    setUnit(nextUnit);
    try {
      localStorage.setItem('weather_temp_unit', nextUnit);
    } catch {
      // ignore
    }
  };

  // City selection
  const handleSelectCity = (city: GeoLocation) => {
    setCurrentCity(city);
  };

  // Manual refresh
  const handleRefresh = () => {
    loadForecast(currentCity);
  };

  // Browser Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser environment.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const localizedLocation: GeoLocation = {
          id: Math.round(latitude * 1000 + longitude),
          name: 'Local Coordinate',
          latitude,
          longitude,
          admin1: 'Device GPS',
          country: 'Current Area',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };

        setCurrentCity(localizedLocation);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = 'Could not access device location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission was denied. Please select a city using the search bar.';
        }
        setErrorMessage(errorMsg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const smartRecommendations = weatherData
    ? generateSmartRecommendations(weatherData)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#070c18] text-slate-100 selection:bg-sky-500/30 selection:text-white">
      {/* Top Bar Navigation */}
      <TopBar
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onRefresh={handleRefresh}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLoading={isLoading}
        isLocating={isLocating}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Search Bar Section */}
        <div className="max-w-3xl mx-auto">
          <SearchBar
            onSelectCity={handleSelectCity}
            currentCityName={currentCity.name}
            isLoadingWeather={isLoading}
          />
        </div>

        {/* Error Alert Display */}
        {errorMessage && (
          <ErrorAlert
            message={errorMessage}
            onRetry={handleRefresh}
            isRetrying={isLoading}
          />
        )}

        {/* Loading Skeleton */}
        {isLoading && !weatherData && <LoadingSkeleton />}

        {/* Populated Dashboard State */}
        {weatherData && (
          <div className="space-y-8 sm:space-y-10">
            {/* 1. Current Weather Card */}
            <CurrentWeatherCard
              location={currentCity}
              weather={weatherData}
              unit={unit}
              lastUpdated={lastUpdated}
            />

            {/* 2. 7-Day Forecast Grid */}
            <ForecastGrid daily={weatherData.daily} unit={unit} />

            {/* 3. Temperature Trend Line Chart */}
            <TemperatureTrendChart daily={weatherData.daily} unit={unit} />

            {/* 4. Smart Planning Recommendations */}
            <SmartRecommendations
              recommendations={smartRecommendations}
              weather={weatherData}
              cityName={currentCity.name}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-300">Weather Intelligence App</span>
            <span aria-hidden="true">·</span>
            <span>Client-side Pure ESM Architecture</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-300 transition-colors flex items-center gap-1"
            >
              <span>Powered by Open-Meteo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5 text-slate-400" /> WMO Standard
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
