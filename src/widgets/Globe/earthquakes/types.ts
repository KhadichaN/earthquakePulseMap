export type DataMode = "historic" | "week";

export type PointsPayload = {
	mode: DataMode;
	data: Float32Array;
	maxDepth: number;
};
