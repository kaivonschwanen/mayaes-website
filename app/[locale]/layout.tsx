import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { Anton, Inter, Special_Elite } from "next/font/google";
import "../globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const specialElite = Special_Elite({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-stamp",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = "Maya ES | AI Fashion Film & Music Artist";
  const description =
    locale === "de"
      ? "Maya ES – KI-gestützte Fashion Films, Musik und 3D-Kunst. Portfolio, Kollaborationen und Projekte."
      : "Maya ES – AI-powered fashion film, music, and 3D art. Portfolio, collaborations, and projects.";

  return {
    title,
    description,
    metadataBase: new URL("https://mayaesai.com"), // ← deine echte Domain eintragen
    alternates: {
      canonical: `/${locale}`,
      languages: {
        de: "/de",
        en: "/en",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://mayaesai.com/${locale}`,
      siteName: "Maya ES",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }], // Bild noch erstellen
      locale: locale === "de" ? "de_DE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${anton.variable} ${inter.variable} ${specialElite.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
