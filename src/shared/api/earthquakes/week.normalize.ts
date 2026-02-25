import type {
	EarthquakeStats,
	WeekEarthquakeEvent,
	WeekEarthquakesData,
} from "./week.types";

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfUtcDay(ms: number) {
	const d = new Date(ms);
	return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function isFiniteNumber(value: unknown): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

function toWeekEvent(feature: unknown): WeekEarthquakeEvent | null {
	if (!feature || typeof feature !== "object") return null;

	const geometry = (feature as { geometry?: { coordinates?: unknown } })
		.geometry;
	const properties = (
		feature as { properties?: { mag?: unknown; time?: unknown } }
	).properties;

	const coords = geometry?.coordinates;
	if (!Array.isArray(coords) || coords.length < 2) return null;

	const lon = coords[0];
	const lat = coords[1];
	const depthRaw = coords[2];
	const mag = properties?.mag;
	const time = properties?.time;

	if (!isFiniteNumber(lat) || !isFiniteNumber(lon)) return null;
	if (!isFiniteNumber(mag) || mag < 2.5) return null;
	if (!isFiniteNumber(time)) return null;

	return {
		lat,
		lon,
		depth: isFiniteNumber(depthRaw) ? depthRaw : -1,
		mag,
		time,
	};
}

function buildStats(events: WeekEarthquakeEvent[]): EarthquakeStats | null {
	if (events.length === 0) return null;

	let minMagnitude = Infinity;
	let maxMagnitude = -Infinity;
	let minDepth = Infinity;
	let maxDepth = -Infinity;
	let minTime = Infinity;
	let maxTime = -Infinity;

	for (const event of events) {
		minMagnitude = Math.min(minMagnitude, event.mag);
		maxMagnitude = Math.max(maxMagnitude, event.mag);

		if (event.depth >= 0) {
			minDepth = Math.min(minDepth, event.depth);
			maxDepth = Math.max(maxDepth, event.depth);
		}

		minTime = Math.min(minTime, event.time);
		maxTime = Math.max(maxTime, event.time);
	}

	return {
		totalCount: events.length,
		minMagnitude,
		maxMagnitude,
		minDepth: minDepth === Infinity ? 0 : minDepth,
		maxDepth: maxDepth === -Infinity ? 0 : maxDepth,
		startYear: new Date(minTime).getUTCFullYear(),
		endYear: new Date(maxTime).getUTCFullYear(),
	};
}

export function normalizeWeekData(raw: unknown): WeekEarthquakesData {
	const features = Array.isArray((raw as { features?: unknown }).features)
		? ((raw as { features: unknown[] }).features ?? [])
		: [];

	const rawEvents = features
		.map(toWeekEvent)
		.filter((event): event is WeekEarthquakeEvent => event !== null)
		.sort((a, b) => a.time - b.time);

	if (rawEvents.length === 0) {
		return {
			events: [],
			stats: null,
			range: null,
		};
	}

	const endDayMs = startOfUtcDay(rawEvents[rawEvents.length - 1].time);
	const startDayMs = endDayMs - 6 * DAY_MS;
	const nextDayAfterEndMs = endDayMs + DAY_MS;

	const events = rawEvents.filter(
		(event) => event.time >= startDayMs && event.time < nextDayAfterEndMs,
	);

	const stats = buildStats(events);

	if (!stats) {
		return {
			events,
			stats: null,
			range: null,
		};
	}

	return {
		events,
		stats,
		range: {
			startMs: startDayMs,
			endMs: endDayMs,
		},
	};
}
