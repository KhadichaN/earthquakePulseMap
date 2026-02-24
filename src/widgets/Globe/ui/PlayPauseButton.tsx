import pauseIcon from "@/shared/assets/icons/pause.svg";
import playIcon from "@/shared/assets/icons/play.svg";
import { useTime } from "@/shared/context/TimeContext";
import styles from "./styles.module.scss";

export default function PlayPauseButton() {
	const { isPlaying, togglePlay, isAllMode } = useTime();
	const disabled = isAllMode;

	return (
		<button
			type="button"
			disabled={disabled}
			className={`${styles.button} ${
				disabled ? styles.disabled : isPlaying ? styles.active : styles.inactive
			}`}
			onClick={disabled ? undefined : togglePlay}
		>
			<img src={isPlaying ? pauseIcon : playIcon} alt="time toggle" />
		</button>
	);
}
