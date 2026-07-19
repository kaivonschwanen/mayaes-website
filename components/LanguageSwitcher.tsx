"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchTo = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em]">
      <button
        onClick={() => switchTo("de")}
        className={locale === "de" ? "text-blood" : "text-mute hover:text-bone"}
      >
        DE
      </button>
      <span className="text-mute">/</span>
      <button
        onClick={() => switchTo("en")}
        className={locale === "en" ? "text-blood" : "text-mute hover:text-bone"}
      >
        EN
      </button>
    </div>
  );
}