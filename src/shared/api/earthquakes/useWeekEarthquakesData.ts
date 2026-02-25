import { useEffect, useState } from "react";
import {
	getCachedWeekEarthquakesData,
	loadWeekEarthquakesData,
} from "./week.store";
import type { WeekEarthquakesData } from "./week.types";

export function useWeekEarthquakesData(enabled = true) {
	const [data, setData] = useState<WeekEarthquakesData | null>(() =>
		enabled ? getCachedWeekEarthquakesData() : null,
	);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (!enabled) return;

		const cached = getCachedWeekEarthquakesData();
		if (cached) {
			setData(cached);
			setError(null);
			return;
		}

		let cancelled = false;

		loadWeekEarthquakesData()
			.then((next) => {
				if (cancelled) return;
				setData(next);
				setError(null);
			})
			.catch((err: unknown) => {
				if (cancelled) return;
				setError(
					err instanceof Error
						? err
						: new Error("Failed to load week earthquakes data"),
				);
			});

		return () => {
			cancelled = true;
		};
	}, [enabled]);

	return { data, error };
}
