"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AiLabel from "@/components/AiLabel";
import Link from "next/link";
import { useLocale } from "next-intl";
import PartnersMarquee from "@/components/PartnersMarquee";
import Header from "@/components/Header";
import { Volume2, VolumeX, Play } from "lucide-react";

import {
  FaInstagram,
  FaSpotify,
  FaYoutube,
  FaLinkedinIn,
  FaTiktok,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";


export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [introMuted, setIntroMuted] = useState(true);
  const introVideoRef = useRef<HTMLVideoElement>(null);


  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted && introVideoRef.current) {
      introVideoRef.current.muted = true;
      setIntroMuted(true);
    }
  };

  const [isHovering, setIsHovering] = useState(false);

  const handleVideoEnter = () => {
    setIsHovering(true);
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => { });
  };

  const handleVideoLeave = () => {
    setIsHovering(false);
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  const handleVideoClick = () => {
    // Auf Geräten mit echtem Hover (Desktop-Maus) übernimmt das schon
    // onMouseEnter/onMouseLeave -- hier nichts tun, sonst doppeltes
    // Toggle bei einem Klick waehrend des Hoverns.
    const hasHover = window.matchMedia("(hover: hover)").matches;
    if (hasHover) return;

    setIsHovering((prev) => {
      const next = !prev;
      const video = videoRef.current;
      if (video) {
        if (next) {
          video.currentTime = 0;
          video.play().catch(() => { });
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
      return next;
    });
  };

  const toggleIntroMute = () => {
    if (!introVideoRef.current) return;
    const nextMuted = !introVideoRef.current.muted;
    introVideoRef.current.muted = nextMuted;
    setIntroMuted(nextMuted);

    if (!nextMuted && videoRef.current) {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <main className=" text-bone">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Maya ES",
            url: "https://mayaesai.com",
            sameAs: [
              "https://www.instagram.com/m.a.y.a_es/",
              "https://open.spotify.com/artist/4Ps4f6CwOBFmSrqiQQKO7q",
              "https://music.youtube.com/channel/UCe0ROKE7s9fwY3u_orDxUDw",
              "https://www.linkedin.com/in/maya-es-525728150/",
              "https://x.com/MayaES3Dfashion",
              "https://www.tiktok.com/@maya.es.films",
            ],
            jobTitle: "AI Fashion Film & Music Artist",
          }),
        }}
      />

      <Header />

      <IntroVideo
        introVideoRef={introVideoRef}
        introMuted={introMuted}
        toggleIntroMute={toggleIntroMute}
      />

      <div className="h-16 md:h-24" />

      <div id="site-content">

        {/* HERO */}
        <section className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 pb-16 md:grid-cols-2 md:items-start md:px-10 md:pb-24">
          <div className="flex flex-col justify-center">
            <h1 className="font-display text-[15vw] leading-[0.85] tracking-tight md:text-[6.2vw]">
              {t("Hero.line1")}
              <br />
              {t("Hero.line2")}
              <br />
              {t("Hero.line3")}
              <br />
              <span className="text-blood">{t("Hero.line4")}</span>
            </h1>

            <p>
              <br />
              <span className="text-2xl font-medium uppercase tracking-[0.5em] text-blood">
                {t("Hero.poweredBy")}
              </span>
            </p>

            <span
              className="mt-16 inline-flex w-fit items-center gap-2 border border-white/25 px-6 py-3 text-xs font-medium uppercase tracking-[0.6em] "
            >
              {t("Hero.label1")}

            </span>


            <div className="mt-10 max-w-lg text-[17px] leading-[1.8] tracking-[0.01em] text-mute text-justify">
              <p>{t("Hero.description1")}</p>

              <p className="mt-6">
                {t("Hero.description2")}
              </p>

              <p className="mt-6">
                {t("Hero.description3")}
              </p>

              <p className="mt-6">
                {t("Hero.description4")}
              </p>

              <p className="mt-10 font-medium tracking-[0.08em] text-blood">
                {t("Hero.tagline")}
              </p>
            </div>

          </div>

          <div className="relative flex aspect-[1/2] scale-[1.00] items-center justify-center overflow-hidden border border-white bg-ink-soft">
            <Image
              src="/Maya Avatar Homepage colorgraded.jpg"
              alt="Portrait"
              fill
              priority
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className="object-cover border-3 border-white/20 z-10 select-none [-webkit-touch-callout:none]"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
            <div className="absolute inset-0 z-10 bgs-transparent" />
            <span className="absolute right-4 top-4 z-10 text-[10px] uppercase tracking-[0.3em] text-mute [writing-mode:vertical-rl]">
              {t("Hero.location")}
            </span>
            <AiLabel position="top-left" />
          </div>
        </section>

        {/* FEATURED WORK GRID */}
        <section id="work" className="mx-auto grid max-w-[1400px] grid-cols-1 gap-px bg-white/5 md:grid-cols-2">
          {/* AI Film & Music */}
          <div
            className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden bg-ink p-8"
            onMouseEnter={handleVideoEnter}
            onMouseLeave={handleVideoLeave}
            onClick={handleVideoClick}
            onFocus={handleVideoEnter}
            onBlur={handleVideoLeave}
            tabIndex={0}
            role="button"
            aria-label="Video abspielen"
          >
            {/* Poster -- Standardzustand */}
            <img
              src="/Casino-Standbild-Website.jpg"
              alt=""
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className={[
                "absolute inset-0 h-full w-full object-cover select-none [-webkit-touch-callout:none]",
                "transition-opacity duration-300",
                isHovering ? "opacity-0" : "opacity-100",
              ].join(" ")}
            />

            {!isHovering && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-[3px] bg-black/40 backdrop-blur-sm">
                  <Play className="h-6 w-6 text-bone" fill="currentColor" />
                </div>
              </div>
            )}

            <video
              ref={videoRef}
              src="https://media.mayaesai.com/Casino scene short.mp4"
              loop
              muted={isMuted}
              playsInline
              preload="none"
              draggable={false}
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              className={[
                "absolute inset-0 h-full w-full object-cover select-none [-webkit-touch-callout:none]",
                "transition-opacity duration-300",
                isHovering ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />
            <AiLabel position="top-left" />

            <button
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className="absolute bottom-4 right-4 z-20 flex items-center justify-center rounded-[3px] bg-black/35 p-1.5 text-bone shadow-[2px_2px_5px_rgba(0,0,0,0.30)] transition-colors hover:bg-black/50 hover:text-blood"
            >
              {isMuted ? (
                <VolumeX className="h-6 w-6" strokeWidth={1.8} />
              ) : (
                <Volume2 className="h-6 w-6" strokeWidth={1.8} />
              )}
            </button>

            <div className="relative z-10">
              <span className="text-xs uppercase tracking-[0.2em] text-mute">
                {t("Featured.aiFilmMusic")}
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center bg-transparent p-8 md:p-14">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-blood">
              {t("Featured.label")}
            </span>
            <h2 className="font-display mt-4 text-5xl leading-[0.9] md:text-6xl">
              {t("Featured.titleLine1")}
              <br />
              {t("Featured.titleLine2")}
            </h2>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-mute">
              {t("Featured.description")}
            </p>

            <Link href={`/${locale}/coming-soon`} className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-bone transition-colors hover:text-blood">
              {t("Featured.cta")} <span aria-hidden>↗</span>
            </Link>
          </div>

          {/* 3D Fashion */}
          <div className="flex flex-col justify-center bg-paper p-8 text-ink md:p-14">
            <h2 className="font-display text-4xl leading-[0.9] text-ink md:text-5xl">
              {t("Fashion3D.titleLine1")}
              <br />
              {t("Fashion3D.titleLine2")}
            </h2>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink/60">
              {t("Fashion3D.description")}
            </p>

            <Link href={`/${locale}/coming-soon`} className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-blood">
              {t("Fashion3D.cta")} <span aria-hidden>↗</span>
            </Link>
          </div>

          {/* Art & Story */}
          <div className="relative flex min-h-[280px] flex-col justify-center overflow-hidden bg-blood p-8 md:p-14">
            <div className="absolute inset-0 opacity-30">
              <NoiseTexture />
            </div>
            <div className="relative z-10">
              <h2 className="font-display text-4xl leading-[0.9] text-ink md:text-5xl">
                {t("ArtStory.titleLine1")}
                <br />
                {t("ArtStory.titleLine2")}
              </h2>
              <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink/70">
                {t("ArtStory.description")}
              </p>

              <Link href={`/${locale}/coming-soon`}
                className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-ink/60"
              >
                {t("ArtStory.cta")} <span aria-hidden>↗</span>
              </Link>
            </div>
          </div>
        </section>

        {/* MANIFESTO */}
        <section className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-6 py-20 md:grid-cols-[1fr_1.2fr_auto] md:px-10">
          <div className="text-xs uppercase tracking-[0.2em] text-mute">
            {(t.raw("Manifesto.roles") as string[]).map((role) => (
              <p key={role}>{role}</p>
            ))}
          </div>

          <div>
            <h2 className="font-display text-4xl leading-[0.95] md:text-6xl">
              {t("Manifesto.titleLine1")}
              <br />
              <span className="text-blood">{t("Manifesto.titleLine2")}</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-mute">
              {t("Manifesto.description")}
            </p>

            <Link href={`/${locale}/coming-soon`} className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-bone transition-colors hover:text-blood">
              {t("Manifesto.cta")} <span aria-hidden>↗</span>
            </Link>
          </div>

          <RotatingBadge />
        </section>

        {/* CONTACT */}
        <section className="mx-auto grid max-w-[1400px] grid-cols-1 gap-px md:grid-cols-[1.1fr_1fr_1fr]">
          <div className="flex flex-col justify-center bg-blood p-8 text-ink md:p-14">
            <span className="text-xs font-medium uppercase tracking-[0.2em]">
              {t("Contact.collaboration")}
            </span>
            <h2 className="font-display mt-4 text-4xl leading-[0.95] md:text-5xl">
              {t("Contact.titleLine1")}
              <br />
              {t("Contact.titleLine2")}
            </h2>

            <a href="mailto:mayaes2018@gmail.com"
              className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:text-ink/60"
            >
              {t("Contact.cta")} <span aria-hidden>↗</span>
            </a>
          </div>


        </section>

        <PartnersMarquee />

        <footer className="mx-auto flex max-w-[1400px] flex-col-reverse items-center justify-between gap-4 px-6 py-6 text-[11px] uppercase tracking-[0.18em] text-mute md:flex-row md:px-10"></footer>


        <footer className="mx-auto flex max-w-[1400px] flex-col gap-5 px-6 py-6 text-[11px] uppercase tracking-[0.18em] text-mute md:flex-row md:items-center md:justify-between md:px-10">

          <span>{t("Footer.copyright")}</span>

          <div className="flex items-center gap-6">
            <Link
              href={`/${locale}/impressum`}
              className="transition-colors hover:text-bone"
            >
              {t("Footer.imprint")}
            </Link>

            <Link
              href={`/${locale}/datenschutz`}
              className="transition-colors hover:text-bone"
            >
              {t("Footer.privacy")}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/m.a.y.a_es/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transition-colors hover:text-blood"
            >
              <FaInstagram className="h-4 w-4" />
            </a>

            <a
              href="https://open.spotify.com/artist/4Ps4f6CwOBFmSrqiQQKO7q"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Spotify"
              className="transition-colors hover:text-blood"
            >
              <FaSpotify className="h-4 w-4" />
            </a>

            <a
              href="https://music.youtube.com/channel/UCe0ROKE7s9fwY3u_orDxUDw"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube Music"
              className="transition-colors hover:text-blood"
            >
              <FaYoutube className="h-4 w-4" />
            </a>

            <a
              href="https://www.linkedin.com/in/maya-es-525728150/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="transition-colors hover:text-blood"
            >
              <FaLinkedinIn className="h-4 w-4" />
            </a>

            <a
              href="https://x.com/MayaES3Dfashion"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="transition-colors hover:text-blood"
            >
              <FaXTwitter className="h-4 w-4" />
            </a>

            <a
              href="https://www.tiktok.com/@maya.es.films"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="transition-colors hover:text-blood"
            >
              <FaTiktok className="h-4 w-4" />
            </a>
          </div>

        </footer>
        <p className="mx-auto max-w-[1400px] px-6 pb-6 text-[10px] normal-case tracking-normal text-mute/70 md:px-10">
          {t("AiLabel.disclaimer")}
        </p>
      </div >
    </main >
  );
}

