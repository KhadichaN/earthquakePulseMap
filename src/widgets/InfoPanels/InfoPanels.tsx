import { useEffect, useState } from "react";
import closeIcon from "@/shared/assets/icons/close.svg";
import DepthLegend from "./DepthLegend";
import MagnitudeLegend from "./MagnitudeLegend";
import SummaryCard from "./SummaryCard";

import styles from "./styles.module.scss";

interface Stats {
	totalCount: number;
	minMagnitude: number;
	maxMagnitude: number;
	minDepth: number;
	maxDepth: number;
	startYear: number;
	endYear: number;
}

interface InfoPanelsProps {
	showMobileClose?: boolean;
	onMobileClose?: () => void;
}

export default function InfoPanels({
	showMobileClose = false,
	onMobileClose,
}: InfoPanelsProps) {
	const [stats, setStats] = useState<Stats | null>(null);

	useEffect(() => {
		fetch("/data/earthquakes-stats.json")
			.then((res) => res.json())
			.then((data) => setStats(data))
			.catch(() => {
				console.error("Failed to load stats");
			});
	}, []);

	return (
		<div className={styles.wrapper}>
			{showMobileClose && (
				<button
					type="button"
					className={styles.closeBtn}
					onClick={onMobileClose}
				>
					<img src={closeIcon} alt="Close info panels" />
				</button>
			)}
			<SummaryCard stats={stats} />
			<DepthLegend stats={stats} />
			<MagnitudeLegend stats={stats} />
		</div>
	);
}
