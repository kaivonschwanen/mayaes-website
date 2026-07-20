import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  robots: { index: true, follow: true },
};

/**
 * ============================================================
 * WICHTIG — BITTE VOR VERÖFFENTLICHUNG PRÜFEN / ANPASSEN:
 * - [PLATZHALTER] mit deinen echten Daten ersetzen.
 * - Wenn du ein Kontaktformular einbaust: den auskommentierten
 *   Abschnitt "Kontaktformular" aktivieren und anpassen.
 * - Wenn du weitere Tools einbaust (z.B. Google Fonts extern statt
 *   next/font, Embeds, weitere Analytics): jeweils neuen Abschnitt
 *   ergänzen.
 * Dies ist eine Vorlage, keine Rechtsberatung — bei Unsicherheit
 * kurz von einem Anwalt / eRecht24 gegenprüfen lassen.
 * ============================================================
 */

const OWNER = {
  fullName: "Maya Schmid",
  street: "Heppenheimer Str. 23",
  zipCity: "68309 Mannheim",
  country: "Deutschland",
  email: "mayaes2018@gmail.com",
};

const HAS_CONTACT_FORM = false; // auf true setzen, sobald ein Kontaktformular existiert
const HAS_VERCEL_ANALYTICS = false; // auf false setzen, falls (noch) nicht aktiviert

export default async function DatenschutzPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale === "de") return <DatenschutzDE />;
  if (locale === "en") return <DatenschutzEN />;
  notFound();
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-[900px] px-6 py-24 text-bone md:px-10">
      <Link
        href="../"
        className="mb-12 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-mute transition-colors hover:text-blood"
      >
        ← Zurück / Back
      </Link>
      {children}
    </main>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 mt-10 font-display text-xl text-bone first:mt-0">
      {children}
    </h2>
  );
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2 mt-6 font-medium text-bone">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-sm leading-relaxed text-mute">{children}</p>;
}

