import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import ProtectedImage from "@/components/ProtectedImage";

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

export default async function AboutPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "AboutMe" });

    return (
        <main className="mx-auto max-w-[1400px] px-6 py-24 text-bone md:px-10">
            <Link
                href="../"
                className="mb-12 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-mute transition-colors hover:text-blood"
            >
                ← {t("back")}
            </Link>

            <div className="grid grid-cols-1 gap-40 md:grid-cols-2 md:items-start">
                {/* Bild -- gleiche visuelle Sprache wie das Hero-Portrait
            (border, bg-ink-soft, overflow-hidden) fuer Konsistenz */}
                <div className="relative aspect-[3/4] overflow-hidden ">
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
                            className="object-contain select-none [-webkit-touch-callout:none]"
                            sizes="(min-width: 768px) 50vw, 100vw"
                        />
                    </div>
                </div>

                {/* Text */}
                <div className="flex flex-col justify-center">
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-blood">
                        {t("label")}
                    </span>
                    <h1 className="font-display mt-4 text-5xl leading-[1.0] md:text-4xl">
                        {t("title")}
                    </h1>
                    <div className="mt-6 max-w-md space-y-4 text-sm leading-relaxed text-mute text-justify">
                        <p>{t("paragraph1")}</p>
                        <p>{t("paragraph2")}</p>
                        <p>{t("paragraph3")}</p>
                        <p>{t("paragraph4")}</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
