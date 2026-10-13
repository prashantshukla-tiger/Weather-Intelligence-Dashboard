import { WeatherForecastResponse, SmartRecommendation } from '../types/weather';

export function generateSmartRecommendations(data: WeatherForecastResponse): SmartRecommendation[] {
  const current = data.current_weather;
  const todayMaxTemp = data.daily.temperature_2m_max[0] ?? current.temperature;
  const todayMinTemp = data.daily.temperature_2m_min[0] ?? current.temperature;
  const todayPrecip = data.daily.precipitation_sum[0] ?? 0;
  const todayMaxWind = data.daily.windspeed_10m_max[0] ?? current.windspeed;
  const weatherCode = current.weathercode;
  const recommendations: SmartRecommendation[] = [];

  // 1. Precipitation & Umbrella advisory
  const isRainingNow = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode);
  if (todayPrecip > 2.0 || isRainingNow) {
    recommendations.push({
      id: 'umbrella',
      title: 'Rain Gear Required',
      subtitle: `${todayPrecip.toFixed(1)}mm forecast precipitation`,
      severity: todayPrecip > 10 ? 'warning' : 'advisory',
      icon: 'Umbrella',
      message: isRainingNow
        ? 'Active precipitation is underway in your area. Waterproof jacket or sturdy umbrella strongly recommended.'
        : `Measurable rain expected today (${todayPrecip.toFixed(1)}mm). Keep an umbrella in your bag before leaving.`,
      actionableTip: 'Opt for waterproof footwear and allow an extra 10–15 minutes for road commute.',
    });
  } else if (todayPrecip > 0.2) {
    recommendations.push({
      id: 'umbrella-light',
      title: 'Passing Drizzle Possible',
      subtitle: `${todayPrecip.toFixed(1)}mm light accumulation`,
      severity: 'info',
      icon: 'CloudDrizzle',
      message: 'Brief light showers or damp conditions may occur during intervals today.',
      actionableTip: 'A compact umbrella or water-resistant windbreaker will keep you covered.',
    });
  }

  // 2. Temperature Extreme: Extreme Heat & High UV Alert
  if (todayMaxTemp >= 35) {
    recommendations.push({
      id: 'heat-alert',
      title: 'High Heat & Sun Exposure Alert',
      subtitle: `Peak temperature reaching ${Math.round(todayMaxTemp)}°C`,
      severity: 'warning',
      icon: 'Flame',
      message: 'High heat stress levels predicted. Elevated thermal conditions can cause rapid dehydration.',
      actionableTip: 'Drink plenty of water (2–3L), seek air-conditioned spaces, and avoid strenuous outdoor exercise between 12 PM – 4 PM.',
    });
  } else if (todayMaxTemp >= 30) {
    recommendations.push({
      id: 'heat-moderate',
      title: 'Warm & Sunny Conditions',
      subtitle: `High of ${Math.round(todayMaxTemp)}°C`,
      severity: 'info',
      icon: 'SunMedium',
      message: 'Warm daytime temperatures. Moderate solar intensity across peak midday hours.',
      actionableTip: 'Wear lightweight, breathable cotton or linen fabrics and use SPF 30+ sunscreen outdoors.',
    });
  }

  // 3. Cold Weather & Frost Alert
  if (todayMinTemp <= 5 || current.temperature <= 6) {
    recommendations.push({
      id: 'cold-alert',
      title: 'Cold Weather Advisory',
      subtitle: `Lows dipping to ${Math.round(todayMinTemp)}°C`,
      severity: 'warning',
      icon: 'Snowflake',
      message: 'Brisk, cold air masses active. Chill factor may feel noticeably colder in shaded areas.',
      actionableTip: 'Layer with thermal base layers, a fleece or insulated coat, and keep extremities covered.',
    });
  } else if (todayMinTemp <= 12) {
    recommendations.push({
      id: 'cold-mild',
      title: 'Cool Morning & Evening Chill',
      subtitle: `Lows around ${Math.round(todayMinTemp)}°C`,
      severity: 'info',
      icon: 'ThermometerSnowflake',
      message: 'Crisp temperatures in the morning and post-dusk hours.',
      actionableTip: 'Carry a light knit sweater or light jacket if staying out after sunset.',
    });
  }

  // 4. Wind Alert
  if (todayMaxWind >= 28 || current.windspeed >= 28) {
    recommendations.push({
      id: 'wind-alert',
      title: 'High Wind Velocity Advisory',
      subtitle: `Gusts up to ${Math.round(todayMaxWind)} km/h`,
      severity: 'advisory',
      icon: 'Wind',
      message: 'Noticeable wind shear and gustiness. May cause unstable handling for two-wheelers and high-profile vehicles.',
      actionableTip: 'Secure balcony plants and lightweight outdoor furniture; take care when opening car doors.',
    });
  }

  // 5. Ideal Outdoor Weather Check
  const isMildTemp = todayMaxTemp >= 18 && todayMaxTemp <= 28;
  const isDry = todayPrecip < 1.0;
  const isCalmWind = todayMaxWind < 22;
  const isClearOrPartly = [0, 1, 2].includes(weatherCode);

  if (isMildTemp && isDry && isCalmWind && isClearOrPartly) {
    recommendations.push({
      id: 'ideal-outdoor',
      title: 'Prime Outdoor Weather Window',
      subtitle: `${Math.round(todayMaxTemp)}°C with pleasant skies`,
      severity: 'favorable',
      icon: 'Compass',
      message: 'Atmospheric conditions are in an optimal comfort zone with gentle breezes and pleasant temperatures.',
      actionableTip: 'Ideal timing for park visits, outdoor runs, al fresco dining, and cycling excursions.',
    });
  }

  // 6. Fog or Visibility Warning
  if ([45, 48].includes(weatherCode)) {
    recommendations.push({
      id: 'fog-alert',
      title: 'Low Visibility & Mist Warning',
      subtitle: 'Dense fog layers reported',
      severity: 'warning',
      icon: 'CloudFog',
      message: 'Surface mist and dense fog causing reduced horizontal visibility on highways and streets.',
      actionableTip: 'Use low-beam headlights or fog lamps, maintain extra braking distance, and avoid speeding.',
    });
  }

  // 7. Thunderstorm Safety Alert
  if ([95, 96, 99].includes(weatherCode)) {
    recommendations.push({
      id: 'storm-alert',
      title: 'Active Thunderstorm Alert',
      subtitle: 'Convective lightning & localized gusts',
      severity: 'warning',
      icon: 'Zap',
      message: 'Severe electrical storm activity. Heightened risk of cloud-to-ground lightning discharge.',
      actionableTip: 'Seek solid indoor shelter immediately; avoid tall trees, open fields, and metal structures.',
    });
  }

  // Fallback favorable recommendation if fewer than 2 items generated
  if (recommendations.length < 2) {
    recommendations.push({
      id: 'daily-outlook',
      title: 'Stable Atmospheric Flow',
      subtitle: `Current temperature ${Math.round(current.temperature)}°C`,
      severity: 'favorable',
      icon: 'CheckCircle2',
      message: 'No hazardous weather systems detected in the immediate regional forecast.',
      actionableTip: 'Standard daily routines and commute plans can proceed without weather interruptions.',
    });
  }

  return recommendations;
}
