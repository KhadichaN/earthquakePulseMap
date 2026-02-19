import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

import ContinentsLines from "./ContinentsLines";
import EarthMesh from "./EarthMesh";
import EarthquakesPoints from "./EarthquakesPoints";

interface Props {
	isRotating: boolean;
	isPlaying: boolean;
	timeSpeed: number;
	isAllMode: boolean;
}

export default function GlobeContent({
	isRotating,
	isPlaying,
	timeSpeed,
	isAllMode,
}: Props) {
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
				<EarthquakesPoints
					isPlaying={isPlaying}
					timeSpeed={timeSpeed}
					isAllMode={isAllMode}
				/>
			</group>

			<OrbitControls
				enablePan={false}
				maxDistance={5}
				minPolarAngle={0.1}
				maxPolarAngle={Math.PI - 0.1}
			/>
		</>
	);
}
