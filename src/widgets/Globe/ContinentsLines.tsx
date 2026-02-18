import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

export default function ContinentsLines() {
  const [data, setData] = useState<Float32Array | null>(null);

  useEffect(() => {
    fetch("/data/coastline.bin")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        setData(new Float32Array(buffer));
      });
  }, []);

  const geometry = useMemo(() => {
    if (!data) return null;

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute(
      "position",
      new THREE.BufferAttribute(data, 3)
    );

    return buffer;
  }, [data]);

  if (!geometry) return null;

  return (
    <lineSegments geometry={geometry}>
      <shaderMaterial
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        uniforms={{
          uColor: { value: new THREE.Color("#4bffea") },
          uIntensity: { value: 1.2 },
        }}
        vertexShader={`
          varying float vIntensity;

          void main() {
            vIntensity = 1.0;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          uniform float uIntensity;
          varying float vIntensity;

          void main() {
            float glow = vIntensity * uIntensity;
            gl_FragColor = vec4(uColor * glow, glow);
          }
        `}
      />
    </lineSegments>
  );
}
