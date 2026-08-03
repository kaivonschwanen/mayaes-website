"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type NebulaData = {
    position: [number, number, number];
    radius: number;
    color: string;
    opacity: number;
    rotationSpeed: number;
};

const NEBULA_COUNT = 10;

// Reine Grautoene fuer den monochromen Look -- keine Farbe mehr,
// nur unterschiedliche Helligkeitsstufen fuer etwas Tiefe.
const NEBULA_COLORS = ["#4a4a4a", "#3a3a3a", "#525252", "#404040"];

function useNebulaData(): NebulaData[] {
    return useMemo(() => {
        const data: NebulaData[] = [];
        for (let i = 0; i < NEBULA_COUNT; i++) {
            data.push({
                position: [
                    THREE.MathUtils.randFloatSpread(24),
                    THREE.MathUtils.randFloatSpread(16),
                    THREE.MathUtils.randFloat(-28, -16),
                ],
                radius: THREE.MathUtils.randFloat(16, 26),
                color: NEBULA_COLORS[i % NEBULA_COLORS.length],
                opacity: THREE.MathUtils.randFloat(0.1, 0.16),
                rotationSpeed: THREE.MathUtils.randFloat(-0.05, 0.05),
            });
        }
        return data;
    }, []);
}

function NebulaBlob({ position, radius, color, opacity, rotationSpeed }: NebulaData) {
    const meshRef = useRef<THREE.Mesh>(null);

    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uColor: { value: new THREE.Color(color) },
                uOpacity: { value: opacity },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 uColor;
                uniform float uOpacity;
                varying vec2 vUv;

                void main() {
                    float dist = length(vUv - 0.5) * 2.0;
                    float falloff = 1.0 - smoothstep(0.0, 1.0, dist);
                    falloff = pow(falloff, 1.8);
                    gl_FragColor = vec4(uColor * falloff * uOpacity, falloff * uOpacity);
                }
            `,
        });
    }, [color, opacity]);

    useEffect(() => {
        return () => material.dispose();
    }, [material]);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.z += rotationSpeed * delta * 0.1;
        }
    });

    return (
        <mesh ref={meshRef} position={position} material={material} renderOrder={0}>
            <planeGeometry args={[radius, radius]} />
        </mesh>
    );
}

export default function NebulaField() {
    const nebulas = useNebulaData();

    return (
        <>
            {nebulas.map((n, i) => (
                <NebulaBlob key={i} {...n} />
            ))}
        </>
    );
}
