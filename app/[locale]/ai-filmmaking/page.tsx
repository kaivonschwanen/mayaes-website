"use client";

/**
 * app/[locale]/ai-filmmaking/page.tsx
 *
 * Aufbau wie die 3D-Animation-Seite, aber formatbewusst:
 *  - Breitformat: Video oben (volle Breite), Flip-Kachel direkt darunter
 *  - Hochformat:  Video links oder rechts, Flip-Kachel daneben
 *  - Video-Kachel: Standbild, startet im Loop bei Hover (Touch: Tap), leichter Parallax
 *  - Flip-Kachel:  reine Typografie, dreht sich wie eine Spielkarte
 *                  Vorderseite: transparent + Rahmen, 2 Textbloecke
 *                  Rueckseite:  bg-paper, 3 Textbloecke
 *
 * SPRACHEN: Die Texte stehen in de.json / en.json unter
 *   AiFilmmaking.projects.<film.id>.<key>
 * Im FILMS-Array steht pro Block nur der `key` plus das Aussehen.
 * `lines` ist der Notnagel, falls ein Key in den messages fehlt.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import AiLabel from "@/components/AiLabel";
import AnimLabel from "@/components/3dLabel";
import { Play, Volume2, VolumeX } from "lucide-react";
import { useHls } from "@/hooks/useHls";

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
   aspect         Seitenverhaeltnis des Videofensters. Damit das Video
                  UNBESCHNITTEN laeuft, muss dieser Wert dem Verhaeltnis der
                  Quelldatei entsprechen -- bei 1920x1080 also "16 / 9".
                  Weicht er ab, schneidet "cover" die Differenz weg.

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
   parallax       Staerke der Videoverschiebung beim Scrollen.
                  0 = aus · 0.12 = dezent · 0.3 = deutlich
                  ACHTUNG: Solange Parallax an ist, liegt eine Ueberdeckung
                  von 14 % auf der Bildebene, damit beim Verschieben keine
                  Luecken an den Raendern entstehen. Das ist ein Beschnitt.
                  Wer das Bild wirklich unangetastet sehen will, setzt hier 0.

   layout         Groessen; ueberschreibt DEFAULT_LAYOUT fuer diesen Eintrag:
     maxWidth     Gesamtbreite der Zeile
     videoSize    Breite des Videofensters
     textSize     Breite der Flip-Kachel
     gap          Abstand zwischen Video und Kachel
                  Video und Kachel teilen sich die Restbreite, deshalb sind
                  videoSize/textSize als calc() mit --row-gap formuliert --
                  aendert man den Abstand, passen sich die Breiten mit an.
     tileHeight   Hoehe der Flip-Kachel NUR AUF MOBILE. Ab md richtet sie
                  sich automatisch nach der Hoehe des Videos daneben.
     align        "stretch" = Flip-Kachel uebernimmt im Hochformat exakt die
                              Videohoehe
                  "fixed"   = Flip-Kachel behaelt immer tileHeight

   --------------------------------------------------------------------------
   TEXTE DER FLIP-KACHEL -- ZWEISPRACHIG
   --------------------------------------------------------------------------
   Der Text selbst steht NICHT hier, sondern in de.json / en.json unter
     AiFilmmaking.projects.<film.id>.<key>
   Zeilenumbruch dort mit \n -- zwei Zeilen ergeben die zweizeilige Kachel.

   Hier im TSX steht nur das Aussehen. Pro Block einstellbar:
     key          Name des Eintrags in den messages
     lines        Fallback, falls der Key fehlt. Jeder Eintrag ist EINE Zeile.
     font         "display" | "arimo" | "sans"          (siehe FONTS)
     color        "bone" | "mute" | "blood" | "ink" | … (siehe COLORS)
     size         freier CSS-Wert: "14px", "clamp(28px, 3.4vw, 52px)"
     tracking     Laufweite, z. B. "0.24em"
     leading      Zeilenabstand, z. B. "0.9" (eng) oder "1.8" (luftig)
     weight       Schriftstaerke, z. B. 400 / 700
     uppercase    true = Grossbuchstaben
     gap          Abstand nach oben zum Block darueber, z. B. "22px"
   ========================================================================== */

/* Breite der ganzen Seite -- Ueberschrift, Filmzeilen und Fusszeile richten
   sich danach. 94vw laesst links und rechts nur einen schmalen Rand stehen,
   1720px verhindert, dass es auf sehr breiten Monitoren auseinanderfaellt. */
