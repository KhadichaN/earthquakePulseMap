import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

import { useTime } from "@/shared/context/TimeContext";
import ContinentsLines from "./ContinentsLines";
import EarthMesh from "./EarthMesh";
import EarthquakesPoints from "./earthquakes/EarthquakesPoints";

export default function GlobeContent() {
	const { isRotating } = useTime();
	const globeRef = useRef<THREE.Group>(null);

	useFrame(() => {
		if (isRotating && globeRef.current) {
			globeRef.current.rotation.y += 0.001;
		}
	});

	return (
		<>
			<ambientLight intensity={0.6} />
			<directionalLight position={[5, 5, 5]} intensity={1} />

			<group ref={globeRef}>
				<EarthMesh />
				<ContinentsLines />
				<EarthquakesPoints />
			</group>

			<OrbitControls
				enablePan={false}
				maxDistance={6}
				minPolarAngle={0.1}
				maxPolarAngle={Math.PI - 0.1}
			/>
		</>
	);
}
