import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://mayaesai.com";
  return [
    { url: `${base}/de`, lastModified: new Date(), priority: 1 },
    { url: `${base}/en`, lastModified: new Date(), priority: 1 },
    { url: `${base}/de/impressum`, lastModified: new Date() },
    { url: `${base}/en/impressum`, lastModified: new Date() },
    { url: `${base}/de/datenschutz`, lastModified: new Date() },
    { url: `${base}/en/datenschutz`, lastModified: new Date() },
  ];
}
