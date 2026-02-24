import * as am5 from "@amcharts/amcharts5";

export function createAmRoot(host: HTMLElement) {
	const root = am5.Root.new(host);
	root.setThemes([]);
	root._logo?.dispose();
	return root;
}
