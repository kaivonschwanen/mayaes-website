"use client";

/**
 * app/[locale]/ai-filmmaking/page.tsx
 *
 * Aufbau wie die 3D-Animation-Seite, aber formatbewusst:
 *  - Breitformat: Video oben (volle Breite), Flip-Kachel direkt darunter
 *  - Hochformat:  Video links oder rechts, Flip-Kachel daneben
 *  - Video-Kachel: Standbild, startet im Loop bei Hover (Touch: Tap), leichter Parallax
 *  - Flip-Kachel:  Logo weiss auf schwarz, dreht sich wie eine Spielkarte
 *                  und zeigt die Projektgeschichte
 * Alles Steuerbare steht im FILMS-Array und in DEFAULT_LAYOUT.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import Header from "@/components/Header";
import AiLabel from "@/components/AiLabel";
import { Play, Volume2, VolumeX } from "lucide-react";

/* ==========================================================================
   PARAMETER
   --------------------------------------------------------------------------
   ZWEI EBENEN, die oft verwechselt werden:
     layout.videoSize  = wie gross das FENSTER ist   (der Rahmen auf der Seite)
     videoZoom         = wie gross das BILD im Fenster ist (der Inhalt darin)
   --------------------------------------------------------------------------
   format         "wide" = Breitformat, Video oben oder unten, jeweils volle Breite
                  "tall" = Hochformat, Video und Text nebeneinander
   videoPosition  wide: "top" | "bottom"   ·   tall: "left" | "right"
                  Auf Mobile steht das Video immer oben.
   aspect         Seitenverhältnis des Videofensters, z. B. "16 / 9",
                  "2.39 / 1", "9 / 16", "4 / 5". Ohne Angabe: 16/9 bzw. 9/16.

   videoZoom      Zoom des Bildinhalts INNERHALB des Fensters. Der Rahmen
                  bleibt dabei exakt gleich gross.
                  1 = unveraendert · 1.25 = naeher dran · 0.85 = kleiner
   videoFit       "cover"   (Standard) Fenster wird immer voll gefuellt,
                            was ueber den Rand hinausragt, wird beschnitten
                  "contain" ganzes Videobild bleibt sichtbar, der Rest des
                            Fensters bleibt frei (zeigt bg-ink)
                  Wichtig: Zum VERKLEINERN (videoZoom < 1) "contain" setzen --
                  bei "cover" wuerde das Bild sonst einfach weiter den Rahmen
                  fuellen und der Zoom bliebe unsichtbar.
   videoFocus     Welcher Ausschnitt beim Beschneiden stehen bleibt:
                  "center" (Standard), "top", "bottom", "50% 30%" …
   parallax       Stärke der Videoverschiebung beim Scrollen.
                  0 = aus · 0.12 = dezent · 0.3 = deutlich
                  Achtung: Solange Parallax an ist, liegt eine leichte
                  Ueberdeckung (Faktor 1.14) auf der Bildebene, damit beim
                  Verschieben keine Luecken an den Raendern entstehen. Zum
                  echten Verkleinern also `parallax: 0` setzen.

   layout         Größen; überschreibt DEFAULT_LAYOUT für diesen Eintrag:
     maxWidth     Gesamtbreite der Zeile             "1400px"
     videoSize    Breite des Videofensters           wide: "100%" · tall: "40%"
     textSize     Breite der Flip-Kachel             wide: "100%" · tall: "60%"
     gap          Abstand zwischen den Kacheln       "1px" (Haarlinie), "40px" …
     tileHeight   Höhe der Flip-Kachel               "clamp(360px,30vw,520px)"
     align        "stretch" = Flip-Kachel wächst im Hochformat auf Videohöhe
                  "fixed"   = Flip-Kachel behält immer tileHeight
   ========================================================================== */

type Format = "wide" | "tall";
type VideoPosition = "top" | "bottom" | "left" | "right";
type Align = "stretch" | "fixed";
type VideoFit = "cover" | "contain";

type LayoutConfig = {
  maxWidth?: string;
  videoSize?: string;
  textSize?: string;
  gap?: string;
  tileHeight?: string;
  align?: Align;
};

