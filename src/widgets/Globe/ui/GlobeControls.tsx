import PlayPauseButton from "./PlayPauseButton";
import RotationButton from "./RotationButton";
import SpeedControls from "./SpeedControls";

import styles from "./styles.module.scss";

interface Props {
  isRotating: boolean;
  onToggleRotation: () => void;

  isPlaying: boolean;
  onTogglePlay: () => void;

  currentSpeed: number;
  onChangeSpeed: (speed: number) => void;
}

export default function GlobeControls({
  isRotating,
  onToggleRotation,
  isPlaying,
  onTogglePlay,
  currentSpeed,
  onChangeSpeed,
}: Props) {
  return (
    <div className={styles.controls}>
      <RotationButton
        isRotating={isRotating}
        onToggle={onToggleRotation}
      />

      <PlayPauseButton
        isPlaying={isPlaying}
        onToggle={onTogglePlay}
      />

      <SpeedControls
        currentSpeed={currentSpeed}
        onChangeSpeed={onChangeSpeed}
      />
    </div>
  );
}
