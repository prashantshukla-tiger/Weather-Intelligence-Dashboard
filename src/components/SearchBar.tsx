import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, History, AlertCircle } from 'lucide-react';
import { GeoLocation } from '../types/weather';
import { searchCities } from '../services/weatherApi';

interface SearchBarProps {
  onSelectCity: (city: GeoLocation) => void;
  currentCityName?: string;
  isLoadingWeather: boolean;
}

const POPULAR_CITIES: GeoLocation[] = [
  { id: 1264527, name: 'Chennai', country: 'India', country_code: 'IN', admin1: 'Tamil Nadu', latitude: 13.0878, longitude: 80.2785 },
  { id: 1850147, name: 'Tokyo', country: 'Japan', country_code: 'JP', admin1: 'Tokyo', latitude: 35.6895, longitude: 139.6917 },
  { id: 2643743, name: 'London', country: 'United Kingdom', country_code: 'GB', admin1: 'England', latitude: 51.5085, longitude: -0.1257 },
  { id: 5128581, name: 'New York', country: 'United States', country_code: 'US', admin1: 'New York', latitude: 40.7143, longitude: -74.006 },
  { id: 2988507, name: 'Paris', country: 'France', country_code: 'FR', admin1: 'Île-de-France', latitude: 48.8534, longitude: 2.3488 },
  { id: 292223, name: 'Dubai', country: 'United Arab Emirates', country_code: 'AE', admin1: 'Dubai', latitude: 25.0772, longitude: 55.3093 },
  { id: 1880252, name: 'Singapore', country: 'Singapore', country_code: 'SG', latitude: 1.2897, longitude: 103.8501 },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  currentCityName,
  isLoadingWeather,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [recentSearches, setRecentSearches] = useState<GeoLocation[]>(() => {
    try {
      const saved = localStorage.getItem('weather_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced geocoding search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    const controller = new AbortController();
    setIsSearching(true);
    setHasSearched(false);

    const timer = setTimeout(async () => {
      try {
        const data = await searchCities(query, controller.signal);
        setResults(data);
        setHasSearched(true);
        setIsOpen(true);
        setSelectedIndex(-1);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setResults([]);
        setHasSearched(true);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleSelect = (city: GeoLocation) => {
    onSelectCity(city);
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(-1);

    // Save to recents
    setRecentSearches((prev) => {
      const filtered = prev.filter((c) => c.id !== city.id);
      const updated = [city, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('weather_recent_searches', JSON.stringify(updated));
      } catch {
        // ignore local storage errors
      }
      return updated;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem('weather_recent_searches');
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full" ref={containerRef}>
      {/* Search Bar Container */}
      <div className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            {isSearching || isLoadingWeather ? (
              <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
            ) : (
              <Search className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={
              currentCityName
                ? `Search any city worldwide (currently viewing ${currentCityName})...`
                : 'Search any city worldwide (e.g., Chennai, Tokyo, London)...'
            }
            className="w-full pl-11 pr-10 py-3.5 bg-slate-900/90 text-white placeholder-slate-400 rounded-xl border border-slate-700/80 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm md:text-base shadow-lg transition-all"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                setHasSearched(false);
                inputRef.current?.focus();
              }}
              className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700/90 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800">
            {/* Live Search Results */}
            {query.trim().length >= 2 ? (
              <div>
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                    <span>Searching Open-Meteo Geocoding database...</span>
                  </div>
                ) : results.length > 0 ? (
                  <div className="py-2">
                    <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Matching Locations
                    </div>
                    {results.map((city, idx) => (
                      <button
                        key={`${city.id}-${city.latitude}-${city.longitude}`}
                        onClick={() => handleSelect(city)}
                        className={`w-full px-4 py-2.5 text-left flex items-center justify-between transition-colors ${
                          idx === selectedIndex
                            ? 'bg-sky-600/20 text-white'
                            : 'hover:bg-slate-800/80 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                          <div>
                            <span className="font-medium text-white">{city.name}</span>
                            <span className="text-xs text-slate-400 ml-2">
                              {[city.admin1, city.country].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-slate-400 tabular-nums font-mono hidden sm:block">
                          {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                        </div>
                      </button>
                    ))}
                  </div>
                ) : hasSearched ? (
                  <div className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-amber-400 text-sm font-medium">
                      <AlertCircle className="w-4 h-4" />
                      <span>No cities found matching "{query}"</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Check spelling or try a major nearby metropolitan area.
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Recent Searches */}
            {recentSearches.length > 0 && query.trim().length < 2 && (
              <div className="py-2">
                <div className="px-4 py-1.5 flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-slate-400" /> Recent Lookups
                  </span>
                  <button
                    onClick={clearRecent}
                    className="text-xs text-slate-400 hover:text-slate-200 lowercase font-normal"
                  >
                    clear
                  </button>
                </div>
                {recentSearches.map((city) => (
                  <button
                    key={`recent-${city.id}`}
                    onClick={() => handleSelect(city)}
                    className="w-full px-4 py-2 text-left flex items-center justify-between hover:bg-slate-800/80 text-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm">{city.name}</span>
                      <span className="text-xs text-slate-400">
                        ({[city.admin1, city.country].filter(Boolean).join(', ')})
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Popular Fast-Pick Locations */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-400 scrollbar-none">
        <span className="shrink-0 font-medium text-slate-400 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-sky-400" /> Quick select:
        </span>
        {POPULAR_CITIES.map((city) => {
          const isSelected = currentCityName?.toLowerCase() === city.name.toLowerCase();
          return (
            <button
              key={city.name}
              onClick={() => handleSelect(city)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all shrink-0 border ${
                isSelected
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-700/60 hover:text-white'
              }`}
            >
              {city.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