/* ---------- Signature generative graphics (no stock imagery) ---------- */

function NoiseTexture() {
  return (
    <svg width="100%" height="100%" aria-hidden>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}

function RotatingBadge() {
  return (
    <div className="relative hidden h-32 w-32 shrink-0 items-center justify-center md:flex">
      <svg viewBox="0 0 200 200" className="badge-spin h-full w-full">
        <defs>
          <path id="badge-circle" d="M100,100 m-75,0 a75,75 0 1,1 150,0 a75,75 0 1,1 -150,0" />
        </defs>
        <text fill="#8a8a86" fontSize="12" letterSpacing="3" className="uppercase">
          <textPath href="#badge-circle" startOffset="0%">
            CREATE TO INSPIRE • CREATE TO INSPIRE •
          </textPath>
        </text>
      </svg>
      <span className="font-arimo absolute text-3xl text-blood">ES</span>
    </div>
  );
}

function IntroVideo({
  introVideoRef,
  introMuted,
  toggleIntroMute,
}: {
  introVideoRef: React.RefObject<HTMLVideoElement | null>;
  introMuted: boolean;
  toggleIntroMute: () => void;
}) {
  const scrollToContent = () => {
    document.getElementById("site-content")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const videoEl = introVideoRef.current;
    if (!videoEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoEl.play().catch(() => { });
        } else {
          videoEl.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(videoEl);

    return () => observer.disconnect();
  }, [introVideoRef]);

  return (
    <section className="group relative h-screen w-full overflow-hidden bg-ink"
      onContextMenu={(e) => e.preventDefault()}>
      <video
        ref={introVideoRef}
        src="https://media.mayaesai.com/reel-website-ohne-goere.mp4"
        autoPlay
        loop
        muted
        playsInline
        draggable={false}
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
        // onContextMenu={(e) => e.preventDefault()}
        onClick={scrollToContent}
        className="absolute inset-0 h-full w-full cursor-pointer object-cover select-none [-webkit-touch-callout:none]"
      />
      <div className="absolute inset-0 bg-black/20" />
      <AiLabel position="top-left" />

      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="animate-hero-logo font-arimo font-bold text-[16vw] tracking-wide text-bone/90 md:text-[6vw]"
          style={{ transform: "scale(1.20, 1.00)" }}>
          MAYA ES<span className="text-blood">.</span>
        </h1>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleIntroMute();
        }}
        aria-label={introMuted ? "Unmute video" : "Mute video"}
        className="absolute bottom-6 right-6 z-20 flex items-center justify-center rounded-[3px] bg-black/35 p-1.5 text-bone shadow-[2px_2px_5px_rgba(0,0,0,0.30)] transition-colors hover:bg-black/50 hover:text-blood md:bottom-8 md:right-10"
      >
        {introMuted ? (
          <VolumeX className="h-6 w-6" strokeWidth={1.8} />
        ) : (
          <Volume2 className="h-6 w-6" strokeWidth={1.8} />
        )}
      </button>

      <div
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2 text-bone"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] opacity-80">Scroll</span>
        <span className="animate-bounce text-lg">↓</span>
      </div>
    </section>
  );
}