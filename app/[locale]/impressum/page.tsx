import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: true, follow: true },
};

/**
 * ============================================================
 * WICHTIG — BITTE VOR VERÖFFENTLICHUNG AUSFÜLLEN:
 * Alle [PLATZHALTER] unten mit deinen echten Daten ersetzen.
 * Dies ist eine Vorlage, keine Rechtsberatung — bei Unsicherheit
 * kurz von einem Anwalt / eRecht24 gegenprüfen lassen.
 * ============================================================
 */

const OWNER = {
  fullName: "Maya Schmid", // z.B. "Maya Musterfrau"
  artistName: "Maya ES", // optionaler Künstlername, darf zusätzlich stehen
  street: "Heppenheimer Str. 23",
  zipCity: "68309 Mannheim",
  country: "Deutschland",
  email: "mayaes2018@gmail.com",
  phone: "", // optional, z.B. "+49 (0) 123 4567890" — leer lassen wenn nicht angegeben
  vatId: "", // optional, z.B. "DE123456789" — leer lassen wenn keine USt-ID vorhanden
};

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale === "de") return <ImpressumDE />;
  if (locale === "en") return <ImpressumEN />;
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

function ImpressumDE() {
  return (
    <Shell>
      <h1 className="font-display mb-10 text-4xl leading-[0.95] md:text-5xl">
        Impressum
      </h1>

      <section className="mb-10 space-y-1 text-sm leading-relaxed text-mute">
        <h2 className="mb-3 font-display text-xl text-bone">
          Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)
        </h2>
        <p>
          {OWNER.fullName}
          {OWNER.artistName ? ` (Künstlername: ${OWNER.artistName})` : ""}
        </p>
        <p>{OWNER.street}</p>
        <p>
          {OWNER.zipCity}, {OWNER.country}
        </p>
      </section>

      <section className="mb-10 space-y-1 text-sm leading-relaxed text-mute">
        <h2 className="mb-3 font-display text-xl text-bone">Kontakt</h2>
        <p>
          E-Mail:{" "}
          <a href={`mailto:${OWNER.email}`} className="text-bone hover:text-blood">
            {OWNER.email}
          </a>
        </p>
        {OWNER.phone && <p>Telefon: {OWNER.phone}</p>}
      </section>

      {OWNER.vatId && (
        <section className="mb-10 space-y-1 text-sm leading-relaxed text-mute">
          <h2 className="mb-3 font-display text-xl text-bone">
            Umsatzsteuer-Identifikationsnummer
          </h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:{" "}
            {OWNER.vatId}
          </p>
        </section>
      )}

      <section className="mb-10 space-y-1 text-sm leading-relaxed text-mute">
        <h2 className="mb-3 font-display text-xl text-bone">
          Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
        </h2>
        <p>{OWNER.fullName}</p>
        <p>{OWNER.street}</p>
        <p>
          {OWNER.zipCity}, {OWNER.country}
        </p>
      </section>

      <section className="mb-10 space-y-3 text-sm leading-relaxed text-mute">
        <h2 className="mb-3 font-display text-xl text-bone">
          Haftung für Inhalte
        </h2>
        <p>
          Als Diensteanbieterin bin ich gemäß § 7 Abs. 1 DDG für eigene Inhalte
          auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
          §§ 8 bis 10 DDG bin ich als Diensteanbieterin jedoch nicht
          verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
          überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
          Tätigkeit hinweisen.
        </p>
        <p>
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
          Informationen nach den allgemeinen Gesetzen bleiben hiervon
          unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
          Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
          Bekanntwerden entsprechender Rechtsverletzungen werde ich diese
          Inhalte umgehend entfernen.
        </p>
      </section>

      <section className="mb-10 space-y-3 text-sm leading-relaxed text-mute">
        <h2 className="mb-3 font-display text-xl text-bone">
          Haftung für Links
        </h2>
        <p>
          Mein Angebot enthält Links zu externen Websites Dritter (u. a.
          Instagram, Spotify, YouTube Music, LinkedIn), auf deren Inhalte ich
          keinen Einfluss habe. Deshalb kann ich für diese fremden Inhalte auch
          keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist
          stets der jeweilige Anbieter oder Betreiber der Seiten
          verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
          Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige
          Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
        </p>
        <p>
          Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist ohne
          konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
          Bekanntwerden von Rechtsverletzungen werde ich derartige Links
          umgehend entfernen.
        </p>
      </section>

      <section className="mb-10 space-y-3 text-sm leading-relaxed text-mute">
        <h2 className="mb-3 font-display text-xl text-bone">Urheberrecht</h2>
        <p>
          Die durch mich erstellten Inhalte und Werke auf diesen Seiten
          unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
          Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
          Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung
          von mir als Urheberin bzw. Erstellerin. Downloads und Kopien dieser
          Seite sind nur für den privaten, nicht kommerziellen Gebrauch
          gestattet.
        </p>
        <p>
          Ein Teil der auf dieser Website gezeigten Bilder und Videos wurde mit
          Hilfe von KI-Tools erstellt; entsprechende Hinweise befinden sich
          direkt am jeweiligen Inhalt. Soweit Inhalte auf dieser Seite nicht
          von mir erstellt wurden, werden die Urheberrechte Dritter beachtet.
          Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam
          werden, bitte ich um einen entsprechenden Hinweis per E-Mail. Bei
          Bekanntwerden von Rechtsverletzungen werde ich derartige Inhalte
          umgehend entfernen.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-mute">
        <h2 className="mb-3 font-display text-xl text-bone">
          Streitschlichtung
        </h2>
        <p>
          Die Europäische Kommission hat ihre Plattform zur
          Online-Streitbeilegung (OS-Plattform) zum 20. Juli 2025 eingestellt;
          ein entsprechender Link entfällt daher. Ich bin nicht verpflichtet
          und nicht bereit, an einem Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>
    </Shell>
  );
}

