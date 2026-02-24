import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import { MAX_DEPTH_KM } from "../constants";
import type { Bin } from "../types";
import { lerpColorInt } from "../utils";

export function createStrip(opts: {
	root: am5.Root;
	parent: am5.Container;
	heightPx: number;
	data: Bin[];
	valueField: "magMax" | "depthNeg";
	yMin: number;
	yMax: number;
	fillMode: "solid" | "depthGradient";
	solidColorInt?: number;
	fillOpacity: number;
}) {
	const chart = opts.parent.children.push(
		am5xy.XYChart.new(opts.root, {
			panX: false,
			panY: false,
			wheelX: "none",
			wheelY: "none",
			paddingLeft: 0,
			paddingRight: 0,
			paddingTop: 0,
			paddingBottom: 0,
			height: opts.heightPx,
		}),
	);

	const xRenderer = am5xy.AxisRendererX.new(opts.root, {
		visible: false,
		minGridDistance: 0,
	});
	xRenderer.grid.template.setAll({ visible: false });
	xRenderer.labels.template.setAll({ visible: false });

	const xAxis = chart.xAxes.push(
		am5xy.CategoryAxis.new(opts.root, {
			categoryField: "label",
			renderer: xRenderer,
			startLocation: 0,
			endLocation: 1,
		}),
	);

	const yRenderer = am5xy.AxisRendererY.new(opts.root, { visible: false });
	yRenderer.grid.template.setAll({ visible: false });
	yRenderer.labels.template.setAll({ visible: false });

	const yAxis = chart.yAxes.push(
		am5xy.ValueAxis.new(opts.root, {
			min: opts.yMin,
			max: opts.yMax,
			renderer: yRenderer,
		}),
	);

	const series = chart.series.push(
		am5xy.ColumnSeries.new(opts.root, {
			xAxis,
			yAxis,
			categoryXField: "label",
			valueYField: opts.valueField,
			clustered: false,
		}),
	);

	series.columns.template.setAll({
		width: 2,
		strokeOpacity: 0,
		fillOpacity: opts.fillOpacity,
	});

	if (opts.fillMode === "solid") {
		series.columns.template.setAll({
			fill: am5.color(opts.solidColorInt ?? 0xf2b82e),
		});
	}

	if (opts.fillMode === "depthGradient") {
		const shallow = "#f2b82e";
		const deep = "#b81414";

		series.columns.template.adapters.add("fill", (fill, target) => {
			const ctx = target.dataItem?.dataContext as Bin | undefined;
			if (!ctx) return fill;

			let t = ctx.depthAvg / MAX_DEPTH_KM;
			t = Math.min(Math.max(t, 0), 1);
			t = t ** 0.6;

			return am5.color(lerpColorInt(shallow, deep, t));
		});
	}

	series.set("interactive", false);
	chart.set("interactive", false);

	xAxis.data.setAll(opts.data);
	series.data.setAll(opts.data);

	const zeroRange = yAxis.createAxisRange(yAxis.makeDataItem({ value: 0 }));
	zeroRange.get("grid")?.setAll({
		stroke: am5.color(0xffffff),
		strokeOpacity: 0.12,
		strokeWidth: 1,
		visible: true,
	});

	return chart;
}
