import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

// Versionskennung für CSS/JS: ändert sich nur, wenn sich deren Inhalt ändert
// (Browser laden die Dateien dann neu, sonst bleibt der Zwischenspeicher gültig).
const hash = createHash("sha256");
for (const datei of ["src/assets/css/main.css", "src/assets/js/main.js"]) hash.update(readFileSync(datei));

export default {
  version: hash.digest("hex").slice(0, 10),
  // Zeitstempel des Builds, z. B. für DTSTAMP in Kalenderdateien
  zeitstempel: new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z"),
};
