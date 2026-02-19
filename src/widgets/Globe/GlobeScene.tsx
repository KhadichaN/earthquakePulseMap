import { Canvas } from "@react-three/fiber";
import { useState } from "react";

import GlobeContent from "./GlobeContent";
import styles from "./GlobeScene.module.scss";
import GlobeControls from "./ui/GlobeControls";

export default function GlobeScene() {
  const [isRotating, setIsRotating] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeSpeed, setTimeSpeed] = useState(1);

  return (
    <div className={styles.canvasWrapper}>
      <Canvas frameloop="always" camera={{ position: [0, 0, 4], fov: 30 }}>
        <GlobeContent
          isRotating={isRotating}
          isPlaying={isPlaying}
          timeSpeed={timeSpeed}
        />
      </Canvas>

      <GlobeControls
        isRotating={isRotating}
        onToggleRotation={() => setIsRotating((prev) => !prev)}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((prev) => !prev)}
        currentSpeed={timeSpeed}
        onChangeSpeed={setTimeSpeed}
      />
    </div>
  );
}
