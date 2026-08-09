import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import ProtectedImage from "@/components/ProtectedImage";
import InfoFlip from "@/components/InfoFlip";

export const metadata: Metadata = {
    title: "About Me",
    robots: { index: true, follow: true },
};

/**
 * ============================================================
 * BILD-ROTATION -- hier einstellen, kein Bildbearbeitungs-Tool noetig:
 *
 * 1) ROTATION_DEG: Winkel in Grad, um das Foto geradezuruecken.
 *    Positiv = im Uhrzeigersinn, negativ = gegen den Uhrzeigersinn.
 *    In 0.5er-Schritten annaehern, bis du senkrecht stehst.
 *
 * 2) IMAGE_SCALE: Durch das Rotieren entstehen an den Ecken leere
 *    Dreiecke (dort wuerde sonst der Container-Hintergrund
 *    durchscheinen). Bild leicht hochskalieren (>1), bis die Ecken
 *    komplett vom Foto bedeckt sind. Bei kleinen Winkeln reichen
 *    meist 1.03-1.12 -- einfach hochzaehlen, bis nichts mehr durch-
 *    schimmert, dann nicht weiter als noetig (sonst wird zu stark
 *    reingezoomt und es geht Bildinhalt an den Raendern verloren).
 * ============================================================
 */
const ROTATION_DEG = 0;
const IMAGE_SCALE = 1;

// Punkte-Raster
const DOT_COLS_1 = 35;
const DOT_ROWS_1 = 10;

const DOT_COLS_2 = 7;
const DOT_ROWS_2 = 27;

export default async function AboutPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "AboutMe" });

    /** Fehlt ein Key in den messages, bleibt das Feld leer statt zu werfen */
    const tx = (key: string, fallback = "") => {
        try {
            const has = (t as unknown as { has?: (k: string) => boolean }).has;
            if (typeof has === "function" && !has.call(t, key)) return fallback;
            return t(key);
        } catch {
            return fallback;
        }
    };

    const frontEyebrow = tx("frontEyebrow", tx("infoLabel"));
    const frontHeadline = tx("frontHeadline");
    const frontText = tx("frontText");
    const frontBadge = tx("frontBadge");

    return (
        <main className="mx-auto max-w-[1400px] px-6 py-24 text-bone md:px-10">
            <Link
                href="../"
                className="mb-12 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-mute transition-colors hover:text-blood"
            >
                ← {t("back")}
            </Link>


            <h1 className="font-display mb-20 mt-4 text-[8vw] leading-[0.85] tracking-tight md:text-[4vw]">
                {t("titleLine3")}
                <br />
                <span className="text-blood">{t("titleLine4")}</span>
            </h1>

            <div className="grid grid-cols-1 gap-40 md:grid-cols-2 md:items-center">
                {/* Bild -- gleiche visuelle Sprache wie das Hero-Portrait
            (border, bg-ink-soft, overflow-hidden) fuer Konsistenz */}
                {/* Bild mit Deko-Elementen */}
                <div className="relative">
                    {/* Blaues Rechteck -- oben links */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -left-8 -bottom-8 z-0 h-56 w-40 bg-[#2f5fd0]"
                    />

                    {/* Rosa Rechteck -- unten rechts */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -top-10 -right-8 z-0 h-64 w-48 bg-[#e8a0b8]"
                    />

                    {/* Punkte-Raster 10 x 30 -- rechts oben */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -right-10 -bottom-11 z-20 grid gap-[6px]"
                        style={{ gridTemplateColumns: `repeat(${DOT_COLS_1}, 3px)` }}
                    >
                        {Array.from({ length: DOT_COLS_1 * DOT_ROWS_1 }).map((_, i) => (
                            <span key={i} className="block h-[3px] w-[3px] bg-white/70" />))}
                    </div>
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -left-8 -top-6 z-20 grid gap-[6px]"
                        style={{ gridTemplateColumns: `repeat(${DOT_COLS_2}, 3px)` }}
                    >
                        {Array.from({ length: DOT_COLS_2 * DOT_ROWS_2 }).map((_, i) => (
                            <span key={i} className="block h-[3px] w-[3px] bg-white/70" />
                        ))}
                    </div>

                    {/* Bild -- liegt darüber */}
                    <div className="relative z-10 aspect-square overflow-hidden">
                        <div
                            className="absolute inset-0"
                            style={{
                                transform: `rotate(${ROTATION_DEG}deg) scale(${IMAGE_SCALE})`,
                                transformOrigin: "center center",
                            }}
                        >
                            <ProtectedImage
                                src="/Maya Website Quadrat.jpg"
                                alt={t("imageAlt")}
                                className="object-cover select-none [-webkit-touch-callout:none]"
                                sizes="(min-width: 768px) 50vw, 100vw"
                            />
                        </div>
                    </div>
                </div>

                {/* Flip-Kachel -- Vorderseite transparent mit weisser Schrift */}
                <InfoFlip
                    label={t("infoLabel")}
                    front={
                        <div className="flex h-full w-full flex-col justify-center overflow-y-auto p-8 md:p-10">
                            {/* 1 -- rote Zeile */}
                            <span className="text-xs font-medium uppercase tracking-[0.2em] text-blood">
                                {frontEyebrow}
                            </span>

                            {/* 2 -- grosse, fette Zeile in Weiss */}
                            <h2 className="font-display mt-4 text-3xl font-bold leading-[0.95] text-bone md:text-4xl">
                                {frontHeadline}
                            </h2>

                            {/* 3 -- kleinerer Text in Grau */}
                            {frontText && (
                                <p className="mt-6 max-w-md text-sm leading-relaxed text-mute">
                                    {frontText}
                                </p>
                            )}

                            {/* 4 -- Rechteck mit Text */}
                            {frontBadge && (
                                <span className="mt-8 inline-flex w-fit items-center gap-2 border border-white/25 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.3em] text-bone/70">
                                    {frontBadge}
                                </span>
                            )}
                        </div>
                    }
                >
                    <div className="space-y-4 text-xs leading-relaxed text-ink text-justify">
                        <p>{t("paragraph1")}</p>
                        <p>{t("paragraph2")}</p>
                        <p>{t("paragraph3")}</p>
                        <p>{t("paragraph4")}</p>
                        <p>{t("paragraph5")}</p>
                        <p>{t("paragraph6")}</p>
                        <p>{t("paragraph7")}</p>
                        <p>{t("paragraph8")}</p>
                    </div>
                </InfoFlip>
            </div>
        </main>
    );
}
