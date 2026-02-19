import { useMemo } from "react";
import styles from "./styles.module.scss";

interface Props {
	currentSpeed: number;
	onChangeSpeed: (speed: number) => void;
	disabled?: boolean;
}

const speeds = [0.25, 0.5, 1, 2, 4];

export default function SpeedControls({
	currentSpeed,
	onChangeSpeed,
	disabled = false,
}: Props) {
	const nextSpeed = useMemo(() => {
		const index = speeds.indexOf(currentSpeed);
		const nextIndex = (index + 1) % speeds.length;
		return speeds[nextIndex];
	}, [currentSpeed]);

	return (
		<button
			type="button"
			disabled={disabled}
			className={`${styles.button} ${
				disabled ? styles.disabled : styles.active
			}`}
			onClick={disabled ? undefined : () => onChangeSpeed(nextSpeed)}
		>
			<span className={styles.speedText}>{currentSpeed}x</span>
		</button>
	);
}
