---
layout: layouts/page.njk
title: Mitglied werden
kicker: Mitmachen
description: Aktiv in der Vereinsarbeit oder als passives Mitglied – unterstütze den Carnevalverein Petersberg!
---
Du hast Interesse an der aktiven Vereinsarbeit im Carnevalverein Petersberg e.V.? Oder möchtest du unseren Verein als passives Mitglied unterstützen? Dann fülle gleich unseren Aufnahmeantrag aus und schicke ihn uns!

## Jahresbeitrag

<div class="stats stats--small">
  <div class="stat"><span class="stat-value">21 €</span><span class="stat-label">Erwachsene</span></div>
  <div class="stat"><span class="stat-value">12 €</span><span class="stat-label">Kinder</span></div>
  <div class="stat"><span class="stat-value">21 € + 12 €</span><span class="stat-label">Familien: 1. Person 21 €, jede weitere 12 €</span></div>
</div>

## Unterlagen

<ul class="doc-list">
{%- for d in dokumente %}
  <li><a href="{{ d.datei }}">{{ d.titel }}</a> <span>PDF</span></li>
{%- endfor %}
</ul>

## Antrag abgeben

Den ausgefüllten und unterschriebenen Aufnahmeantrag schickst du per Post an

{{ site.name }}<br>
{{ site.kontakt.adresse.strasse }}<br>
{{ site.kontakt.adresse.plz }} {{ site.kontakt.adresse.ort }}

oder eingescannt per E-Mail an <a href="mailto:{{ site.kontakt.vorstand }}">{{ site.kontakt.vorstand }}</a>.

## Änderungen und Kündigung

Neue Adresse, neue Bankverbindung oder Kündigung der Mitgliedschaft? Bitte wende dich direkt an den Vorstand: <a href="mailto:{{ site.kontakt.vorstand }}">{{ site.kontakt.vorstand }}</a> oder per Post an die Vereinsanschrift. Für Änderungen kannst du auch den [Aufnahmeantrag / Änderungsmeldung (PDF)](/uploads/2021/01/20210118_Anmeldung_CVP.pdf) verwenden.

Fragen? [Schreib uns](/kontakt/) – wir freuen uns auf dich!
