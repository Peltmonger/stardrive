---
publishDate: 2026-06-04
draft: false
featured: false
title: 'Externe Datenquellen mit deiner Astro-Website verbinden'
excerpt: 'Wenn deine Inhalte außerhalb des Codes bearbeitet werden sollen, kannst du Astro so konfigurieren, dass Daten aus externen Quellen geladen werden. So geht es.'
image:
  file: '@images/content/articles/connecting.jpg'
  alt: 'Astronauten verbinden im All zwei Datenkabel'
tags: ['astro', 'directus', 'supabase', 'strapi', 'contentful', 'github']
categories: ['web-development', 'infrastructure']
---

Du willst deine Inhalte woanders bearbeiten als in der Codebase? Völlig fair. 🤩

Vielleicht hast du ein Marketing-Team, das Markdown nicht anfassen will. Vielleicht migrierst du von einem anderen CMS. Oder du magst einfach den Komfort eines visuellen Editors.

Gute Nachrichten: Astro spielt nett mit externen Datenquellen. Lass uns durchgehen, wie du eine verbindest - am Beispiel von [Directus](https://directus.io), weil es kostenlos, Open Source und API-first ist.

> Beachte, dass Astro statische Websites erzeugt!
> Wenn sich Inhalte ändern, muss die gesamte Seite neu gebaut werden.
> Mit SSR (Server-Side-Rendering) lässt sich das etwas dynamischer gestalten, allerdings kommen dann Caching-Herausforderungen hinzu.

## 💔 Das Problem mit "nimm einfach ein CMS"

Die meisten CMS-Integrationen sind entweder zu starr oder zu magisch. Entweder bekommst du eine eingeschlossene Hosted-Lösung, der deine Daten gehören, oder einen Haufen SDKs, die gegen deinen Build-Prozess kämpfen.

Was du eigentlich willst, ist einfach: Inhalte zur Build-Zeit über eine API holen, mit deinen bestehenden Komponenten rendern und bei Änderungen neu bauen. Kein Lock-in. Keine Magie.

## 🩹 Der Ansatz

Astro behandelt externe Daten wie jede andere asynchrone Datenquelle. Du holst sie, typisierst sie, renderst sie. Das war's.

Und du musst das Muster nicht von Grund auf erfinden - Stardrive liefert schon ein funktionierendes Beispiel mit. Das Events-System kann Live-Daten von der Add to Calendar PRO API holen statt lokale Markdown-Dateien zu lesen. Schau dir `src/utils/event-bridge.ts` an: Es exponiert dieselbe `getEvents`- / `getEventEntry`-Schnittstelle, egal ob Events aus der Content-Collection oder der API kommen, sodass jede Aufrufstelle (Listen, Detailseiten, RSS) unverändert weiterarbeitet. Genau dieses Schema kopierst du für einen Directus-basierten Blog.

## 🛠️ Schritt für Schritt mit Directus

### 1. Directus einrichten

Starte ein Directus-Projekt (selbst gehostet oder Cloud). Lege eine Collection an - sagen wir, `articles` - mit Feldern, die das abbilden, was du brauchst: `title`, `slug`, `excerpt`, `content`, `publish_date`, `image` und so weiter.

Stelle sicher, dass die Collection ordentliche Leserechte für die Public-Rolle hat (oder einen dedizierten API-Token).

### 2. Einige Artikel anlegen

Füge ein paar Test-Einträge hinzu. Du wirst dir später danken, wenn du die Render-Schleife debuggst. 😅

### 3. In Astro einbinden

Erstelle einen kleinen Loader, der von der Directus-REST-API (oder GraphQL-API) holt. Etwa so:

```ts
const DIRECTUS_URL = import.meta.env.DIRECTUS_URL;
const DIRECTUS_TOKEN = import.meta.env.DIRECTUS_TOKEN;

export async function fetchArticles() {
  const res = await fetch(`${DIRECTUS_URL}/items/articles?fields=*`, {
    headers: { Authorization: `Bearer ${DIRECTUS_TOKEN}` },
  });
  const { data } = await res.json();
  return data;
}
```

Dann nutze es in deiner Seite oder in einem Content-Loader. Mappe die Directus-Felder auf dieselbe Form, die deine Komponenten schon erwarten - so musst du deine Blog-Liste, den Einzelbeitrag oder den RSS-Feed nicht umschreiben.

> Tipp: Halte deine Umgebungsvariablen in `.env` und commite sie nie. Astro ist ein Frontend-Framework - pack keine Secrets in client-seitigen Code.

> Security-Tipp: Behandle externe CMS-Inhalte als nicht vertrauenswürdig. Sanitiziere jedes HTML, das nicht aus vertrauenswürdigen Repository-Commits stammt, bevor du es mit `set:html` oder einem Markdown-Renderer ausgibst. Stardrive stellt dafür `sanitizeTrustedHtmlFragment` aus `src/utils/security.ts` bereit und nutzt dasselbe Muster für dynamische Add to Calendar PRO Event-Beschreibungen.

### 4. Bei Änderung neu bauen

Das ist der Teil, den Leute vergessen. Da Astro standardmäßig statisch ist, erscheint eine Inhaltsänderung in Directus nicht auf deiner Seite, bis du neu baust.

Zwei Optionen:

- **Webhook + Rebuild.** Konfiguriere Directus so, dass es bei jeder Änderung eines Datensatzes den Deploy-Webhook deines Hosters triggert. Cloudflare Pages, Netlify und Vercel unterstützen das alle.
- **SSR + Cache-Purge.** Wenn du Astro im SSR-Modus betreibst (wir nutzen Cloudflare Workers), kannst du on-demand holen und den Cache bei Inhaltsänderungen leeren. Dynamischer, aber du tauschst Einfachheit gegen Caching-Komplexität.

Wähl das, was zu deinem Traffic und deinen Frische-Anforderungen passt.

### 5. Vergiss die Sitemap nicht (SSR-Falle)

Hier tappen Leute rein: Wenn du den SSR-Weg gehst und Artikel on-demand holst, weiß deine statische Sitemap nichts von ihnen. Sie wird zur Build-Zeit generiert, aber deine Artikel leben in Directus und ändern sich unabhängig. Neue Artikel erscheinen also erst beim nächsten Full-Build in der Sitemap - was den Sinn von SSR irgendwie ad absurdum führt.

Die Lösung ist ein separater, dynamischer Sitemap-Endpunkt - eine SSR-Route, die zur Anfragezeit Directus abfragt und frisches XML zurückliefert. Stardrive macht genau das schon für Events: siehe `src/pages/dynamic-events-sitemap.xml.ts`. Sie triggert die Add to Calendar PRO API, baut die URL-Liste und serviert die Sitemap on the fly. Kopier dieses Muster für deine Directus-Artikel und du bist abgesichert.

## 🎯 Das Fazit

Ein externes CMS an Stardrive anzubinden ist kein Hack - es ist ein unterstützter, geradliniger Weg. Zur Build-Zeit holen, mit deinen bestehenden Komponenten rendern, bei Änderung neu bauen.

Und weil das Boilerplate schon Blog, RSS, Sitemaps und strukturierte Daten verkabelt hat, bekommst du all das kostenlos. Du tauschst nur die Datenquelle aus. 🚀
