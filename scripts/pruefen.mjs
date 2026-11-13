/**
 * Prüft die fertig gebaute Website in _site/, bevor sie hochgeladen wird.
 * Aufruf: npm test (nach npm run build). Bei Fehlern endet das Skript mit Code 1,
 * dann bricht auch der Upload in GitHub Actions ab.
 *
 * Geprüft wird:
 *  - interne Links und Bilder (href/src/srcset) zeigen auf vorhandene Dateien
 *  - alle Weiterleitungen aus src/_data/weiterleitungen.yaml haben ein gültiges Ziel
 *  - keine E-Mail-Adresse steht im Klartext in einer HTML-Seite (Spam-Schutz)
 *  - die Sitemap enthält keinen Redaktionsbereich und nur vorhandene Seiten
 *  - Kalenderdateien (.ics) nutzen CRLF und Zeilen von höchstens 75 Byte
 */
import fs from "node:fs";
import path from "node:path";
import * as yaml from "js-yaml";

const SITE = "_site";
const PREFIX = ("/" + (process.env.PATH_PREFIX || "").replace(/^\/+|\/+$/g, "") + "/").replace("//", "/");
const fehler = [];
const melden = (datei, text) => fehler.push(`${datei}: ${text}`);

function alleDateien(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? alleDateien(p) : [p];
  });
}
const dateien = alleDateien(SITE);
const vorhanden = new Set(dateien.map((d) => d.slice(SITE.length).split(path.sep).join("/")));

/** Existiert die (ohne Präfix angegebene) Adresse im gebauten Ordner? */
function existiert(adresse) {
  let p = decodeURI(adresse.split("#")[0].split("?")[0]);
  if (p === "" ) return true;
  if (p.endsWith("/")) p += "index.html";
  return vorhanden.has(p) || vorhanden.has(p + "/index.html");
}
/** Wandelt einen Link der Seite in einen Pfad ohne Präfix um (null = extern/ignorieren). */
function intern(url, seite) {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url) || url.startsWith("data:")) return null;
  const basis = "/" + path.posix.dirname(seite.slice(SITE.length).split(path.sep).join("/")).replace(/^\/+/, "") + "/";
  const abs = new URL(url, "https://x" + basis.replace("//", "/")).pathname;
  return abs.startsWith(PREFIX) ? "/" + abs.slice(PREFIX.length) : null;
}

// ---------- HTML-Seiten ----------
const mailMuster = /[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}/gi;
let links = 0;
for (const datei of dateien.filter((d) => d.endsWith(".html") && !d.includes(`${path.sep}admin${path.sep}`))) {
  const html = fs.readFileSync(datei, "utf8");
  const ohneSkripte = html.replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g, "");
  for (const [, , url] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    const p = intern(url.replace(/&amp;/g, "&"), datei);
    if (p === null) continue;
    links++;
    if (!existiert(p)) melden(datei, `Link ins Leere: ${url}`);
  }
  for (const [, set] of html.matchAll(/\bsrcset="([^"]+)"/g)) {
    for (const teil of set.split(",")) {
      const p = intern(teil.trim().split(/\s+/)[0], datei);
      if (p !== null && !existiert(p)) melden(datei, `Bild fehlt: ${teil.trim()}`);
    }
  }
  const sichtbar = ohneSkripte.replace(/<(?:link|meta)\b[^>]*>/g, "");
  for (const [adresse] of sichtbar.matchAll(mailMuster)) {
    if (/\.(png|jpe?g|webp|svg|gif)$/i.test(adresse)) continue; // z. B. bild@2x.png
    melden(datei, `E-Mail-Adresse im Klartext: ${adresse}`);
  }
}

// ---------- Weiterleitungen ----------
const weiterleitungen = yaml.load(fs.readFileSync("src/_data/weiterleitungen.yaml", "utf8"), { schema: yaml.JSON_SCHEMA }) || [];
for (const w of weiterleitungen) {
  if (!w.nach.startsWith("/")) continue;
  if (!existiert(w.nach)) melden("weiterleitungen.yaml", `Ziel fehlt: ${w.von} -> ${w.nach}`);
  if (w.von.replace(/\/$/, "") === w.nach.split("#")[0].replace(/\/$/, "")) melden("weiterleitungen.yaml", `Weiterleitung auf sich selbst: ${w.von}`);
}

// ---------- Sitemap ----------
const sitemap = fs.readFileSync(path.join(SITE, "sitemap.xml"), "utf8");
for (const [, loc] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const p = new URL(loc).pathname;
  const ohne = p.startsWith(PREFIX) ? "/" + p.slice(PREFIX.length) : p;
  if (ohne.startsWith("/admin")) melden("sitemap.xml", `Redaktionsbereich enthalten: ${loc}`);
  else if (!existiert(ohne)) melden("sitemap.xml", `Seite fehlt: ${loc}`);
}

// ---------- Kalenderdateien ----------
const kalender = dateien.filter((d) => d.endsWith(".ics"));
for (const datei of kalender) {
  const text = fs.readFileSync(datei, "utf8");
  if (/[^\r]\n/.test(text)) melden(datei, "Zeilenende ist nicht CRLF");
  if (!text.startsWith("BEGIN:VCALENDAR\r\n") || !text.trimEnd().endsWith("END:VCALENDAR")) melden(datei, "kein vollständiger VCALENDAR");
  text.split("\r\n").forEach((z, i) => {
    if (Buffer.byteLength(z) > 75) melden(datei, `Zeile ${i + 1} länger als 75 Byte`);
  });
  const ereignisse = (text.match(/BEGIN:VEVENT/g) || []).length;
  if ((text.match(/DTSTAMP:/g) || []).length !== ereignisse) melden(datei, "DTSTAMP fehlt in einem Termin");
}

// ---------- Kennzeichendatei für den Upload ----------
if (!vorhanden.has("/.cvp-website")) melden(".cvp-website", "Kennzeichendatei fehlt – Upload würde abbrechen");

const seiten = dateien.filter((d) => d.endsWith(".html")).length;
console.log(`Geprüft: ${seiten} Seiten, ${links} interne Links, ${weiterleitungen.length} Weiterleitungen, ${kalender.length} Kalenderdateien.`);
if (fehler.length) {
  for (const f of fehler.slice(0, 100)) console.error("✗ " + f);
  if (fehler.length > 100) console.error(`… und ${fehler.length - 100} weitere`);
  console.error(`${fehler.length} Fehler gefunden.`);
  process.exit(1);
}
console.log("✓ Alles in Ordnung.");
