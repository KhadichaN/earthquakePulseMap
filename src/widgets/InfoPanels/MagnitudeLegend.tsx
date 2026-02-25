import styles from "./styles.module.scss";

interface Props {
	stats: {
		minMagnitude: number;
		maxMagnitude: number;
	} | null;
	mode: "historic" | "week";
}

export default function MagnitudeLegend({ stats, mode }: Props) {
	const minLabel = stats ? stats.minMagnitude.toFixed(1) : "—";
	const maxLabel = stats ? stats.maxMagnitude.toFixed(1) : "—";

	const note =
		mode === "week"
			? "Size mapped from M2.5 upward."
			: "Size mapped from M6 to M9 (clamped).";

	return (
		<div className={styles.card}>
			<h4 className={styles.legendTitle}>Magnitude (size)</h4>

			<div className={styles.magnitudeRow}>
				<div className={`${styles.magDot} ${styles.mag6}`} />
				<span>{minLabel}</span>
			</div>

			<div className={styles.magnitudeRow}>
				<div className={`${styles.magDot} ${styles.mag75}`} />
				<span>Mid</span>
			</div>

			<div className={styles.magnitudeRow}>
				<div className={`${styles.magDot} ${styles.mag9}`} />
				<span>{maxLabel}+</span>
			</div>

			<p className={styles.note}>{note}</p>
		</div>
	);
}
