import { WeatherConditionInfo } from '../types/weather';

export const WMO_WEATHER_CODES: Record<number, WeatherConditionInfo> = {
  0: {
    code: 0,
    label: 'Clear Sky',
    description: 'Completely clear sky with abundant sunshine',
    iconName: 'Sun',
    category: 'clear',
    bgGradient: 'from-amber-500/15 via-orange-500/10 to-transparent',
    cardGlow: 'rgba(245, 158, 11, 0.2)',
  },
  1: {
    code: 1,
    label: 'Mainly Clear',
    description: 'Scattered high clouds with mostly sunny intervals',
    iconName: 'SunMedium',
    category: 'clear',
    bgGradient: 'from-amber-400/15 via-sky-500/10 to-transparent',
    cardGlow: 'rgba(251, 191, 36, 0.18)',
  },
  2: {
    code: 2,
    label: 'Partly Cloudy',
    description: 'Sun interspersed with fair weather cumulus clouds',
    iconName: 'CloudSun',
    category: 'cloudy',
    bgGradient: 'from-sky-500/15 via-blue-600/10 to-transparent',
    cardGlow: 'rgba(56, 189, 248, 0.15)',
  },
  3: {
    code: 3,
    label: 'Overcast',
    description: 'Continuous cloud cover with diffused light',
    iconName: 'Cloud',
    category: 'cloudy',
    bgGradient: 'from-slate-500/20 via-slate-700/10 to-transparent',
    cardGlow: 'rgba(148, 163, 184, 0.15)',
  },
  45: {
    code: 45,
    label: 'Foggy',
    description: 'Dense ground-level mist reducing visibility below 1km',
    iconName: 'CloudFog',
    category: 'fog',
    bgGradient: 'from-zinc-500/20 via-slate-700/10 to-transparent',
    cardGlow: 'rgba(161, 161, 170, 0.15)',
  },
  48: {
    code: 48,
    label: 'Depositing Rime Fog',
    description: 'Freezing fog depositing ice crystals on surfaces',
    iconName: 'CloudFog',
    category: 'fog',
    bgGradient: 'from-cyan-600/20 via-slate-800/10 to-transparent',
    cardGlow: 'rgba(6, 182, 212, 0.15)',
  },
  51: {
    code: 51,
    label: 'Light Drizzle',
    description: 'Fine, gentle droplets of intermittent precipitation',
    iconName: 'CloudDrizzle',
    category: 'rain',
    bgGradient: 'from-teal-600/20 via-slate-800/10 to-transparent',
    cardGlow: 'rgba(20, 184, 166, 0.18)',
  },
  53: {
    code: 53,
    label: 'Moderate Drizzle',
    description: 'Steady fine drizzle dampening outdoor surfaces',
    iconName: 'CloudDrizzle',
    category: 'rain',
    bgGradient: 'from-cyan-600/20 via-slate-800/10 to-transparent',
    cardGlow: 'rgba(6, 182, 212, 0.2)',
  },
  55: {
    code: 55,
    label: 'Dense Drizzle',
    description: 'Continuous thick drizzle with reduced visibility',
    iconName: 'CloudDrizzle',
    category: 'rain',
    bgGradient: 'from-blue-600/20 via-slate-800/10 to-transparent',
    cardGlow: 'rgba(59, 130, 246, 0.2)',
  },
  56: {
    code: 56,
    label: 'Freezing Drizzle',
    description: 'Light freezing drizzle creating thin ice glaze',
    iconName: 'CloudSnow',
    category: 'rain',
    bgGradient: 'from-cyan-500/20 via-blue-900/10 to-transparent',
    cardGlow: 'rgba(6, 182, 212, 0.2)',
  },
  57: {
    code: 57,
    label: 'Heavy Freezing Drizzle',
    description: 'Dense freezing drizzle with slippery pavement hazard',
    iconName: 'CloudSnow',
    category: 'rain',
    bgGradient: 'from-cyan-500/20 via-blue-900/10 to-transparent',
    cardGlow: 'rgba(6, 182, 212, 0.25)',
  },
  61: {
    code: 61,
    label: 'Slight Rain',
    description: 'Gentle, light rainfall with occasional damp patches',
    iconName: 'CloudRain',
    category: 'rain',
    bgGradient: 'from-blue-500/20 via-indigo-900/10 to-transparent',
    cardGlow: 'rgba(59, 130, 246, 0.2)',
  },
  63: {
    code: 63,
    label: 'Moderate Rain',
    description: 'Steady raindrops accumulating noticeable precipitation',
    iconName: 'CloudRain',
    category: 'rain',
    bgGradient: 'from-blue-600/25 via-indigo-950/15 to-transparent',
    cardGlow: 'rgba(37, 99, 235, 0.25)',
  },
  65: {
    code: 65,
    label: 'Heavy Rain',
    description: 'Intense rain downpour with pooling water',
    iconName: 'CloudRain',
    category: 'rain',
    bgGradient: 'from-blue-700/30 via-slate-900/20 to-transparent',
    cardGlow: 'rgba(29, 78, 216, 0.3)',
  },
  66: {
    code: 66,
    label: 'Light Freezing Rain',
    description: 'Freezing rain creating black ice layers',
    iconName: 'CloudSnow',
    category: 'rain',
    bgGradient: 'from-indigo-600/25 via-slate-900/20 to-transparent',
    cardGlow: 'rgba(99, 102, 241, 0.25)',
  },
  67: {
    code: 67,
    label: 'Heavy Freezing Rain',
    description: 'Severe freezing precipitation causing icing hazards',
    iconName: 'CloudSnow',
    category: 'rain',
    bgGradient: 'from-indigo-700/30 via-slate-900/20 to-transparent',
    cardGlow: 'rgba(79, 70, 229, 0.3)',
  },
  71: {
    code: 71,
    label: 'Slight Snowfall',
    description: 'Light flurries of individual snowflakes drifting down',
    iconName: 'Snowflake',
    category: 'snow',
    bgGradient: 'from-sky-300/20 via-slate-800/15 to-transparent',
    cardGlow: 'rgba(125, 211, 252, 0.2)',
  },
  73: {
    code: 73,
    label: 'Moderate Snow',
    description: 'Steady snowfall accumulating on cold surfaces',
    iconName: 'Snowflake',
    category: 'snow',
    bgGradient: 'from-sky-400/25 via-slate-800/20 to-transparent',
    cardGlow: 'rgba(56, 189, 248, 0.25)',
  },
  75: {
    code: 75,
    label: 'Heavy Snow',
    description: 'Heavy snowfall with deep accumulation and drift',
    iconName: 'Snowflake',
    category: 'snow',
    bgGradient: 'from-cyan-300/30 via-slate-900/25 to-transparent',
    cardGlow: 'rgba(103, 232, 249, 0.3)',
  },
  77: {
    code: 77,
    label: 'Snow Grains',
    description: 'Small white opaque grains of granular snow',
    iconName: 'Snowflake',
    category: 'snow',
    bgGradient: 'from-sky-300/20 via-slate-900/15 to-transparent',
    cardGlow: 'rgba(125, 211, 252, 0.2)',
  },
  80: {
    code: 80,
    label: 'Slight Rain Showers',
    description: 'Brief intermittent rain showers with breaks of sun',
    iconName: 'CloudRain',
    category: 'rain',
    bgGradient: 'from-blue-500/20 via-indigo-900/10 to-transparent',
    cardGlow: 'rgba(59, 130, 246, 0.2)',
  },
  81: {
    code: 81,
    label: 'Moderate Showers',
    description: 'Passing rain showers with rapid precipitation pulses',
    iconName: 'CloudRain',
    category: 'rain',
    bgGradient: 'from-blue-600/25 via-indigo-950/15 to-transparent',
    cardGlow: 'rgba(37, 99, 235, 0.25)',
  },
  82: {
    code: 82,
    label: 'Violent Rain Showers',
    description: 'Torrential downpours from convective storm clouds',
    iconName: 'CloudRain',
    category: 'rain',
    bgGradient: 'from-indigo-700/30 via-slate-950/25 to-transparent',
    cardGlow: 'rgba(67, 56, 202, 0.3)',
  },
  85: {
    code: 85,
    label: 'Slight Snow Showers',
    description: 'Intermittent bursts of snow flurries with gusty wind',
    iconName: 'Snowflake',
    category: 'snow',
    bgGradient: 'from-sky-400/20 via-slate-900/15 to-transparent',
    cardGlow: 'rgba(56, 189, 248, 0.2)',
  },
  86: {
    code: 86,
    label: 'Heavy Snow Showers',
    description: 'Intense snow squalls with rapid visibility drops',
    iconName: 'Snowflake',
    category: 'snow',
    bgGradient: 'from-sky-300/25 via-slate-950/20 to-transparent',
    cardGlow: 'rgba(125, 211, 252, 0.25)',
  },
  95: {
    code: 95,
    label: 'Thunderstorm',
    description: 'Convective thunderstorm with audible thunder and lightning',
    iconName: 'CloudLightning',
    category: 'thunderstorm',
    bgGradient: 'from-purple-600/25 via-slate-900/20 to-transparent',
    cardGlow: 'rgba(168, 85, 247, 0.25)',
  },
  96: {
    code: 96,
    label: 'Thunderstorm with Hail',
    description: 'Severe storm producing lightning and hail stones',
    iconName: 'CloudLightning',
    category: 'thunderstorm',
    bgGradient: 'from-fuchsia-700/30 via-slate-950/25 to-transparent',
    cardGlow: 'rgba(192, 38, 211, 0.3)',
  },
  99: {
    code: 99,
    label: 'Heavy Thunderstorm & Hail',
    description: 'Intense severe thunderstorm with damaging hail and gusts',
    iconName: 'CloudLightning',
    category: 'thunderstorm',
    bgGradient: 'from-violet-800/35 via-zinc-950/30 to-transparent',
    cardGlow: 'rgba(139, 92, 246, 0.35)',
  },
};

export function getWeatherCondition(code: number): WeatherConditionInfo {
  if (code in WMO_WEATHER_CODES) {
    return WMO_WEATHER_CODES[code];
  }
  return {
    code,
    label: `Code ${code}`,
    description: 'Atmospheric conditions reported by station',
    iconName: 'Cloud',
    category: 'cloudy',
    bgGradient: 'from-slate-600/20 via-slate-800/10 to-transparent',
    cardGlow: 'rgba(100, 116, 139, 0.15)',
  };
}

export function formatTemp(celsius: number, unit: 'C' | 'F' = 'C'): string {
  if (unit === 'F') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function convertTemp(celsius: number, unit: 'C' | 'F' = 'C'): number {
  if (unit === 'F') {
    return Math.round(((celsius * 9) / 5 + 32) * 10) / 10;
  }
  return Math.round(celsius * 10) / 10;
}

export function formatSpeed(kmh: number, unit: 'kmh' | 'mph' = 'kmh'): string {
  if (unit === 'mph') {
    const mph = kmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}
