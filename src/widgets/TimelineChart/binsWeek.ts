import type {
	WeekDateRange,
	WeekEarthquakeEvent,
} from "@/shared/api/earthquakes/useEarthquakesData";
import type { Bin } from "./types";
import { pad2 } from "./utils";

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfUtcDay(ms: number) {
	const d = new Date(ms);
	return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export function buildDailyBinsFromWeekEvents(
	events: WeekEarthquakeEvent[],
	range?: WeekDateRange | null,
): Bin[] {
	const map = new Map<
		string,
		{ magMax: number; depthSum: number; depthCnt: number }
	>();

	for (const event of events) {
		const mag = event.mag;
		const t = event.time;
		const depth = event.depth;

		if (!Number.isFinite(mag) || mag < 2.5) continue;
		if (!Number.isFinite(t)) continue;

		const d = new Date(t);
		const key = `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;

		const cur = map.get(key) ?? { magMax: 0, depthSum: 0, depthCnt: 0 };

		if (mag > cur.magMax) cur.magMax = mag;

		if (typeof depth === "number" && Number.isFinite(depth) && depth >= 0) {
			cur.depthSum += depth;
			cur.depthCnt += 1;
		}

		map.set(key, cur);
	}

	const keys = Array.from(map.keys()).sort();

	if (keys.length === 0) return [];

	const min = range
		? startOfUtcDay(range.startMs)
		: new Date(`${keys[0]}T00:00:00.000Z`).getTime();
	const max = range
		? startOfUtcDay(range.endMs)
		: new Date(`${keys[keys.length - 1]}T00:00:00.000Z`).getTime();

	const bins: Bin[] = [];

	for (let ms = min; ms <= max; ms += DAY_MS) {
		const d = new Date(ms);
		const key = `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;

		const v = map.get(key);

		const avgDepth = v?.depthCnt ? v.depthSum / v.depthCnt : 0;
		const depthClamped = Math.min(Math.max(avgDepth, 0), 700);

		bins.push({
			label: key,
			magMax: v ? v.magMax : 0,
			depthAvg: depthClamped,
			depthNeg: -depthClamped,
		});
	}

	return bins;
}
