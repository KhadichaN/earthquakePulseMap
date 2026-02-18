import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export default function EarthquakesPoints() {
  const [data, setData] = useState<Float32Array | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useEffect(() => {
    fetch("/data/earthquakes.bin")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        setData(new Float32Array(buffer));
      });
  }, []);

  const geometry = useMemo(() => {
    if (!data) return null;

    const stride = 6;
    const count = data.length / stride;

    const positions = new Float32Array(count * 3);
    const magnitudes = new Float32Array(count);
    const depths = new Float32Array(count);

    const baseRadius = 1.02;
    const maxDepthKm = 700;

    for (let i = 0; i < count; i++) {
      const x = data[i * stride];
      const y = data[i * stride + 1];
      const z = data[i * stride + 2];
      const mag = data[i * stride + 3];
      const depth = data[i * stride + 4];

      const v = new THREE.Vector3(x, y, z).normalize();

      let depthNorm = 0;

      if (depth >= 0) {
        depthNorm = Math.min(depth / maxDepthKm, 1.0);
        depthNorm = depthNorm ** 0.6;
      }

      const finalRadius =
        depth >= 0 ? baseRadius - depthNorm * 0.35 : baseRadius; // неизвестные строго на поверхности

      const finalPos = v.multiplyScalar(finalRadius);

      positions[i * 3] = finalPos.x;
      positions[i * 3 + 1] = finalPos.y;
      positions[i * 3 + 2] = finalPos.z;

      magnitudes[i] = mag;
      depths[i] = depth;
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    geometry.setAttribute(
      "aMagnitude",
      new THREE.BufferAttribute(magnitudes, 1),
    );

    geometry.setAttribute("aDepth", new THREE.BufferAttribute(depths, 1));

    return geometry;
  }, [data]);

  if (!geometry) return null;

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uMaxDepth: { value: 700.0 },
        }}
        vertexShader={`
        attribute float aMagnitude;
        attribute float aDepth;

        varying float vDepth;

        void main() {
          vDepth = aDepth;

          float magNorm = clamp((aMagnitude - 6.0) / 3.0, 0.0, 1.0);
          float size = mix(4.0, 18.0, magNorm);

          gl_PointSize = size;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
        fragmentShader={`
        uniform float uMaxDepth;
        varying float vDepth;

        void main() {

          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          vec3 color;

          // неизвестная глубина
          if (vDepth < 0.0) {
            color = vec3(0.5, 0.5, 0.5);
          } else {

            float depthNorm = clamp(vDepth / uMaxDepth, 0.0, 1.0);

            depthNorm = pow(depthNorm, 0.6);

            // жёлтый → красный
            vec3 shallow = vec3(1.0, 0.9, 0.0);
            vec3 deep = vec3(1.0, 0.0, 0.0);

            color = mix(shallow, deep, depthNorm);
          }

            float glow = 1.0 - smoothstep(0.3, 0.5, dist);

            float core = 1.0 - smoothstep(0.0, 0.15, dist);

            vec3 finalColor = color + color * core * 0.8;

            float alpha = glow * 0.7 + core * 0.9;

            gl_FragColor = vec4(finalColor, alpha);

        }
      `}
      />
    </points>
  );
}
