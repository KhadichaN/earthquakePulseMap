import styles from "./styles.module.scss";

interface Props {
	isAllMode: boolean;
	onToggle: () => void;
}

export default function ShowAllButton({ isAllMode, onToggle }: Props) {
	return (
		<button
			type="button"
			className={`${styles.button} ${
				isAllMode ? styles.active : styles.inactive
			}`}
			onClick={onToggle}
		>
			<span className={styles.label}>ALL</span>
		</button>
	);
}
