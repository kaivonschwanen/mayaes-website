"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

const CLIENTS = [
    { name: "MERIDIAN", src: "/logos/decentraland logo.jpg" },
    { name: "GLASHAUS", src: "/logos/DFWNY-logo.jpg" },
    { name: "FERNWEH", src: "/logos/Fashion-Week-Brooklyn logo.jpg" },
    { name: "UNIT9", src: "/logos/Faust Magazine Logo.png" },
    { name: "OBLIQUE", src: "/logos/FFFM.png" },
    { name: "STUDIO KLANG", src: "/logos/jitrois-logo.jpg" },
    { name: "LOGO 7", src: "/logos/Logo_Popakademie.jpg" },
    { name: "LOGO 8", src: "/logos/Roku-tv-logo.jpg" },
    { name: "LOGO 9", src: "/logos/Spotify-logo.jpg" },
    { name: "LOGO 10", src: "/logos/vntana-logo.jpg" },
    { name: "LOGO 11", src: "/logos/youtube_music_preview.png" },
];

// Liste verdoppeln -> nahtlose Endlos-Schleife (translateX(-50%) = genau 1 Satz)
const LOOP_CLIENTS = [...CLIENTS, ...CLIENTS];

export default function PartnersMarquee() {
    const t = useTranslations();

    return (
        <section className="mx-auto mt-16 flex max-w-[1400px] items-stretch bg-ink">
            {/* Label links */}
            <div className="flex shrink-0 items-center px-6 py-10 md:px-10">
                <span className="whitespace-nowrap text-xs uppercase tracking-[0.2em] text-mute">
                    {t("Contact.clientsLabel")}
                </span>
            </div>

            {/* weiße Trennlinie */}
            <div className="my-6 w-px shrink-0 bg-white/25" />

            {/* Scroll-Fenster – Breite steuert, wie viele Logos sichtbar sind (hier: 6) */}
            <div className="relative w-full max-w-[896px] overflow-hidden py-10">
                <div className="animate-marquee flex w-max gap-6 pl-6">
                    {LOOP_CLIENTS.map((client, i) => (
                        <div
                            key={`${client.name}-${i}`}
                            className="group relative h-14 w-[170px] shrink-0 transition-transform duration-300 ease-out hover:z-10 hover:scale-150 md:h-16 md:w-[200px]"
                        >
                            <Image
                                src={client.src}
                                alt={`${client.name} Logo`}
                                fill
                                sizes="150px"
                                className="object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
