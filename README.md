# Website Carnevalverein Petersberg e.V.

Moderne, schnelle und leicht pflegbare Vereinswebsite – gebaut mit
[Eleventy](https://www.11ty.dev/) als statische Seite, mit Redaktionssystem im Browser.

## Auf einen Blick

| Was | Wie |
|---|---|
| **Inhalte pflegen** | Im Browser unter `https://cv-petersberg.de/admin/` (Anmeldung mit GitHub-Konto) – oder direkt die Dateien unten bearbeiten |
| **Termine** | `src/_data/termine.yaml` (mit Beginn, Einlass, Eintritt) – „Nächster Termin“ auf der Startseite und alle Listen aktualisieren sich automatisch (auch ohne Neubau direkt im Browser) |
| **Beiträge** | Eine Markdown-Datei pro Beitrag in `src/aktuelles/` |
| **Prinzenpaar / Kampagne** | `src/_data/kampagne.yaml` |
| **Gruppen, Vorstand, Chronik** | `src/_data/gruppen.yaml`, `vorstand.yaml`, `chronik.yaml` |
| **Name, Kontakt, Menü, Farben, Logo** | `src/_data/site.yaml` |
| **Bilder & PDFs** | `src/uploads/` |

## Logo und Vereinsfarben

Das offizielle Vektor-Logo (`src/assets/img/logo-cvp.svg`) und seine Farben (Rot `#c81522`, Gelb `#f9ec9e`, Grün `#217c41`) sind übernommen.
So werden sie geändert:

1. Original-Logo (am besten als SVG, sonst PNG mit transparentem Hintergrund)
   nach `src/assets/img/` kopieren und den Pfad unter `logo:` in `src/_data/site.yaml` eintragen.
   Browser- und App-Symbole liegen als `favicon.png`, `icon-180.png` und `icon-192.png` daneben.
2. In `src/_data/site.yaml` unter `farben:` die drei Farbwerte eintragen
   (`primaer`, `akzent`, `dunkel`). Alle hellen/dunklen Abstufungen, der Dark Mode
   und die Hover-Effekte werden automatisch daraus berechnet.
3. Optional `src/assets/img/og.png` (1200×630, Vorschaubild für WhatsApp/Facebook) ersetzen.

## Lokal starten (für Technik-Verantwortliche)

Voraussetzung: [Node.js](https://nodejs.org/) ab Version 20.

```bash
npm install
npm start        # Vorschau unter http://localhost:8080 mit Live-Reload
npm run build    # fertige Seite im Ordner _site/
```

Der Ordner `_site/` enthält nur HTML/CSS/JS und läuft auf **jedem** Webspace
(kein PHP, keine Datenbank, keine Updates oder Sicherheitslücken eines CMS).

## Veröffentlichen

`.github/workflows/deploy.yml` baut die Seite bei jeder Änderung (auch aus dem
Redaktionssystem) und jede Nacht neu und lädt sie hoch – auf das OVH-Webhosting
(FTP) und/oder auf GitHub Pages.

### Live auf cv-petersberg.de (OVH-Webhosting)

Die neue Seite kommt in einen **eigenen Ordner** auf dem bestehenden Webhosting.
WordPress bleibt unangetastet daneben liegen – das Umschalten ist ein Klick und
jederzeit rückgängig zu machen. DNS und E-Mail werden nicht verändert.

1. **Sicherung:** Im OVH-Kundencenter unter *Web Cloud → Hosting → Datenbanken*
   die WordPress-Datenbank sichern (*Sicherung erstellen*) und per FTP den
   bisherigen Ordner `www/` herunterladen.
2. **Testadresse anlegen:** *Hosting → Multisite → Domain hinzufügen*:
   `neu.cv-petersberg.de`, Wurzelverzeichnis `cvp-neu`, SSL aktivieren.
3. **FTP-Zugang in GitHub hinterlegen:** im Repository unter
   *Settings → Secrets and variables → Actions*
   - Secrets: `FTP_SERVER` (z. B. `ftp.clusterXXX.hosting.ovh.net`, steht im
     OVH-Kundencenter unter *Hosting → FTP-SSH*), `FTP_BENUTZER`, `FTP_PASSWORT`
     – am besten einen eigenen FTP-Benutzer nur für den Ordner `cvp-neu` anlegen
   - Variable: `FTP_ZIELORDNER` = `cvp-neu/`
4. **Upload starten:** *Actions → Website veröffentlichen → Run workflow*.
   Danach unter https://neu.cv-petersberg.de alles prüfen.
5. **Umschalten:** *Hosting → Multisite* bei `cv-petersberg.de` **und**
   `www.cv-petersberg.de` das Wurzelverzeichnis von `www` auf `cvp-neu` ändern.
   Nach wenigen Minuten ist die neue Seite live. *Zurück:* wieder `www` eintragen.
6. **HTTPS erzwingen:** Wenn alles läuft, in `src/htaccess.njk` die drei
   HTTPS-Zeilen aktivieren (Kommentarzeichen `#` entfernen).
7. Nach einigen Wochen ohne Probleme kann WordPress gelöscht werden
   (Ordner `www/` und Datenbank) – das beendet auch dessen Sicherheitsupdates.

Die erzeugte `.htaccess` sorgt für echte 301-Weiterleitungen aller alten
WordPress-Adressen (Liste: `src/_data/weiterleitungen.yaml`), die eigene
Fehlerseite, Browser-Caching und Sicherheits-Header.

### GitHub Pages (Testadresse)

https://r3mbrandt.github.io/cv-petersberg-website/ – einmalig unter
*Settings → Pages → Source* „GitHub Actions“ wählen. Wird GitHub Pages nicht
gebraucht, die Variable `GITHUB_PAGES` = `false` setzen.

### Redaktionssystem einrichten (einmalig)

1. Projekt in ein GitHub-Repository legen.
2. In `src/admin/config.yml` ist das Repository `R3mbrandt/cv-petersberg-website` bereits eingetragen.
3. Redakteurinnen und Redakteure als Mitglieder des Repositorys einladen.
4. Für den Login ohne eigenen Server: unter `/admin/` „Mit Token anmelden“
   (persönlicher GitHub-Token) oder eine OAuth-App einrichten – Anleitung:
   <https://github.com/sveltia/sveltia-cms#authentication>.

Jede Änderung im Redaktionssystem wird als Version gespeichert und lässt sich
jederzeit rückgängig machen.

## Technik & Qualität

- **Responsiv** vom Smartphone bis zum großen Monitor (fluide Schriftgrößen, Container Queries)
- **Dark Mode** automatisch nach Geräteeinstellung
- **Barrierearm**: semantisches HTML, Tastaturbedienung, Skip-Link, sichtbarer Fokus,
  reduzierte Animationen bei entsprechender Systemeinstellung
- **Datenschutzfreundlich**: keine Cookies, kein Tracking, Schriften lokal (kein Google Fonts)
- **Schnell**: ~100 KB Schriften, ein CSS, ein winziges Skript, keine Frameworks im Browser
- **Moderne Web-Features** mit sauberem Fallback: View Transitions zwischen Seiten,
  Scroll-Animationen, `color-mix()` für Farbabstufungen
- **Kalender-Abo** (`/termine.ics`) zum Abonnieren in Handy-Kalendern
- **SEO**: strukturierte Daten für Verein und Veranstaltungen (Google-Eventanzeige),
  Sitemap, RSS-Feed, Social-Media-Vorschaubilder
- **Installierbar** als App auf dem Homescreen (Web-App-Manifest)

## Übernahme von der alten WordPress-Seite

Alle Inhalte von cv-petersberg.de wurden übernommen:

- **29 Beiträge** (2011–2026: Berichte, Prinzenmannschaften, Proklamationen u. a.) inkl. Bilder – unter denselben Adressen wie bisher
  (`/JJJJ/MM/TT/titel/`), damit Google-Treffer und geteilte Links weiter funktionieren
- Vorstand, Festausschuss, Gruppen mit Fotos, Chronik (1948–2008, ergänzt um 2025),
  72 Ex-Prinzenpaare seit 1949, Zahlen & Beiträge, Downloads, Fuldaer Randstaaten
- Alte Seitenadressen (z. B. `/gruppen/green-diamonds/`, `/der-verein/kontakt/`) leiten
  automatisch auf die neuen Seiten weiter – Liste in `src/_data/weiterleitungen.yaml`
- Die Termine der Kampagne 2027 aus der Kalender-App (`/kalender/`) – inklusive Kalenderdateien
  für alle Termine und für jeden einzelnen Termin; `/kalender/` leitet auf `/termine/` weiter
- 119 Einladungs-, Flyer- und Terminbeiträge sowie veraltete Hinweise (alte Bildergalerien,
  Kontaktformular, eingebettetes Video) wurden bewusst nicht übernommen;
  ihre Adressen leiten auf das jeweilige Jahresarchiv weiter
- 23 alte Startseiten-Slider ohne eigenen Inhalt und die Bildergalerien `/bilder/kampagne-…`
  (waren schon auf der alten Seite nicht mehr erreichbar) wurden nicht übernommen;
  ihre Adressen leiten auf das jeweilige Jahresarchiv weiter.

## Offene Punkte (vor dem Livegang prüfen)

Alle Stellen sind im Code mit `TODO` markiert (`grep -rn TODO src`):

- **Impressum:** Vereinsregisternummer (Amtsgericht Fulda) ergänzen
- **Datenschutz:** Hosting-Anbieter und Speicherdauer der Logfiles eintragen; Text rechtlich prüfen
  (die alte Erklärung beschrieb WordPress-Plugins und Cookies, die es nicht mehr gibt)
- **E-Mail-Adressen einrichten** (OVH-Kundencenter → *E-Mails*): `kontakt@`, `einmarsch@` und
  `vorstand@cv-petersberg.de` – auf der Website sind sie bereits eingetragen (`src/_data/site.yaml`)
  und gegen Adress-Sammler geschützt (im HTML verschlüsselt, siehe `eleventy.config.js`)
- Nach der **Prinzenkürung** die neue Prinzenmannschaft in `kampagne.yaml` eintragen und die
  bisherige in `exprinzen.yaml` oben ergänzen
- **Redaktionssystem:** Login einrichten (siehe „Redaktionssystem einrichten“)
