---
publishDate: 2026-06-04
draft: false
featured: false
title: 'Connect external data sources to your Astro Website'
excerpt: 'If you want your content to be edited outside of the codebase, you can configure Astro to pull data from those external sources. Learn how.'
image:
  file: '@images/content/articles/connecting.jpg'
  alt: 'Astronauts connecting 2 data cables in space'
tags: ['astro', 'directus', 'supabase', 'strapi', 'contentful', 'github']
categories: ['web-development', 'infrastructure']
---

So you want to edit your content somewhere other than the codebase? Totally fair. 🤩

Maybe you have a marketing team that doesn't want to touch Markdown. Maybe you're migrating from another CMS. Or maybe you just like the comfort of a visual editor.

Good news: Astro plays nicely with external data sources. Let's walk through how to connect one - using [Directus](https://directus.io) as the example, because it's free, open source, and API-first.

> Mind that Astro creates static websites!
> When content changes, you would need to rebuild the whole site.
> This can be a little bit more dynamic with SSR (server-side-rendering), but this then comes with Caching challenges.

## 💔 The problem with "just use a CMS"

Most CMS integrations are either too rigid or too magical. You either get a locked-in hosted solution that owns your data, or a pile of SDKs that fight your build process.

What you actually want is simple: fetch content from an API at build time, render it with your existing components, and rebuild when something changes. No lock-in. No magic.

## 🩹 The approach

Astro treats external data like any other async data source. You fetch it, you type it, you render it. That's it.

And you don't have to invent the pattern from scratch - Stardrive already ships with a working example. The events system can pull live data from the Add to Calendar PRO API instead of reading local Markdown files. Look at `src/utils/event-bridge.ts`: it exposes the same `getEvents` / `getEventEntry` interface whether events come from the content collection or the API, so every call site (lists, detail pages, RSS) keeps working unchanged. That's the exact scheme you'd copy for a Directus-backed blog.

## 🛠️ Step-by-step with Directus

### 1. Set up Directus

Spin up a Directus project (self-hosted or cloud). Create a collection - say, `articles` - with fields that mirror what you need: `title`, `slug`, `excerpt`, `content`, `publish_date`, `image`, and so on.

Make sure the collection has proper read permissions for the public role (or a dedicated API token).

### 2. Create some articles

Add a few test entries. You'll thank yourself later when you're debugging the render loop. 😅

### 3. Connect it in Astro

Create a small loader that fetches from the Directus REST (or GraphQL) API. Something like:

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

Then use it in your page or in a content loader. Map the Directus fields to the same shape your components already expect - that way you don't have to rewrite your blog list, single post, or RSS feed.

> Tip: keep your environment variables in `.env` and never commit them. Astro is a frontend framework - don't put secrets in client-side code.

> Security tip: treat external CMS content as untrusted. Sanitize any HTML that did not come from trusted repository commits before rendering it with `set:html` or a Markdown renderer. Stardrive exposes `sanitizeTrustedHtmlFragment` from `src/utils/security.ts` for rich HTML fragments and uses the same pattern for dynamic Add to Calendar PRO event descriptions.

### 4. Rebuild on change

This is the part people forget. Since Astro is static by default, a content change in Directus won't appear on your site until you rebuild.

Two options:

- **Webhook + rebuild.** Configure Directus to hit your hosting provider's deploy webhook whenever a record changes. Cloudflare Pages, Netlify, and Vercel all support this.
- **SSR + cache purge.** If you're running Astro in SSR mode (we use Cloudflare Workers), you can fetch on-demand and purge the cache when content changes. More dynamic, but you trade simplicity for caching complexity.

Pick the one that matches your traffic and freshness needs.

### 5. Don't forget the sitemap (SSR gotcha)

Here's a trap people fall into: if you go the SSR route and fetch articles on-demand, your static sitemap won't know about them. It's generated at build time, but your articles live in Directus and change independently. So new articles simply won't appear in the sitemap until the next full build - which kind of defeats the point of SSR.

The fix is a separate, dynamic sitemap endpoint - an SSR route that queries Directus at request time and returns fresh XML. Stardrive already does exactly this for events: see `src/pages/dynamic-events-sitemap.xml.ts`. It hits the Add to Calendar PRO API, builds the URL list, and serves a sitemap on the fly. Copy that pattern for your Directus articles and you're covered.

## 🎯 The takeaway

Connecting an external CMS to Stardrive isn't a hack - it's a supported, straightforward path. Fetch at build time, render with your existing components, rebuild on change.

And because the boilerplate already has a blog, RSS, sitemaps, and structured data wired up, you get all of that for free. You just swap the data source. 🚀
