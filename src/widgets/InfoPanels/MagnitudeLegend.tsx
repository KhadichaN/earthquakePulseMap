import styles from "./styles.module.scss";

interface Props {
	stats: { minMagnitude: number; maxMagnitude: number } | null;
}

export default function MagnitudeLegend({ stats }: Props) {
	const minLabel = stats ? stats.minMagnitude.toFixed(1) : "—";
	const midLabel = "7.5";
	const maxLabel = "9.0+";

	return (
		<div className={styles.card}>
			<h4 className={styles.legendTitle}>Magnitude (size)</h4>

			<div className={styles.magnitudeRow}>
				<div className={`${styles.magDot} ${styles.mag6}`} />
				<span>{minLabel}</span>
			</div>

			<div className={styles.magnitudeRow}>
				<div className={`${styles.magDot} ${styles.mag75}`} />
				<span>{midLabel}</span>
			</div>

			<div className={styles.magnitudeRow}>
				<div className={`${styles.magDot} ${styles.mag9}`} />
				<span>{maxLabel}</span>
			</div>

			<p className={styles.note}>Size mapped from M6 to M9 (clamped).</p>
		</div>
	);
}
