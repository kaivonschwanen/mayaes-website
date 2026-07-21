"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AiLabel from "@/components/AiLabel";
import Link from "next/link";
import { useLocale } from "next-intl";
import PartnersMarquee from "@/components/PartnersMarquee";


export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [introMuted, setIntroMuted] = useState(true);
  const introVideoRef = useRef<HTMLVideoElement>(null);

  const NAV_LINKS = [
    t("Nav.work"),
    t("Nav.about"),
    t("Nav.collaboration"),
    t("Nav.journal"),
  ];

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
    <main className="bg-ink text-bone">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Maya Es",
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

      <IntroVideo
        introVideoRef={introVideoRef}
        introMuted={introMuted}
        toggleIntroMute={toggleIntroMute}
      />

      <div className="h-16 bg-ink md:h-24" />

      <div id="site-content">
        {/* HEADER */}
        <header className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 md:px-10">
          <a href="#" className="font-display text-2xl tracking-wide">
            MAYA ES<span className="text-blood">.</span>
          </a>

          <nav className="hidden items-center gap-10 text-base font-medium uppercase tracking-[0.18em] text-mute md:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link} href={`/${locale}/coming-soon`} className="transition-colors hover:text-bone">
                {link}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em]"
              aria-expanded={menuOpen}
              aria-label="Open menu"
            >
              {t("Nav.menu")}
              <span className="text-lg leading-none">{menuOpen ? "×" : "+"}</span>
            </button>
          </div>
        </header>

        {menuOpen && (
          <nav className="mx-6 mb-6 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm uppercase tracking-[0.18em] text-mute md:hidden">
            {NAV_LINKS.map((link) => (
              <Link key={link} href={`/${locale}/coming-soon`} onClick={() => setMenuOpen(false)}>
                {link}
              </Link>
            ))}
          </nav>
        )}

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
              <span className="text-2xl font-medium uppercase tracking-[0.8em] text-blood">
                {t("Hero.poweredBy")}
              </span>
            </p>

            <p className="mt-8 max-w-sm text-sm leading-relaxed text-mute">
              {t("Hero.description")}
              <br />
              <span className="text-blood">{t("Hero.tagline")}</span>
            </p>


            <a href="#work"
              className="mt-8 inline-flex w-fit items-center gap-2 border border-white/25 px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:border-blood hover:text-blood"
            >
              {t("Hero.cta")}
              <span aria-hidden>↗</span>
            </a>
          </div>

          <div className="relative flex aspect-[1/2] items-center justify-center overflow-hidden border border-white/10 bg-ink-soft">
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
        <section id="work" className="mx-auto grid max-w-[1400px] grid-cols-1 gap-px bg-white/10 md:grid-cols-2">
          {/* AI Film & Music */}
          <div className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden bg-ink p-8">
            <video
              ref={videoRef}
              src="https://media.mayaesai.com/Casino-Glam-Website.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              draggable={false}
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              className="absolute inset-0 h-full w-full object-cover select-none [-webkit-touch-callout:none]"
            />

            <AiLabel position="top-left" />

            <button
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className="absolute bottom-4 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-black/30 text-sm backdrop-blur-sm transition-colors hover:border-blood"
            >
              {isMuted ? "🔇" : "🔊"}
            </button>

            <div className="relative z-10">
              <span className="text-xs uppercase tracking-[0.2em] text-mute">
                {t("Featured.aiFilmMusic")}
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center bg-ink p-8 md:p-14">
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

        {/* CONTACT / FOOTER */}
        <section className="mx-auto grid max-w-[1400px] grid-cols-1 gap-px bg-white/10 md:grid-cols-[1.1fr_1fr_1fr]">
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

          <div className="bg-ink" />

          <div className="flex flex-col justify-center gap-6 bg-paper p-8 text-ink md:p-14">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-ink/50">
                {t("Contact.contactLabel")}
              </span>
            </div>
            <div className="flex flex-col gap-2 text-xs font-medium uppercase tracking-[0.18em]">

              <a href="https://www.instagram.com/m.a.y.a_es/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border-t border-ink/10 py-2 hover:text-blood"
              >
                Instagram <span aria-hidden>↗</span>
              </a>

              <a href="https://open.spotify.com/artist/4Ps4f6CwOBFmSrqiQQKO7q"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border-t border-ink/10 py-2 hover:text-blood"
              >
                Spotify <span aria-hidden>↗</span>
              </a>

              <a href="https://music.youtube.com/channel/UCe0ROKE7s9fwY3u_orDxUDw"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border-t border-ink/10 py-2 hover:text-blood"
              >
                YouTube Music <span aria-hidden>↗</span>
              </a>

              <a href="https://www.linkedin.com/in/maya-es-525728150/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border-t border-ink/10 py-2 hover:text-blood"
              >
                LinkedIn <span aria-hidden>↗</span>
              </a>

              <a href="https://x.com/MayaES3Dfashion"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border-t border-ink/10 py-2 hover:text-blood"
              >
                X (Twitter) <span aria-hidden>↗</span>
              </a>

              <a href="https://www.tiktok.com/@maya.es.films"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border-t border-b border-ink/10 py-2 hover:text-blood"
              >
                TikTok <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </section>

        <PartnersMarquee />

        <footer className="mx-auto flex max-w-[1400px] flex-col-reverse items-center justify-between gap-4 px-6 py-6 text-[11px] uppercase tracking-[0.18em] text-mute md:flex-row md:px-10"></footer>


        <footer className="mx-auto flex max-w-[1400px] flex-col-reverse items-center justify-between gap-4 px-6 py-6 text-[11px] uppercase tracking-[0.18em] text-mute md:flex-row md:px-10">
          <span>{t("Footer.copyright")}</span>
          <div className="flex gap-6">
            <Link href={`/${locale}/impressum`} className="hover:text-bone">
              {t("Footer.imprint")}
            </Link>
            <Link href={`/${locale}/datenschutz`} className="hover:text-bone">
              {t("Footer.privacy")}
            </Link>
          </div>
        </footer>
        <p className="mx-auto max-w-[1400px] px-6 pb-6 text-[10px] normal-case tracking-normal text-mute/70 md:px-10">
          {t("AiLabel.disclaimer")}
        </p>
      </div>
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
      <span className="font-display absolute text-3xl text-blood">ES</span>
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
    <section className="group relative h-screen w-full overflow-hidden bg-ink">
      <video
        ref={introVideoRef}
        src="https://media.mayaesai.com/reel-website-2.mp4"
        autoPlay
        loop
        muted
        playsInline
        draggable={false}
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        onClick={scrollToContent}
        className="absolute inset-0 h-full w-full cursor-pointer object-cover select-none [-webkit-touch-callout:none]"
      />
      <div className="absolute inset-0 bg-black/20" />
      <AiLabel position="top-left" />

      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="font-display text-[16vw] tracking-wide text-bone md:text-[6vw]">
          MAYA ES<span className="text-blood">.</span>
        </h1>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleIntroMute();
        }}
        aria-label={introMuted ? "Unmute video" : "Mute video"}
        className="absolute bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-black/30 text-sm text-bone backdrop-blur-sm transition-colors hover:border-blood md:bottom-8 md:right-10"
      >
        {introMuted ? "🔇" : "🔊"}
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