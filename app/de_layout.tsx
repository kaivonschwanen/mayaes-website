import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NOX Studio — Mode. Film. Musik. Kunst.",
  description:
    "NOX Studio erschafft Welten an der Schnittstelle von Mode, Film, Musik und künstlicher Intelligenz.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${anton.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
