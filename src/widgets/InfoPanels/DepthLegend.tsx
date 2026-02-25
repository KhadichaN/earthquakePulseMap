import styles from "./styles.module.scss";

interface Props {
	stats: {
		maxDepth: number;
	} | null;
	mode: "historic" | "week";
}

export default function DepthLegend({ stats }: Props) {
	const datasetMax = stats ? `${stats.maxDepth.toFixed(0)} km` : "—";

	return (
		<div className={styles.card}>
			<h4 className={styles.legendTitle}>Depth (km)</h4>

			<div className={styles.depthRow}>
				<span className={styles.depthLabel}>Shallow</span>
				<div className={styles.gradientBar} />
				<span className={styles.depthLabel}>Deep</span>
			</div>

			<div className={styles.legendLabels}>
				<span>0</span>
				<span>{datasetMax}</span>
			</div>

			<div className={styles.unknownRow}>
				<span className={styles.swatch} />
				<span className={styles.unknownText}>Unknown depth</span>
			</div>

			<p className={styles.note}>Nonlinear mapping (pow 0.6).</p>
		</div>
	);
}