const PAGE_MAX = "1400px";


type Format = "wide" | "tall";
type VideoPosition = "top" | "bottom" | "left" | "right";
type Align = "stretch" | "fixed";
type VideoFit = "cover" | "contain";

/* Schriftarten und Farben als feste Klassen -- so findet Tailwind sie beim
   Build. Neue Varianten hier ergaenzen, nicht weiter unten frei bauen. */
const FONTS = {
  display: "font-display",
  arimo: "font-arimo",
  sans: "font-sans",
} as const;

const COLORS = {
  bone: "text-bone",
  mute: "text-mute",
  muteSoft: "text-mute/70",
  blood: "text-blood",
  ink: "text-ink",
  inkSoft: "text-ink/60",
  paper: "text-paper",
} as const;

type FontKey = keyof typeof FONTS;
type ColorKey = keyof typeof COLORS;

type TextBlock = {
  key?: string;
  lines?: string[];
  font?: FontKey;
  color?: ColorKey;
  size?: string;
  tracking?: string;
  leading?: string;
  weight?: number;
  uppercase?: boolean;
  gap?: string;
};

type LayoutConfig = {
  maxWidth?: string;
  videoSize?: string;
  textSize?: string;
  gap?: string;
  tileHeight?: string;
  align?: Align;
};

type Film = {
  /** Muss dem Key in de.json / en.json unter projects entsprechen */
  id: string;
  format: Format;
  videoPosition: VideoPosition;
  videoSrc: string;
  /** Pfad zur master.m3u8 auf R2. Ohne Angabe wird videoSrc (MP4) genutzt. */
  hlsSrc?: string;
  poster: string;
  /** Nur Fallback fuer aria-Labels, wenn die messages nichts liefern */
  label: string;
  year: string;
  aspect?: string;

  /** Vorderseite der Kachel: zwei Textbloecke */
  front: TextBlock[];
  /** Rueckseite der Kachel: drei Textbloecke */
  back: TextBlock[];

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
    maxWidth: PAGE_MAX,
    videoSize: "100%",
    textSize: "100%",
    gap: "clamp(24px, 3vw, 56px)",
    tileHeight: "clamp(360px, 28vw, 480px)",
    align: "fixed",
  },
  tall: {
    maxWidth: PAGE_MAX,
    /* Beide Kacheln teilen sich die Breite abzueglich des Abstands --
       sonst wuerde die Zeile um genau den Abstand ueberlaufen. */
    videoSize: "calc(50% - var(--row-gap) / 2)",
    textSize: "calc(50% - var(--row-gap) / 2)",
    gap: "clamp(32px, 4vw, 80px)",
    /* Gilt nur auf Mobile -- ab md kommt die Hoehe vom Video. */
    tileHeight: "clamp(340px, 80vw, 480px)",
    align: "stretch",
  },
};

/* Aussehen der Textbloecke -- gilt fuer alle Filme gleich, damit die Kacheln
   eine Familie bleiben. Soll ein Film abweichen, den Block dort einzeln
   ueberschreiben (siehe Fashion Film Festival Milano weiter unten). */
const FRONT_STYLE: TextBlock[] = [
  {
    key: "frontTitle",
    font: "display",
    color: "bone",
    size: "clamp(28px, 3.2vw, 50px)",
    leading: "0.9",
  },
  {
    key: "frontMeta",
    font: "arimo",
    color: "mute",
    size: "clamp(11px, 1vw, 13px)",
    tracking: "0.24em",
    leading: "2",
    uppercase: true,
    gap: "22px",
  },
];

const BACK_STYLE: TextBlock[] = [
  {
    key: "backEyebrow",
    font: "arimo",
    color: "blood",
    size: "12px",
    tracking: "0.2em",
    leading: "1.8",
    uppercase: true,
  },
  {
    key: "backHeadline",
    font: "display",
    color: "ink",
    size: "clamp(26px, 2.6vw, 40px)",
    leading: "0.95",
    gap: "16px",
  },
  {
    key: "backText",
    font: "sans",
    color: "inkSoft",
    size: "14px",
    leading: "1.7",
    gap: "24px",
  },
];

/* Alle Quellen sind 1920x1080 -- deshalb ueberall "16 / 9", Zoom 1 und
   Parallax 0. So laeuft jedes Video exakt in seinem Originalausschnitt. */
