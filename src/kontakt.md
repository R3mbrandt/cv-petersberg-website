---
layout: layouts/page.njk
title: Kontakt
description: Nimm Kontakt zu uns auf oder sag uns einfach deine Meinung!
---
<div class="contact-cards">
  <a class="contact-card" href="mailto:{{ site.kontakt.email }}?subject=Anfrage%20%C3%BCber%20cv-petersberg.de">
    <span class="contact-label">E-Mail</span>
    <strong>{{ site.kontakt.email }}</strong>
  </a>
  <a class="contact-card" href="tel:+49{{ site.kontakt.telefon | replace(' ', '') | replace('0661', '661') }}">
    <span class="contact-label">Telefon</span>
    <strong>{{ site.kontakt.telefon }}</strong>
  </a>
  <div class="contact-card">
    <span class="contact-label">Post</span>
    <strong>{{ site.name }}<br>{{ site.kontakt.adresse.strasse }}<br>{{ site.kontakt.adresse.plz }} {{ site.kontakt.adresse.ort }}</strong>
  </div>
</div>

<h2 id="auftritte">Auftritts- und Einmarschanfragen</h2>

Möchtet ihr mit eurem Verein, eurer Büttenrede oder einem sonstigen carnevalistischen Beitrag einen Auftritt bei einer unserer Veranstaltungen machen? Wollt ihr den CVP oder eine Tanzgruppe des CVP zu einer eurer Veranstaltungen einladen?

Schreibt uns mit Datum, Ort, Verein/Gruppe und eurem Wunsch:

<p><a class="btn" href="mailto:{{ site.kontakt.email }}?subject=Auftritts-%20%2F%20Einmarschanfrage&body=Verein%20%2F%20Gruppe%3A%0D%0ADatum%3A%0D%0AOrt%3A%0D%0AAnfrage%3A%0D%0A">Anfrage per E-Mail senden</a></p>

## Folge uns

{% for s in site.social %}<a class="btn btn-ghost" href="{{ s.url }}" rel="noopener">{{ s.name }}</a> {% endfor %}
