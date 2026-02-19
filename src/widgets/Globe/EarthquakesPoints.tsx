import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

interface Props {
	isPlaying: boolean;
	timeSpeed: number;
	isAllMode: boolean;
}

export default function EarthquakesPoints({
	isPlaying,
	timeSpeed,
	isAllMode,
}: Props) {
	const [data, setData] = useState<Float32Array | null>(null);
	const materialRef = useRef<THREE.ShaderMaterial>(null);
	const BASE_TIME_SCALE = 0.02;

	const currentTimeRef = useRef(0);
	const isPlayingRef = useRef(isPlaying);
	const timeSpeedRef = useRef(timeSpeed);
	const isAllModeRef = useRef(isAllMode);
	const uniforms = useMemo(
		() => ({
			uMaxDepth: { value: 700.0 },
			uCurrentTime: { value: 0.0 },
			uTimeSpeed: { value: 1.0 },
			uShowAll: { value: 0.0 },
		}),
		[],
	);

	useEffect(() => {
		isPlayingRef.current = isPlaying;
	}, [isPlaying]);

	useEffect(() => {
		timeSpeedRef.current = timeSpeed;
	}, [timeSpeed]);

	useEffect(() => {
		isAllModeRef.current = isAllMode;
	}, [isAllMode]);

	useEffect(() => {
		fetch("/data/earthquakes.bin")
			.then((res) => res.arrayBuffer())
			.then((buffer) => {
				setData(new Float32Array(buffer));
			});
	}, []);

	useFrame((_, delta) => {
		if (!materialRef.current) return;

		if (isPlayingRef.current) {
			currentTimeRef.current += delta * timeSpeedRef.current * BASE_TIME_SCALE;

			if (currentTimeRef.current > 1) currentTimeRef.current = 0;
		}

		uniforms.uCurrentTime.value = currentTimeRef.current;
		uniforms.uTimeSpeed.value = timeSpeedRef.current;
		uniforms.uShowAll.value = isAllModeRef.current ? 1.0 : 0.0;
	});

	const geometry = useMemo(() => {
		if (!data) return null;

		const stride = 6;
		const count = data.length / stride;

		const positions = new Float32Array(count * 3);
		const magnitudes = new Float32Array(count);
		const depths = new Float32Array(count);
		const times = new Float32Array(count);

		const baseRadius = 1.02;
		const maxDepthKm = 700;

		const v = new THREE.Vector3();

		for (let i = 0; i < count; i++) {
			const x = data[i * stride];
			const y = data[i * stride + 1];
			const z = data[i * stride + 2];
			const mag = data[i * stride + 3];
			const depth = data[i * stride + 4];
			const normalizedTime = data[i * stride + 5];

			v.set(x, y, z).normalize();

			let depthNorm = 0;
			if (depth >= 0) {
				depthNorm = Math.min(depth / maxDepthKm, 1.0);
				depthNorm = depthNorm ** 0.6;
			}

			const finalRadius =
				depth >= 0 ? baseRadius - depthNorm * 0.35 : baseRadius;
			const finalPos = v.multiplyScalar(finalRadius);

			positions[i * 3] = finalPos.x;
			positions[i * 3 + 1] = finalPos.y;
			positions[i * 3 + 2] = finalPos.z;

			magnitudes[i] = mag;
			depths[i] = depth;
			times[i] = normalizedTime;
		}

		const g = new THREE.BufferGeometry();
		g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		g.setAttribute("aMagnitude", new THREE.BufferAttribute(magnitudes, 1));
		g.setAttribute("aDepth", new THREE.BufferAttribute(depths, 1));
		g.setAttribute("aTime", new THREE.BufferAttribute(times, 1));

		return g;
	}, [data]);

	if (!geometry) return null;

	return (
		<points geometry={geometry}>
			<shaderMaterial
				ref={materialRef}
				transparent
				depthWrite={false}
				blending={THREE.AdditiveBlending}
				uniforms={uniforms}
				vertexShader={`
          attribute float aMagnitude;
          attribute float aDepth;
          attribute float aTime;

          varying float vDepth;
          varying float vTime;

          void main() {
            vDepth = aDepth;
            vTime = aTime;

            float magNorm = clamp((aMagnitude - 6.0) / 3.0, 0.0, 1.0);
            float size = mix(4.0, 18.0, magNorm);

            gl_PointSize = size;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
				fragmentShader={`
			uniform float uMaxDepth;
			uniform float uCurrentTime;
			uniform float uTimeSpeed;
			uniform float uShowAll;

			varying float vDepth;
			varying float vTime;

			void main() {

				float dist = length(gl_PointCoord - vec2(0.5));
				if (dist > 0.5) discard;

				// time and visibility logic

				float life = 1.0;

				if (uShowAll < 0.5) {

					float diff = uCurrentTime - vTime;
					if (diff < 0.0) discard;

					float baseLifeWindow = 0.05;
					float lifeWindow = baseLifeWindow / sqrt(uTimeSpeed);

					life = 1.0 - clamp(diff / lifeWindow, 0.0, 1.0);
					if (life <= 0.0) discard;

				} else {

					// Show All mode → всегда видим
					// чуть усиливаем визуальную плотность
					life = 1.15;

				}

				// color logic

				vec3 color;

				if (vDepth < 0.0) {
					color = vec3(0.5, 0.5, 0.5);
				} else {
					float depthNorm = clamp(vDepth / uMaxDepth, 0.0, 1.0);
					depthNorm = pow(depthNorm, 0.6);

					vec3 shallow = vec3(1.0, 0.9, 0.0);
					vec3 deep = vec3(1.0, 0.0, 0.0);

					color = mix(shallow, deep, depthNorm);
				}

				// glow and core logic


				float glow = 1.0 - smoothstep(0.3, 0.5, dist);
				float core = 1.0 - smoothstep(0.0, 0.15, dist);

				vec3 finalColor = color + color * core * 0.8;

				if (uShowAll > 0.5) {
					finalColor *= 1.25;
				}

				float alpha = (glow * 0.7 + core * 0.9) * life;

				gl_FragColor = vec4(finalColor, alpha);
			}

        `}
			/>
		</points>
	);
}
