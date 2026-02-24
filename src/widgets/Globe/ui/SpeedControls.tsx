import { useMemo } from "react";
import { useTime } from "@/shared/context/TimeContext";
import styles from "./styles.module.scss";

const speeds = [0.25, 0.5, 1, 2, 4];

export default function SpeedControls() {
	const { timeSpeed, setTimeSpeed, isAllMode } = useTime();
	const disabled = isAllMode;

	const nextSpeed = useMemo(() => {
		const index = speeds.indexOf(timeSpeed);
		const nextIndex = (index + 1) % speeds.length;
		return speeds[nextIndex];
	}, [timeSpeed]);

	return (
		<button
			type="button"
			disabled={disabled}
			className={`${styles.button} ${disabled ? styles.disabled : styles.active}`}
			onClick={disabled ? undefined : () => setTimeSpeed(nextSpeed)}
		>
			<span className={styles.speedText}>{timeSpeed}x</span>
		</button>
	);
}