type Film = {
  /** Muss dem Key in den messages-Dateien entsprechen */
  id: string;
  format: Format;
  videoPosition: VideoPosition;
  videoSrc: string;
  poster: string;
  /** Optional: Pfad zum Logo (SVG/PNG, weiss). Ohne Angabe wird logoText gesetzt */
  logoSrc?: string;
  logoText: string;
  year: string;
  aspect?: string;

  /** Zoom des Bildinhalts im Fenster -- 1 = normal, >1 naeher dran, <1 kleiner */
  videoZoom?: number;
  /** "cover" fuellt das Fenster und beschneidet, "contain" zeigt alles */
  videoFit?: VideoFit;
  /** Bildausschnitt bei "cover": "center", "top", "50% 30%" … */
  videoFocus?: string;

  parallax?: number;
  layout?: LayoutConfig;
};

const DEFAULT_LAYOUT: Record<Format, Required<LayoutConfig>> = {
  wide: {
    maxWidth: "1400px",
    videoSize: "100%",
    textSize: "100%",
    gap: "1px",
    tileHeight: "clamp(360px, 28vw, 480px)",
    align: "fixed",
  },
  tall: {
    maxWidth: "1400px",
    videoSize: "50%",
    textSize: "50%",
    gap: "1px",
    tileHeight: "clamp(420px, 60vw, 640px)",
    align: "stretch",
  },
};

const FILMS: Film[] = [
  {
    id: "casino",
    format: "wide",
    videoPosition: "top",
    videoSrc:
      "https://media.mayaesai.com/jitrois%20being%20a%20man%20remastered%20neue-musik.mp4",
    poster: "/scene-1.jpg",
    logoSrc: "/logos/jitrois-logo.jpg",
    logoText: "3D FASHION DESIGN",
    year: "2020",
    aspect: "16 / 9",
    /* Bildinhalt im Fenster: 1 = so wie geliefert */
    videoZoom: 1,
    videoFit: "cover",
    videoFocus: "center",
    parallax: 0.12,
  },
  {
    id: "goere",
    format: "wide",
    videoPosition: "left",
    videoSrc:
      "https://media.mayaesai.com/Dance%20of%20the%20Lights%20Volume%201%20enhanced-2.mp4",
    poster: "/goere-standbild.jpg",
    logoText: "DANCE OF THE LIGHT",
    year: "2023",
    aspect: "16 / 9",
    /* Beispiel: naeher ans Motiv, Ausschnitt im oberen Drittel halten */
    videoZoom: 1.00,
    videoFit: "cover",
    videoFocus: "50% 35%",
    parallax: 0.16,
  },
  {
    id: "FASHION FILM FESTIVAL MILANO",
    format: "wide",
    videoPosition: "bottom",
    videoSrc: "https://media.mayaesai.com/Maya-ES-MFFF-Metaverse-a.mp4",
    poster: "/FFFM-logo-website.jpg",
    logoSrc: "/logos/FFFM.png",
    logoText: "FASHION FILM FESTIVAL MILANO",
    year: "2023",
    aspect: "16 / 9",
    /* Beispiel zum VERKLEINERN: contain + parallax 0, sonst bleibt es wirkungslos */
    videoZoom: 1.22,
    videoFit: "contain",
    parallax: 0,
    layout: { tileHeight: "clamp(320px, 24vw, 420px)" },
  },
];

/** true auf Geräten mit echtem Maus-Hover */
const hasHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

/**
 * Fehlt ein Key in den messages, wird der Fallback gezeigt statt die Seite
 * mit MISSING_MESSAGE abzubrechen -- praktisch, solange Texte noch fehlen.
 */
type Translator = (key: string) => string;

function safeT(t: Translator, key: string, fallback = "") {
  try {
    const has = (t as unknown as { has?: (k: string) => boolean }).has;
    if (typeof has === "function" && !has.call(t, key)) return fallback;
    return t(key);
  } catch {
    return fallback;
  }
}

