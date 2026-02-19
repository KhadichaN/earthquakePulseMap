import PlayPauseButton from "./PlayPauseButton";
import RotationButton from "./RotationButton";
import ShowAllButton from "./ShowAllButton";
import SpeedControls from "./SpeedControls";

import styles from "./styles.module.scss";

interface Props {
	isRotating: boolean;
	onToggleRotation: () => void;

	isPlaying: boolean;
	onTogglePlay: () => void;

	currentSpeed: number;
	onChangeSpeed: (speed: number) => void;

	isAllMode: boolean;
	onToggleAllMode: () => void;
}

export default function GlobeControls({
	isRotating,
	onToggleRotation,
	isPlaying,
	onTogglePlay,
	currentSpeed,
	onChangeSpeed,
	isAllMode,
	onToggleAllMode,
}: Props) {
	return (
		<div className={styles.controls}>
			<RotationButton isRotating={isRotating} onToggle={onToggleRotation} />

			<PlayPauseButton
				isPlaying={isPlaying}
				onToggle={onTogglePlay}
				disabled={isAllMode}
			/>

			<SpeedControls
				currentSpeed={currentSpeed}
				onChangeSpeed={onChangeSpeed}
				disabled={isAllMode}
			/>

			<ShowAllButton isAllMode={isAllMode} onToggle={onToggleAllMode} />
		</div>
	);
}
