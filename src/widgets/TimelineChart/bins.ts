import {
	DURATION,
	END_YEAR,
	MAX_DEPTH_KM,
	START_MS,
	START_YEAR,
} from "./constants";
import type { Bin } from "./types";
import { pad2 } from "./utils";

export function buildMonthlyBins(arr: Float32Array): Bin[] {
	const stride = 6;
	const count = Math.floor(arr.length / stride);
	const monthsTotal = (END_YEAR - START_YEAR + 1) * 12;

	const magMax = new Float32Array(monthsTotal);
	const depthSum = new Float32Array(monthsTotal);
	const depthCnt = new Uint16Array(monthsTotal);

	for (let i = 0; i < count; i++) {
		const mag = arr[i * stride + 3];
		const depth = arr[i * stride + 4];
		const tNorm = arr[i * stride + 5];

		const ms = START_MS + tNorm * DURATION;
		const d = new Date(ms);

		const y = d.getUTCFullYear();
		const m = d.getUTCMonth();
		const idx = (y - START_YEAR) * 12 + m;
		if (idx < 0 || idx >= monthsTotal) continue;

		if (mag > magMax[idx]) magMax[idx] = mag;

		if (depth >= 0) {
			depthSum[idx] += depth;
			depthCnt[idx] += 1;
		}
	}

	const bins: Bin[] = new Array(monthsTotal);

	for (let idx = 0; idx < monthsTotal; idx++) {
		const year = START_YEAR + Math.floor(idx / 12);
		const month = idx % 12;

		const avgDepth = depthCnt[idx] ? depthSum[idx] / depthCnt[idx] : 0;
		const depthClamped = Math.min(Math.max(avgDepth, 0), MAX_DEPTH_KM);

		bins[idx] = {
			label: `${year}-${pad2(month + 1)}`,
			magMax: magMax[idx] || 0,
			depthAvg: depthClamped,
			depthNeg: -depthClamped,
		};
	}

	return bins;
}
