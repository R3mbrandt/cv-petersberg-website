import * as yaml from "js-yaml";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import fs from "node:fs";
import path from "node:path";
import { imageSizeFromFile } from "image-size/fromFile";

/**
 * Eleventy-Konfiguration für die Website des Carnevalverein Petersberg e.V.
 *
 * Inhalte liegen als Markdown (Seiten, Beiträge) und YAML (Termine, Gruppen,
 * Vereinsdaten) unter src/. Normalerweise muss diese Datei nicht angefasst werden.
 */

const TZ = "Europe/Berlin";

/** Zerlegt "2027-01-23" oder "2027-01-23T19:11" ohne Zeitzonen-Überraschungen. */
function parts(value) {
  if (value instanceof Date) {
    return {
      y: value.getUTCFullYear(), m: value.getUTCMonth() + 1, d: value.getUTCDate(),
      hh: value.getUTCHours(), mm: value.getUTCMinutes(), hasTime: false,
    };
  }
  const match = String(value).trim().match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{1,2}):(\d{2}))?/);
  if (!match) throw new Error(`Ungültiges Datum: "${value}" – erwartet wird JJJJ-MM-TT oder JJJJ-MM-TTTHH:MM`);
  const [, y, m, d, hh, mm] = match;
  return { y: +y, m: +m, d: +d, hh: hh ? +hh : 0, mm: mm ? +mm : 0, hasTime: hh !== undefined };
}

const asUTC = (p) => new Date(Date.UTC(p.y, p.m - 1, p.d, p.hh, p.mm));
const pad = (n) => String(n).padStart(2, "0");

