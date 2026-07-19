"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const NAV_LINKS = ["Work", "About", "Collaboration", "Journal"];

// const CLIENTS = ["MERIDIAN", "GLASHAUS", "FERNWEH", "UNIT9", "OBLIQUE", "STUDIO KLANG"];

const CLIENTS = [
  { name: "MERIDIAN", src: "/logos/logo decentraland.svg" },
  { name: "GLASHAUS", src: "/logos/logo fashion-film-festival-milano.png" },
  { name: "FERNWEH", src: "/logos/logo pop-akademie mannheim.jpg" },
  { name: "UNIT9", src: "/logos/logo-dfwny.jpg" },
  { name: "OBLIQUE", src: "/logos/Logo-Faust-magazine-hopenheart.png" },
  { name: "STUDIO KLANG", src: "/logos/logo-jitrois.png" },
  // Hier können Sie das 7. Logo hinzufügen:
  { name: "LOGO 7", src: "/logos/VNTANA_Logo.jpg" },
];


export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
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

    // beim Entstummen: Intro-Video automatisch stummschalten
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

    // beim Entstummen: Featured-Video automatisch stummschalten
    if (!nextMuted && videoRef.current) {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <main className="bg-ink text-bone">
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
              <a key={link} href="#" className="transition-colors hover:text-bone">
                {link}
              </a>
            ))}
          </nav>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em]"
            aria-expanded={menuOpen}
            aria-label="Open menu"
          >
            Menu
            <span className="text-lg leading-none">{menuOpen ? "×" : "+"}</span>
          </button>
        </header>

        {menuOpen && (
          <nav className="mx-6 mb-6 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm uppercase tracking-[0.18em] text-mute md:hidden">
            {NAV_LINKS.map((link) => (
              <a key={link} href="#" onClick={() => setMenuOpen(false)}>
                {link}
              </a>
            ))}
          </nav>
        )}

        {/* HERO */}
        <section className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 pb-16 md:grid-cols-2 md:items-start md:px-10 md:pb-24">
          <div className="flex flex-col justify-center">
            <h1 className="font-display text-[15vw] leading-[0.85] tracking-tight md:text-[6.2vw]">
              FASHION.
              <br />
              FILM.
              <br />
              MUSIC.
              <br />
              <span className="text-blood">3D ART.</span>
            </h1>

            <p>
              <br />
              <span className="text-2xl font-medium uppercase tracking-[0.8em] text-blood">
                powered by AI
              </span>
            </p>


            <p className="mt-8 max-w-sm text-sm leading-relaxed text-mute">
              I build worlds at the intersection of fashion, film, music, and
              artificial intelligence.
              <br />
              <span className="text-blood">Visionary. Creator. Storyteller.</span>
            </p>

            <a
              href="#work"
              className="mt-8 inline-flex w-fit items-center gap-2 border border-white/25 px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:border-blood hover:text-blood"
            >
              View My Work
              <span aria-hidden>↗</span>
            </a>
          </div>

          <div className="relative flex aspect-[1/2] items-center justify-center overflow-hidden border border-white/10 bg-ink-soft">
            <Image
              src="/Maya Avatar Homepage.jpg"
              alt="Portrait"
              fill
              priority
              className="object-cover border-4 border-white/50 z-10"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
            {/* Diese "Glasscheibe" blockiert den Zugriff auf das Bild darunter */}
            <div className="absolute inset-0 z-10 bgs-transparent" />
            <span className="absolute right-4 top-4 z-10 text-[10px] uppercase tracking-[0.3em] text-mute [writing-mode:vertical-rl]">
              MAYA ES / MILAN / IT
            </span>
          </div>
        </section>

        {/* FEATURED WORK GRID */}
        <section id="work" className="mx-auto grid max-w-[1400px] grid-cols-1 gap-px bg-white/10 md:grid-cols-2">
          {/* AI Film & Music */}
          <div className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden bg-ink p-8">
            <video
              ref={videoRef}
              src="https://media.mayaesai.com/Casino Glam-A.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              onContextMenu={(e) => e.preventDefault()}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="relative z-10 flex items-center gap-4">
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause video" : "Play video"}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-black/30 text-lg backdrop-blur-sm transition-colors hover:border-blood"
              >
                {isPlaying ? "❚❚" : "▶"}
              </button>

              <button
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-black/30 text-sm backdrop-blur-sm transition-colors hover:border-blood"
              >
                {isMuted ? "🔇" : "🔊"}
              </button>

              <span className="text-xs uppercase tracking-[0.2em] text-mute">
                AI Film &amp; Music
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center bg-ink p-8 md:p-14">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-blood">
              Featured Project
            </span>
            <h2 className="font-display mt-4 text-5xl leading-[0.9] md:text-6xl">
              CASINO
              <br />
              GLAM
            </h2>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-mute">
              An AI-generated short film paired with an original soundtrack.
            </p>
            <a
              href="#"
              className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-bone transition-colors hover:text-blood"
            >
              View Project <span aria-hidden>↗</span>
            </a>
          </div>

          {/* 3D Fashion */}
          <div className="flex flex-col justify-center bg-paper p-8 text-ink md:p-14">
            <h2 className="font-display text-4xl leading-[0.9] md:text-5xl">
              3D
              <br />
              FASHION
            </h2>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink/60">
              Digital couture between sculpture, technology, and futuristic
              aesthetics.
            </p>
            <a
              href="#"
              className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:text-blood"
            >
              Explore Projects <span aria-hidden>↗</span>
            </a>
          </div>

          {/* Art & Story */}
          <div className="relative flex min-h-[280px] flex-col justify-center overflow-hidden bg-blood p-8 md:p-14">
            <div className="absolute inset-0 opacity-30">
              <NoiseTexture />
            </div>
            <div className="relative z-10">
              <h2 className="font-display text-4xl leading-[0.9] text-ink md:text-5xl">
                ART &amp;
                <br />
                STORY
              </h2>
              <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink/70">
                Painting, screenwriting, and visual experiments beyond the
                boundaries.
              </p>
              <a
                href="#"
                className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-ink/60"
              >
                Learn More <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* MANIFESTO */}
        <section className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-6 py-20 md:grid-cols-[1fr_1.2fr_auto] md:px-10">
          <div className="text-xs uppercase tracking-[0.2em] text-mute">
            <p>Artist</p>
            <p>Designer</p>
            <p>Filmmaker</p>
            <p>Producer</p>
          </div>

          <div>
            <h2 className="font-display text-4xl leading-[0.95] md:text-6xl">
              I CREATE
              <br />
              <span className="text-blood">THE FUTURE.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-mute">
              My work merges artificial intelligence with human emotion to
              shape new realities. Every project is a journey into the
              unknown.
            </p>
            <a
              href="#"
              className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:text-blood"
            >
              My Journey <span aria-hidden>↗</span>
            </a>
          </div>

          <RotatingBadge />
        </section>

        {/* CONTACT / FOOTER */}
        <section className="mx-auto grid max-w-[1400px] grid-cols-1 gap-px bg-white/10 md:grid-cols-[1.1fr_1fr_1fr]">
          <div className="flex flex-col justify-center bg-blood p-8 text-ink md:p-14">
            <span className="text-xs font-medium uppercase tracking-[0.2em]">
              Collaboration
            </span>
            <h2 className="font-display mt-4 text-4xl leading-[0.95] md:text-5xl">
              LET&apos;S CREATE
              <br />
              SOMETHING GREAT.
            </h2>
            <a
              href="mailto:mayaes2018@gmail.com"
              className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:text-ink/60"
            >
              Get In Touch <span aria-hidden>↗</span>
            </a>
          </div>

          <div className="flex flex-col justify-center bg-ink p-8 md:p-14">
            <span className="text-xs uppercase tracking-[0.2em] text-mute">
              Clients &amp; Partners
            </span>
            <ul className="mt-6 grid grid-cols-2 items-center gap-x-6 gap-y-8 md:grid-cols-3">
              {CLIENTS.map((client) => (
                <li key={client.name} className="relative h-12 w-full max-w-[140px]">
                  <Image
                    src={client.src}
                    alt={`${client.name} Logo`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center gap-6 bg-paper p-8 text-ink md:p-14">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-ink/50">
                Contact
              </span>
              <p className="mt-3 text-sm leading-relaxed">
                mayaes2018@gmail.com
                {/* <br />
                +49 151 53590868
                <br />
                Mannheim, Germany */}
              </p>
            </div>
            <div className="flex flex-col gap-2 text-xs font-medium uppercase tracking-[0.18em]">
              <a
                href="https://www.instagram.com/m.a.y.a_es/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border-t border-ink/10 py-2 hover:text-blood"
              >
                Instagram <span aria-hidden>↗</span>
              </a>

              <a
                href="https://open.spotify.com/artist/4Ps4f6CwOBFmSrqiQQKO7q"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border-t border-ink/10 py-2 hover:text-blood"
              >
                Spotify <span aria-hidden>↗</span>
              </a>

              <a
                href="https://music.youtube.com/channel/UCe0ROKE7s9fwY3u_orDxUDw"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border-t border-ink/10 py-2 hover:text-blood"
              >
                YouTube Music <span aria-hidden>↗</span>
              </a>

              <a
                href="https://www.linkedin.com/in/maya-es-525728150/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border-t border-b border-ink/10 py-2 hover:text-blood"
              >
                LinkedIn <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </section>


        <footer className="mx-auto flex max-w-[1400px] flex-col-reverse items-center justify-between gap-4 px-6 py-6 text-[11px] uppercase tracking-[0.18em] text-mute md:flex-row md:px-10">
          <span>© 2026 MAYA ES. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-bone">
              Imprint
            </a>
            <a href="#" className="hover:text-bone">
              Privacy Policy
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}

/* ---------- Signature generative graphics (no stock imagery) ---------- */

function ShardFigure() {
  return (
    <svg viewBox="0 0 400 500" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="shard-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a3a3c" />
          <stop offset="55%" stopColor="#161617" />
          <stop offset="100%" stopColor="#e11f26" />
        </linearGradient>
      </defs>
      <g fill="url(#shard-grad)" stroke="#0b0b0c" strokeWidth="1">
        <polygon points="200,40 260,140 180,160" />
        <polygon points="260,140 320,220 190,240" />
        <polygon points="180,160 190,240 100,220" />
        <polygon points="190,240 250,340 130,340" />
        <polygon points="100,220 190,240 130,340 60,300" />
        <polygon points="250,340 320,220 190,240" />
        <polygon points="130,340 250,340 210,440 150,440" />
        <polygon points="60,300 130,340 150,440 40,400" />
      </g>
      <circle cx="205" cy="70" r="26" fill="#d9d5cc" />
    </svg>
  );
}

function LiquidTexture() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id="liquid-grad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#2a2a2c" />
          <stop offset="100%" stopColor="#0b0b0c" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#liquid-grad)" />
      {[...Array(9)].map((_, i) => (
        <path
          key={i}
          d={`M${40 + i * 40} 60 C ${30 + i * 40} 180, ${55 + i * 40} 260, ${45 + i * 40} 380`}
          stroke="#e11f26"
          strokeOpacity="0.25"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

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
      <svg viewBox="0 0 200 200" className="h-full w-full animate-[spin_16s_linear_infinite]">
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
          videoEl.play().catch(() => {
            // Browser kann Autoplay blockieren, z.B. wenn der Tab
            // zwischenzeitlich inaktiv war – kein Problem, einfach ignorieren.
          });
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
        onClick={scrollToContent}
        className="absolute inset-0 h-full w-full cursor-pointer object-cover"
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="font-display text-[16vw] tracking-wide text-bone md:text-[6vw]">
          MAYA ES<span className="text-blood">.</span>
        </h1>
      </div>

      {/* Lautstärke-Button oben rechts */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleIntroMute();
        }}
        aria-label={introMuted ? "Unmute video" : "Mute video"}
        className="absolute right-6 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-black/30 text-sm text-bone backdrop-blur-sm transition-colors hover:border-blood md:right-10 md:top-8"
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
