"use client";

/**
 * hooks/useHls.ts
 *
 * Haengt einen HLS-Stream an ein <video>-Element.
 *
 * WICHTIG zur Reihenfolge: Erst wird hls.js versucht, danach erst die native
 * Wiedergabe. Andersherum geht es schief, weil Chrome auf die Frage
 * canPlayType("application/vnd.apple.mpegurl") teilweise mit "maybe"
 * antwortet, HLS dann aber doch nicht abspielen kann -- und zwar lautlos.
 * Safari und iOS landen weiterhin im nativen Zweig, dort ist Hls.isSupported()
 * false, weil kein MSE zur Verfuegung steht.
 *
 * Alles andere am <video> bleibt unveraendert: poster, loop, muted,
 * playsInline und eigene Play/Pause-Logik funktionieren weiter.
 */

import { useEffect } from "react";

type Options = {
  /**
   * Startstufe der Qualitaet.
   *  -1 = hls.js schaetzt selbst
   *   0 = unterste Stufe -> schnellstmoegliches erstes Bild.
   *       Fuer das Intro sinnvoll: Die Automatik zieht binnen ein, zwei
   *       Sekunden nach oben, aber der Start ist sofort da.
   */
  startLevel?: number;
  /**
   * true  = nie mehr Aufloesung holen, als das Element darstellen kann.
   *         Bei kleinen Kacheln viel wert.
   * false = fuer bildschirmfuellende Videos, dort soll die volle Stufe
   *         erreichbar bleiben.
   */
  capToPlayerSize?: boolean;
  /** Sekunden Vorpufferung. */
  maxBufferLength?: number;
  /**
   * true = hls.js schreibt seine internen Meldungen in die Konsole.
   * Nur zur Fehlersuche einschalten, danach wieder entfernen.
   */
  debug?: boolean;
};

export function useHls(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  src: string,
  options: Options = {},
) {
  const {
    startLevel = -1,
    capToPlayerSize = true,
    maxBufferLength = 15,
    debug = false,
  } = options;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let destroy = () => { };

    import("hls.js")
      .then(({ default: Hls }) => {
        if (cancelled) return;

        /* Safari / iOS: kein MSE, dafuer native HLS-Wiedergabe. */
        if (!Hls.isSupported()) {
          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
          } else {
            console.error("[useHls] Browser kann kein HLS abspielen.");
          }
          return;
        }

        const hls = new Hls({
          debug,
          startLevel,
          capLevelToPlayerSize: capToPlayerSize,
          maxBufferLength,
        });

        /* Ohne diesen Handler bleibt es bei Netzwerk- oder CORS-Problemen
           vollkommen still -- hls.js wirft keine Ausnahmen, sondern meldet
           ueber Events. */
        hls.on(Hls.Events.ERROR, (_evt, data) => {
          if (!data.fatal) return;
          console.error("[useHls]", data.type, data.details);

          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();          // Verbindung war kurz weg
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();  // Dekoder neu aufsetzen
          } else {
            hls.destroy();
          }
        });

        hls.loadSource(src);
        hls.attachMedia(video);
        destroy = () => hls.destroy();
      })
      .catch((err) => {
        console.error("[useHls] hls.js konnte nicht geladen werden:", err);
      });

    return () => {
      cancelled = true;
      destroy();
    };
  }, [src, videoRef, startLevel, capToPlayerSize, maxBufferLength, debug]);
}