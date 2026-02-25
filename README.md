# Earthquake Map

Earthquake Map is an interactive 3D globe that lets you *feel* seismic activity over time.

You can explore:
- the full historical dataset (`1900–2026`, `M >= 6`)
- a live-style **Last 7 Days** mode (`M >= 2.5`)

Built for smooth rendering, fast loading, and clear visual storytelling.

## Live Demo

Deployed on Vercel:  
https://earthquake-map-nine.vercel.app/

## Highlights

- Real-time style 3D globe experience (rotate, zoom, inspect)
- GPU-rendered glowing quake points with custom shaders
- Depth-aware placement inside the Earth (nonlinear scaling)
- Timeline playback with speed controls
- **Last 7 Days mode** 

## Data Modes

1. `Historic`
- Range: `1900–2026`
- Filter: `M >= 6`
- Timeline uses monthly aggregation for chart display

2. `Last 7 Days`
- Source: USGS `2.5_week` feed
- Filter: `M >= 2.5`
- Uses a fixed 7-day UTC window
- Timeline chart shows daily aggregates


## Tech Stack

- React + TypeScript + Vite
- Three.js + `@react-three/fiber` + `@react-three/drei`
- amCharts 5 (timeline strips)
- SCSS modules
- Custom GLSL shaders

## Local Development

1. Install dependencies
```bash
npm install
```

2. Start dev server
```bash
npm run dev
```

3. Build for production
```bash
npm run build
```

4. Preview production build
```bash
npm run preview
```

## Data Pipeline

Historical data is preprocessed into compact binary assets for performance:

1. Fetch and process source datasets
2. Convert to `.bin` with scripts:
   - `scripts/convert-earthquakes.js`
   - `scripts/convert-coastline.js`
3. Load binary data at runtime as `Float32Array`
4. Render through GPU pipeline

## Data Sources

- USGS Earthquake Catalog  
  https://earthquake.usgs.gov/
- Natural Earth (110m Coastline)  
  https://www.naturalearthdata.com/

## Roadmap

- Rich quake tooltip/card (place, magnitude, depth, time, USGS link)
- More performance tuning for dense scenes
