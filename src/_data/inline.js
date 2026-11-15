import crypto from "node:crypto";
import fs from "node:fs";
import * as yaml from "js-yaml";

/**
 * Die beiden kleinen Inline-Blöcke im <head> (layouts/base.njk) und ihre
 * SHA-256-Prüfsummen für die Content-Security-Policy in der .htaccess.
 * Ändert sich der Inhalt, passen sich die Prüfsummen beim Bauen automatisch an.
 */
const site = yaml.load(fs.readFileSync("src/_data/site.yaml", "utf8"), { schema: yaml.JSON_SCHEMA });
const f = site.farben;

const skript =
  'document.documentElement.classList.add("js");' +
  // Standard ist hell; gewähltes dunkles Design sofort anwenden – nur lokaler Speicher im Browser
  'try{var d=localStorage.getItem("cvp-design");if(d==="light"||d==="dark")document.documentElement.dataset.theme=d}catch(e){}';
const stil = `:root{--cv-primaer:${f.primaer};--cv-akzent:${f.akzent};--cv-gruen:${f.gruen};--cv-dunkel:${f.dunkel}}`;

const hash = (s) => "'sha256-" + crypto.createHash("sha256").update(s, "utf8").digest("base64") + "'";

export default { skript, stil, skriptHash: hash(skript), stilHash: hash(stil) };
