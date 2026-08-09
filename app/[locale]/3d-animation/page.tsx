"use client";

/**
 * app/[locale]/3d-animation/page.tsx
 *
 * Layout: pro Projekt eine Zeile aus zwei Kacheln.
 *  - Video-Kachel: Standbild, startet im Loop bei Hover (Touch: Tap)
 *  - Flip-Kachel:  Firmenlogo weiss auf schwarz, dreht sich bei Hover
 *                  wie eine Spielkarte und zeigt die Projektgeschichte
 * Die Zeilen alternieren, damit die Seite nicht in eine Spalte kippt.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import Header from "@/components/Header";
import AiLabel from "@/components/AiLabel";
import { Play, Volume2, VolumeX } from "lucide-react";

type Project = {
  /** Muss dem Key in den messages-Dateien entsprechen */
  id: string;
  videoSrc: string;
  poster: string;
  /** Optional: Pfad zum Logo (SVG/PNG, weiss). Ohne Angabe wird logoText gesetzt */
  logoSrc?: string;
  logoText: string;
  year: string;
};

const PROJECTS: Project[] = [
  {
    id: "casino",
    videoSrc: "https://media.mayaesai.com/Casino scene short.mp4",
    poster: "/Casino-Standbild-Website.jpg",
    logoSrc: "/logos/client-one.svg",
    logoText: "CLIENT ONE",
    year: "2025",
  },
  {
    id: "project-two",
    videoSrc: "https://media.mayaesai.com/beispiel-zwei.mp4",
    poster: "/beispiel-zwei-standbild.jpg",
    logoText: "CLIENT TWO",
    year: "2025",
  },
];

/** true auf Geräten mit echtem Maus-Hover */
const hasHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

export default function Animation3DPage() {
  const t = useTranslations("Animation3D");
  const tRoot = useTranslations();
  const locale = useLocale();

  /** Nur ein Video darf gleichzeitig Ton haben */
  const [soundId, setSoundId] = useState<string | null>(null);

  return (
    <main className="text-bone">

      {/* Der Universum-Parallax liegt im Layout dahinter -- deshalb hier
          bewusst kein deckender Hintergrund auf <main> oder <section>. */}

      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10">
        <Link
          href="../"
          className="mb-12 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-mute transition-colors hover:text-blood"
        >
          ← {t("back")}
        </Link>

        <span className="block text-xs font-medium uppercase tracking-[0.2em] text-blood">
          {t("eyebrow")}
        </span>

        <h1 className="font-display mt-4 text-[15vw] leading-[0.85] tracking-tight md:text-[6.2vw]">
          {t("titleLine1")}
          <br />
          <span className="text-blood">{t("titleLine2")}</span>
        </h1>

        <p className="mt-10 max-w-lg text-[17px] leading-[1.8] tracking-[0.01em] text-mute text-justify">
          {t("intro")}
        </p>
      </section>

      {PROJECTS.map((project, index) => {
        const reversed = index % 2 === 1;

        return (
          <section
            key={project.id}
            className="mx-auto grid max-w-[1400px] grid-cols-1 gap-px bg-white/5 md:grid-cols-2"
          >
            <div className={reversed ? "md:order-2" : "md:order-1"}>
              <VideoTile
                project={project}
                soundOn={soundId === project.id}
                onToggleSound={() =>
                  setSoundId((prev) => (prev === project.id ? null : project.id))
                }
              />
            </div>

            <div className={reversed ? "md:order-1" : "md:order-2"}>
              <FlipTile project={project} />
            </div>
          </section>
        );
      })}

      <section className="mx-auto grid max-w-[1400px] grid-cols-1 gap-px md:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col justify-center bg-blood p-8 text-ink md:p-14">
          <span className="text-xs font-medium uppercase tracking-[0.2em]">
            {t("Contact.collaboration")}
          </span>
          <h2 className="font-display mt-4 text-4xl leading-[0.95] md:text-5xl">
            {t("Contact.titleLine1")}
            <br />
            {t("Contact.titleLine2")}
          </h2>

          <a
            href="mailto:mayaes2018@gmail.com"
            className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:text-ink/60"
          >
            {t("Contact.cta")} <span aria-hidden>↗</span>
          </a>
        </div>

        <div className="flex flex-col justify-center p-8 md:p-14">
          <p className="max-w-xs text-sm leading-relaxed text-mute">
            {t("Contact.note")}
          </p>
          <Link
            href={`/${locale}/coming-soon`}
            className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-bone transition-colors hover:text-blood"
          >
            {t("Contact.secondaryCta")} <span aria-hidden>↗</span>
          </Link>
        </div>
      </section>

      <p className="mx-auto max-w-[1400px] px-6 py-10 text-[10px] normal-case tracking-normal text-mute/70 md:px-10">
        {tRoot("AiLabel.disclaimer")}
      </p>
    </main>
  );
}

