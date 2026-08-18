"use client";

/**
 * app/[locale]/feat-collab/page.tsx
 *
 * Gleiche Bauweise wie /ai-filmmaking -- Kopfbereich, Flip-Kacheln, Rahmen,
 * Typografie und Parallax sind unveraendert uebernommen. Neu sind nur die
 * Zeilentypen:
 *
 *   Zeile 1   FilmRow       Video + Flip-Kachel  (genau EIN Eintrag)
 *   Zeile 2   PhotoRow      zwei Bilder mit sehr unterschiedlichem Format,
 *                           auf gleiche Hoehe gebracht (sizing: "justified")
 *   Zeile 3   MagazineRow   zwei Segmente:
 *                             links   Flip-Kachel
 *                             rechts  Magazin-Doppelseite
 *                           Die Doppelseite darf EIN Bild sein oder ZWEI
 *                           Einzelscans, die im selben Rahmen nebeneinander
 *                           liegen. Seite tauschen mit `spreadPosition`.
 *   Zeile 4+  PhotoRow      reine Fotozeilen
 *
 * REIHENFOLGE DER SEITE: Die Fotozeilen stehen in zwei Arrays --
 *   PHOTO_ROWS_BEFORE_MAGAZINE  laeuft vor der Magazinzeile
 *   PHOTO_ROWS_AFTER_MAGAZINE   laeuft danach
 * Eine Zeile verschieben heisst also: Eintrag von einem Array ins andere.
 *
 * SPRACHEN: Alle Texte stehen in de.json / en.json unter
 *   FeatCollab.projects.<row.id>.<key>
 * Im Datenteil weiter unten steht pro Block nur der `key` plus das Aussehen.
 * `lines` bzw. `caption` sind der Notnagel, falls ein Key noch fehlt.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import AiLabel from "@/components/AiLabel";
import AnimLabel from "@/components/3dLabel";
import { Play, Volume2, VolumeX } from "lucide-react";
import { useHls } from "@/hooks/useHls";

/* ==========================================================================
   PARAMETER
   --------------------------------------------------------------------------
   ZWEI EBENEN, die oft verwechselt werden:
     layout.videoSize / spreadSize = wie gross das FENSTER ist (der Rahmen)
     zoom                          = wie gross das BILD im Fenster ist
   --------------------------------------------------------------------------
   aspect         Seitenverhaeltnis des Fensters. Damit ein Bild oder Video
                  UNBESCHNITTEN laeuft, muss dieser Wert dem Verhaeltnis der
                  Quelldatei entsprechen -- bei 1920x1080 also "16 / 9",
                  bei einer Magazinseite in A4 "1 / 1.414".
                  TIPP: Man darf einfach die Pixelmasse eintragen,
                  "2048 / 1966" ist ein voellig gueltiger Wert.
   zoom           Zoom des Inhalts INNERHALB des Fensters, der Rahmen bleibt
                  gleich gross. 1 = unveraendert · 1.25 = naeher dran
   fit            "cover"   fuellt das Fenster, beschneidet den Ueberstand
                  "contain" zeigt das ganze Bild, Rest bleibt frei (bg-ink)
                  Zum VERKLEINERN (zoom < 1) immer "contain" setzen.
   focus          Ausschnitt bei "cover": "center", "top", "50% 30%" …
   parallax       Verschiebung beim Scrollen. 0 = aus · 0.12 = dezent
                  ACHTUNG: Solange Parallax an ist, liegt eine Ueberdeckung
                  von 14 % auf der Bildebene, damit an den Raendern keine
                  Luecken entstehen. Das ist ein Beschnitt. Wer das Bild
                  unangetastet sehen will, setzt hier 0.
   badge          "ai" | "3d" | "none" -- welches Label oben links sitzt.

   --------------------------------------------------------------------------
   FOTOZEILEN: sizing
   --------------------------------------------------------------------------
   "equal"      (Standard) Alle Segmente gleich breit. Passt, solange die
                Bilder dasselbe Format haben -- drei Hochformate, zwei
                Breitformate. Bei gemischten Formaten stehen die Rahmen
                unterschiedlich hoch nebeneinander, das wirkt unruhig.
   "justified"  Die Segmente bekommen Breiten nach ihrem Seitenverhaeltnis,
                sodass ALLE Bilder exakt gleich hoch stehen -- so wie eine
                Bildzeile im Magazin ausgeglichen wird. Ein fast quadratisches
                und ein extremes Breitbild ergeben dann ein schmales und ein
                sehr breites Segment mit gemeinsamer Oberkante und Unterkante.
                Dafuer MUSS bei jedem Foto `aspect` gesetzt sein, und zwar auf
                das echte Verhaeltnis der Datei -- sonst stimmt die Rechnung
                nicht und "cover" beschneidet.

   --------------------------------------------------------------------------
   TEXTE DER FLIP-KACHEL -- ZWEISPRACHIG
   --------------------------------------------------------------------------
   Der Text steht in de.json / en.json unter
     FeatCollab.projects.<row.id>.<key>
   Zeilenumbruch dort mit \n -- zwei Zeilen ergeben die zweizeilige Kachel.
   Hier im TSX steht nur das Aussehen (font, color, size, tracking, leading,
   weight, uppercase, gap).
   ========================================================================== */

