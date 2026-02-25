export const vertexShader = `
          attribute float aMagnitude;
          attribute float aDepth;
          attribute float aTime;

          uniform float uMagMin;
          uniform float uMagMax;

          varying float vDepth;
          varying float vTime;

          void main() {
            vDepth = aDepth;
            vTime = aTime;

            float magNorm = clamp((aMagnitude - uMagMin) / max(0.0001, (uMagMax - uMagMin)), 0.0, 1.0);

            float size = mix(3.0, 16.0, magNorm);

            gl_PointSize = size;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `;
export const fragmentShader = `
			uniform float uMaxDepth;
			uniform float uCurrentTime;
			uniform float uTimeSpeed;
			uniform float uShowAll;

			varying float vDepth;
			varying float vTime;

			void main() {
				float dist = length(gl_PointCoord - vec2(0.5));
				if (dist > 0.5) discard;

				float life = 1.0;

				if (uShowAll < 0.5) {
					float diff = uCurrentTime - vTime;
					if (diff < 0.0) discard;

					float baseLifeWindow = 0.05;
					float lifeWindow = baseLifeWindow / sqrt(max(uTimeSpeed, 0.0001));

					life = 1.0 - clamp(diff / lifeWindow, 0.0, 1.0);
					if (life <= 0.0) discard;
				} else {
					life = 1.15;
				}

				vec3 color;

				if (vDepth < 0.0) {
					color = vec3(0.55, 0.52, 0.65);
				} else {
					float depthNorm = clamp(vDepth / max(uMaxDepth, 1.0), 0.0, 1.0);
					depthNorm = pow(depthNorm, 0.6);

					vec3 shallow = vec3(0.95, 0.72, 0.18);
					vec3 deep = vec3(0.72, 0.08, 0.08);

					color = mix(shallow, deep, depthNorm);
				}

				float glow = 1.0 - smoothstep(0.3, 0.5, dist);
				float core = 1.0 - smoothstep(0.0, 0.15, dist);

				vec3 finalColor = color + color * core * 0.8;

				if (uShowAll > 0.5) {
					finalColor *= 1.25;
				}

				float alpha = (glow * 0.7 + core * 0.9) * life;
				gl_FragColor = vec4(finalColor, alpha);
			}
        `;
