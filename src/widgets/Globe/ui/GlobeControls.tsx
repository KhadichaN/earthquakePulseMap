import PlayPauseButton from "./PlayPauseButton";
import RotationButton from "./RotationButton";
import ShowAllButton from "./ShowAllButton";
import SpeedControls from "./SpeedControls";

import styles from "./styles.module.scss";

export default function GlobeControls() {
	return (
		<div className={styles.controls}>
			<RotationButton />
			<PlayPauseButton />
			<SpeedControls />
			<ShowAllButton />
		</div>
	);
}
