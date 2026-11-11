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

  // Vergangene Termine ausblenden (die Seite ist statisch – so bleibt sie aktuell)
  const heute = new Date(); heute.setHours(0, 0, 0, 0);
  document.querySelectorAll("[data-termine]").forEach((list) => {
    list.querySelectorAll("[data-datum]").forEach((el) => {
      if (new Date(el.dataset.datum.slice(0, 10) + "T23:59:59") < heute) el.remove();
    });
    if (!list.children.length) {
      list.hidden = true;
      document.querySelector("[data-termine-leer]")?.removeAttribute("hidden");
    }
  });

  // Countdown zum nächsten Termin
  const card = document.querySelector("[data-countdown]");
  const out = card?.querySelector("[data-countdown-out]");
  if (card && out) {
    const ziel = new Date(card.dataset.countdown.length > 10 ? card.dataset.countdown : card.dataset.countdown + "T00:00");
    const tick = () => {
      const diff = ziel - new Date();
      if (diff <= 0) { out.textContent = "Heute – wir sehen uns!"; return; }
      const t = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60;
      out.textContent = t > 0 ? `Noch ${t} ${t === 1 ? "Tag" : "Tage"}, ${h} Std.` : `Noch ${h} Std. ${m} Min.`;
    };
    tick();
    setInterval(tick, 30000);
  }
});
