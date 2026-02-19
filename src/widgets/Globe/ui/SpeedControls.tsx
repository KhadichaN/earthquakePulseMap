import { useMemo } from "react";
import styles from "./styles.module.scss";

interface Props {
  currentSpeed: number;
  onChangeSpeed: (speed: number) => void;
}

const speeds = [0.25, 0.5, 1, 2, 4];

export default function SpeedControls({
  currentSpeed,
  onChangeSpeed,
}: Props) {
  const nextSpeed = useMemo(() => {
    const index = speeds.indexOf(currentSpeed);
    const nextIndex = (index + 1) % speeds.length;
    return speeds[nextIndex];
  }, [currentSpeed]);

  return (
    <button
      type="button"
      className={`${styles.button} ${styles.active}`}
      onClick={() => onChangeSpeed(nextSpeed)}
    >
      <span className={styles.speedText}>{currentSpeed}x</span>
    </button>
  );
}
