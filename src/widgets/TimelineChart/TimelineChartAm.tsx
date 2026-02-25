import * as am5 from "@amcharts/amcharts5";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { useWeekEarthquakesData } from "@/shared/api/earthquakes/useEarthquakesData";
import { useTime } from "@/shared/context/TimeContext";
import { buildMonthlyBins } from "./bins";
import { buildDailyBinsFromWeekEvents } from "./binsWeek";
import { createAmRoot } from "./chart/amRoot";
import { createStrip } from "./chart/createStrip";
import { END_YEAR, ROW_DEPTH, ROW_GAP, ROW_MAG, START_YEAR } from "./constants";
import styles from "./styles.module.scss";
import { pad2 } from "./utils";

export default function TimelineChartAm() {
	const { mode, currentTimeRef, isAllMode, currentDate } = useTime();
	const { data: weekData } = useWeekEarthquakesData(mode === "week");

	const hostRef = useRef<HTMLDivElement | null>(null);

	const [raw, setRaw] = useState<Float32Array | null>(null);

	const bins = useMemo(() => {
		if (mode === "week")
			return weekData
				? buildDailyBinsFromWeekEvents(weekData.events, weekData.range)
				: [];
		return raw ? buildMonthlyBins(raw) : [];
	}, [mode, raw, weekData]);

	const progressRef = useRef(0);
	const isAllModeRef = useRef(isAllMode);

	useEffect(() => {
		isAllModeRef.current = isAllMode;
	}, [isAllMode]);

	const currentLabel = useMemo(() => {
		if (mode === "week") return "Last 7 days";
		if (isAllMode) return "1900.01 — 2026.01";
		return `${currentDate.getUTCFullYear()}.${pad2(currentDate.getUTCMonth() + 1)}`;
	}, [mode, currentDate, isAllMode]);

	useEffect(() => {
		if (mode !== "historic") return;

		const controller = new AbortController();
		setRaw(null);

		fetch("/data/earthquakes.bin", { signal: controller.signal })
			.then((r) => r.arrayBuffer())
			.then((buf) => setRaw(new Float32Array(buf)))
			.catch(() => {
				// ignore
			});

		return () => controller.abort();
	}, [mode]);

	useEffect(() => {
		let raf = 0;

		const tick = () => {
			const p =
				mode === "week"
					? 1
					: isAllModeRef.current
						? 1
						: Math.min(Math.max(currentTimeRef.current, 0), 1);

			progressRef.current = p;
			raf = requestAnimationFrame(tick);
		};

		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [currentTimeRef, mode]);

	useLayoutEffect(() => {
		const host = hostRef.current;
		if (!host || bins.length === 0) return;

		const root = createAmRoot(host);

		const container = root.container.children.push(
			am5.Container.new(root, {
				width: am5.p100,
				height: am5.p100,
				layout: root.verticalLayout,
			}),
		);
		// mag strip

		const maxMagInBins =
			mode === "week" ? Math.max(...bins.map((b) => b.magMax), 3) : 10;

		const weekYMax = mode === "week" ? Math.ceil(maxMagInBins * 1.2) : 10;

		const weekYMin = mode === "week" ? 2.5 : 5;

		const magChart = createStrip({
			root,
			parent: container,
			heightPx: ROW_MAG,
			data: bins,
			valueField: "magMax",
			yMin: weekYMin,
			yMax: weekYMax,
			fillMode: "solid",
			solidColorInt: 0xf2b82e,
			fillOpacity: 1,
		});

		container.children.push(
			am5.Container.new(root, { height: ROW_GAP, width: am5.p100 }),
		);

		// depth strip
		const maxDepthInBins =
			mode === "week" ? Math.max(...bins.map((b) => b.depthAvg), 50) : 700;

		const depthYMin = mode === "week" ? -Math.ceil(maxDepthInBins * 1.2) : -700;

		const depthChart = createStrip({
			root,
			parent: container,
			heightPx: ROW_DEPTH,
			data: bins,
			valueField: "depthNeg",
			yMin: depthYMin,
			yMax: 0,
			fillMode: "depthGradient",
			fillOpacity: 1,
		});

		const vLineMag = magChart.plotContainer.children.push(
			am5.Graphics.new(root, {
				stroke: am5.color(0xffffff),
				strokeOpacity: 0.9,
				strokeWidth: 2,
				visible: mode !== "week" && !isAllModeRef.current,
			}),
		);

		const vLineDepth = depthChart.plotContainer.children.push(
			am5.Graphics.new(root, {
				stroke: am5.color(0xffffff),
				strokeOpacity: 0.9,
				strokeWidth: 2,
				visible: mode !== "week" && !isAllModeRef.current,
			}),
		);

		const redrawLines = () => {
			const visible = mode !== "week" && !isAllModeRef.current;

			vLineMag.set("visible", visible);
			vLineDepth.set("visible", visible);

			if (!visible) return;

			const p = progressRef.current;

			{
				const w = magChart.plotContainer.width();
				const h = magChart.plotContainer.height();
				const x = Math.round(w * p);

				vLineMag.set("draw", (display) => {
					display.moveTo(x, 0);
					display.lineTo(x, h);
				});
			}

			{
				const w = depthChart.plotContainer.width();
				const h = depthChart.plotContainer.height();
				const x = Math.round(w * p);

				vLineDepth.set("draw", (display) => {
					display.moveTo(x, 0);
					display.lineTo(x, h);
				});
			}
		};

		const d1 = root.events.on("frameended", redrawLines);
		const d2 = root.container.events.on("boundschanged", redrawLines);

		return () => {
			d1.dispose();
			d2.dispose();
			root.dispose();
		};
	}, [bins, mode]);

	if (bins.length === 0) return null;

	const chartH = 130;

	const magLegend =
		mode === "week" ? "Magnitude (2.5+)" : "Magnitude (6 - 9.5)";
	const depthLegend = "Depth (km) (0 - 700)";
	const periodLabel = mode === "week" ? "per day" : "per month";

	return (
		<div className={styles.wrap} aria-hidden="true">
			<div className={styles.aggregationHint}>
				<span className={styles.metricPill}>M max ({periodLabel})</span>
				<span className={styles.metricPill}>Depth avg ({periodLabel})</span>
			</div>

			<div className={styles.legends}>
				<span className={styles.legendMag}>{magLegend}</span>
				<span className={styles.legendDepth}>{depthLegend}</span>
			</div>

			<div className={styles.chartCell} style={{ height: chartH }}>
				<div ref={hostRef} className={styles.chartHost} />
			</div>

			<div className={styles.axis}>
				<span className={styles.axisStart}>
					{mode === "week" ? "7d" : START_YEAR}
				</span>

				<div
					className={`${styles.axisDate} ${
						mode === "week" || isAllMode ? styles.axisDateHidden : ""
					}`}
				>
					{currentLabel}
				</div>

				<span className={styles.axisEnd}>
					{mode === "week" ? "Now" : END_YEAR}
				</span>
			</div>
		</div>
	);
}