/* Breite der ganzen Seite -- Ueberschrift, Zeilen und Fusszeile richten sich
   danach. Identisch zu /ai-filmmaking, damit beide Seiten fluchten. */
const PAGE_MAX = "1400px";

type Format = "wide" | "tall";
type VideoPosition = "top" | "bottom" | "left" | "right";
type Align = "stretch" | "fixed";
type Fit = "cover" | "contain";
type Badge = "ai" | "3d" | "none";
type SpreadPosition = "left" | "right";
type Sizing = "equal" | "justified";

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

/** Alles, was die Flip-Kachel braucht -- Film- und Magazinzeile teilen sie sich */
type FlipContent = {
  /** Muss dem Key in de.json / en.json unter projects entsprechen */
  id: string;
  year: string;
  /** Nur Fallback fuer aria-Labels, wenn die messages nichts liefern */
  label: string;
  front: TextBlock[];
  back: TextBlock[];
};

/** Ein Bild in einem Segment -- Magazinseite oder Foto */
type ImageItem = {
  src: string;
  /** Key der Bildunterschrift in den messages, sonst `caption` */
  key?: string;
  caption?: string;
  alt?: string;
  aspect?: string;
  zoom?: number;
  fit?: Fit;
  focus?: string;
  badge?: Badge;
};

type LayoutConfig = {
  maxWidth?: string;
  videoSize?: string;
  textSize?: string;
  gap?: string;
  tileHeight?: string;
  align?: Align;
};

type Film = FlipContent & {
  format: Format;
  videoPosition: VideoPosition;
  videoSrc: string;
  /** Pfad zur master.m3u8 auf R2. Ohne Angabe wird videoSrc (MP4) genutzt. */
  hlsSrc?: string;
  poster: string;
  aspect?: string;
  videoZoom?: number;
  videoFit?: Fit;
  videoFocus?: string;
  parallax?: number;
  layout?: LayoutConfig;
};

type MagazineLayout = {
  maxWidth?: string;
  /** Breite der Doppelseite */
  spreadSize?: string;
  /** Breite der Flip-Kachel */
  tileSize?: string;
  gap?: string;
  /** Hoehe der Flip-Kachel NUR AUF MOBILE -- ab md kommt sie vom Bild daneben */
  tileHeight?: string;
  /** Seitenverhaeltnis der GANZEN Doppelseite, nicht einer Einzelseite */
  spreadAspect?: string;
  /** Bundsteg: Abstand zwischen zwei Einzelscans, z. B. "0px" oder "1px" */
  gutter?: string;
};

type MagazineRow = FlipContent & {
  /**
   * Die Doppelseite. EIN Eintrag = ein fertiger Doppelseiten-Scan.
   * ZWEI Eintraege = linke und rechte Seite, die im selben Rahmen
   * nahtlos nebeneinander liegen.
   */
  spread: ImageItem[];
  /** Auf welcher Seite die Doppelseite steht. Die Kachel nimmt die andere. */
  spreadPosition?: SpreadPosition;
  parallax?: number;
  layout?: MagazineLayout;
};

