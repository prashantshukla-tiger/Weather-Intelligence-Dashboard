import React from 'react';
import {
  Sun,
  SunMedium,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Zap,
  Wind,
  Umbrella,
  Flame,
  ThermometerSnowflake,
  CheckCircle2,
  Compass,
  AlertTriangle,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  LucideProps,
} from 'lucide-react';

interface WeatherIconProps extends LucideProps {
  name: string;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = 'w-6 h-6', ...props }) => {
  switch (name) {
    case 'Sun':
      return <Sun className={className} {...props} />;
    case 'SunMedium':
      return <SunMedium className={className} {...props} />;
    case 'CloudSun':
      return <CloudSun className={className} {...props} />;
    case 'Cloud':
      return <Cloud className={className} {...props} />;
    case 'CloudFog':
      return <CloudFog className={className} {...props} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={className} {...props} />;
    case 'CloudRain':
      return <CloudRain className={className} {...props} />;
    case 'CloudSnow':
      return <CloudSnow className={className} {...props} />;
    case 'Snowflake':
      return <Snowflake className={className} {...props} />;
    case 'CloudLightning':
      return <CloudLightning className={className} {...props} />;
    case 'Zap':
      return <Zap className={className} {...props} />;
    case 'Wind':
      return <Wind className={className} {...props} />;
    case 'Umbrella':
      return <Umbrella className={className} {...props} />;
    case 'Flame':
      return <Flame className={className} {...props} />;
    case 'ThermometerSnowflake':
      return <ThermometerSnowflake className={className} {...props} />;
    case 'CheckCircle2':
      return <CheckCircle2 className={className} {...props} />;
    case 'Compass':
      return <Compass className={className} {...props} />;
    case 'AlertTriangle':
      return <AlertTriangle className={className} {...props} />;
    case 'Droplets':
      return <Droplets className={className} {...props} />;
    case 'Eye':
      return <Eye className={className} {...props} />;
    case 'Gauge':
      return <Gauge className={className} {...props} />;
    case 'Sunrise':
      return <Sunrise className={className} {...props} />;
    case 'Sunset':
      return <Sunset className={className} {...props} />;
    default:
      return <CloudSun className={className} {...props} />;
  }
};
