import * as THREE from "three";

export function latLonToUnitVec3(latDeg: number, lonDeg: number) {
	const lat = (latDeg * Math.PI) / 180;
	const lon = (lonDeg * Math.PI) / 180;

	const cosLat = Math.cos(lat);

	const x = cosLat * Math.cos(lon);
	const y = Math.sin(lat);
	const z = cosLat * Math.sin(lon);

	return new THREE.Vector3(x, y, z);
}
