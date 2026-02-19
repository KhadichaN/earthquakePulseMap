import pauseIcon from "@/shared/assets/icons/pause.svg";
import playIcon from "@/shared/assets/icons/play.svg";

import styles from "./styles.module.scss";

interface Props {
	isPlaying: boolean;
	onToggle: () => void;
	disabled?: boolean;
}

export default function PlayPauseButton({
	isPlaying,
	onToggle,
	disabled = false,
}: Props) {
	return (
		<button
			type="button"
			disabled={disabled}
			className={`${styles.button} ${
				disabled ? styles.disabled : isPlaying ? styles.active : styles.inactive
			}`}
			onClick={disabled ? undefined : onToggle}
		>
			<img src={isPlaying ? pauseIcon : playIcon} alt="time toggle" />
		</button>
	);
}
