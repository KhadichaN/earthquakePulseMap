export type WeekEarthquakeEvent = {
	lat: number;
	lon: number;
	depth: number;
	mag: number;
	time: number;
};

export type EarthquakeStats = {
	totalCount: number;
	minMagnitude: number;
	maxMagnitude: number;
	minDepth: number;
	maxDepth: number;
	startYear: number;
	endYear: number;
};

export type WeekDateRange = {
	startMs: number;
	endMs: number;
};

export type WeekEarthquakesData = {
	events: WeekEarthquakeEvent[];
	stats: EarthquakeStats | null;
	range: WeekDateRange | null;
};
