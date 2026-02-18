import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(
  __dirname,
  "../public/data/coastline.geojson"
);

const outputPath = path.join(
  __dirname,
  "../public/data/coastline.bin"
);

const RADIUS = 1.02;

function latLonToXYZ(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

const raw = fs.readFileSync(inputPath, "utf-8");
const geo = JSON.parse(raw);

const vertices = [];

for (const feature of geo.features) {
  const { geometry } = feature;

  const processLine = (coords) => {
    for (let i = 0; i < coords.length - 1; i++) {
      const [lon1, lat1] = coords[i];
      const [lon2, lat2] = coords[i + 1];

      if (Math.abs(lon1 - lon2) > 180) continue;

      const v1 = latLonToXYZ(lat1, lon1, RADIUS);
      const v2 = latLonToXYZ(lat2, lon2, RADIUS);

      vertices.push(...v1);
      vertices.push(...v2);
    }
  };

  if (geometry.type === "LineString") {
    processLine(geometry.coordinates);
  }

  if (geometry.type === "MultiLineString") {
    for (const line of geometry.coordinates) {
      processLine(line);
    }
  }
}

const floatArray = new Float32Array(vertices);
fs.writeFileSync(outputPath, Buffer.from(floatArray.buffer));

console.log("Coastline binary created:", outputPath);
console.log("Vertices count:", floatArray.length / 3);
