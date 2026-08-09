"use client";

import { useState } from "react";

const hasHover = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

export default function InfoFlip({
    label,
    front,
    children,
}: {
    label: string;
    /** Optional: freier Inhalt fuer die Vorderseite. Ohne Angabe wird `label` zentriert gezeigt. */
    front?: React.ReactNode;
    children: React.ReactNode;
}) {
    const [flipped, setFlipped] = useState(false);
    const toggle = () => setFlipped((prev) => !prev);

    return (
        <div
            className="relative [perspective:1600px]"
            onMouseEnter={() => hasHover() && setFlipped(true)}
            onMouseLeave={() => hasHover() && setFlipped(false)}
            onFocus={() => setFlipped(true)}
            onBlur={() => setFlipped(false)}
            onClick={() => !hasHover() && toggle()}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle();
                }
            }}
            tabIndex={0}
            role="button"
            aria-expanded={flipped}
            aria-label={label}
        >
            <div
                className="relative transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{
                    transformStyle: "preserve-3d",
                    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
            >
                {/* Rückseite -- gibt die Höhe vor */}
                <div
                    className="bg-paper p-8 text-ink md:p-10"
                    style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                    }}
                >
                    {children}
                </div>

                {/* Vorderseite -- transparent */}
                <div
                    className={[
                        "absolute inset-0 border border-white/25",
                        front ? "" : "flex items-center justify-center p-8",
                    ].join(" ")}
                    style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(0deg) translateZ(1px)",
                    }}
                >
                    {front ?? (
                        <span className="font-display text-center text-4xl uppercase tracking-[0.2em] text-bone md:text-5xl">
                            {label}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
