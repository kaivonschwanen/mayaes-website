// i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de'],
  defaultLocale: 'en',
  localeDetection: false // Stoppt die automatische Umleitung basierend auf der Browsersprache
});
