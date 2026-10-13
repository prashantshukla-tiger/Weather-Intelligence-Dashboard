import { GeocodingResponse, GeoLocation, WeatherForecastResponse } from '../types/weather';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query: string, signal?: AbortSignal): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(trimmed)}&count=5&language=en&format=json`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) {
      throw new Error(`Geocoding service returned status ${res.status}`);
    }
    const data: GeocodingResponse = await res.json();
    return data.results ?? [];
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return [];
    }
    throw err;
  }
}

export async function fetchWeatherForecast(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<WeatherForecastResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current_weather: 'true',
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m',
    daily: 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,uv_index_max,precipitation_probability_max',
    timezone: 'auto',
  });

  const url = `${FORECAST_BASE_URL}?${params.toString()}`;

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Forecast service returned HTTP ${res.status}`);
  }

  const data: WeatherForecastResponse = await res.json();

  // Validate critical fields
  if (!data.current_weather || !data.daily || !data.daily.time) {
    throw new Error('Incomplete weather telemetry received from station.');
  }

  return data;
}