const FILMS: Film[] = [
  {
    id: "digitalFashionWeek",
    format: "tall",
    videoPosition: "left",
    videoSrc:
      "https://media.mayaesai.com/Homepage%20Modeschau%20Fashion%20animation%20websiteMaya%2020%20sekunden%203D.mp4",
    hlsSrc: "https://media.mayaesai.com/FashionAnimationWebsite/master.m3u8",  
    poster: "/DFW-2022-2055-website.jpg",
    label: "Digital Fashion Week",
    year: "2022 - 2025",
    aspect: "16 / 9",
    videoZoom: 1,
    videoFit: "cover",
    videoFocus: "center",
    parallax: 0,
    front: FRONT_STYLE,
    back: BACK_STYLE,
  },
  {
    id: "danceOfTheLight",
    format: "tall",
    videoPosition: "right",
    videoSrc:
      "https://media.mayaesai.com/Dance%20of%20the%20Lights%20Volume%201%20enhanced-2.mp4",
    hlsSrc: "https://media.mayaesai.com/DanceOfTheLightsWebsite/master.m3u8",  
    poster: "/dance-of-the-Light-Vorschau-website.jpg",
    label: "Dance of the Light",
    year: "2023",
    aspect: "16 / 9",
    videoZoom: 1,
    videoFit: "cover",
    videoFocus: "center",
    parallax: 0,
    front: FRONT_STYLE,
    back: BACK_STYLE,
  },
  {
    id: "fashionFilmFestivalMilano",
    format: "tall",
    videoPosition: "left",
    videoSrc: "https://media.mayaesai.com/Maya-ES-MFFF-Metaverse-a.mp4",
    hlsSrc: "https://media.mayaesai.com/FashionFilmFestivalMilanoWebsite/master.m3u8",  
    poster: "/Vorschau-fffm-website.jpg",
    label: "Fashion Film Festival Milano",
    year: "2023",
    aspect: "16 / 9",
    videoZoom: 1,
    videoFit: "cover",
    videoFocus: "center",
    parallax: 0,
    /* Der Titel ist deutlich laenger als bei den anderen -- deshalb hier
       eine Stufe kleiner, sonst bricht er auf Tablets in drei Zeilen um. */
    front: [
      { ...FRONT_STYLE[0], size: "clamp(24px, 2.8vw, 42px)" },
      FRONT_STYLE[1],
    ],
    back: BACK_STYLE,
  },
];

/** true auf Geraeten mit echtem Maus-Hover */
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

/** messages haben Vorrang vor `lines`, Zeilenumbruch dort mit \n */
function resolveLines(t: Translator, filmId: string, block: TextBlock) {
  if (block.key) {
    const value = safeT(t, `projects.${filmId}.${block.key}`, "");
    if (value) return value.split("\n").map((line) => line.trim());
  }
  return block.lines ?? [];
}

function TextBlockView({
  block,
  lines,
  centered,
}: {
  block: TextBlock;
  lines: string[];
  centered?: boolean;
}) {
  if (!lines.length) return null;

  return (
    <p
      className={[
        FONTS[block.font ?? "sans"],
        COLORS[block.color ?? "bone"],
        block.uppercase ? "uppercase" : "",
        centered ? "text-center" : "",
      ].join(" ")}
      style={{
        fontSize: block.size,
        letterSpacing: block.tracking,
        lineHeight: block.leading,
        fontWeight: block.weight,
        marginTop: block.gap,
      }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block">
          {line}
        </span>
      ))}
    </p>
  );
}