type PhotoRow = {
  id: string;
  /** Zwei, drei oder vier Eintraege ergeben zwei, drei oder vier Segmente */
  photos: ImageItem[];
  /** "equal" = gleich breit · "justified" = gleich hoch (siehe Parameter oben) */
  sizing?: Sizing;
  /** Gilt fuer alle Fotos der Zeile, sofern das Foto nichts eigenes setzt */
  aspect?: string;
  parallax?: number;
  maxWidth?: string;
  gap?: string;
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
    tileHeight: "clamp(340px, 80vw, 480px)",
    align: "stretch",
  },
};

/* Die Zeile liegt auf einem gedachten Dreier-Raster: Die Doppelseite belegt
   zwei Felder (0.30 + 0.30), die Kachel eines plus den frei gewordenen
   Abstand (0.40 + 1 x gap). Zusammen ergibt das exakt 100 %. */
const DEFAULT_MAGAZINE_LAYOUT: Required<MagazineLayout> = {
  maxWidth: PAGE_MAX,
  spreadSize: "calc((100% - 2 * var(--row-gap)) * 0.60)",
  tileSize: "calc((100% - 2 * var(--row-gap)) * 0.40 + var(--row-gap))",
  gap: "clamp(20px, 2.4vw, 44px)",
  tileHeight: "clamp(360px, 90vw, 520px)",
  /* Zwei A4-Seiten nebeneinander: 2 breit zu 1.414 hoch. Ist der Scan anders
     proportioniert, hier das echte Verhaeltnis eintragen -- sonst schneidet
     "cover" die Differenz weg. */
  spreadAspect: "2 / 1.414",
  /* 0px = die beiden Scans stossen nahtlos aneinander wie im Heft. */
  gutter: "0px",
};

const DEFAULT_PHOTO_LAYOUT = {
  maxWidth: PAGE_MAX,
  gap: "clamp(20px, 2.4vw, 44px)",
  aspect: "3 / 4",
} as const;

/* Aussehen der Textbloecke -- gilt fuer alle Kacheln gleich, damit sie eine
   Familie bleiben. Soll eine Zeile abweichen, den Block dort einzeln
   ueberschreiben (siehe Magazinzeile weiter unten). */
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

/* ==========================================================================
   INHALTE
   Pfade und IDs anpassen -- die Struktur bleibt.
   ========================================================================== */

/* Zeile 1: genau EIN Film. Quelle ist 1920x1080, deshalb "16 / 9",
   Zoom 1 und Parallax 0 -- so laeuft das Video im Originalausschnitt. */
const FILMS: Film[] = [
  {
    id: "collabFilm",
    format: "tall",
    videoPosition: "left",
    videoSrc:
      "https://media.mayaesai.com/jitrois being a man remastered neue-musik.mp4",
    hlsSrc: "https://media.mayaesai.com/JitroisBeingAManWebsite/master.m3u8",
    poster: "/Aaron-umgewandelt.jpg",
    label: "Feature & Collaboration",
    year: "2020",
    aspect: "16 / 9",
    videoZoom: 1,
    videoFit: "cover",
    videoFocus: "center",
    parallax: 0,
    front: FRONT_STYLE,
    back: BACK_STYLE,
  },
];

/* --------------------------------------------------------------------------
   Zeile 2: zwei Bilder mit sehr unterschiedlichem Format.

   WICHTIG: Bei sizing "justified" traegt man in `aspect` das ECHTE Verhaeltnis
   der Datei ein -- am einfachsten die Pixelmasse, also z. B. "2048 / 1966"
   fuer das fast quadratische und "3840 / 1080" fuer das Breitbild. Aus diesen
   Werten rechnet die Zeile die Breiten so aus, dass beide Rahmen exakt gleich
   hoch stehen. Steht dort etwas Falsches, kippt die gemeinsame Kante und
   "cover" beginnt zu beschneiden.
   -------------------------------------------------------------------------- */
const PHOTO_ROWS_BEFORE_MAGAZINE: PhotoRow[] = [
  {
    id: "photosDuo",
    sizing: "justified",
    parallax: 0,
    photos: [
      {
        src: "/Cassie-und-Avatar-in-Jitrois.jpg",
        key: "photo1",
        /* HIER die echten Masse des fast quadratischen Bildes eintragen */
        aspect: "829 / 649",
        badge: "none",
      },
      {
        src: "/Aaron-und-Cassia-auf-dem-Podest.jpg",
        key: "photo2",
        /* HIER die echten Masse des Breitbildes eintragen */
        aspect: "1280 / 720",
        badge: "none",
      },
    ],
  },
];