export default function (eleventyConfig) {
  // Unterordner-Betrieb (z. B. GitHub Pages unter /cv-petersberg-website/):
  // alle Links und Bilder in HTML werden automatisch angepasst.
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // YAML-Datendateien, alle Werte als Text (Datumsangaben bleiben so wie eingegeben)
  eleventyConfig.addDataExtension("yaml,yml", (contents) =>
    yaml.load(contents, { schema: yaml.JSON_SCHEMA })
  );

  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });
  eleventyConfig.addPassthroughCopy({ "src/assets/img": "assets/img" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/css": "assets/css" });
  eleventyConfig.addPassthroughCopy({ "src/uploads": "uploads" });
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy({ "src/assets/img/favicon.png": "favicon.ico" });
  eleventyConfig.addWatchTarget("src/assets/css/");

  // ---------- Datumsfilter ----------
  eleventyConfig.addFilter("datum", (value, style = "long") => {
    const p = parts(value);
    const opts = {
      long: { weekday: "long", day: "numeric", month: "long", year: "numeric" },
      short: { day: "2-digit", month: "2-digit", year: "numeric" },
      day: { day: "2-digit" },
      month: { month: "short" },
      weekday: { weekday: "short" },
    }[style];
    return new Intl.DateTimeFormat("de-DE", { ...opts, timeZone: "UTC" }).format(asUTC(p)).replace(style === "month" ? "." : /$^/, "");
  });
  eleventyConfig.addFilter("uhrzeit", (value) => {
    const p = parts(value);
    return p.hasTime ? `${pad(p.hh)}:${pad(p.mm)} Uhr` : "";
  });
  eleventyConfig.addFilter("iso", (value) => {
    const p = parts(value);
    return p.hasTime ? `${p.y}-${pad(p.m)}-${pad(p.d)}T${pad(p.hh)}:${pad(p.mm)}` : `${p.y}-${pad(p.m)}-${pad(p.d)}`;
  });
  eleventyConfig.addFilter("rfc822", (value) => new Date(value).toUTCString());
  eleventyConfig.addFilter("icsDatum", (value) => {
    const p = parts(value);
    return p.hasTime
      ? `;TZID=${TZ}:${p.y}${pad(p.m)}${pad(p.d)}T${pad(p.hh)}${pad(p.mm)}00`
      : `;VALUE=DATE:${p.y}${pad(p.m)}${pad(p.d)}`;
  });
  /** Kalender-Ende: ganztägig -> Folgetag; mit Uhrzeit -> Beginn + 3 Stunden */
  eleventyConfig.addFilter("icsEnde", (value) => {
    const p = parts(value);
    if (!p.hasTime) {
      const n = new Date(Date.UTC(p.y, p.m - 1, p.d + 1));
      return `;VALUE=DATE:${n.getUTCFullYear()}${pad(n.getUTCMonth() + 1)}${pad(n.getUTCDate())}`;
    }
    const e = new Date(Date.UTC(p.y, p.m - 1, p.d, p.hh + 3, p.mm));
    return `;TZID=${TZ}:${e.getUTCFullYear()}${pad(e.getUTCMonth() + 1)}${pad(e.getUTCDate())}T${pad(e.getUTCHours())}${pad(e.getUTCMinutes())}00`;
  });
  eleventyConfig.addFilter("icsText", (s = "") =>
    String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n")
  );

  /** Termine sortiert; mit "kommend" nur solche ab heute (Stand: Build). */
  eleventyConfig.addFilter("termineSortiert", (list = [], modus = "alle") => {
    const heute = new Date();
    heute.setUTCHours(0, 0, 0, 0);
    return [...list]
      .filter((t) => modus !== "kommend" || asUTC(parts(t.datum)) >= heute)
      .sort((a, b) => asUTC(parts(a.datum)) - asUTC(parts(b.datum)));
  });

  /** Pfad als Apache-Regex (für .htaccess-Weiterleitungen) */
  eleventyConfig.addFilter("htRegex", (p = "") =>
    String(p).replace(/^\//, "").replace(/\/$/, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  /** Erster Betrag aus einem Eintritts-Text ("20,– €", "5 Euro") -> "20.00"; "frei" -> "0" */
  eleventyConfig.addFilter("preis", (text = "") => {
    const t = String(text).toLowerCase();
    if (/frei|kostenlos/.test(t)) return "0";
    const m = t.match(/(\d+)(?:[,.](\d{1,2}))?/);
    return m ? `${m[1]}.${(m[2] || "0").padEnd(2, "0")}` : "";
  });
  /** Beitrag anhand des Dateinamens (mit oder ohne Datum, ohne .md) finden */
  eleventyConfig.addFilter("beitragNach", (beitraege = [], name = "") => {
    const n = String(name || "").trim().replace(/\.md$/, "").split("/").pop();
    if (!n) return null;
    return beitraege.find((p) => path.basename(p.inputPath, ".md") === n || p.fileSlug === n) || null;
  });
  eleventyConfig.addFilter("ohne", (liste = [], eintrag) => (eintrag ? liste.filter((x) => x !== eintrag) : liste));
  eleventyConfig.addFilter("limit", (arr = [], n) => arr.slice(0, n));
  eleventyConfig.addFilter("jahr", () => new Date().getFullYear());
  eleventyConfig.addFilter("absoluteUrl", (path, base) => new URL(path, base).href);
  eleventyConfig.addFilter("excerpt", (content = "", len = 180) => {
    const text = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return text.length > len ? text.slice(0, text.lastIndexOf(" ", len)) + " …" : text;
  });

  /** Kleines Vorschaubild (WordPress-Variante "-480x…") verwenden, falls vorhanden. */
  const thumbCache = new Map();
  eleventyConfig.addFilter("thumb", (src) => {
    if (!src || !src.startsWith("/uploads/")) return src;
    if (thumbCache.has(src)) return thumbCache.get(src);
    const file = path.join("src", src);
    const dir = path.dirname(file);
    const base = path.basename(file).replace(/-scaled(?=\.\w+$)/, "").replace(/-\d+x\d+(?=\.\w+$)/, "");
    const stem = base.replace(/\.\w+$/, "");
    let result = src;
    try {
      const hit = fs.readdirSync(dir).find((f) => f.startsWith(stem + "-480x"));
      if (hit) result = "/" + path.posix.join(path.relative("src", dir).split(path.sep).join("/"), hit);
    } catch {}
    thumbCache.set(src, result);
    return result;
  });

  /** Breite eines Bildes aus src/uploads in Pixeln (0, falls unbekannt) – z. B. ob sich Vergrößern lohnt */
  const breiten = new Map();
  eleventyConfig.addAsyncFilter("bildBreite", async (src) => {
    if (!src || !src.startsWith("/")) return 0;
    if (!breiten.has(src)) {
      breiten.set(src, imageSizeFromFile(path.join("src", src)).then((d) => d.width || 0).catch(() => 0));
    }
    return breiten.get(src);
  });

  /** "2026-02-10" -> "2026/02/10" (für Beitrags-URLs wie bei WordPress) */
  eleventyConfig.addFilter("datumsPfad", (d) => {
    const p = parts(d);
    return `${p.y}/${pad(p.m)}/${pad(p.d)}`;
  });
  eleventyConfig.addFilter("absaetze", (text = "") =>
    String(text).split(/\n\s*\n/).map((t) => `<p>${t.trim()}</p>`).join("")
  );

  // ---------- Spam-Schutz für E-Mail-Adressen ----------
  // Im fertigen HTML steht keine Adresse im Klartext: mailto-Links und Adressen
  // im Text werden verschlüsselt (umgedreht + Base64) und erst im Browser
  // wieder zusammengesetzt (siehe assets/js/main.js). Ohne JavaScript sieht man
  // "name (at) domain.de".
  const MAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g;
  const verschluesseln = (a) => Buffer.from([...a].reverse().join(""), "utf8").toString("base64");
  const ersatztext = (a) => a.replace("@", " (at) ");
  const textSicher = (html) => html.replace(MAIL, (a) =>
    `<span data-mail-text="${verschluesseln(a)}">${ersatztext(a)}</span>`);
  eleventyConfig.addTransform("mail-schutz", function (content) {
    const out = this.page.outputPath || "";
    if (!out.endsWith(".html") || out.includes("/admin/")) return content;
    // 1. mailto-Links
    content = content.replace(/<a\b([^>]*?)\bhref="mailto:([^"?]+)(\?[^"]*)?"([^>]*)>([\s\S]*?)<\/a>/g,
      (_, vor, adr, query = "", nach, inhalt) =>
        `<a${vor}href="#" data-mail="${verschluesseln(decodeURIComponent(adr))}"` +
        (query ? ` data-mail-q="${query}"` : "") + `${nach}>${inhalt}</a>`);
    // 2. Adressen im sichtbaren Text (nicht in Tags, Skripten, Styles)
    return content.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>)/g)
      .map((teil) => (teil.startsWith("<") ? teil : textSicher(teil)))
      .join("");
  });

  // Bilder in Texten: verzögert laden
  eleventyConfig.addTransform("lazy-images", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    return content.replace(/<img(?![^>]*\bloading=)/g, '<img loading="lazy" decoding="async"');
  });

  // ---------- Sammlungen ----------
  eleventyConfig.addCollection("beitraege", (api) =>
    api.getFilteredByGlob("src/aktuelles/*.md").filter((p) => !p.data.entwurf).reverse()
  );
  eleventyConfig.addCollection("beitragsJahre", (api) => {
    const jahre = new Map();
    for (const p of api.getFilteredByGlob("src/aktuelles/*.md").filter((p) => !p.data.entwurf).reverse()) {
      const j = p.date.getUTCFullYear();
      if (!jahre.has(j)) jahre.set(j, []);
      jahre.get(j).push(p);
    }
    return [...jahre].map(([jahr, beitraege]) => ({ jahr, beitraege }));
  });

  return {
    pathPrefix: process.env.PATH_PREFIX || "/",
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
}