export default function AiFilmmakingPage() {
  const t = useTranslations("AiFilmmaking");
  const tRoot = useTranslations();
  const locale = useLocale();

  /** Nur ein Video darf gleichzeitig Ton haben */
  const [soundId, setSoundId] = useState<string | null>(null);

  return (
    <main className="text-bone">

      {/* Der Universum-Parallax liegt im Layout dahinter -- deshalb hier
          bewusst kein deckender Hintergrund auf <main> oder <section>. */}

      <section
        className="mx-auto w-full px-6 py-24 md:px-10"
        style={{ maxWidth: PAGE_MAX }}
      >
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

      <p
        className="mx-auto w-full px-6 py-10 text-[10px] normal-case tracking-normal text-mute/70 md:px-10"
        style={{ maxWidth: PAGE_MAX }}
      >
        {tRoot("AnimLabel.disclaimer")}
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

  /* Wichtig: Wenn die Kachel auf Videohoehe mitwachsen soll, muss der Wrapper
     selbst ein Flex-Container sein -- sonst hat die Karte keine definierte
     Hoehe und die absolut positionierten Seiten fallen auf 0 zusammen. */
  const tileBoxClass = [
    "w-full",
    isTall
      ? "md:w-[var(--text-size)] md:shrink md:grow-0"
      : "md:mx-auto md:w-[var(--text-size)]",
    stretchTile ? "md:flex md:self-stretch" : "",
  ].join(" ");

  return (
    /* Bewusst OHNE Hintergrund: Die Kachel ist vorne transparent, ein bg
       hier wuerde milchig vor dem Sternenhimmel liegen. */
    <section
      className="mx-auto w-full px-6 md:px-10"
      style={{ ...cssVars, maxWidth: L.maxWidth }}
    >
      <div
        className={[
          "flex flex-col gap-8 md:gap-[var(--row-gap)]",
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
  const t = useTranslations("AiFilmmaking");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useHls(videoRef, film.hlsSrc ?? film.videoSrc);
  
  const parallaxStrength = film.parallax ?? 0.12;
  const parallax = useParallax<HTMLDivElement>(parallaxStrength);

  /* Beim Parallax wandert die Bildebene nach oben und unten. Ohne eine
     leichte Ueberdeckung wuerden dabei an den Raendern Luecken auftauchen --
     daher der Faktor 1.14. Ist Parallax aus, faellt die Ueberdeckung weg und
     das Video laeuft im Originalausschnitt. */
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

  /* Auf Touch-Geraeten uebernimmt der Klick das Umschalten,
     auf Desktop erledigen das onMouseEnter/onMouseLeave. */
  const handleClick = () => {
    if (hasHover()) return;
    isPlaying ? stop() : start();
  };

  return (
    <div
      /* Das FENSTER: Groesse kommt aus layout.videoSize + aspect.
         Was darin passiert, steuert mediaStyle weiter unten.
         Der Rahmen greift die transparente Flip-Kachel daneben auf. */
      className="group relative flex w-full flex-col justify-end overflow-hidden border border-white/25 bg-ink p-8"
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
      aria-label={safeT(t, `projects.${film.id}.videoLabel`, film.label)}
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
          preload="metadata"
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

      <AnimLabel position="top-left" />

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
          {safeT(t, `projects.${film.id}.title`, film.label)}
        </span>
      </div>
    </div>
  );
}

/* ---------------- Flip-Kachel ---------------- */

function FlipTile({ film, stretch }: { film: Film; stretch: boolean }) {
  const t = useTranslations("AiFilmmaking");
  const [flipped, setFlipped] = useState(false);

  const toggle = () => setFlipped((prev) => !prev);

  const storyLabel = safeT(t, `projects.${film.id}.storyLabel`, film.label);

  /* Ab md bewusst KEINE eigene Hoehe: Die Kachel uebernimmt exakt die Hoehe
     des Videos daneben, egal wie breit das Fenster gerade ist. tileHeight
     gilt nur untereinander auf Mobile. */
  const heightClass = stretch
    ? "h-[var(--tile-height)] md:h-auto md:self-stretch"
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
        {/* Vorderseite -- transparent mit Rahmen, Sternenhimmel sichtbar.
            translateZ(0.5px) haelt beide Seiten auseinander, sonst flackert
            es in manchen Browsern, sobald man hindurchschaut. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center border border-white/25 p-8 [-webkit-backface-visibility:hidden] [backface-visibility:hidden] [text-shadow:0_2px_14px_rgba(0,0,0,0.6)] [transform:translateZ(0.5px)] md:p-14">
          {film.front.map((block, i) => (
            <TextBlockView
              key={i}
              block={block}
              lines={resolveLines(t, film.id, block)}
              centered
            />
          ))}

          <span className="absolute bottom-8 left-8 text-xs uppercase tracking-[0.2em] text-mute">
            {film.year}
          </span>

          <span className="absolute bottom-8 right-8 text-[10px] uppercase tracking-[0.3em] text-mute/70">
            {t("flipHint")}
          </span>
        </div>

        {/* Rueckseite -- deckend, drei Textbloecke, linksbuendig */}
        <div className="absolute inset-0 flex flex-col justify-center overflow-y-auto bg-paper p-8 [-webkit-backface-visibility:hidden] [backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(0.5px)] md:p-14">
          {film.back.map((block, i) => (
            <TextBlockView
              key={i}
              block={block}
              lines={resolveLines(t, film.id, block)}
            />
          ))}
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
