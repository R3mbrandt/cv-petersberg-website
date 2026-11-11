// Carnevalverein Petersberg – kleines, abhängigkeitsfreies Skript.
// Die Seite funktioniert auch ohne JavaScript; hier gibt es nur Komfort.

document.addEventListener("DOMContentLoaded", () => {
  // Mobiles Menü
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    matchMedia("(min-width: 52.01rem)").addEventListener("change", () => setOpen(false));
  }

  // Schatten am Header beim Scrollen
  const header = document.querySelector("[data-header]");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 8);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---------------------------------------------------------------
  //  Termine im Browser aktuell halten – die Seite ist statisch und wird
  //  nur nachts neu gebaut. Ein Termin gilt bis zum Ende seines Tages.
  // ---------------------------------------------------------------
  const parse = (iso) => new Date(iso.length > 10 ? iso : iso + "T00:00");
  const tagesende = (iso) => { const d = parse(iso); d.setHours(23, 59, 59, 999); return d; };
  const jetzt = () => new Date();

  // Listen: vergangene Termine entfernen, höchstens "data-termine-max" zeigen
  document.querySelectorAll("[data-termine]").forEach((list) => {
    list.querySelectorAll("[data-datum]").forEach((el) => {
      if (tagesende(el.dataset.datum) < jetzt()) el.remove();
    });
    const max = Number(list.dataset.termineMax) || Infinity;
    [...list.children].forEach((el, i) => { el.hidden = i >= max; });
    if (!list.children.length) {
      list.hidden = true;
      list.parentElement.querySelector("[data-termine-leer]")?.removeAttribute("hidden");
    }
  });

  // Karte "Nächster Termin" mit Countdown
  const card = document.querySelector("[data-next-card]");
  const datenEl = document.getElementById("termine-daten");
  if (card && datenEl) {
    let termine = [];
    try { termine = JSON.parse(datenEl.textContent); } catch {}
    const titleEl = card.querySelector("[data-next-title]");
    const dateEl = card.querySelector("[data-next-date]");
    const out = card.querySelector("[data-countdown-out]");
    const tick = () => {
      const t = termine.find((x) => tagesende(x.start) >= jetzt());
      if (!t) { card.hidden = true; return; }
      titleEl.textContent = t.titel;
      dateEl.textContent = t.text;
      const diff = parse(t.start) - jetzt();
      if (diff <= 0) { out.textContent = "Heute – wir sehen uns!"; return; }
      const tage = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60;
      out.textContent = tage > 0 ? `Noch ${tage} ${tage === 1 ? "Tag" : "Tage"}, ${h} Std.` : `Noch ${h} Std. ${m} Min.`;
    };
    tick();
    setInterval(tick, 30000);
  }
});
