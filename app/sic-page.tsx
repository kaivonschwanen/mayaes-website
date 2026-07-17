export default function Home() {
  return (
    <main>
      <Navigation />

      <section id="hero">
        <h1>Dein Name</h1>
        <p>
          Kreative Lösungen für moderne digitale Projekte.
        </p>
        <button>Kontakt aufnehmen</button>
      </section>

      <section id="leistungen">
        <h2>Leistungen</h2>
        <p>
          Platzhalter für deine Dienstleistungen.
        </p>
      </section>

      <section id="ueber-mich">
        <h2>Über mich</h2>
        <p>
          Platzhalter für deine persönliche Vorstellung.
        </p>
      </section>

      <section id="projekte">
        <h2>Projekte</h2>
        <p>
          Hier werden später deine Projekte präsentiert.
        </p>
      </section>

      <section id="kontakt">
        <h2>Kontakt</h2>
        <p>
          Kontaktinformationen kommen hier hin.
        </p>
      </section>

      <Footer />
    </main>
  );
}


function Navigation() {
  return (
    <nav>
      <h2>Portfolio</h2>

      <ul>
        <li><a href="#hero">Start</a></li>
        <li><a href="#leistungen">Leistungen</a></li>
        <li><a href="#ueber-mich">Über mich</a></li>
        <li><a href="#projekte">Projekte</a></li>
        <li><a href="#kontakt">Kontakt</a></li>
      </ul>
    </nav>
  );
}


function Footer() {
  return (
    <footer>
      <p>
        © 2026 Dein Name
      </p>
    </footer>
  );
}