---
layout: layouts/page.njk
title: Für Aktive
kicker: Elferrat, Ratsfrauen & Tanzgarden
description: Einmarschplan und Infos für alle Aktiven des CVP.
permalink: /aktive/
einmarschplan:
  titel: Einmarschplan 2026
  bild: /uploads/2025/12/Einmarschplan_2026.jpg
  pdf: /uploads/2025/12/Einmarschplan_2026.pdf
---
<h2 id="einmarschplan">{{ einmarschplan.titel or "Einmarschplan" }}</h2>

<p><a class="btn" href="{{ einmarschplan.pdf }}">Einmarschplan als PDF</a></p>

<a href="{{ einmarschplan.pdf }}"><img src="{{ einmarschplan.bild }}" alt="{{ einmarschplan.titel or 'Einmarschplan' }}" class="wide-image"></a>

<h2 id="anfragen">Einmarsch- und Auftrittsanfragen</h2>

<p>Anfragen anderer Vereine für Einmärsche oder Auftritte unserer Gruppen laufen über die <a href="/kontakt/#auftritte">Kontaktseite</a>.</p>