function DatenschutzDE() {
  return (
    <Shell>
      <h1 className="font-display mb-10 text-4xl leading-[0.95] md:text-5xl">
        Datenschutzerklärung
      </h1>

      <H2>1. Verantwortlicher</H2>
      <P>
        Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
      </P>
      <P>
        {OWNER.fullName}
        <br />
        {OWNER.street}
        <br />
        {OWNER.zipCity}, {OWNER.country}
        <br />
        E-Mail:{" "}
        <a href={`mailto:${OWNER.email}`} className="text-bone hover:text-blood">
          {OWNER.email}
        </a>
      </P>

      <H2>2. Allgemeines zur Datenverarbeitung</H2>
      <P>
        Ich verarbeite personenbezogene Daten der Nutzer dieser Website
        grundsätzlich nur, soweit dies zur Bereitstellung einer
        funktionsfähigen Website sowie meiner Inhalte und Leistungen
        erforderlich ist. Die Verarbeitung personenbezogener Daten erfolgt nur
        mit Einwilligung der Nutzer oder auf einer sonstigen gesetzlichen
        Erlaubnis, insbesondere soweit die Verarbeitung der Daten zur
        Vertragserfüllung, zur Wahrung berechtigter Interessen (Art. 6 Abs. 1
        lit. f DSGVO) oder aus anderen gesetzlich vorgesehenen Gründen
        erforderlich ist.
      </P>

      <H2>3. Hosting und Content Delivery Network (Vercel &amp; Cloudflare)</H2>
      <P>
        Diese Website wird bei der Vercel Inc., 340 S Lemon Ave #4133, Walnut,
        CA 91789, USA gehostet und über das Content Delivery Network von
        Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA
        ausgeliefert.
      </P>
      <P>
        Beim Aufruf dieser Website werden durch Vercel bzw. Cloudflare
        automatisch Informationen in sogenannten Server-Logfiles erfasst, die
        Ihr Browser übermittelt. Dies sind: IP-Adresse, Datum und Uhrzeit der
        Anfrage, Inhalt der Anforderung (konkrete Seite), Zugriffsstatus/HTTP-
        Statuscode, übertragene Datenmenge, Website, von der die Anforderung
        kommt (Referrer-URL), Browser, Betriebssystem und dessen Oberfläche.
      </P>
      <P>
        Die Verarbeitung erfolgt auf Grundlage meines berechtigten Interesses
        an einer technisch fehlerfreien Darstellung und der Optimierung meiner
        Website (Art. 6 Abs. 1 lit. f DSGVO). Mit beiden Anbietern besteht ein
        Vertrag zur Auftragsverarbeitung gemäß Art. 28 DSGVO. Da es sich bei
        Vercel und Cloudflare um US-amerikanische Unternehmen handelt, kann es
        zu einer Übermittlung personenbezogener Daten in die USA (ein
        Drittland ohne EU-Angemessenheitsbeschluss im vollen Umfang) kommen.
        Diese Übermittlung stützt sich auf EU-Standardvertragsklauseln gemäß
        Art. 46 Abs. 2 lit. c DSGVO sowie, soweit zertifiziert, auf das EU-US
        Data Privacy Framework.
      </P>

      <H2>4. Cookies</H2>
      <P>
        Diese Website selbst setzt keine eigenen Marketing-, Analyse- oder
        Werbe-Cookies. Es können technisch unbedingt erforderliche,
        kurzlebige Cookies bzw. vergleichbare Technologien der
        Hosting-Infrastruktur zum Einsatz kommen, die für den Betrieb der
        Website notwendig sind; hierfür ist nach § 25 Abs. 2 Nr. 2 TTDSG keine
        Einwilligung erforderlich.
      </P>

      {HAS_VERCEL_ANALYTICS && (
        <>
          <H2>5. Reichweitenmessung mit Vercel Web Analytics</H2>
          <P>
            Ich nutze den Dienst „Vercel Web Analytics" der Vercel Inc. zur
            statistischen Auswertung der Nutzung dieser Website. Vercel Web
            Analytics arbeitet ohne Cookies und ohne sonstige
            Speichertechnologien auf Ihrem Endgerät. Zur Unterscheidung von
            Besuchssitzungen wird serverseitig ein Hash-Wert aus IP-Adresse
            und User-Agent gebildet, der nicht dauerhaft gespeichert und
            spätestens nach 24 Stunden automatisch verworfen wird. Es werden
            ausschließlich aggregierte Daten erfasst (z. B. aufgerufene Seite,
            ungefähre Region, Gerätetyp, Referrer), die keine Identifizierung
            einzelner Personen ermöglichen und nicht zur Nachverfolgung über
            verschiedene Websites hinweg genutzt werden.
          </P>
          <P>
            Rechtsgrundlage ist mein berechtigtes Interesse an der
            anonymisierten, datenschutzfreundlichen Analyse des Nutzungsverhaltens
            zur Verbesserung meines Angebots (Art. 6 Abs. 1 lit. f DSGVO). Da
            keine Cookies oder vergleichbare Technologien im Sinne des § 25
            TTDSG eingesetzt werden, ist keine gesonderte Einwilligung
            erforderlich. Weitere Informationen:{" "}
            <a
              href="https://vercel.com/docs/analytics/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone underline hover:text-blood"
            >
              vercel.com/docs/analytics/privacy-policy
            </a>
            .
          </P>
        </>
      )}

      <H2>{HAS_VERCEL_ANALYTICS ? "6" : "5"}. Kontaktaufnahme per E-Mail</H2>
      <P>
        Wenn Sie mich per E-Mail kontaktieren, werden Ihre Angaben (E-Mail-
        Adresse, ggf. Name und Nachricht) von mir zum Zwecke der Bearbeitung
        Ihrer Anfrage gespeichert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f
        DSGVO (berechtigtes Interesse an der Beantwortung Ihrer Anfrage) bzw.
        Art. 6 Abs. 1 lit. b DSGVO, sofern die Anfrage der Anbahnung eines
        Vertrags dient. Die Daten werden gelöscht, sobald sie für die
        Erreichung des Zweckes ihrer Erhebung nicht mehr erforderlich sind und
        keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
      </P>

      {HAS_CONTACT_FORM && (
        <>
          <H2>{HAS_VERCEL_ANALYTICS ? "7" : "6"}. Kontaktformular</H2>
          <P>
            [Anzupassen, sobald ein Kontaktformular aktiv ist:] Bei Nutzung des
            Kontaktformulars werden die von Ihnen eingegebenen Daten (z. B.
            Name, E-Mail-Adresse, Nachricht) sowie die zum Zeitpunkt der
            Übermittlung erfassten Daten (Zeitpunkt) zum Zwecke der
            Bearbeitung Ihrer Anfrage verarbeitet. Rechtsgrundlage ist Art. 6
            Abs. 1 lit. b bzw. lit. f DSGVO. Eine Weitergabe an Dritte erfolgt
            nicht. [Falls ein externer Formular-Dienst genutzt wird (z. B.
            Formspree, Resend o. ä.), hier Name, Sitz und Verweis auf dessen
            Datenschutzerklärung ergänzen.]
          </P>
        </>
      )}

      <H2>
        {HAS_VERCEL_ANALYTICS ? (HAS_CONTACT_FORM ? "8" : "7") : (HAS_CONTACT_FORM ? "7" : "6")}. Externe Links zu sozialen Netzwerken
      </H2>
      <P>
        Diese Website enthält Links zu meinen Profilen bei Instagram, Spotify,
        YouTube Music, LinkedIn, X (Twitter) und TikTok. Es handelt sich um reine Verlinkungen
        (kein eingebettetes Plug-in), sodass beim Aufruf dieser Website
        keinerlei Daten an diese Anbieter übertragen werden. Erst wenn Sie
        aktiv auf einen dieser Links klicken und die jeweilige Plattform
        besuchen, gelten die Datenschutzbestimmungen des jeweiligen Anbieters,
        auf die ich keinen Einfluss habe.
      </P>

      <H2>
        {HAS_VERCEL_ANALYTICS ? (HAS_CONTACT_FORM ? "9" : "8") : (HAS_CONTACT_FORM ? "8" : "7")}. SSL-/TLS-Verschlüsselung
      </H2>
      <P>
        Diese Website nutzt aus Sicherheitsgründen eine SSL-/TLS-Verschlüsselung
        zum Schutz der Übertragung vertraulicher Inhalte. Eine verschlüsselte
        Verbindung erkennen Sie am „https://" und dem Schloss-Symbol in Ihrer
        Browserzeile.
      </P>

      <H2>
        {HAS_VERCEL_ANALYTICS ? (HAS_CONTACT_FORM ? "10" : "9") : (HAS_CONTACT_FORM ? "9" : "8")}. Ihre Rechte als betroffene Person
      </H2>
      <P>Sie haben jederzeit das Recht:</P>
      <ul className="mb-3 ml-5 list-disc space-y-1 text-sm leading-relaxed text-mute">
        <li>gemäß Art. 15 DSGVO Auskunft über Ihre von mir verarbeiteten personenbezogenen Daten zu verlangen,</li>
        <li>gemäß Art. 16 DSGVO die Berichtigung unrichtiger Daten zu verlangen,</li>
        <li>gemäß Art. 17 DSGVO die Löschung Ihrer Daten zu verlangen,</li>
        <li>gemäß Art. 18 DSGVO die Einschränkung der Verarbeitung zu verlangen,</li>
        <li>gemäß Art. 20 DSGVO Ihre Daten in einem gängigen, maschinenlesbaren Format zu erhalten,</li>
        <li>gemäß Art. 21 DSGVO der Verarbeitung Ihrer Daten zu widersprechen,</li>
        <li>sich gemäß Art. 77 DSGVO bei einer Datenschutz-Aufsichtsbehörde zu beschweren.</li>
      </ul>
      <P>
        Die für mich zuständige Datenschutz-Aufsichtsbehörde richtet sich nach
        meinem Wohnsitz-Bundesland. Eine Übersicht aller deutschen
        Landesdatenschutzbehörden finden Sie bei der Datenschutzkonferenz
        (DSK):{" "}
        <a
          href="https://www.datenschutzkonferenz-online.de/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-bone underline hover:text-blood"
        >
          datenschutzkonferenz-online.de
        </a>
        .
      </P>

      <H2>
        {HAS_VERCEL_ANALYTICS ? (HAS_CONTACT_FORM ? "11" : "10") : (HAS_CONTACT_FORM ? "10" : "9")}. Aktualität und Änderung dieser Datenschutzerklärung
      </H2>
      <P>
        Diese Datenschutzerklärung ist aktuell gültig (Stand: Juli 2026). Durch
        die Weiterentwicklung meiner Website oder geänderte gesetzliche
        Vorgaben kann es notwendig werden, diese Erklärung anzupassen.
      </P>
    </Shell>
  );
}

