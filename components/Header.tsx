"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Jeder Link hat jetzt ein eigenes Ziel statt alle pauschal auf
  // /coming-soon zu schicken. "about" zeigt auf die neue About-Seite,
  // der Rest bleibt vorerst wie bisher.
  const NAV_LINKS = [
    { key: "work", label: t("Nav.work"), href: `/${locale}/3d-animation` },
    { key: "collaboration", label: t("Nav.collaboration"), href: `/${locale}/ai-filmmaking` },
    { key: "journal", label: t("Nav.journal"), href: `/${locale}/feat-collab` },
    { key: "about", label: t("Nav.about"), href: `/${locale}/about` },
  ];

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 will-change-[background-color,backdrop-filter]",
        "transition-[padding,background-color,backdrop-filter,border-color] duration-500 ease-out",
        scrolled
          ? "border-b border-white/10 bg-ink/70 py-3 backdrop-blur-md md:py-4"
          : "border-b border-transparent bg-transparent py-6 md:py-7",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-10">
        <a href="#" className="font-arima text-2xl tracking-wide">
          MAYA ES<span className="text-blood">.</span>
        </a>

        <nav className="hidden items-center gap-10 text-base font-medium uppercase tracking-[0.18em] text-mute md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="transition-colors hover:text-bone"
            >
              {link.label}
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
      </div>

      {menuOpen && (
        <nav className="mx-6 mb-6 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm uppercase tracking-[0.18em] text-mute md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
