import { defineConfig } from 'astro/config';

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
import cloudflare from '@astrojs/cloudflare';

// i18n config for sitemap integration
export const sitemap_i18n = {
  defaultLocale: themeConfig.i18n.defaultLocale,
  locales: themeConfig.i18n.locales.reduce((acc, lang) => ({ ...acc, [lang]: lang }), {}),
};

// https://astro.build/config
export default defineConfig({
  site: themeConfig.site,
  output: 'static', // use 'server' for SSR, 'static' for static site generation (SSG); see https://docs.astro.build/en/guides/on-demand-rendering/ for details. SSR makes sense if you have a lot (!) of pages. Otherwise, use static and opt-out some pages from prerendering if needed (https://docs.astro.build/en/reference/routing-reference/#per-page-override).
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

  vite: {
    plugins: [tailwindcss()],
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
    sitemap({ i18n: sitemap_i18n }),
    icon(),
    astroExpressiveCode({ themes: themeConfig.expressiveCodeThemes, plugins: [pluginLineNumbers()], defaultProps: { showLineNumbers: false } }),
    (await import('astro-compress')).default({
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
    }),
  ],

  adapter: cloudflare({
    imageService: 'cloudflare', // mind to activate image optimization in the Cloudflare dashboard for your Zone/Worker!
    prerenderEnvironment: 'node', // only works for the prerender. On demand SSR uses the Cloudflare workerd runtime, which is the default and cannot be changed. Node for build is currently required due to some missing features on Cloudflare's isolated worker runtime!
  }),
});
