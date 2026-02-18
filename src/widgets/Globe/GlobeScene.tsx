import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import ContinentsLines from "./ContinentsLines";
import EarthMesh from "./EarthMesh";
import EarthquakesPoints from "./EarthquakesPoints";


import styles from "./GlobeScene.module.scss";

export default function GlobeScene() {
	return (
		<div className={styles.canvasWrapper}>
			<Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
				<ambientLight intensity={0.6} />
				<directionalLight position={[5, 5, 5]} intensity={1} />
				<EarthMesh />
				<ContinentsLines />
                <EarthquakesPoints />
				<OrbitControls enablePan={false} />
			</Canvas>
		</div>
	);
}
