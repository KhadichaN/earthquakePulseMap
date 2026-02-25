import { normalizeWeekData } from "./week.normalize";
import type { WeekEarthquakesData } from "./week.types";

const WEEK_GEOJSON_URL =
	"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

let cachedWeekData: WeekEarthquakesData | null = null;
let inFlightWeekDataPromise: Promise<WeekEarthquakesData> | null = null;

export function getCachedWeekEarthquakesData() {
	return cachedWeekData;
}

export async function loadWeekEarthquakesData(): Promise<WeekEarthquakesData> {
	if (cachedWeekData) return cachedWeekData;
	if (inFlightWeekDataPromise) return inFlightWeekDataPromise;

	inFlightWeekDataPromise = fetch(WEEK_GEOJSON_URL)
		.then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to fetch week earthquakes data: ${res.status}`);
			}
			return res.json();
		})
		.then((json) => normalizeWeekData(json))
		.then((data) => {
			cachedWeekData = data;
			return data;
		})
		.finally(() => {
			inFlightWeekDataPromise = null;
		});

	return inFlightWeekDataPromise;
}