function ImpressumEN() {
  return (
    <Shell>
      <h1 className="font-display mb-10 text-4xl leading-[0.95] md:text-5xl">
        Legal Notice (Imprint)
      </h1>

      <p className="mb-10 text-xs italic text-mute">
        This English version is provided for convenience only. In case of any
        discrepancy, the German version above is legally binding (Section 5
        DDG requires the notice in the operator's own language).
      </p>

      <section className="mb-10 space-y-1 text-sm leading-relaxed text-mute">
        <h2 className="mb-3 font-display text-xl text-bone">
          Information according to Sec. 5 DDG (German Digital Services Act)
        </h2>
        <p>
          {OWNER.fullName}
          {OWNER.artistName ? ` (artist name: ${OWNER.artistName})` : ""}
        </p>
        <p>{OWNER.street}</p>
        <p>
          {OWNER.zipCity}, {OWNER.country}
        </p>
      </section>

      <section className="mb-10 space-y-1 text-sm leading-relaxed text-mute">
        <h2 className="mb-3 font-display text-xl text-bone">Contact</h2>
        <p>
          Email:{" "}
          <a href={`mailto:${OWNER.email}`} className="text-bone hover:text-blood">
            {OWNER.email}
          </a>
        </p>
        {OWNER.phone && <p>Phone: {OWNER.phone}</p>}
      </section>

      {OWNER.vatId && (
        <section className="mb-10 space-y-1 text-sm leading-relaxed text-mute">
          <h2 className="mb-3 font-display text-xl text-bone">VAT ID</h2>
          <p>VAT identification number pursuant to Sec. 27a German VAT Act: {OWNER.vatId}</p>
        </section>
      )}

      <section className="mb-10 space-y-1 text-sm leading-relaxed text-mute">
        <h2 className="mb-3 font-display text-xl text-bone">
          Responsible for content pursuant to Sec. 18 (2) MStV
        </h2>
        <p>{OWNER.fullName}</p>
        <p>{OWNER.street}</p>
        <p>
          {OWNER.zipCity}, {OWNER.country}
        </p>
      </section>

      <section className="mb-10 space-y-3 text-sm leading-relaxed text-mute">
        <h2 className="mb-3 font-display text-xl text-bone">
          Liability for content
        </h2>
        <p>
          As a service provider, I am responsible for my own content on these
          pages according to general laws pursuant to Sec. 7 (1) DDG. However,
          pursuant to Sec. 8 to 10 DDG, I am not obligated to monitor
          transmitted or stored third-party information or to investigate
          circumstances that indicate illegal activity.
        </p>
        <p>
          Obligations to remove or block the use of information under general
          law remain unaffected. However, liability in this regard is only
          possible from the point in time at which a concrete infringement of
          the law becomes known. Upon becoming aware of any such legal
          infringements, I will remove this content immediately.
        </p>
      </section>

      <section className="mb-10 space-y-3 text-sm leading-relaxed text-mute">
        <h2 className="mb-3 font-display text-xl text-bone">
          Liability for links
        </h2>
        <p>
          My website contains links to external third-party websites (incl.
          Instagram, Spotify, YouTube Music, LinkedIn) over whose content I
          have no influence. Therefore, I cannot accept any liability for
          this external content. The respective provider or operator of the
          linked pages is always responsible for their content. The linked
          pages were checked for possible legal violations at the time of
          linking; illegal content was not identifiable at that time.
        </p>
        <p>
          Permanent monitoring of the content of linked pages is unreasonable
          without concrete evidence of a legal violation. Upon becoming aware
          of legal infringements, I will remove such links immediately.
        </p>
      </section>

      <section className="mb-10 space-y-3 text-sm leading-relaxed text-mute">
        <h2 className="mb-3 font-display text-xl text-bone">Copyright</h2>
        <p>
          Content created by me on these pages is subject to German copyright
          law. Reproduction, editing, distribution, and any use outside the
          limits of copyright law require my written consent as the author or
          creator. Downloads and copies of this page are only permitted for
          private, non-commercial use.
        </p>
        <p>
          Some images and videos shown on this website were created using AI
          tools; corresponding notices appear directly on the respective
          content. Insofar as content on this site was not created by me,
          third-party copyrights are respected. If you nevertheless become
          aware of a copyright infringement, please notify me by email. Upon
          becoming aware of legal infringements, I will remove such content
          immediately.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-mute">
        <h2 className="mb-3 font-display text-xl text-bone">
          Dispute resolution
        </h2>
        <p>
          The European Commission discontinued its Online Dispute Resolution
          (ODR) platform on 20 July 2025; a corresponding link is therefore
          omitted. I am not obligated and not willing to participate in
          dispute resolution proceedings before a consumer arbitration board.
        </p>
      </section>
    </Shell>
  );
}
