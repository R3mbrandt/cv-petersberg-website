---
layout: layouts/page.njk
title: Kontakt
description: Schreib uns – je nach Anliegen an die passende Adresse, dann landet deine Nachricht direkt bei den Richtigen.
---
<div class="contact-cards contact-cards--wege">
  <div class="contact-card">
    <span class="contact-label">Allgemeine Anfragen</span>
    <strong><a href="mailto:{{ site.kontakt.email }}">{{ site.kontakt.email }}</a></strong>
    <span class="contact-desc">Fragen zum Verein, zu Veranstaltungen, Training oder Mitmachen – oder einfach deine Meinung.</span>
  </div>
  <div class="contact-card">
    <span class="contact-label">Auftritte &amp; Einmärsche</span>
    <strong><a href="mailto:{{ site.kontakt.einmarsch }}">{{ site.kontakt.einmarsch }}</a></strong>
    <span class="contact-desc">Einladungen an unsere Garden, das Prinzenpaar oder den CVP – und Auftrittswünsche bei unseren Veranstaltungen.</span>
  </div>
  <div class="contact-card">
    <span class="contact-label">Vorstand</span>
    <strong><a href="mailto:{{ site.kontakt.vorstand }}">{{ site.kontakt.vorstand }}</a></strong>
    <span class="contact-desc">Mitgliedschaft, Kündigung, Änderung von Adresse oder Bankverbindung und alles Vertrauliche.</span>
  </div>
</div>

<h2 id="auftritte">Auftritts- und Einmarschanfragen</h2>

Möchtet ihr mit eurem Verein, eurer Büttenrede oder einem sonstigen carnevalistischen Beitrag einen Auftritt bei einer unserer Veranstaltungen machen? Wollt ihr den CVP oder eine Tanzgruppe des CVP zu einer eurer Veranstaltungen einladen?

Schreibt uns mit Datum, Ort, Verein/Gruppe und eurem Wunsch:

<p><a class="btn" href="mailto:{{ site.kontakt.einmarsch }}?subject=Auftritts-%20%2F%20Einmarschanfrage&body=Verein%20%2F%20Gruppe%3A%0D%0ADatum%20und%20Uhrzeit%3A%0D%0AOrt%3A%0D%0AGew%C3%BCnschte%20Gruppe%3A%0D%0AAnsprechpartner%20und%20Telefon%3A%0D%0A">Anfrage per E-Mail senden</a></p>

<h2>Post</h2>

<p>{{ site.name }}<br>
{{ site.kontakt.adresse.strasse }}<br>
{{ site.kontakt.adresse.plz }} {{ site.kontakt.adresse.ort }}</p>

## Folge uns

{% for s in site.social %}<a class="btn btn-ghost" href="{{ s.url }}" rel="noopener">{{ s.name }}</a> {% endfor %}
