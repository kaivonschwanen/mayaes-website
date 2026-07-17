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
  title: "MAYA ES — Fashion. Film. Music. Art.",
  description:
    "MAYA ES builds worlds at the intersection of fashion, film, music, and artificial intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
