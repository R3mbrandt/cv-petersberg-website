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

Den ausgefüllten Aufnahmeantrag schickst du an:

{{ site.name }}<br>
{{ site.kontakt.adresse.strasse }}<br>
{{ site.kontakt.adresse.plz }} {{ site.kontakt.adresse.ort }}

Fragen? [Schreib uns](/kontakt/) – wir freuen uns auf dich!
