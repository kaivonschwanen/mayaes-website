"use client";

import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

type StarData = {
    positions: Float32Array;
    sizes: Float32Array;
    opacities: Float32Array;
    twinkleSpeeds: Float32Array;
    twinklePhases: Float32Array;
    twinkleAmounts: Float32Array;
};

const STAR_COUNT = 500;

// Nur ein Teil der Sterne funkelt -- wirkt organischer als wenn alle
// gleichzeitig pulsieren.
const TWINKLE_CHANCE = 0.45;

export default function StarField() {
    const dpr = useThree((state) => state.viewport.dpr);

    const starData = useMemo<StarData>(() => {
        const positions = new Float32Array(STAR_COUNT * 3);
        const sizes = new Float32Array(STAR_COUNT);
        const opacities = new Float32Array(STAR_COUNT);

        const twinkleSpeeds = new Float32Array(STAR_COUNT);
        const twinklePhases = new Float32Array(STAR_COUNT);
        const twinkleAmounts = new Float32Array(STAR_COUNT);

        for (let i = 0; i < STAR_COUNT; i++) {
            const depth = Math.random();

            let z: number;
            let size: number;
            let opacity: number;

            if (depth < 0.6) {
                // FAR
                z = THREE.MathUtils.randFloat(-40, -30);
                size = THREE.MathUtils.randFloat(1.0, 1.5);
                opacity = THREE.MathUtils.randFloat(0.18, 0.35);
            } else if (depth < 0.9) {
                // MID
                z = THREE.MathUtils.randFloat(-30, -15);
                size = THREE.MathUtils.randFloat(1.2, 1.8);
                opacity = THREE.MathUtils.randFloat(0.25, 0.5);
            } else {
                // NEAR
                z = THREE.MathUtils.randFloat(-15, -5);
                size = THREE.MathUtils.randFloat(1.5, 2.2);
                opacity = THREE.MathUtils.randFloat(0.35, 0.65);
            }

            positions[i * 3] = THREE.MathUtils.randFloatSpread(100);
            positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(60);
            positions[i * 3 + 2] = z;

            sizes[i] = size;
            opacities[i] = opacity;

            // Jeder Stern bekommt eine eigene Basisgeschwindigkeit UND
            // eine eigene Phase -- daraus entsteht unten ein unregelmässiges,
            // "digitales" Flimmern statt eines gleichmässigen Atmens.
            twinkleSpeeds[i] = THREE.MathUtils.randFloat(0.4, 1.6);
            twinklePhases[i] = THREE.MathUtils.randFloat(0, Math.PI * 2);

            const willTwinkle = Math.random() < TWINKLE_CHANCE;
            // Sterne ohne Funkeln bekommen amount = 0 -> im Shader faellt
            // vTwinkle dadurch konstant auf 1.0, komplett ruhig.
            twinkleAmounts[i] = willTwinkle
                ? THREE.MathUtils.randFloat(0.25, 0.5)
                : 0;
        }

        return {
            positions,
            sizes,
            opacities,
            twinkleSpeeds,
            twinklePhases,
            twinkleAmounts,
        };
    }, []);

    const geometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(starData.positions, 3));
        geometry.setAttribute("aSize", new THREE.BufferAttribute(starData.sizes, 1));
        geometry.setAttribute("aOpacity", new THREE.BufferAttribute(starData.opacities, 1));
        geometry.setAttribute("aTwinkleSpeed", new THREE.BufferAttribute(starData.twinkleSpeeds, 1));
        geometry.setAttribute("aTwinklePhase", new THREE.BufferAttribute(starData.twinklePhases, 1));
        geometry.setAttribute("aTwinkleAmount", new THREE.BufferAttribute(starData.twinkleAmounts, 1));
        return geometry;
    }, [starData]);

    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            blending: THREE.NormalBlending,
            uniforms: {
                uColor: { value: new THREE.Color("#f5f4f1") },
                uTime: { value: 0 },
                uPixelRatio: { value: dpr },
            },
            vertexShader: `
                attribute float aSize;
                attribute float aOpacity;
                attribute float aTwinkleSpeed;
                attribute float aTwinklePhase;
                attribute float aTwinkleAmount;

                uniform float uTime;
                uniform float uPixelRatio;

                varying float vOpacity;
                varying float vTwinkle;

                void main() {
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

                    // Zwei ueberlagerte Sinuswellen mit unterschiedlicher
                    // Frequenz ergeben ein unregelmaessiges Muster statt
                    // eines simplen, vorhersehbaren Auf-und-Ab.
                    float wave1 = sin(uTime * aTwinkleSpeed * 2.2 + aTwinklePhase);
                    float wave2 = sin(uTime * aTwinkleSpeed * 6.7 + aTwinklePhase * 2.3);
                    float combined = wave1 * 0.65 + wave2 * 0.35;

                    // Weicher als vorher (pow 3 statt 5): kein hartes
                    // An/Aus-Blinken mehr, sondern ein sanftes Aufglimmen.
                    float sharpPulse = pow(clamp(combined, 0.0, 1.0), 3.0);

                    vTwinkle = (1.0 - aTwinkleAmount * 0.5) + sharpPulse * aTwinkleAmount * 1.4;

                    // Beim Aufglimmen wird der Punkt minimal groesser --
                    // dezenter Glint-Effekt zusaetzlich zur Helligkeit.
                    float sizePulse = 1.0 + sharpPulse * 0.18;

                    gl_PointSize = aSize * uPixelRatio * sizePulse * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;

                    vOpacity = aOpacity;
                }
            `,
            fragmentShader: `
                uniform vec3 uColor;
                varying float vOpacity;
                varying float vTwinkle;

                void main() {
                    vec2 uv = gl_PointCoord - 0.5;
                    float distanceFromCenter = length(uv);

                    if (distanceFromCenter > 0.5) {
                        discard;
                    }

                    // Kleiner, knackiger heller Kern statt grossflaechig weich --
                    // das liest sich mehr wie ein winziger LED-Punkt.
                    float core = 1.0 - smoothstep(0.0, 0.22, distanceFromCenter);
                    float halo = 1.0 - smoothstep(0.05, 0.5, distanceFromCenter);
                    float shape = core * 0.7 + halo * 0.3;

                    float alpha = shape * vOpacity * vTwinkle;

                    gl_FragColor = vec4(uColor, alpha);
                }
            `,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        material.uniforms.uPixelRatio.value = dpr;
    }, [dpr, material]);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        // Bei reduzierter Bewegung: Sterne bleiben sichtbar, aber statisch --
        // kein Twinkle-Loop. uTime bleibt auf 0, vTwinkle-Term faellt damit
        // auf den Basiswert ohne Pulsieren zurueck.
        if (prefersReducedMotion) {
            return () => {
                geometry.dispose();
                material.dispose();
            };
        }

        let animationFrameId = 0;
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (startTime === null) {
                startTime = timestamp;
            }
            const elapsed = (timestamp - startTime) / 1000;
            material.uniforms.uTime.value = elapsed;
            animationFrameId = window.requestAnimationFrame(animate);
        };

        animationFrameId = window.requestAnimationFrame(animate);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            geometry.dispose();
            material.dispose();
        };
    }, [material, geometry]);

    return <points geometry={geometry} material={material} renderOrder={1} />;
}
