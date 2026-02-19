import rotationOff from "@/shared/assets/icons/rotation-off.svg";
import rotationOn from "@/shared/assets/icons/rotation-on.svg";

import styles from "./styles.module.scss";

interface Props {
	isRotating: boolean;
	onToggle: () => void;
}

export default function RotationButton({ isRotating, onToggle }: Props) {
	return (
		<button
			type="button"
			className={`${styles.button} ${
				isRotating ? styles.active : styles.inactive
			}`}
			onClick={onToggle}
		>
			<img src={isRotating ? rotationOn : rotationOff} alt="rotation toggle" />
		</button>
	);
}
