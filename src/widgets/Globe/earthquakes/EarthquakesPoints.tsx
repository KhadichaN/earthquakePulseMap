import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { useTime } from "@/shared/context/TimeContext";
import { buildGeometry } from "./buildGeometry";
import { fragmentShader, vertexShader } from "./shaders";
import { useEarthquakesData } from "./useEarthquakesData";

export default function EarthquakesPoints() {
	const payload = useEarthquakesData(useTime().mode);
	const materialRef = useRef<THREE.ShaderMaterial>(null);

	const {
		mode,
		isPlaying,
		timeSpeed,
		isAllMode,
		currentTimeRef,
		setCurrentTime,
	} = useTime();

	const uniforms = useMemo(
		() => ({
			uMaxDepth: { value: 700 },
			uCurrentTime: { value: 0 },
			uTimeSpeed: { value: 1 },
			uShowAll: { value: 0 },
			uMagMin: { value: 6 },
			uMagMax: { value: 9 },
		}),
		[],
	);

	useFrame((_, delta) => {
		if (!materialRef.current || !payload) return;

		const showAll = mode === "week" || isAllMode;

		if (mode === "historic" && isPlaying && !showAll) {
			const next = currentTimeRef.current + delta * timeSpeed * 0.02;
			setCurrentTime(next > 1 ? 0 : next);
		}

		uniforms.uCurrentTime.value = currentTimeRef.current;
		uniforms.uTimeSpeed.value = timeSpeed;
		uniforms.uShowAll.value = showAll ? 1 : 0;
		uniforms.uMaxDepth.value = payload.maxDepth;
	});

	const geometry = useMemo(() => {
		if (!payload) return null;
		return buildGeometry(payload.data);
	}, [payload]);

	if (!geometry || !payload || payload.mode !== mode) return null;

	return (
		<points geometry={geometry}>
			<shaderMaterial
				ref={materialRef}
				transparent
				depthWrite={false}
				blending={THREE.AdditiveBlending}
				uniforms={uniforms}
				vertexShader={vertexShader}
				fragmentShader={fragmentShader}
			/>
		</points>
	);
}
