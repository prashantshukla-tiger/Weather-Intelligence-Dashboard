# Weather Intelligence App

A responsive, production-grade meteorological intelligence web application built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **Lucide Icons**, and **Chart.js**.

Powered by the **Open-Meteo Geocoding and Forecast APIs**, this application provides high-precision real-time conditions, 7-day extended forecasts, interactive thermal trend visualizations, and dynamic rule-based planning recommendations.

---

## Key Features

1. **Precision Geocoding & City Resolution**
   - Integrates the [Open-Meteo Geocoding API](https://geocoding-api.open-meteo.com/v1/search) with real-time debounced autocomplete.
   - Resolves any municipality worldwide into latitude, longitude, country, and administrative region.
   - Default initial search configured to **Chennai, India** with one-tap quick-selection for major global hubs (Tokyo, London, New York, Paris, Dubai, Singapore).
   - Recent lookups cached in `localStorage` for rapid repeat access.
   - Built-in GPS device geolocation fallback.

2. **Real-Time Current Weather Telemetry**
   - Integrates the [Open-Meteo Forecast API](https://api.open-meteo.com/v1/forecast).
   - Displays current temperature in Celsius (°C) and Fahrenheit (°F) with one-click instant unit toggle.
   - Full WMO (World Meteorological Organization) weather code categorization and descriptive labels.
   - Wind velocity (km/h and direction vectors), apparent "feels like" temperature, relative humidity, and precipitation sum.

3. **7-Day Daily Forecast Grid**
   - High/low daily temperatures with visual relative thermal range scale bars.
   - Precipitation forecasts (mm accumulation) and wind speeds.
   - Interactive card inspection drawer for drilled-down daily weather analysis.

4. **Temperature Trend Analytics Chart**
   - Powered by **Chart.js** via `react-chartjs-2`.
   - Dual-trajectory bezier curves for 7-day daytime highs and overnight radiative lows.
   - Segmented interactive view filters (Combined, Highs Only, Lows Only).
   - Customized dark theme tooltips detailing date, temperature, WMO condition, and precipitation.
   - Summary statistics: Peak expected high, lowest low, max diurnal swing, and average temperatures.

5. **Smart Planning Recommendations Engine**
   - Dynamic contextual guidance synthesized from weather telemetry:
     - **Precipitation & Umbrella Advisory**: Warns when rain gear is required.
     - **Heat & Sun Exposure Alert**: Triggers for temperatures $\ge 35^\circ\text{C}$ with hydration reminders.
     - **Cold Weather Advisory**: Flags sub-$10^\circ\text{C}$ conditions with layering advice.
     - **Wind Velocity Alert**: Warns on wind speeds $> 25\text{ km/h}$.
     - **Prime Outdoor Window**: Identifies optimal mild weather ($18\text{--}28^\circ\text{C}$, calm winds, dry skies).
     - **Fog / Low Visibility Warning**: Road safety alerts for dense mist.
     - **Thunderstorm Alert**: Lightning warnings and safety protocols.
   - **Activity Compatibility Matrix**: Calculated suitability ratings (0–100) for running/cardio, daily commute, outdoor line drying, and patio leisure.

6. **Error Handling & Network Resiliency**
   - Graceful empty states when invalid search queries return zero matches.
   - Offline detection (`navigator.onLine`) and network error banners with manual retry capabilities.
   - Skeleton shimmer loaders during network requests.

---

## Tech Stack & Architecture

- **Framework**: React 19 + TypeScript (Pure client-side ESM; zero server runtime dependencies)
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4
- **Charts**: Chart.js 4 + react-chartjs-2
- **Icons**: Lucide React
- **Data Source**: Open-Meteo APIs (Free, non-commercial open weather license, no API key required)

---

## Local Development Setup

### Prerequisites
- Node.js 18.x or later
- npm 9.x or later

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/your-username/weather-intelligence-app.git
cd weather-intelligence-app

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Open in browser at http://localhost:3000
```

### Production Build

```bash
# Compile and bundle static assets
npm run build

# Preview production build locally
npm run preview
```
The output directory will be `dist/`.

---

## Cloudflare Pages Deployment Guidelines

The Weather Intelligence App is a 100% static client-side single-page application (SPA), making it natively optimized for Cloudflare Pages with worldwide edge CDN distribution.

### Method A: Deploy via Cloudflare Dashboard (Recommended)

1. **Log in to Cloudflare**
   - Navigate to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **Compute (Workers) > Workers & Pages** or directly to **Pages**.

2. **Connect GitHub / Git Repository**
   - Click **Create application** > **Pages** > **Connect to Git**.
   - Select your repository (`weather-intelligence-app`).

3. **Configure Build Settings**
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: In **Environment variables**, set `NODE_VERSION` to `20` (or `18`).

4. **Deploy**
   - Click **Save and Deploy**. Cloudflare Pages will build the static bundle and assign a `*.pages.dev` production URL.

5. **Single-Page Application (SPA) Routing Note**
   - For custom routes or deep linking, create a `public/_routes.json` or Cloudflare Pages redirects rule if using HTML5 history routes.

---

### Method B: Deploy via Wrangler CLI

You can also deploy directly from your local terminal using the Cloudflare Wrangler CLI:

```bash
# 1. Build the production bundle
npm run build

# 2. Install wrangler globally (or use npx)
npx wrangler pages deploy dist --project-name=weather-intelligence-app
```

---

## GitHub Setup & GitHub Actions Workflow

To enable automatic continuous deployment on every `git push` to `main`:

Create `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Static Applet
        run: npm run build

      - name: Publish to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: 'weather-intelligence-app'
          directory: 'dist'
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

---

## Open-Meteo API Endpoints Reference

This app consumes public Open-Meteo REST endpoints without rate-limiting keys:

- **Geocoding API**:
  `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=5&language=en&format=json`
- **Weather Forecast API**:
  `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto`

---

## License

This project is licensed under the Apache 2.0 License. Weather data provided by [Open-Meteo](https://open-meteo.com/) under CC BY 4.0.
