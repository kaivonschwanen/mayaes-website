"use client";

import { Canvas } from "@react-three/fiber";
import StarField from "./StarField";
import NebulaField from "./NebulaField";
import ParallaxCamera from "./ParallaxCamera";

export default function SpaceBackground() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#010207]"
        >
            {/* Deep space */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,#0c1428_0%,#070b17_30%,#03050b_62%,#010207_100%)]" />

            {/* Slow moving distant light fields */}
            <div className="space-glow space-glow-1" />
            <div className="space-glow space-glow-2" />
            <div className="space-glow space-glow-3" />

            {/* Very subtle central depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.28)_75%,rgba(0,0,0,0.7)_100%)]" />

            <Canvas
                camera={{ position: [0, 0, 1], fov: 60 }}
                dpr={[1, 1.5]}
                gl={{
                    antialias: false,
                    alpha: true,
                    powerPreference: "low-power",
                }}
            >
                <ParallaxCamera />
                <NebulaField />
                <StarField />
            </Canvas>

            {/* Final cinematic vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.35)_100%)]" />
        </div>
    );
}
