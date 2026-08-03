"use client";

import { Canvas } from "@react-three/fiber";
import StarField from "./StarField";
import NebulaField from "./NebulaField";
import ParallaxCamera from "./ParallaxCamera";

export default function SpaceBackground() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10"
        >
            <Canvas
                camera={{ position: [0, 0, 1], fov: 60 }}
                dpr={[1, 1.5]}
                gl={{ antialias: false, alpha: false, powerPreference: "low-power" }}
            >
                <color attach="background" args={["#0b0b0c"]} />
                <ParallaxCamera />
                <NebulaField />
                <StarField />
            </Canvas>
        </div>
    );
}
