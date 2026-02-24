import { useTime } from "@/shared/context/TimeContext";
import styles from "./styles.module.scss";

export default function ShowAllButton() {
	const { isAllMode, toggleAllMode } = useTime();

	return (
		<button
			type="button"
			className={`${styles.button} ${isAllMode ? styles.active : styles.inactive}`}
			onClick={toggleAllMode}
		>
			<span className={styles.label}>ALL</span>
		</button>
	);
}
