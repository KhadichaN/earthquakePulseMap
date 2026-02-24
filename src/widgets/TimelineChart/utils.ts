export function pad2(n: number) {
	return String(n).padStart(2, "0");
}

export function hexToRgbInt(hex: string) {
	const h = hex.replace("#", "");
	return Number.parseInt(h, 16);
}

export function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

export function lerpColorInt(aHex: string, bHex: string, t: number) {
	const a = hexToRgbInt(aHex);
	const b = hexToRgbInt(bHex);

	const ar = (a >> 16) & 255;
	const ag = (a >> 8) & 255;
	const ab = a & 255;

	const br = (b >> 16) & 255;
	const bg = (b >> 8) & 255;
	const bb = b & 255;

	const r = Math.round(lerp(ar, br, t));
	const g = Math.round(lerp(ag, bg, t));
	const bl = Math.round(lerp(ab, bb, t));

	return (r << 16) | (g << 8) | bl;
}

export function intToHex6(rgbInt: number) {
	return `#${rgbInt.toString(16).padStart(6, "0")}`;
}
