import * as THREE from "three";

export function buildGeometry(data: Float32Array) {
	const stride = 6;
	const count = data.length / stride;

	const positions = new Float32Array(count * 3);
	const magnitudes = new Float32Array(count);
	const depths = new Float32Array(count);
	const times = new Float32Array(count);

	for (let i = 0; i < count; i++) {
		positions[i * 3] = data[i * stride];
		positions[i * 3 + 1] = data[i * stride + 1];
		positions[i * 3 + 2] = data[i * stride + 2];

		magnitudes[i] = data[i * stride + 3];
		depths[i] = data[i * stride + 4];
		times[i] = data[i * stride + 5];
	}

	const g = new THREE.BufferGeometry();
	g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
	g.setAttribute("aMagnitude", new THREE.BufferAttribute(magnitudes, 1));
	g.setAttribute("aDepth", new THREE.BufferAttribute(depths, 1));
	g.setAttribute("aTime", new THREE.BufferAttribute(times, 1));

	return g;
}
