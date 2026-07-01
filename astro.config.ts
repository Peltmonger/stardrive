import { defineConfig, svgoOptimizer } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import solidJs from '@astrojs/solid-js';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { unified, rehypeHeadingIds } from '@astrojs/markdown-remark';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import astroExpressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { externalLinking } from './src/plugins/external-linking';
import { rehypeYoutubePlugin } from './src/plugins/youtube-embed';
import { themeConfig } from './theme.config';
import { setOnDemandPrerender, getOnDemandSitemapPages } from './src/utils/on-demand-render';
import cloudflare from '@astrojs/cloudflare';

// i18n config for sitemap integration
export const sitemap_i18n = {
  defaultLocale: themeConfig.i18n.defaultLocale,
  locales: themeConfig.i18n.locales.reduce((acc, lang) => ({ ...acc, [lang]: lang }), {}),
};

// https://astro.build/config
export default defineConfig({
  site: themeConfig.site,
  // Astro projects are intended to deliver static pages and not to be fully rendered on-demand!
  // You can use 'server' for SSR, see https://docs.astro.build/en/guides/on-demand-rendering/, but it is not recommended.
  // Best approach: Use static and opt-out some pages from prerendering if needed and supported by your hosting solution (https://docs.astro.build/en/reference/routing-reference/#per-page-override).
  // You can find an option in the themes.config.ts to mark content collections as dynamic, which will then render them on-demand instead of prerendering them.
  output: 'static',
  session: {
    // remove if you require this feature; see https://docs.astro.build/en/reference/session-driver-reference/ for details
    driver: {
      entrypoint: 'unstorage/drivers/null',
    },
  },
  trailingSlash: 'never',

  build: {
    format: 'file',
  },

  image: {
    remotePatterns: [{ protocol: 'https' }], // only allows remote images with https, see https://docs.astro.build/en/guides/images/#authorizing-remote-images for more options
    responsiveStyles: false, // set true for more convenience, but less control; details at https://docs.astro.build/en/guides/images/#responsive-image-behavior
    layout: 'constrained',
  },

  experimental: {
    // Always include svg images as components or <img> tags, never via Astro's <Image> component. The latter one is not supported by Cloudflare and might also break in other scenarios.
    // To auto-optimize SVGs, we use the svgo optimizer. If your svg files look strange, you might want to tweak its configuration or even disable it.
    // See https://docs.astro.build/en/reference/experimental-flags/svg-optimization/
    svgOptimizer: svgoOptimizer({
      multipass: true,
      floatPrecision: 5,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              cleanupIds: false,
              inlineStyles: false,
              removeHiddenElems: false,
              convertShapeToPath: false,
              convertEllipseToCircle: false,
              convertPathData: false,
              convertTransform: {
                degPrecision: 1,
                transformPrecision: 3,
              },
              removeEmptyAttrs: false,
              removeDesc: false,
            },
          },
        },
        'removeXMLNS',
        'convertStyleToAttrs',
        'removeRasterImages',
        'reusePaths',
        {
          name: 'removeXlink',
          params: { includeLegacy: true },
        },
        {
          name: 'prefixIds',
          params: {
            delim: '_',
            prefix: () => Math.random().toString(36).slice(2, 8),
            prefixIds: true,
            prefixClassNames: false,
          },
        },
      ],
    }),
  },

  vite: {
    plugins: [tailwindcss()],
    // The Cloudflare adapter renders on-demand routes (e.g. an unmatched URL hitting the 404 page)
    // inside the workerd runtime during `astro dev`. Some transitive CommonJS deps (e.g. debug -> ms, pulled
    // in via astro-icon -> @iconify/utils) reference the Node-only `module` global, which throws
    // "module is not defined" in workerd. Pre-bundling them with the dep optimizer (esbuild) converts
    // the CJS to ESM so they no longer reference `module`.
    // Production is unaffected as long as things are prerendered (output: 'static'), but would also fail with on-demand SSR.
    // The pre-bundling mitigates the issue for both dev and production, so we do it here.
    // see https://docs.astro.build/en/guides/integrations-guide/cloudflare/#some-dependencies-might-need-to-be-pre-compiled
    optimizeDeps: {
      include: ['debug', 'ms', 'reading-time'],
    },
  },

  markdown: {
    processor: unified({
      rehypePlugins: [
        rehypeYoutubePlugin, // custom plugin to create optimized youtube embeds from youtube links in markdown content; see src/plugins/youtube-embed.ts for details
        rehypeHeadingIds, // adds ids to markdown headings, which are needed for the autolink plugin and also the table of contents generation
        [
          rehypeAutolinkHeadings, // adds anchor links to markdown headings; needs to be added after the rehypeHeadingIds plugin, so that it can find the generated ids
          {
            behavior: 'wrap',
          },
        ],
        [
          externalLinking, // custom plugin to add target="_blank" and rel="noopener" to external links in markdown content; see src/plugins/external-linking.ts for details
          {
            domain: themeConfig.site,
          },
        ],
      ],
    }),
  },

  i18n: {
    defaultLocale: themeConfig.i18n.defaultLocale,
    locales: themeConfig.i18n.locales,
    routing: {
      prefixDefaultLocale: false,
      fallbackType: 'redirect',
    },
  },

  integrations: [
    solidJs(),
    setOnDemandPrerender,
    sitemap({ i18n: sitemap_i18n, customPages: getOnDemandSitemapPages() }),
    icon(),
    astroExpressiveCode({ themes: themeConfig.expressiveCodeThemes, plugins: [pluginLineNumbers()], defaultProps: { showLineNumbers: false } }),
    (await import('astro-compress')).default({
      CSS: false, // disabled: astro-compress's CSS minifier (csso) strips Tailwind v4's modern `@media (width >= ...)` range syntax, which removes all responsive breakpoints and makes the site render mobile-only. Vite already minifies CSS safely.
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
    }),
  ],

  adapter: cloudflare({
    imageService: 'cloudflare', // mind to activate Media > Images > Transformations in the Cloudflare dashboard for your Zone/Worker!
    prerenderEnvironment: 'node', // only applies to prerendering at build time. On-demand SSR always uses the Cloudflare workerd runtime. Node is currently required here because some render-time dependencies call Node-only path/url APIs that are not available in workerd's isolated runtime.
  }),
});
