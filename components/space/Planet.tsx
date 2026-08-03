"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type PlanetProps = {
    position?: [number, number, number];
    radius?: number;
    color?: string;
    rimColor?: string;
    rotationSpeed?: number;
};

export default function Planet({
    position = [9, -3, -18],
    radius = 2.2,
    color = "#1c1a2e",
    rimColor = "#8a7ac0",
    rotationSpeed = 0.02,
}: PlanetProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            // Bewusst UNDURCHSICHTIG: bei transparent+opacity< 1 mischt sich
            // die ohnehin schon dunkle Planetenfarbe zusaetzlich mit dem
            // fast-schwarzen Hintergrund und verschwindet fast komplett.
            // Die "Dezenz" kommt hier ueber gedeckte Farben, nicht ueber Alpha.
            transparent: false,
            depthWrite: true,
            uniforms: {
                uColor: { value: new THREE.Color(color) },
                uRimColor: { value: new THREE.Color(rimColor) },
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vViewPosition;

                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    vViewPosition = -mvPosition.xyz;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 uColor;
                uniform vec3 uRimColor;

                varying vec3 vNormal;
                varying vec3 vViewPosition;

                void main() {
                    vec3 viewDir = normalize(vViewPosition);
                    float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
                    rim = pow(rim, 2.2);

                    // leichte Grundschattierung ueber die Kugel, damit sie
                    // nicht wie eine flache Scheibe wirkt
                    float shade = max(dot(vNormal, vec3(0.4, 0.5, 0.7)), 0.0);
                    vec3 base = uColor * (0.4 + shade * 0.6);

                    vec3 color = mix(base, uRimColor, rim);
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
        });
    }, [color, rimColor]);

    useEffect(() => {
        return () => material.dispose();
    }, [material]);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += rotationSpeed * delta;
        }
    });

    return (
        <mesh ref={meshRef} position={position} material={material} renderOrder={2}>
            <sphereGeometry args={[radius, 48, 48]} />
        </mesh>
    );
}