/* Zeile 3: Flip-Kachel links · Magazin-Doppelseite rechts.
   Die beiden Scans liegen im selben Rahmen und ergeben zusammen die
   aufgeschlagene Doppelseite. Soll die Doppelseite nach links wandern,
   `spreadPosition` auf "left" setzen -- die Kachel folgt automatisch. */
const MAGAZINES: MagazineRow[] = [
  {
    id: "magazineFeature",
    label: "Magazine Feature",
    year: "2020",
    spreadPosition: "right",
    spread: [
      {
        src: "/Faust-Seite-96.jpg",
        alt: "",
        zoom: 1,
        fit: "cover",
        focus: "center",
        badge: "none",
      },
      {
        src: "/Faust-Seite-97.jpg",
        alt: "",
        zoom: 1,
        fit: "cover",
        focus: "center",
      },
    ],
    parallax: 0,
    /* Die Kachel ist hier schmaler als in der Filmzeile -- deshalb der Titel
       eine Stufe kleiner, sonst bricht er auf Tablets zu oft um. */
    front: [
      { ...FRONT_STYLE[0], size: "clamp(24px, 2.6vw, 40px)" },
      { ...FRONT_STYLE[1], size: "clamp(10px, 0.9vw, 12px)", tracking: "0.22em" },
    ],
    back: [
      BACK_STYLE[0],
      { ...BACK_STYLE[1], size: "clamp(22px, 2.2vw, 32px)" },
      { ...BACK_STYLE[2], size: "13px" },
    ],
  },
];

/* Zeile 4 und folgende: reine Fotozeilen. Bei "equal" rechnet sich die
   Segmentbreite aus der Anzahl der Fotos -- zwei Eintraege ergeben Haelften,
   drei Drittel. Weitere Zeile = weiterer Eintrag hier. */
const PHOTO_ROWS_AFTER_MAGAZINE: PhotoRow[] = [
  {
    id: "photosEditorial",
    aspect: "3 / 4",
    parallax: 0,
    photos: [
      { src: "/jitrois_15_0050.jpg", key: "photo1", badge: "none" },
      { src: "/jitrois_linkedIn-2_0143.jpg", key: "photo2", badge: "none" },
      { src: "/7.jpg", key: "photo3", badge: "none" },
    ],
  },
  {
    id: "photosCampaign",
    aspect: "3 / 2",
    parallax: 0,
    photos: [
      { src: "/WireframeModus.jpg", key: "photo1", badge: "none" },
      { src: "/Aaron-laesst-Treppe-entstehen.jpg", key: "photo3", badge: "none" },
    ],
  },
];

/** true auf Geraeten mit echtem Maus-Hover */
const hasHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

/**
 * "16 / 9" · "3/2" · "2048 / 1966" -> Zahl (Breite geteilt durch Hoehe).
 * Nur fuer die Breitenrechnung der justierten Zeile; das Fenster selbst
 * bekommt weiterhin den Originalstring als aspectRatio.
 */
