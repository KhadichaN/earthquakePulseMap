import styles from "./styles.module.scss";

interface Props {
	stats: {
		totalCount: number;
		startYear: number;
		endYear: number;
	} | null;
	mode: "historic" | "week";
}

export default function SummaryCard({ stats, mode }: Props) {
	const title =
		mode === "week"
			? "Last 7 Days"
			: stats
				? `${stats.startYear}–${stats.endYear}`
				: "—";

	const count = stats ? stats.totalCount.toLocaleString() : "—";

	const subtitle =
		mode === "week" ? "Earthquakes (M ≥ 2.5)" : "Recorded earthquakes (M ≥ 6)";

	return (
		<div className={styles.card}>
			<h3 className={styles.title}>{title}</h3>
			<p className={styles.value}>{count}</p>
			<p className={styles.subtitle}>{subtitle}</p>

			<p className={styles.source}>
				Source:{" "}
				<a
					className={styles.link}
					href="https://earthquake.usgs.gov/earthquakes/search/"
					target="_blank"
					rel="noreferrer"
				>
					USGS Earthquake Catalog
				</a>
			</p>
		</div>
	);
}
