import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { themeConfig } from '../../theme.config';

// Astro v5+ only accepts a static `true`/`false` for a route's `prerender`
// export, so it can't be driven from config inside the route files. The
// collection route files therefore carry no `prerender` export (defaulting to
// prerendered); we flip `route.prerender` to false here when the collection is
// listed in `themeConfig.onDemandRenderedCollections`.
// See https://docs.astro.build/en/guides/upgrade-to/v5/#removed-support-for-dynamic-prerender-values-in-routes
const onDemandRoutes: Record<string, string> = {
  'blog/[...article].astro': 'articles',
  'events/detail/[...event].astro': 'events',
  // the events overview/list route is only forced to SSR when events are pulled
  // from the Add to Calendar PRO API (it stays prerendered for markdown events).
  'events/[...year].astro': 'events_overview',
  'integration/[type]/[item].astro': 'integration_options',
  'integration/[type]/index.astro': 'integration_options',
  // Dynamic events sitemap - only SSR when events are pulled from the API.
  'dynamic-events-sitemap.xml.ts': 'dynamic_events_sitemap',
  // Dynamic 404 fallback - only SSR when at least one collection is on-demand
  // rendered (or events are pulled from the API), so on-demand routes can
  // `Astro.rewrite('/404_dynamic')`. Stays prerendered otherwise to keep the
  // build fully static (no server adapter required).
  '404_dynamic.astro': '404_dynamic',
};
const onDemandCollections = new Set<string>(themeConfig.onDemandRenderedCollections ?? []);
export const setOnDemandPrerender: AstroIntegration = {
  name: 'stardrive:on-demand-collections',
  hooks: {
    'astro:route:setup': ({ route }) => {
      // Match both the default-locale (`src/pages/blog/...`) and the localized
      // (`src/pages/[lang]/blog/...`) variants of each collection route.
      const collection = Object.entries(onDemandRoutes).find(([suffix]) => route.component.endsWith(suffix))?.[1];
      const dynamicEvents = Boolean(themeConfig.dynamicEvents?.pullFromAddToCalendarPro);
      // The events overview list is prerendered for markdown events but must be SSR when events come from the API so new entries appear without a rebuild.
      if (collection === 'events_overview' || collection === 'dynamic_events_sitemap') {
        if (dynamicEvents) route.prerender = false;
        return;
      }
      // The dynamic 404 fallback is only needed (and only SSR) when at least
      // one collection is on-demand rendered or events come from the API.
      if (collection === '404_dynamic') {
        if (onDemandCollections.size > 0 || dynamicEvents) route.prerender = false;
        return;
      }
      if (collection && (onDemandCollections.has(collection) || (collection === 'events' && dynamicEvents))) {
        route.prerender = false;
      }
    },
  },
};

// ---------------------------------------------------------------------------
// Sitemap support for on-demand collections
// ---------------------------------------------------------------------------
// On-demand (SSR) collection detail pages are never prerendered, so the sitemap
// integration cannot discover them. We feed their URLs to `sitemap()` via its
// `customPages` option. Those URLs are merged with the auto-discovered ones and
// receive the same i18n `hreflang` alternate treatment (grouped by locale-less
// path), so no manual alternate handling is required.
//
// `customPages` is evaluated at config-load time where `astro:content` is not
// available, so we read the markdown frontmatter directly - mirroring how Astro's
// glob loader derives the entry id: a `slug` frontmatter overrides the filename,
// and filename-based ids are lowercased. `i18nSlug` does not affect the id and is
// therefore ignored, matching the route logic (`entry.id.split('/')`).

interface OnDemandCollectionDescriptor {
  dir: string; // content folder under src/content
  segment: string; // first URL segment
  withType: boolean; // URL includes a `/{type}/` part (from frontmatter)
}

const collectionDescriptors = new Map<string, OnDemandCollectionDescriptor>([
  ['articles', { dir: 'articles', segment: 'blog', withType: false }],
  ['events', { dir: 'events', segment: 'events/detail', withType: false }],
  ['integration_options', { dir: 'integration-options', segment: 'integration', withType: true }],
]);

const contentDir = fileURLToPath(new URL('../content', import.meta.url));

interface Frontmatter {
  draft?: boolean;
  slug?: string;
  type?: string;
}

// Minimal frontmatter reader - only the fields needed to build a URL.
function readFrontmatter(filePath: string): Frontmatter {
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- path is built from the project's own content dir + config locales, never user input
  const raw = fs.readFileSync(filePath, 'utf-8');
  const start = raw.indexOf('---\n');
  if (start !== 0) return {};
  const end = raw.indexOf('\n---', 4);
  if (end === -1) return {};
  const block = raw.slice(4, end);

  const data: Frontmatter = {};
  for (const line of block.split(/\r?\n/)) {
    const m = /^(draft|slug|type):(.*)$/.exec(line);
    if (!m) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (m[1] === 'draft') data.draft = value === 'true';
    else if (m[1] === 'slug') data.slug = value;
    else if (m[1] === 'type') data.type = value;
  }
  return data;
}

// Resolve the URL slug for an entry: a custom `slug` frontmatter wins (verbatim,
// locale prefix stripped); otherwise the lowercased filename is used.
function resolveSlug(fileName: string, slugFrontmatter?: string): string {
  const slug = slugFrontmatter || fileName.replace(/\.md$/, '').toLowerCase();
  return slug.replace(/^[a-z]{2}\//, '');
}

export function getOnDemandSitemapPages(): string[] {
  const site = themeConfig.site.replace(/\/+$/, '');
  const { defaultLocale, locales } = themeConfig.i18n;
  const urls: string[] = [];
  const dynamicEvents = Boolean(themeConfig.dynamicEvents?.pullFromAddToCalendarPro);

  for (const collection of onDemandCollections) {
    // When events are pulled from the Add to Calendar PRO API, the sitemap
    // URLs are generated on-demand by dynamic-events-sitemap.ts (which hits
    // the API), not from local markdown files.
    if (collection === 'events' && dynamicEvents) continue;

    const descriptor = collectionDescriptors.get(collection);
    if (!descriptor) continue;

    for (const locale of locales) {
      const localeDir = path.join(contentDir, descriptor.dir, locale);
      // eslint-disable-next-line security/detect-non-literal-fs-filename -- path is built from the project's own content dir + config locales, never user input
      if (!fs.existsSync(localeDir)) continue;

      // eslint-disable-next-line security/detect-non-literal-fs-filename -- see above
      for (const fileName of fs.readdirSync(localeDir)) {
        if (!fileName.endsWith('.md') || fileName.startsWith('_')) continue;
        const data = readFrontmatter(path.join(localeDir, fileName));
        if (data.draft) continue;
        if (descriptor.withType && !data.type) continue;

        const slug = resolveSlug(fileName, data.slug);
        const typePart = descriptor.withType ? `${data.type}/` : '';
        const pathPart = `${descriptor.segment}/${typePart}${slug}`;
        const prefix = locale === defaultLocale ? '' : `/${locale}`;
        urls.push(`${site}${prefix}/${pathPart}`);
      }
    }
  }

  return Array.from(new Set(urls));
}