function ratioOf(aspect: string) {
  const [w, h] = aspect.split("/").map((part) => parseFloat(part.trim()));
  if (!w || !h || Number.isNaN(w) || Number.isNaN(h)) return 1;
  return w / h;
}

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
function resolveLines(t: Translator, rowId: string, block: TextBlock) {
  if (block.key) {
    const value = safeT(t, `projects.${rowId}.${block.key}`, "");
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

/* ---------------- Seite ---------------- */

export default function FeatCollabPage() {
  const t = useTranslations("FeatCollab");
  const tRoot = useTranslations();

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

      {/* Reihenfolge der Seite -- hier ablesbar von oben nach unten */}
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

        {PHOTO_ROWS_BEFORE_MAGAZINE.map((row) => (
          <PhotoRowView key={row.id} row={row} />
        ))}

        {MAGAZINES.map((row) => (
          <MagazineRowView key={row.id} row={row} />
        ))}

        {PHOTO_ROWS_AFTER_MAGAZINE.map((row) => (
          <PhotoRowView key={row.id} row={row} />
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

/* ---------------- Zeile 1: Video + Flip-Kachel ---------------- */

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
  const videoFirst =
    film.videoPosition === "top" || film.videoPosition === "left";

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
      <RowTitle id={film.id} />

      <div
        className={[
          "flex flex-col gap-8 md:gap-[var(--row-gap)]",
          directionClass,
        ].join(" ")}
      >
        <div className={videoBoxClass}>
          <VideoTile
            film={film}
            soundOn={soundOn}
            onToggleSound={onToggleSound}
          />
        </div>

        <div className={tileBoxClass}>
          <FlipTile item={film} stretch={stretchTile} />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Magazinzeile: Kachel · Doppelseite ---------------- */

function MagazineRowView({ row }: { row: MagazineRow }) {
  const L = { ...DEFAULT_MAGAZINE_LAYOUT, ...(row.layout ?? {}) };
  const spreadRight = (row.spreadPosition ?? "right") === "right";

  const cssVars = {
    "--row-gap": L.gap,
    "--spread-size": L.spreadSize,
    "--tile-size": L.tileSize,
    "--tile-height": L.tileHeight,
  } as React.CSSProperties;

  return (
    <section
      className="mx-auto w-full px-6 md:px-10"
      style={{ ...cssVars, maxWidth: L.maxWidth }}
    >
      <RowTitle id={row.id} />

      {/* Die Doppelseite steht im Markup zuerst -- auf Mobile also oben.
          Ab md dreht flex-row-reverse die Zeile, damit sie rechts landet
          und die Kachel links. */}
      <div
        className={[
          "flex flex-col gap-8 md:items-stretch md:gap-[var(--row-gap)]",
          spreadRight ? "md:flex-row-reverse" : "md:flex-row",
        ].join(" ")}
      >
        <div className="w-full md:w-[var(--spread-size)] md:shrink md:grow-0 md:self-start">
          <SpreadTile
            pages={row.spread}
            rowId={row.id}
            aspect={L.spreadAspect}
            gutter={L.gutter}
            parallax={row.parallax ?? 0}
          />
        </div>

        {/* Flex-Wrapper, damit die Kachel die Hoehe der Doppelseite uebernimmt */}
        <div className="w-full md:flex md:w-[var(--tile-size)] md:shrink md:grow-0 md:self-stretch">
          <FlipTile item={row} stretch />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Fotozeilen ---------------- */

function PhotoRowView({ row }: { row: PhotoRow }) {
  const gap = row.gap ?? DEFAULT_PHOTO_LAYOUT.gap;
  const count = row.photos.length;
  const justified = row.sizing === "justified";

  /* Seitenverhaeltnis pro Foto -- eigenes vor Zeilenwert vor Standard. */
  const aspects = row.photos.map(
    (photo) => photo.aspect ?? row.aspect ?? DEFAULT_PHOTO_LAYOUT.aspect,
  );

  /* "justified": Die verfuegbare Breite wird im Verhaeltnis der Bildbreiten
     verteilt. Ein Bild mit doppeltem Seitenverhaeltnis bekommt doppelt so
     viel Platz -- dadurch stehen alle Rahmen exakt gleich hoch.
     "equal": alle gleich breit. */
  const ratios = aspects.map(ratioOf);
  const ratioSum = ratios.reduce((sum, r) => sum + r, 0);

  const widths = row.photos.map((_, i) =>
    justified
      ? `calc((100% - ${count - 1} * var(--row-gap)) * ${(ratios[i] / ratioSum).toFixed(5)})`
      : `calc((100% - ${count - 1} * var(--row-gap)) / ${count})`,
  );

  return (
    <section
      className="mx-auto w-full px-6 md:px-10"
      style={{
        "--row-gap": gap,
        maxWidth: row.maxWidth ?? DEFAULT_PHOTO_LAYOUT.maxWidth,
      } as React.CSSProperties}
    >
      <RowTitle id={row.id} />

      {/* items-start, damit unterschiedlich hohe Rahmen oben buendig stehen --
          bei "justified" sind sie ohnehin gleich hoch. */}
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-[var(--row-gap)]">
        {row.photos.map((photo, i) => (
          <div
            key={`${row.id}-${i}`}
            style={{ "--seg-size": widths[i] } as React.CSSProperties}
            className="w-full md:w-[var(--seg-size)] md:shrink md:grow-0"
          >
            <ImageTile
              item={photo}
              rowId={row.id}
              fallbackAspect={aspects[i]}
              parallax={row.parallax ?? 0}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Zeilen-Ueberschrift (optional) ---------------- */

/**
 * Wird nur gezeigt, wenn in den messages `projects.<id>.rowTitle` steht.
 * Fehlt der Key, bleibt die Zeile still -- kein leerer Abstand.
 */
function RowTitle({ id }: { id: string }) {
  const t = useTranslations("FeatCollab");
  const title = safeT(t, `projects.${id}.rowTitle`, "");
  if (!title) return null;

  return (
    <span className="mb-5 block text-xs font-medium uppercase tracking-[0.2em] text-blood">
      {title}
    </span>
  );
}

/* ---------------- Doppelseite ---------------- */

/**
 * Ein Rahmen, darin eine oder zwei Seiten. Bei zwei Seiten teilen sie sich
 * die Breite exakt haelftig und stossen ohne Abstand aneinander -- so wirkt
 * es wie ein aufgeschlagenes Heft und nicht wie zwei Bilder nebeneinander.
 * Die Bildunterschrift kommt aus `projects.<id>.spreadCaption`.
 */
function SpreadTile({
  pages,
  rowId,
  aspect,
  gutter,
  parallax = 0,
}: {
  pages: ImageItem[];
  rowId: string;
  aspect: string;
  gutter: string;
  parallax?: number;
}) {
  const t = useTranslations("FeatCollab");
  const p = useParallax<HTMLDivElement>(parallax);
  const coverScale = parallax === 0 ? 1 : 1.14;

  const caption = safeT(t, `projects.${rowId}.spreadCaption`, "");
  const badge = pages[0]?.badge ?? "none";

  return (
    <div
      /* Rahmen, Hintergrund und Innenabstand wie bei der Video-Kachel --
         so bleiben alle Segmente der Seite eine Familie. */
      className="group relative flex w-full flex-col justify-end overflow-hidden border border-white/25 bg-ink p-8"
      style={{ aspectRatio: aspect }}
    >
      <div
        ref={p.ref}
        style={{
          transform: `translate3d(0, ${p.offset.toFixed(2)}px, 0) scale(${coverScale})`,
        }}
        className="absolute inset-0 will-change-transform"
      >
        {/* Eigene Ebene fuer den Hover-Zoom -- beim Magazin bewusst dezenter
            als bei den Fotos, damit die Doppelseite ruhig bleibt. */}
        <div
          className="absolute inset-0 flex transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          style={{ gap: gutter }}
        >
          {pages.map((page, i) => (
            <div key={i} className="relative h-full flex-1 overflow-hidden">
              <img
                src={page.src}
                alt={page.alt ?? ""}
                draggable={false}
                loading="lazy"
                onContextMenu={(e) => e.preventDefault()}
                style={{
                  objectFit: page.fit ?? "cover",
                  objectPosition: page.focus ?? "center",
                  transform: `scale(${page.zoom ?? 1})`,
                  transformOrigin: "center center",
                }}
                className="absolute inset-0 h-full w-full select-none [-webkit-touch-callout:none]"
              />
            </div>
          ))}
        </div>
      </div>

      {caption && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />
      )}

      {badge === "ai" && <AiLabel position="top-left" />}
      {badge === "3d" && <AnimLabel position="top-left" />}

      {caption && (
        <div className="relative z-10">
          <span className="text-xs uppercase tracking-[0.2em] text-mute">
            {caption}
          </span>
        </div>
      )}
    </div>
  );
}

/* ---------------- Bild-Kachel ---------------- */

function ImageTile({
  item,
  rowId,
  fallbackAspect,
  parallax = 0,
}: {
  item: ImageItem;
  rowId: string;
  fallbackAspect: string;
  parallax?: number;
}) {
  const t = useTranslations("FeatCollab");
  const p = useParallax<HTMLDivElement>(parallax);

  /* Wie beim Video: ohne leichte Ueberdeckung entstehen beim Verschieben
     Luecken an den Raendern. Ist Parallax aus, faellt sie weg. */
  const coverScale = parallax === 0 ? 1 : 1.14;

  const mediaStyle: React.CSSProperties = {
    objectFit: item.fit ?? "cover",
    objectPosition: item.focus ?? "center",
    transform: `scale(${item.zoom ?? 1})`,
    transformOrigin: "center center",
  };

  const caption = item.key
    ? safeT(t, `projects.${rowId}.${item.key}`, item.caption ?? "")
    : (item.caption ?? "");

  return (
    <div
      className="group relative flex w-full flex-col justify-end overflow-hidden border border-white/25 bg-ink p-8"
      style={{ aspectRatio: item.aspect ?? fallbackAspect }}
    >
      <div
        ref={p.ref}
        style={{
          transform: `translate3d(0, ${p.offset.toFixed(2)}px, 0) scale(${coverScale})`,
        }}
        className="absolute inset-0 will-change-transform"
      >
        {/* Eigene Ebene fuer den Hover-Zoom, damit er sich nicht mit dem
            Zoom aus mediaStyle und dem Parallax ins Gehege kommt. */}
        <div className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
          <img
            src={item.src}
            alt={item.alt ?? caption}
            draggable={false}
            loading="lazy"
            onContextMenu={(e) => e.preventDefault()}
            style={mediaStyle}
            className="absolute inset-0 h-full w-full select-none [-webkit-touch-callout:none]"
          />
        </div>
      </div>

      {/* Leichter Verlauf nach unten, damit die Bildunterschrift auf hellen
          Motiven lesbar bleibt. Nur wenn es eine gibt. */}
      {caption && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />
      )}

      {item.badge === "ai" && <AiLabel position="top-left" />}
      {item.badge === "3d" && <AnimLabel position="top-left" />}

      {caption && (
        <div className="relative z-10">
          <span className="text-xs uppercase tracking-[0.2em] text-mute">
            {caption}
          </span>
        </div>
      )}
    </div>
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

  useHls(videoRef, film.hlsSrc ?? film.videoSrc);

  const parallaxStrength = film.parallax ?? 0.12;
  const parallax = useParallax<HTMLDivElement>(parallaxStrength);

  const coverScale = parallaxStrength === 0 ? 1 : 1.14;

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
    video.play().catch(() => {});
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
    if (isPlaying) stop();
    else start();
  };

  return (
    <div
      className="group relative flex w-full flex-col justify-end overflow-hidden border border-white/25 bg-ink p-8"
      style={{
        aspectRatio:
          film.aspect ?? (film.format === "tall" ? "9 / 16" : "16 / 9"),
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

function FlipTile({ item, stretch }: { item: FlipContent; stretch: boolean }) {
  const t = useTranslations("FeatCollab");
  const [flipped, setFlipped] = useState(false);

  const toggle = () => setFlipped((prev) => !prev);

  const storyLabel = safeT(t, `projects.${item.id}.storyLabel`, item.label);

  /* Ab md bewusst KEINE eigene Hoehe: Die Kachel uebernimmt exakt die Hoehe
     des Nachbarsegments. tileHeight gilt nur untereinander auf Mobile. */
  const heightClass = stretch
    ? "h-[var(--tile-height)] md:h-auto md:self-stretch"
    : "h-[var(--tile-height)]";

  return (
    <div
      className={["group relative w-full [perspective:1600px]", heightClass].join(
        " ",
      )}
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
        <div className="absolute inset-0 flex flex-col items-center justify-center border border-white/25 p-8 [-webkit-backface-visibility:hidden] [backface-visibility:hidden] [text-shadow:0_2px_14px_rgba(0,0,0,0.6)] [transform:translateZ(0.5px)] md:p-10 lg:p-14">
          {item.front.map((block, i) => (
            <TextBlockView
              key={i}
              block={block}
              lines={resolveLines(t, item.id, block)}
              centered
            />
          ))}

          <span className="absolute bottom-8 left-8 text-xs uppercase tracking-[0.2em] text-mute">
            {item.year}
          </span>

          <span className="absolute bottom-8 right-8 text-[10px] uppercase tracking-[0.3em] text-mute/70">
            {t("flipHint")}
          </span>
        </div>

        {/* Rueckseite -- deckend, drei Textbloecke, linksbuendig */}
        <div className="absolute inset-0 flex flex-col justify-center overflow-y-auto bg-paper p-8 [-webkit-backface-visibility:hidden] [backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(0.5px)] md:p-10 lg:p-14">
          {item.back.map((block, i) => (
            <TextBlockView
              key={i}
              block={block}
              lines={resolveLines(t, item.id, block)}
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
 * kein fertiges style-Objekt: Die Kacheln bauen daraus zusammen mit der
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
