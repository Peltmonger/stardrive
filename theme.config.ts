import type { ThemeConfig } from './types/theme-config.d.ts';

// language files from ./src/i18n
// The `with { type: 'json' }` import attribute is required so this file can also be
// imported from a plain ESM context (e.g. `ec.config.mjs`, which Node loads directly).
import enStrings from './src/i18n/en.json' with { type: 'json' };
import deStrings from './src/i18n/de.json' with { type: 'json' };
import frStrings from './src/i18n/fr.json' with { type: 'json' };
import esStrings from './src/i18n/es.json' with { type: 'json' };

export const themeConfig: ThemeConfig = {
  // `import.meta.env?.` is guarded because this file is also imported from `ec.config.mjs`,
  // which Node loads as plain ESM where `import.meta.env` is not defined (only Vite injects it).
  site: import.meta.env?.SITE_OVERRIDE || 'https://astro-stardrive.com',
  primaryColor: '#f26430', // mind to also update the Tailwind config if you change this!
  themeColor: '#50168a',
  generateWebmanifest: true,
  name: 'Astro StarDrive',
  shortName: 'StarDrive',
  darkMode: true,
  robots: import.meta.env?.ROBOTS || 'index, follow',
  xHandle: 'jekuer',

  // Structured data
  author: {
    type: 'Person',
    name: 'Jens Kuerschner',
    url: 'https://jekuer.com',
    image: '',
  },
  publisher: {
    type: 'Organization',
    name: 'Peltmonger Ventures',
    url: 'https://peltmonger.com',
    image: '',
  },

  // I18n
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'fr', 'es'],
    languages: {
      en: 'English',
      de: 'Deutsch',
      fr: 'Français',
      es: 'Español',
    },
    languageModules: {
      en: enStrings,
      de: deStrings,
      fr: frStrings,
      es: esStrings,
    },
    translatedStructuredData: {
      de: {
        author: {
          name: 'Jens Kürschner',
          url: 'https://jekuer.de',
        },
        publisher: {
          name: 'Peltmonger Ventures',
          url: 'https://peltmonger.com/de',
        },
      },
    },
  },

  // md(x) code block rendering
  expressiveCodeThemes: {
    light: 'min-light',
    dark: 'min-dark',
  },

  // content/article settings
  articles: {
    imageFallback: true,
    gridView: true,
    textOverImage: false,
    categories: true, // if set false, make sure to also remove category directories under /pages
    tags: true, // if set false, make sure to also remove tag directories under /pages
    entriesPerPage: 4,
    tocMaxDepth: 3,
    defaults: {
      author: {
        name: 'Jens Kuerschner',
        url: 'https://www.linkedin.com/in/jenskuerschner/',
      },
    },
    social: {
      // default values - can be overridden at the Single component level
      xHandle: 'jekuer', // to be added as "via @handle" in the tweet
      buttons: {
        email: true,
        facebook: true,
        hackernews: true,
        linkedin: true,
        pinterest: false,
        reddit: true,
        telegram: false,
        x: true,
        whatsapp: false,
      },
      buttonsSmallScreen: {
        email: true,
        facebook: true,
        hackernews: false,
        linkedin: true,
        pinterest: false,
        reddit: true,
        telegram: true,
        x: true,
        whatsapp: true,
      },
    },
  },

  // promotion settings
  promotions: {
    newsletterSignup: 'footer',
    footerBanner: true,
    navAd: true,
    topBanner: true,
    heroChip: true,
  },

  // for the purpose of this demo, we render intergration options on-demand instead of prerendering them.
  onDemandRenderedCollections: ['integration_options'],

  // you can also dynamically integrate events from your Add to Calendar PRO account (https://add-to-calendar-pro.com/), having your API key set as environment variable ADD_TO_CALENDAR_PRO_API_KEY.
  dynamicEvents: {
    pullFromAddToCalendarPro: false,
    filterBy: {
      from: '',
      to: '',
      group: '',
    },
  },

  // LLM and coding assistant settings
  llms: {
    autoGeneration: true,
    intro: 'Stardrive is a boilerplate and template for Astro.js. It is build to be a alsmost all batteries included starting point for all kinds of content driven websites, like blogs, documentation sites, knowledge bases, or even marketing sites. It is also optimized for being used by and with LLMs and coding assistants to create bullet proofed websites automatically.',
    excludePagesPattern: ['/integration/**'],
    includePages: [],
    addArticles: 'selected',
    addEvents: 'all',
    addFAQ: 'all',
  },
};
