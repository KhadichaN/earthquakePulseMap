import { useEffect, useState } from "react";
import {
	type EarthquakeStats,
	useWeekEarthquakesData,
} from "@/shared/api/earthquakes/useEarthquakesData";
import { useTime } from "@/shared/context/TimeContext";

export function useInfoStats() {
	const { mode } = useTime();
	const { data: weekData } = useWeekEarthquakesData(mode === "week");
	const [historicStats, setHistoricStats] = useState<EarthquakeStats | null>(
		null,
	);

	useEffect(() => {
		if (mode !== "historic") return;

		const controller = new AbortController();
		setHistoricStats(null);

		async function loadHistoric() {
			const res = await fetch("/data/earthquakes-stats.json", {
				signal: controller.signal,
			});
			const data = await res.json();
			setHistoricStats(data as EarthquakeStats);
		}

		loadHistoric().catch(() => {
			// ignore
		});

		return () => controller.abort();
	}, [mode]);

	if (mode === "week") return weekData?.stats ?? null;
	return historicStats;
}
