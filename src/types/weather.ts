export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  population?: number;
}

export interface GeocodingResponse {
  results?: GeoLocation[];
  generationtime_ms?: number;
}

export interface CurrentWeather {
  time: string;
  interval?: number;
  temperature: number;
  windspeed: number;
  winddirection: number;
  is_day: number;
  weathercode: number;
}

export interface CurrentVariables {
  time: string;
  temperature_2m?: number;
  relative_humidity_2m?: number;
  apparent_temperature?: number;
  is_day?: number;
  precipitation?: number;
  weather_code?: number;
  surface_pressure?: number;
  wind_speed_10m?: number;
  wind_direction_10m?: number;
}

export interface DailyForecast {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  windspeed_10m_max: number[];
  uv_index_max?: number[];
  precipitation_probability_max?: number[];
}

export interface WeatherForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: CurrentWeather;
  current?: CurrentVariables;
  daily: DailyForecast;
  daily_units?: {
    time: string;
    weathercode: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_sum: string;
    windspeed_10m_max: string;
  };
}

export interface WeatherConditionInfo {
  code: number;
  label: string;
  description: string;
  iconName: string;
  category: 'clear' | 'cloudy' | 'rain' | 'snow' | 'thunderstorm' | 'fog';
  bgGradient: string;
  cardGlow: string;
}

export type TempUnit = 'C' | 'F';
export type SpeedUnit = 'kmh' | 'mph';

export interface SmartRecommendation {
  id: string;
  title: string;
  subtitle: string;
  severity: 'favorable' | 'advisory' | 'warning' | 'info';
  icon: string;
  message: string;
  actionableTip: string;
}
