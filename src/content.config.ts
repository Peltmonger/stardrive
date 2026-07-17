import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { themeConfig } from '../theme.config';

const httpUrl = z.url().refine((value) => ['http:', 'https:'].includes(new URL(value).protocol), {
  message: 'Must be an http or https URL',
});

// Collections marked as on-demand in `themeConfig.onDemandRenderedCollections` are
// assumed to be large — that is the only reason to opt out of prerendering. For
// those, we also enable `deferRender` so the glob loader skips
// eager rendering during sync and renders entries on demand instead. This
// trades cached render output for lower memory usage during sync, which is the
// right trade for large collections. See https://astro.build/blog/astro-710/
const onDemandCollections = new Set<string>(themeConfig.onDemandRenderedCollections ?? []);

const articles = defineCollection({
  loader: glob({ pattern: ['**/[^_]**.md'], base: './src/content/articles', deferRender: onDemandCollections.has('articles') }),
  schema: ({ image }) =>
    z.object({
      publishDate: z.date(),
      updateDate: z.date().optional(),
      draft: z.boolean().optional(),
      featured: z.boolean().optional(),
      llmsTxt: z.boolean().optional(), // set true while setting `addArticles` to `selected` in the theme settings, to have this article show up in the llms.txt file
      slug: z.string().optional(), // If you have a lot of articles, we recommend adding a random hash to the md file to prevent duplication. In this case, you can set a nicer slug via this option. Mind that a custom slug needs to include the language code - like "de/abc-german"
      i18nSlug: z.record(z.string(), z.string()).optional(), // if you use different custom slugs or file names for different languages, you need to define them per language on each article like { de: 'de/abc-german', en: 'en/abc-english' }
      externalCanonical: httpUrl.optional(),
      title: z.string(),
      excerpt: z.string().optional(),
      image: z
        .object({
          file: image().optional(), // file would be a relative path to the src/images/content/articles folder. You can use the alias @images to reference this folder. The article list-item.astro and [...article].astro elements hold a fallback option, if no file or url is set.
          url: httpUrl.optional(), // url would be an optional url to any image
          alt: z.string().optional(), // this defines the alt text for the image
        })
        .optional(),
      tags: z.array(z.string()).optional(),
      categories: z.array(z.string()).optional(),
      author: z
        .object({
          name: z.string(),
          url: httpUrl.optional(),
        })
        .optional(),
      tocDepth: z.number().optional(),
      // meta data for the blog overview page. Do not specify this in the frontmatter!
      url: z.string().optional(),
    }),
});

const events = defineCollection({
  loader: glob({ pattern: ['**/[^_]**.md'], base: './src/content/events', deferRender: onDemandCollections.has('events') }),
  schema: ({ image }) =>
    z.object({
      publishDate: z.date(),
      updateDate: z.date().optional(),
      draft: z.boolean().optional(),
      slug: z.string().optional(), // If you have a lot of events, we recommend adding a random hash to the md file to prevent duplication. In this case, you can set a nicer slug via this option. Mind that a custom slug needs to include the language code - like "de/abc-german"
      i18nSlug: z.record(z.string(), z.string()).optional(), // if you use different custom slugs or file names for different languages, you need to define them per language on each event like { de: 'de/abc-german', en: 'en/abc-english' }
      title: z.string(),
      description: z.string().optional(), // this description is used for the shareable event. Use the markdown body for additional longer and rich descriptions
      startDate: z.date(),
      endDate: z.date(),
      allDay: z.boolean().optional(),
      timeZone: z.string().optional(), // valid IANA time zone. Find it via https://tz.add-to-calendar-technology.com/
      location: z.string().optional(),
      organizer: z
        .object({
          name: z.string(),
          email: z.string(),
        })
        .optional(),
      rrule: z.string().optional(), // use this to define a recurrence rule for the event, e.g. "FREQ=WEEKLY;BYDAY=MO,WE,FR" for a weekly event on Monday, Wednesday and Friday
      icsFile: z.string().optional(), // use this to define a path to a static .ics file instead of having generated dynamically (which might break in some environments)
      image: z
        .object({
          file: image().optional(), // file would be a relative path to the src/images/content/articles folder. You can use the alias @images to reference this folder. The article list-item.astro and [...article].astro elements hold a fallback option, if no file or url is set.
          url: httpUrl.optional(), // url would be an optional url to any image
          alt: z.string().optional(), // this defines the alt text for the image
        })
        .optional(),
      llmsTxt: z.boolean().optional(),
    }),
});

const faq_answers = defineCollection({
  loader: glob({ pattern: ['**/[^_]**.md'], base: './src/content/faq-answers', deferRender: onDemandCollections.has('faq_answers') }),
  schema: () =>
    z.object({
      publishDate: z.date().optional(),
      updateDate: z.date().optional(),
      draft: z.boolean().optional(),
      question: z.string(),
      category: z.string().optional(),
      llmsTxt: z.boolean().optional(),
    }),
});

const integration_options = defineCollection({
  loader: glob({ pattern: ['**/[^_]**.md'], base: './src/content/integration-options', deferRender: onDemandCollections.has('integration_options') }),
  schema: ({ image }) =>
    z.object({
      publishDate: z.date().optional(),
      updateDate: z.date().optional(),
      draft: z.boolean().optional(),
      slug: z.string().optional(), // If you have a lot of integration options, we recommend adding a random hash to the md file to prevent duplication. In this case, you can set a nicer slug via this option. Mind that a custom slug needs to include the language code - like "de/abc-german"
      i18nSlug: z.record(z.string(), z.string()).optional(), // if you use different custom slugs or file names for different languages, you need to define them per language on each item like { de: 'de/abc-german', en: 'en/abc-english' }
      type: z.string(), // can be used to split integration via Zapier vs. Make vs. n8n vs. native, ...
      service: z.string(), // e.g. "Google Sheets", "Notion", "Shopify", ...
      title: z.string(),
      description: z.string().optional(),
      url: httpUrl.optional(),
      logo: z
        .object({
          file: image().optional(), // file would be a relative path to the src/images/content/integration_options folder. You can use the alias @images to reference this folder.
          url: httpUrl.optional(), // url would be an optional url to any image
          alt: z.string().optional(), // this defines the alt text for the image
        })
        .optional(),
    }),
});

export const collections = { articles, events, faq_answers, integration_options };
