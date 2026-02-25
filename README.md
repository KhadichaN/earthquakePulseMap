# Earthquake Pulse Map

An interactive 3D earthquake visualization on a globe.

Historical earthquakes (1900–2026, M ≥ 6) are rendered as glowing GPU points inside the Earth with depth-based positioning and nonlinear scaling.

Data is sourced from the **USGS Earthquake Catalog (GeoJSON)** and preprocessed into a binary format for performance.

---

## Tech Stack

- Vite + React + TypeScript (SWC)
- Three.js
- @react-three/fiber
- @react-three/drei
- Custom GLSL shaders

---

## Current Features

- 3D globe with rotation & zoom
- Transparent Earth mesh
- Coastlines rendered from Natural Earth dataset (binary format)
- Unified base radius across globe elements
- Binary data pipeline for earthquakes
- Earthquakes rendered as GPU points:
  - Position: lat/lon → 3D sphere
  - Depth: nonlinear scaling (visualized inside Earth)
  - Unknown depth handled explicitly (-1)
  - Color gradient by depth
  - Additive glow shader
- Chronological timeline playback:
  - GPU-driven time uniform
  - Play / Pause controls
  - Adjustable playback speed (0.25x → 4x)
  - Nonlinear lifeWindow scaling for consistent visual density
  - Stable animation independent of globe rotation
- Show All mode:
  - Static rendering of the full dataset
  - Timeline controls disabled automatically
  - Increased visual intensity for density clarity
- Informational side panels:
  - Dataset summary
  - Depth color scale
  - Magnitude → point size reference
- Chart:
  - date
  - magnitude
  - depth
- "Last 7 days" mode 

---

## Data Pipeline

1. USGS GeoJSON (1900–2026, M ≥ 6)
2. Node.js preprocessing scripts:
   - `scripts/convert-earthquakes.js`
   - `scripts/convert-coastline.js`
3. Conversion to compact `.bin` files
4. Runtime loading as `Float32Array`
5. GPU rendering via custom shaders

Binary format reduces runtime parsing overhead and improves rendering performance.

---

## Planned Features

- Tooltip / side panel:
  - place
  - magnitude
  - depth
  - time
  - USGS link
- Performance optimizations for high-density rendering

---

## Data Sources

- USGS Earthquake Catalog (GeoJSON)  
  https://earthquake.usgs.gov/

- Natural Earth – 110m Coastline  
  https://www.naturalearthdata.com/

---

## Getting Started

### Install

```bash
npm install
```

### 2) Run

```bash
npm run dev
```
