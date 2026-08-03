"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const PARALLAX_STRENGTH_X = 5;
const PARALLAX_STRENGTH_Y = 1.8;
const LERP_FACTOR = 0.03;

// TEMPORAER zum Debuggen -- danach wieder auf false setzen.
const DEBUG = true;

export default function ParallaxCamera() {
    const { camera } = useThree();
    const target = useRef({ x: 0, y: 0 });
    const enabled = useRef(true);
    const frameCount = useRef(0);

    useEffect(() => {
        enabled.current = !window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (DEBUG) {
            console.log(
                "[ParallaxCamera] mounted. enabled =",
                enabled.current,
                "camera =",
                camera
            );
        }

        if (!enabled.current) return;

        function handlePointerMove(e: PointerEvent) {
            const nx = (e.clientX / window.innerWidth) * 2 - 1;
            const ny = (e.clientY / window.innerHeight) * 2 - 1;

            target.current.x = nx * PARALLAX_STRENGTH_X;
            target.current.y = -ny * PARALLAX_STRENGTH_Y;

            if (DEBUG) {
                console.log(
                    "[ParallaxCamera] pointermove ->",
                    "clientX:", e.clientX,
                    "target.x:", target.current.x.toFixed(3)
                );
            }
        }

        window.addEventListener("pointermove", handlePointerMove);
        return () => window.removeEventListener("pointermove", handlePointerMove);
    }, [camera]);

    useFrame(() => {
        if (!enabled.current) return;

        camera.position.x += (target.current.x - camera.position.x) * LERP_FACTOR;
        camera.position.y += (target.current.y - camera.position.y) * LERP_FACTOR;

        if (DEBUG) {
            frameCount.current += 1;
            // nur alle ~30 Frames loggen, sonst spammt die Konsole zu
            if (frameCount.current % 30 === 0) {
                console.log(
                    "[ParallaxCamera] frame tick, camera.position.x =",
                    camera.position.x.toFixed(3),
                    "target.x =",
                    target.current.x.toFixed(3)
                );
            }
        }
    });

    return null;
}