/* ---------------- Video-Kachel ---------------- */

function VideoTile({
  project,
  soundOn,
  onToggleSound,
}: {
  project: Project;
  soundOn: boolean;
  onToggleSound: () => void;
}) {
  const t = useTranslations("Animation3D");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = !soundOn;
  }, [soundOn]);

  const start = () => {
    setIsPlaying(true);
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => { });
  };

  const stop = () => {
    setIsPlaying(false);
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  /* Auf Touch-Geräten übernimmt der Klick das Umschalten,
     auf Desktop erledigen das onMouseEnter/onMouseLeave. */
  const handleClick = () => {
    if (hasHover()) return;
    isPlaying ? stop() : start();
  };

  return (
    <div
      className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden bg-ink p-8 md:min-h-[560px]"
      onMouseEnter={() => hasHover() && start()}
      onMouseLeave={() => hasHover() && stop()}
      onFocus={start}
      onBlur={stop}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label={t(`projects.${project.id}.videoLabel`)}
    >
      <img
        src={project.poster}
        alt=""
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        className={[
          "absolute inset-0 h-full w-full select-none object-cover [-webkit-touch-callout:none]",
          "transition-opacity duration-300",
          isPlaying ? "opacity-0" : "opacity-100",
        ].join(" ")}
      />

      {!isPlaying && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-[3px] bg-black/40 backdrop-blur-sm">
            <Play className="h-6 w-6 text-bone" fill="currentColor" />
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        src={project.videoSrc}
        loop
        muted
        playsInline
        preload="none"
        draggable={false}
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        className={[
          "absolute inset-0 h-full w-full select-none object-cover [-webkit-touch-callout:none]",
          "transition-opacity duration-300",
          isPlaying ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      <AiLabel position="top-left" />

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleSound();
        }}
        aria-label={soundOn ? "Mute video" : "Unmute video"}
        className="absolute bottom-4 right-4 z-20 flex items-center justify-center rounded-[3px] bg-black/35 p-1.5 text-bone shadow-[2px_2px_5px_rgba(0,0,0,0.30)] transition-colors hover:bg-black/50 hover:text-blood"
      >
        {soundOn ? (
          <Volume2 className="h-6 w-6" strokeWidth={1.8} />
        ) : (
          <VolumeX className="h-6 w-6" strokeWidth={1.8} />
        )}
      </button>

      <div className="relative z-10">
        <span className="text-xs uppercase tracking-[0.2em] text-mute">
          {t(`projects.${project.id}.title`)}
        </span>
      </div>
    </div>
  );
}

/* ---------------- Flip-Kachel ---------------- */

function FlipTile({ project }: { project: Project }) {
  const t = useTranslations("Animation3D");
  const [flipped, setFlipped] = useState(false);

  const toggle = () => setFlipped((prev) => !prev);

  return (
    <div
      className="group relative min-h-[420px] [perspective:1600px] md:min-h-[560px]"
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
      aria-label={t(`projects.${project.id}.storyLabel`)}
    >
      <div
        className={[
          "absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "[transform-style:preserve-3d] motion-reduce:transition-none",
          flipped ? "[transform:rotateY(180deg)]" : "",
        ].join(" ")}
      >
        {/* Vorderseite -- Logo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink p-8 [-webkit-backface-visibility:hidden] [backface-visibility:hidden] md:p-14">
          {project.logoSrc ? (
            <div className="relative h-24 w-full max-w-[320px]">
              <Image
                src={project.logoSrc}
                alt={project.logoText}
                fill
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="select-none object-contain brightness-0 invert"
                sizes="320px"
              />
            </div>
          ) : (
            <span className="font-arimo text-center text-4xl font-bold tracking-wide text-bone md:text-6xl">
              {project.logoText}
            </span>
          )}

          <span className="absolute bottom-8 left-8 text-xs uppercase tracking-[0.2em] text-mute">
            {project.year}
          </span>

          <span className="absolute bottom-8 right-8 text-[10px] uppercase tracking-[0.3em] text-mute/70">
            {t("flipHint")}
          </span>
        </div>

        {/* Rückseite -- Geschichte */}
        <div className="absolute inset-0 flex flex-col justify-center bg-paper p-8 text-ink [-webkit-backface-visibility:hidden] [backface-visibility:hidden] [transform:rotateY(180deg)] md:p-14">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-blood">
            {t(`projects.${project.id}.client`)}
          </span>

          <h2 className="font-display mt-4 text-3xl leading-[0.95] md:text-4xl">
            {t(`projects.${project.id}.headline`)}
          </h2>

          <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink/60">
            {t(`projects.${project.id}.story`)}
          </p>

          <span className="mt-8 inline-flex w-fit items-center gap-2 border border-ink/25 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.3em] text-ink/70">
            {t(`projects.${project.id}.role`)}
          </span>
        </div>
      </div>
    </div>
  );
}