function DatenschutzEN() {
  return (
    <Shell>
      <h1 className="font-display mb-10 text-4xl leading-[0.95] md:text-5xl">
        Privacy Policy
      </h1>

      <p className="mb-10 text-xs italic text-mute">
        This English version is provided for convenience only. In case of any
        discrepancy, the German version is legally binding.
      </p>

      <H2>1. Controller</H2>
      <P>The controller responsible for data processing on this website is:</P>
      <P>
        {OWNER.fullName}
        <br />
        {OWNER.street}
        <br />
        {OWNER.zipCity}, {OWNER.country}
        <br />
        Email:{" "}
        <a href={`mailto:${OWNER.email}`} className="text-bone hover:text-blood">
          {OWNER.email}
        </a>
      </P>

      <H2>2. General information on data processing</H2>
      <P>
        I only process personal data of users of this website to the extent
        necessary to provide a functional website and my content and
        services. Processing takes place only with the user's consent or on
        another legal basis, in particular where processing is necessary for
        contract performance, to safeguard legitimate interests (Art. 6(1)(f)
        GDPR), or for other legally permitted reasons.
      </P>

      <H2>3. Hosting and Content Delivery Network (Vercel &amp; Cloudflare)</H2>
      <P>
        This website is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut,
        CA 91789, USA, and delivered via the content delivery network of
        Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA.
      </P>
      <P>
        When you visit this website, Vercel and/or Cloudflare automatically
        collect information in so-called server log files that your browser
        transmits: IP address, date and time of the request, requested page,
        access status/HTTP status code, amount of data transferred, referring
        website, browser, operating system and its interface.
      </P>
      <P>
        Processing is based on my legitimate interest in the technically
        error-free presentation and optimization of my website (Art. 6(1)(f)
        GDPR). Data processing agreements pursuant to Art. 28 GDPR are in
        place with both providers. As Vercel and Cloudflare are U.S.
        companies, personal data may be transferred to the USA (a third
        country without a full EU adequacy decision). This transfer relies on
        the EU Standard Contractual Clauses pursuant to Art. 46(2)(c) GDPR
        and, where certified, the EU-U.S. Data Privacy Framework.
      </P>

      <H2>4. Cookies</H2>
      <P>
        This website itself does not set any marketing, analytics, or
        advertising cookies. Strictly necessary, short-lived cookies or
        comparable technologies from the hosting infrastructure may be used
        where required for the website to function; under Sec. 25(2) No. 2
        TTDSG, no consent is required for these.
      </P>

      {HAS_VERCEL_ANALYTICS && (
        <>
          <H2>5. Traffic analysis with Vercel Web Analytics</H2>
          <P>
            I use "Vercel Web Analytics" provided by Vercel Inc. to
            statistically evaluate usage of this website. Vercel Web
            Analytics operates without cookies or any other storage
            technology on your device. To distinguish visitor sessions, a
            hash value is generated server-side from your IP address and
            user agent; it is not permanently stored and is automatically
            discarded after 24 hours at the latest. Only aggregated data is
            collected (e.g. page visited, approximate region, device type,
            referrer) that does not allow identification of individuals and
            is not used for cross-site tracking.
          </P>
          <P>
            The legal basis is my legitimate interest in privacy-friendly,
            anonymized analysis of usage behavior to improve my offering
            (Art. 6(1)(f) GDPR). As no cookies or comparable technologies
            within the meaning of Sec. 25 TTDSG are used, no separate consent
            is required. More information:{" "}
            <a
              href="https://vercel.com/docs/analytics/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone underline hover:text-blood"
            >
              vercel.com/docs/analytics/privacy-policy
            </a>
            .
          </P>
        </>
      )}

      <H2>{HAS_VERCEL_ANALYTICS ? "6" : "5"}. Contact by email</H2>
      <P>
        If you contact me by email, your details (email address, and, where
        applicable, name and message) will be stored by me for the purpose of
        processing your inquiry. The legal basis is Art. 6(1)(f) GDPR
        (legitimate interest in responding to your inquiry) or Art. 6(1)(b)
        GDPR where the inquiry serves to initiate a contract. Data will be
        deleted once it is no longer required for the purpose for which it
        was collected, unless statutory retention obligations apply.
      </P>

      {HAS_CONTACT_FORM && (
        <>
          <H2>{HAS_VERCEL_ANALYTICS ? "7" : "6"}. Contact form</H2>
          <P>
            [To be adjusted once a contact form is active:] When using the
            contact form, the data you enter (e.g. name, email address,
            message) as well as the time of submission will be processed for
            the purpose of handling your inquiry. Legal basis: Art. 6(1)(b) or
            (f) GDPR. Data is not shared with third parties. [If an external
            form service is used (e.g. Formspree, Resend, etc.), add its name,
            location, and a reference to its privacy policy here.]
          </P>
        </>
      )}

      <H2>
        {HAS_VERCEL_ANALYTICS ? (HAS_CONTACT_FORM ? "8" : "7") : (HAS_CONTACT_FORM ? "7" : "6")}. External links to social networks
      </H2>
      <P>
        This website contains links to my profiles on Instagram, Spotify,
        YouTube Music, LinkedIn, X (Twitter) and TikTok. These are plain hyperlinks (not embedded
        plug-ins), so no data is transmitted to these providers when you
        visit this website. Only if you actively click one of these links and
        visit the respective platform do that platform's own privacy terms
        apply, over which I have no control.
      </P>

      <H2>
        {HAS_VERCEL_ANALYTICS ? (HAS_CONTACT_FORM ? "9" : "8") : (HAS_CONTACT_FORM ? "8" : "7")}. SSL/TLS encryption
      </H2>
      <P>
        For security reasons, this website uses SSL/TLS encryption to protect
        the transmission of confidential content. You can recognize an
        encrypted connection by the "https://" prefix and the lock icon in
        your browser's address bar.
      </P>

      <H2>
        {HAS_VERCEL_ANALYTICS ? (HAS_CONTACT_FORM ? "10" : "9") : (HAS_CONTACT_FORM ? "9" : "8")}. Your rights as a data subject
      </H2>
      <P>You have the right at any time to:</P>
      <ul className="mb-3 ml-5 list-disc space-y-1 text-sm leading-relaxed text-mute">
        <li>request information about your personal data processed by me pursuant to Art. 15 GDPR,</li>
        <li>request rectification of inaccurate data pursuant to Art. 16 GDPR,</li>
        <li>request erasure of your data pursuant to Art. 17 GDPR,</li>
        <li>request restriction of processing pursuant to Art. 18 GDPR,</li>
        <li>receive your data in a common, machine-readable format pursuant to Art. 20 GDPR,</li>
        <li>object to the processing of your data pursuant to Art. 21 GDPR,</li>
        <li>lodge a complaint with a data protection supervisory authority pursuant to Art. 77 GDPR.</li>
      </ul>
      <P>
        The competent supervisory authority depends on my state of residence
        in Germany. An overview of all German state data protection
        authorities is available from the Datenschutzkonferenz (DSK):{" "}
        <a
          href="https://www.datenschutzkonferenz-online.de/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-bone underline hover:text-blood"
        >
          datenschutzkonferenz-online.de
        </a>
        .
      </P>

      <H2>
        {HAS_VERCEL_ANALYTICS ? (HAS_CONTACT_FORM ? "11" : "10") : (HAS_CONTACT_FORM ? "10" : "9")}. Currency and amendment of this privacy policy
      </H2>
      <P>
        This privacy policy is currently valid (as of July 2026). As my
        website evolves or legal requirements change, it may become necessary
        to amend this policy.
      </P>
    </Shell>
  );
}
