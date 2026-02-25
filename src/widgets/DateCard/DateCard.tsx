import { useMemo } from "react";
import { useWeekEarthquakesData } from "@/shared/api/earthquakes/useEarthquakesData";
import { useTime } from "@/shared/context/TimeContext";
import styles from "./styles.module.scss";

function pad2(n: number) {
	return String(n).padStart(2, "0");
}

export default function DateCard() {
	const { mode, isAllMode, currentDate } = useTime();
	const { data: weekData } = useWeekEarthquakesData(mode === "week");

	const label = useMemo(() => {
		if (mode === "week") {
			const range = weekData?.range;
			if (!range) return "Last 7 days";

			const start = new Date(range.startMs);
			const end = new Date(range.endMs);

			return `${start.getUTCFullYear()}.${pad2(start.getUTCMonth() + 1)}.${pad2(start.getUTCDate())}
	— ${end.getUTCFullYear()}.${pad2(end.getUTCMonth() + 1)}.${pad2(end.getUTCDate())}`;
		}
		if (isAllMode) {
			return "1900.01 — 2026.01";
		}

		const yyyy = currentDate.getUTCFullYear();
		const mm = pad2(currentDate.getUTCMonth() + 1);

		return `${yyyy}.${mm}`;
	}, [mode, isAllMode, currentDate, weekData]);

	return <div className={styles.card}>{label}</div>;
}
