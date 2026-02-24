import * as am5 from "@amcharts/amcharts5";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { useTime } from "@/shared/context/TimeContext";
import { buildMonthlyBins } from "./bins";
import { createAmRoot } from "./chart/amRoot";
import { createStrip } from "./chart/createStrip";
import { END_YEAR, ROW_DEPTH, ROW_GAP, ROW_MAG, START_YEAR } from "./constants";
import styles from "./styles.module.scss";
import { pad2 } from "./utils";

export default function TimelineChartAm() {
	const { currentTimeRef, isAllMode, currentDate } = useTime();

	const hostRef = useRef<HTMLDivElement | null>(null);

	const [raw, setRaw] = useState<Float32Array | null>(null);
	const bins = useMemo(() => (raw ? buildMonthlyBins(raw) : []), [raw]);

	const progressRef = useRef(0);
	const isAllModeRef = useRef(isAllMode);

	useEffect(() => {
		isAllModeRef.current = isAllMode;
	}, [isAllMode]);

	const currentLabel = useMemo(() => {
		if (isAllMode) return "1900.01 — 2026.01";
		return `${currentDate.getUTCFullYear()}.${pad2(currentDate.getUTCMonth() + 1)}`;
	}, [currentDate, isAllMode]);

	useEffect(() => {
		fetch("/data/earthquakes.bin")
			.then((r) => r.arrayBuffer())
			.then((buf) => setRaw(new Float32Array(buf)));
	}, []);

	// Обновляем прогресс постоянно, без подсветок/эффектов
	useEffect(() => {
		let raf = 0;

		const tick = () => {
			const p = isAllModeRef.current
				? 1
				: Math.min(Math.max(currentTimeRef.current, 0), 1);

			progressRef.current = p;
			raf = requestAnimationFrame(tick);
		};

		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [currentTimeRef]);

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

		const magChart = createStrip({
			root,
			parent: container,
			heightPx: ROW_MAG,
			data: bins,
			valueField: "magMax",
			yMin: 5,
			yMax: 10,
			fillMode: "solid",
			solidColorInt: 0xf2b82e,
			fillOpacity: 1,
		});

		container.children.push(
			am5.Container.new(root, { height: ROW_GAP, width: am5.p100 }),
		);

		const depthChart = createStrip({
			root,
			parent: container,
			heightPx: ROW_DEPTH,
			data: bins,
			valueField: "depthNeg",
			yMin: -700,
			yMax: 0,
			fillMode: "depthGradient",
			fillOpacity: 1,
		});

		// Линии рисуем ВНУТРИ plotContainer каждого chart, чтобы учитывать padding.
		const vLineMag = magChart.plotContainer.children.push(
			am5.Graphics.new(root, {
				stroke: am5.color(0xffffff),
				strokeOpacity: 0.9,
				strokeWidth: 2,
				visible: !isAllModeRef.current,
			}),
		);

		const vLineDepth = depthChart.plotContainer.children.push(
			am5.Graphics.new(root, {
				stroke: am5.color(0xffffff),
				strokeOpacity: 0.9,
				strokeWidth: 2,
				visible: !isAllModeRef.current,
			}),
		);

		const redrawLines = () => {
			const visible = !isAllModeRef.current;

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
	}, [bins]);

	if (bins.length === 0) return null;

	const chartH = 130;

	return (
		<div className={styles.wrap} aria-hidden="true">
			<div className={styles.legends}>
				<span className={styles.legendMag}>Magnitude</span>
				<span className={styles.legendDepth}>Depth (km)</span>
			</div>

			<div className={styles.chartCell} style={{ height: chartH }}>
				<div ref={hostRef} className={styles.chartHost} />
			</div>

			<div className={styles.axis}>
				<span className={styles.axisStart}>{START_YEAR}</span>

				<div
					className={`${styles.axisDate} ${isAllMode ? styles.axisDateHidden : ""}`}
				>
					{currentLabel}
				</div>

				<span className={styles.axisEnd}>{END_YEAR}</span>
			</div>
		</div>
	);
}
