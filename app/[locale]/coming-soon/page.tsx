import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon",
  robots: { index: false, follow: true }, // nicht indexieren, solange leer
};

export default async function ComingSoonPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale === "de") return <ComingSoonDE locale={locale} />;
  if (locale === "en") return <ComingSoonEN locale={locale} />;
  notFound();
}

function Shell({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center text-bone">
      <span className="font-display text-2xl tracking-wide">
        MAYA ES<span className="text-blood">.</span>
      </span>

      <div className="mt-10">{children}</div>

      <Link
        href={`/${locale}`}
        className="mt-12 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-mute transition-colors hover:text-blood"
      >
        ← {locale === "de" ? "Zurück zur Startseite" : "Back to homepage"}
      </Link>
    </main>
  );
}

function ComingSoonDE({ locale }: { locale: string }) {
  return (
    <Shell locale={locale}>
      <h1 className="font-display text-4xl leading-[0.95] md:text-6xl">
        Diese Seite <span className="text-blood">entsteht</span>
        <br />
        gerade.
      </h1>
      <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-mute">
        Ich arbeite an diesem Bereich meiner Website. Schau bald wieder vorbei
        – oder folge mir in den sozialen Medien für Updates.
      </p>
    </Shell>
  );
}

function ComingSoonEN({ locale }: { locale: string }) {
  return (
    <Shell locale={locale}>
      <h1 className="font-display text-4xl leading-[0.95] md:text-6xl">
        This page is <span className="text-blood">under</span>
        <br />
        construction.
      </h1>
      <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-mute">
        I'm currently working on this part of my website. Check back soon –
        or follow me on Social Media for updates.
      </p>
    </Shell>
  );
}