export default function FeatCollabPage() {
  const t = useTranslations("FeatCollab");
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

      <div className="flex flex-col gap-16 md:gap-24">
        {FILMS.map((film) => (
          <FilmRow
            key={film.id}
            film={film}
            soundOn={soundId === film.id}
            onToggleSound={() =>
              setSoundId((prev) => (prev === film.id ? null : film.id))
            }
          />
        ))}
      </div>

      <section className="mx-auto mt-24 grid max-w-[1400px] grid-cols-1 gap-px md:grid-cols-[1.1fr_1fr]">
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

/* ---------------- Zeile: Video + Flip-Kachel ---------------- */

function FilmRow({
  film,
  soundOn,
  onToggleSound,
}: {
  film: Film;
  soundOn: boolean;
  onToggleSound: () => void;
}) {
  const L = { ...DEFAULT_LAYOUT[film.format], ...(film.layout ?? {}) };
  const isTall = film.format === "tall";
  const videoFirst = film.videoPosition === "top" || film.videoPosition === "left";

  const cssVars = {
    "--video-size": L.videoSize,
    "--text-size": L.textSize,
    "--tile-height": L.tileHeight,
    "--row-gap": L.gap,
  } as React.CSSProperties;

  const directionClass = isTall
    ? videoFirst
      ? "md:flex-row"
      : "md:flex-row-reverse"
    : videoFirst
      ? "md:flex-col"
      : "md:flex-col-reverse";

  /* Hochformat: Breiten nebeneinander. Breitformat: volle Breite, zentriert. */
  const videoBoxClass = isTall
    ? "w-full md:w-[var(--video-size)] md:shrink md:grow-0 md:self-start"
    : "w-full md:mx-auto md:w-[var(--video-size)]";

  const stretchTile = isTall && L.align === "stretch";

  /* Wichtig: Wenn die Kachel auf Videohöhe mitwachsen soll, muss der Wrapper
     selbst ein Flex-Container sein -- sonst hat die Karte keine definierte
     Höhe und die absolut positionierten Seiten fallen auf 0 zusammen. */
  const tileBoxClass = [
    "w-full",
    isTall
      ? "md:w-[var(--text-size)] md:shrink md:grow-0"
      : "md:mx-auto md:w-[var(--text-size)]",
    stretchTile ? "md:flex md:self-stretch" : "",
  ].join(" ");

  return (
    <section
      className="mx-auto w-full bg-white/5"
      style={{ ...cssVars, maxWidth: L.maxWidth }}
    >
      <div
        className={[
          "flex flex-col gap-px md:gap-[var(--row-gap)]",
          directionClass,
        ].join(" ")}
      >
        <div className={videoBoxClass}>
          <VideoTile film={film} soundOn={soundOn} onToggleSound={onToggleSound} />
        </div>

        <div className={tileBoxClass}>
          <FlipTile film={film} stretch={stretchTile} />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Video-Kachel ---------------- */

function VideoTile({
  film,
  soundOn,
  onToggleSound,
}: {
  film: Film;
  soundOn: boolean;
  onToggleSound: () => void;
}) {
  const t = useTranslations("FeatCollab");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const parallaxStrength = film.parallax ?? 0.12;
  const parallax = useParallax<HTMLDivElement>(parallaxStrength);

  /* Beim Parallax wandert die Bildebene nach oben und unten. Ohne eine
     leichte Ueberdeckung wuerden dabei an den Raendern Luecken auftauchen --
     daher der Faktor 1.14. Ist Parallax aus, faellt die Ueberdeckung weg,
     erst dann laesst sich mit videoZoom auch wirklich verkleinern. */
  const coverScale = parallaxStrength === 0 ? 1 : 1.14;

  /* Bildinhalt im Fenster: Zoom, Fuellverhalten und Ausschnitt.
     Gilt fuer Standbild und Video gleichermassen, damit beim Umschalten
     kein Sprung entsteht. */
  const mediaStyle: React.CSSProperties = {
    objectFit: film.videoFit ?? "cover",
    objectPosition: film.videoFocus ?? "center",
    transform: `scale(${film.videoZoom ?? 1})`,
    transformOrigin: "center center",
  };

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
      /* Das FENSTER: Groesse kommt aus layout.videoSize + aspect.
         Was darin passiert, steuert mediaStyle weiter unten. */
      className="group relative flex w-full flex-col justify-end overflow-hidden bg-ink p-8"
      style={{
        aspectRatio: film.aspect ?? (film.format === "tall" ? "9 / 16" : "16 / 9"),
      }}
      onMouseEnter={() => hasHover() && start()}
      onMouseLeave={() => hasHover() && stop()}
      onFocus={start}
      onBlur={stop}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label={safeT(t, `projects.${film.id}.videoLabel`, film.logoText)}
    >
      {/* Parallax-Ebene -- nur Bild und Video bewegen sich, die Bedienelemente nicht.
          Verschiebung und Ueberdeckung stecken in einem transform, damit sie
          sich nicht gegenseitig ueberschreiben. */}
      <div
        ref={parallax.ref}
        style={{
          transform: `translate3d(0, ${parallax.offset.toFixed(2)}px, 0) scale(${coverScale})`,
        }}
        className="absolute inset-0 will-change-transform"
      >
        <img
          src={film.poster}
          alt=""
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          style={mediaStyle}
          className={[
            "absolute inset-0 h-full w-full select-none [-webkit-touch-callout:none]",
            "transition-opacity duration-300",
            isPlaying ? "opacity-0" : "opacity-100",
          ].join(" ")}
        />

        <video
          ref={videoRef}
          src={film.videoSrc}
          loop
          muted
          playsInline
          preload="none"
          draggable={false}
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
          style={mediaStyle}
          className={[
            "absolute inset-0 h-full w-full select-none [-webkit-touch-callout:none]",
            "transition-opacity duration-300",
            isPlaying ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
      </div>

      {!isPlaying && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-[3px] bg-black/40 backdrop-blur-sm">
            <Play className="h-6 w-6 text-bone" fill="currentColor" />
          </div>
        </div>
      )}

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
          {safeT(t, `projects.${film.id}.title`, film.logoText)}
        </span>
      </div>
    </div>
  );
}

/* ---------------- Flip-Kachel ---------------- */

function FlipTile({ film, stretch }: { film: Film; stretch: boolean }) {
  const t = useTranslations("FeatCollab");
  const [flipped, setFlipped] = useState(false);

  const toggle = () => setFlipped((prev) => !prev);

  const client = safeT(t, `projects.${film.id}.client`);
  const headline = safeT(t, `projects.${film.id}.headline`, film.logoText);
  const story = safeT(t, `projects.${film.id}.story`);
  const role = safeT(t, `projects.${film.id}.role`);
  const storyLabel = safeT(t, `projects.${film.id}.storyLabel`, film.logoText);

  const heightClass = stretch
    ? "h-[var(--tile-height)] md:h-auto md:self-stretch md:min-h-[var(--tile-height)]"
    : "h-[var(--tile-height)]";

  return (
    <div
      className={[
        "group relative w-full [perspective:1600px]",
        heightClass,
      ].join(" ")}
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
      aria-label={storyLabel}
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
          {film.logoSrc ? (
            <div className="relative h-24 w-full max-w-[320px]">
              <Image
                src={film.logoSrc}
                alt={film.logoText}
                fill
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="select-none object-contain brightness-0 invert"
                sizes="320px"
              />
            </div>
          ) : (
            <span className="font-arimo text-center text-4xl font-bold tracking-wide text-bone md:text-6xl">
              {film.logoText}
            </span>
          )}

          <span className="absolute bottom-8 left-8 text-xs uppercase tracking-[0.2em] text-mute">
            {film.year}
          </span>

          <span className="absolute bottom-8 right-8 text-[10px] uppercase tracking-[0.3em] text-mute/70">
            {t("flipHint")}
          </span>
        </div>

        {/* Rückseite -- Geschichte */}
        <div className="absolute inset-0 flex flex-col justify-center overflow-y-auto bg-paper p-8 text-ink [-webkit-backface-visibility:hidden] [backface-visibility:hidden] [transform:rotateY(180deg)] md:p-14">
          {client && (
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-blood">
              {client}
            </span>
          )}

          <h2 className="font-display mt-4 text-3xl leading-[0.95] md:text-4xl">
            {headline}
          </h2>

          {story && (
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink/60">
              {story}
            </p>
          )}

          {role && (
            <span className="mt-8 inline-flex w-fit items-center gap-2 border border-ink/25 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.3em] text-ink/70">
              {role}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Parallax ---------------- */

/**
 * Gibt den aktuellen Versatz in Pixeln zurueck. Bewusst nur der Wert und
 * kein fertiges style-Objekt: Die Video-Kachel baut daraus zusammen mit der
 * Ueberdeckung ein einziges transform.
 */
function useParallax<T extends HTMLElement>(strength = 0.12) {
  const ref = useRef<T>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || strength === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // -1 (unterhalb des Viewports) … +1 (oberhalb)
      const progress = (vh / 2 - (rect.top + rect.height / 2)) / vh;
      setOffset(progress * strength * 100);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [strength]);

  return { ref, offset };
}
