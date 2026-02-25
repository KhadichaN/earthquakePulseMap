import { useEffect, useMemo, useState } from "react";
import {
	useWeekEarthquakesData,
	type WeekEarthquakeEvent,
} from "@/shared/api/earthquakes/useEarthquakesData";
import { latLonToUnitVec3 } from "./geo";
import type { DataMode, PointsPayload } from "./types";

function buildWeekPointsPayload(events: WeekEarthquakeEvent[]): PointsPayload {
	const stride = 6;
	const packed = new Float32Array(events.length * stride);
	const baseRadius = 1.02;

	let observedMaxDepth = 0;
	for (const event of events) {
		if (event.depth >= 0) {
			observedMaxDepth = Math.max(observedMaxDepth, event.depth);
		}
	}

	const maxDepthForRadius = Math.max(700, observedMaxDepth || 700);

	for (let i = 0; i < events.length; i++) {
		const event = events[i];
		const v = latLonToUnitVec3(event.lat, event.lon).normalize();

		let depthNorm = 0;
		if (event.depth >= 0) {
			depthNorm = Math.min(event.depth / maxDepthForRadius, 1);
			depthNorm = depthNorm ** 0.6;
		}

		const finalRadius =
			event.depth >= 0 ? baseRadius - depthNorm * 0.35 : baseRadius;

		v.multiplyScalar(finalRadius);

		const off = i * stride;
		packed[off] = v.x;
		packed[off + 1] = v.y;
		packed[off + 2] = v.z;
		packed[off + 3] = event.mag;
		packed[off + 4] = event.depth;
		packed[off + 5] = 0;
	}

	return {
		mode: "week",
		data: packed,
		maxDepth: maxDepthForRadius,
	};
}

export function useEarthquakesData(mode: DataMode) {
	const { data: weekData } = useWeekEarthquakesData(mode === "week");
	const [historicPayload, setHistoricPayload] = useState<PointsPayload | null>(
		null,
	);

	const weekPayload = useMemo(() => {
		if (!weekData) return null;
		return buildWeekPointsPayload(weekData.events);
	}, [weekData]);

	useEffect(() => {
		if (mode !== "historic") return;

		const controller = new AbortController();
		setHistoricPayload(null);

		async function loadHistoric() {
			const res = await fetch("/data/earthquakes.bin", {
				signal: controller.signal,
			});
			const buffer = await res.arrayBuffer();
			const data = new Float32Array(buffer);

			setHistoricPayload({ mode: "historic", data, maxDepth: 700 });
		}

		loadHistoric().catch(() => {
			// ignore
		});

		return () => controller.abort();
	}, [mode]);

	if (mode === "week") return weekPayload;
	return historicPayload;
}
