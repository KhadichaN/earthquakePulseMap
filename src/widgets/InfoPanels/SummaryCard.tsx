import styles from "./styles.module.scss";

interface Props {
	stats: {
		totalCount: number;
		startYear: number;
		endYear: number;
	} | null;
}

export default function SummaryCard({ stats }: Props) {
	const title = stats ? `${stats.startYear}–${stats.endYear}` : "—";
	const count = stats ? stats.totalCount.toLocaleString() : "—";

	return (
		<div className={styles.card}>
			<h3 className={styles.title}>{title}</h3>

			<p className={styles.value}>{count}</p>

			<p className={styles.subtitle}>Recorded earthquakes (M ≥ 6)</p>

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
