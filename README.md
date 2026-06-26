![Stardrive - the Astro boilerplate for the AI age](https://github.com/peltmonger/stardrive/blob/main/repository-header.png?raw=true)

[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Astro](https://img.shields.io/badge/astro-%232C2052.svg?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![LLM-friendly](https://img.shields.io/badge/LLM%20friendly-brightgreen?style=for-the-badge)](./AGENTS.md)

<br />

# Stardrive - the Astro boilerplate for the AI age

## 🚀 Intro and Philosophy

Stardrive is a very opinionated boilerplate for [Astro](https://astro.build/).

The core idea is to have a strong boilerplate to...

1. skip the first 36 steps of creating a high-class website, if you do it manually;
2. make sure all the important basics (security, SEO, meta data, accessibility, ...) are included when using AI agents.
3. focus on providing the best technical foundation, not necessarily the most fancy design.

We are building on the amazing Astro project, because it is the maybe most performant and stable, yet flexible frontend framework out there at the very moment.
It also enables you to include components from any other big JavaScript framework, like React, Vue, Svelte, or Solid.

We recommend deploying on Cloudflare as Astro and Stardrive are optimized for their workers, but you are also free to use any other hoster.

<br />

> [!WARNING]
> Mind Astro's frontend nature!
> Astro is a frontend framework. This means it runs as a static site on the client side.
> Do never add any sensitive information here! Any backend data needs to be processed by a respective backend service.
> While there are things that can act as a backend service (mainly Astro's on-demand server-side rendering, optionally combined with Middleware), it still is a frontend framework.

<br />

---

<br />

## ▶️ Demo

See [astro-stardrive.com](https://astro-stardrive.com/) for a live demo.

It actually is a hosted version of this exact boilerplate, which already comes with all batteries included 🤩.

<br />

---

<br />

## ✨ Features

Everything you need to launch a fast, modern, AI-ready website - batteries included.

### 🤖 Built for the AI age

- **LLM-friendly by design** - Super well documented, so AI agents immediately know what to do.
- **WebMCP prepared** - Ship tools your visitors' AI agents can actually use.
- **`llms.txt` auto-populated** - Your content, served on a silver platter to LLMs.
- **[Schema.org](https://schema.org) auto-generated** - Rich, structured data without the busywork.

### 🛠️ Developer experience

- **Fully typed** - TypeScript end to end.
- **TailwindCSS** - Utility-first styling, ready to go.
- **ESLint & Prettier** - Linting and formatting, pre-configured.
- **Use any package manager** - npm, pnpm, yarn, or bun.
- **Centralized config** - Tweak most things from a single `theme.config.ts`.
- **Cloudflare Worker prepared** - Deploy to the edge in seconds.

### 🎨 Design & UX

- **Hot theme included** - Looks great out of the box.
- **Light / Dark mode** - Automatic and toggleable.
- **Full i18n support** - Go global from day one.
- **Smooth page transitions & animations** - Polished feel, zero fuss.
- **Dynamic header** - Adapts to different use cases.
- **References marquee** - Show off your logos in style.
- **Pricing tables** - Convert visitors into customers.
- **Optional promotional elements** - Banners, signups, and more when you need them.

### 📝 Content

- **Powerful blog** - Auto-generated Table of Contents, optimized YouTube embeds, auto-highlighting of external links, reading-time calculation, and proper auto-generated social preview images.
- **Markdown-based FAQ** - Manage answers as simple files.

### 🖖 Accessibility & SEO

- **WCAG prepared** - Accessibility baked in.
- **A thousand tiny tweaks** - Optimized for SEO, social sharing, page-speed scores, and more…

<br />

---

<br />

## 📦 Installation

### Creation

It is highly recommended to create a new project via:

```sh
npm create stardrive@latest
```

*or*

```sh
pnpm create stardrive@latest
```

*or*

```sh
yarn create stardrive@latest
```

<br />

`bun` also works as long as Node is installed as well.

The installer helps you to already adjust the boilerplate a little bit to your needs right from the beginning.

> [!TIP]
> Use the flag `--no-install` to skip the dependency install.
> Use the flag `--version X.X.X` to use a specific version.

<br />

_(Alternatively, you can also always simply fork and/or clone the official repository.)_

<br />

### Cleanup

Remove the following files as they are only relevant for the official boilerplate demo and repository.

- `./scripts/syncVersion.js`
- `./SECURITY.md`
- `./CHANGELOG.md`
- `./repository-header.png`
- `./.github` (whole directory)

During the further configuration, you will delete and adjust even more content, but this is the stuff, you can and should blindy trash at the very beginning.

> [!NOTE]
> If you have created your project via the `npm create stardrive` command, this cleanup already happend automatically!

<br />

---

<br />

## 🗂️ Structure

The code structure follows the official Astro scheme. It is recommended to rather keep it that way. 
A clear exception is the component directory. There, we rather keep the amount of files low than splitting everything into atoms. 
Adjust this based on your project, personal taste, and coding guidelines!

```
.
├── astro.config.ts              # Base Astro config (integrations, build, adapter)
├── theme.config.ts              # 🎯 Central project config: branding, i18n, blog, promo, llms.txt
├── eslint.config.mjs            # ESLint rules
├── tsconfig.json                # TypeScript config
├── wrangler.jsonc               # Cloudflare Worker deployment config
├── worker-configuration.d.ts    # Auto-generated Cloudflare Worker types
├── package.json                 # Defining the project and its dependencies
├── AGENTS.md                    # Entry point and general guidance for AI agents
│
├── .ai/                         # AI guides on specific topics and tasks. Triggered via AGENTS.md
│
├── public/                       # Served as-is at the site root
│   ├── _headers                  # Cloudflare HTTP headers (security, caching)
│   ├── _redirects                # Cloudflare redirects (keep updated on migrations)
│   ├── favicon.svg               # Dynamic light/dark favicon (handled inside the SVG)
│   ├── favicon.ico               # Classic favicon fallbacks (+ dark-mode variant)
│   ├── apple-touch-icon.png      # iOS home-screen icon (sits on a theme color)
│   ├── web-app-manifest-*.png    # PWA manifest icons (192/512)
│   ├── data/                     # Public downloadable files (articles/ for blog assets)
│   ├── images/                   # Stable-URL images: og.png, x.png, structured-preview.png (social fallbacks)
│   └── map/
│       └── office.pmtiles        # Demo map tiles for the contact page (replace/remove)
│
├── scripts/
│   ├── generateLLMFiles.js       # Builds llms.txt from your content
│   ├── postbuild.js              # Post-build hook (runs the steps below)
│   ├── processSocialImages.js    # Auto-generates social preview images for articles
│   ├── purgeCloudflareCache.js   # Purges CF cache after deploy (needs CF_PURGE_* env vars)
│   ├── syncVersion.js            # ⛔ Demo/repo only — delete in your project
│   └── upgrade.js                # Helper to upgrade the boilerplate
│
├── types/                        # Global type definitions
│
└── src/
    ├── content.config.ts         # Astro content collections schema (articles, faq, integrations)
    │
    ├── pages/                    # File-based routing — one file per route
    │   ├── index.astro           # Home page
    │   ├── about.astro · contact.astro · features.astro · pricing.astro · examples.astro · faq.astro
    │   ├── signup.astro · get-listed.astro · legal-notice.astro · privacy-policy.astro
    │   ├── 404.astro             # Not-found page
    │   ├── robots.txt.ts         # Generates robots.txt (honors the ROBOTS env override)
    │   ├── rss.xml.js            # Generates the blog RSS feed
    │   ├── site.webmanifest.ts   # Generates the PWA manifest from theme.config.ts
    │   ├── [lang]/               # i18n routes (string-translated pages share this folder)
    │   ├── de/ · es/ · fr/       # Per-language folders for hard-coded/long-form content
    │   ├── blog/                 # Blog routes: [article], [...page], categories/, tags/
    │   ├── docs/                 # Docs pages (index, guide, configuration)
    │   └── integration/          # Integration listing routes ([type]/, index)
    │
    ├── layouts/
    │   ├── default.astro         # Base page layout
    │   └── article.astro         # Blog article layout
    │
    ├── components/               # Kept intentionally coarse (not atomic)
    │   ├── headline.astro · contact-form.astro · contact-map.astro · integration-list.astro
    │   ├── webmcp-tools.astro    # Experimental WebMCP tools exposed to visitor AI agents
    │   ├── head/                 # <head> bits: base.astro (favicons), hreflang.astro, ogx.astro (OG/X meta)
    │   ├── layout/               # header, footer, hero, references, language + light-mode switchers, nav/
    │   ├── blog/                 # ToC, list/single, pagination, social-share, cat-tag-list
    │   ├── promo/                # Optional promo slots: banners, nav-ad, newsletter signup
    │   └── structured/           # Schema.org JSON-LD (website.astro, article.astro)
    │
    ├── content/                  # Markdown-based content collections
    │   ├── articles/             # Blog posts (per language)
    │   ├── faq-answers/          # FAQ entries as Markdown (per language)
    │   └── integration-options/  # Integration data (per language)
    │
    ├── i18n/                     # Translation strings — one JSON per language
    │
    ├── images/                   # Build-optimized images (logos, content/, references/)
    │
    ├── plugins/                  # Markdown/rehype plugins
    │   ├── external-linking.ts   # Auto-highlights & secures external links
    │   └── youtube-embed.ts      # Optimized YouTube embeds in Markdown
    │
    ├── styles/
    │   ├── tailwind.config.css   # 🎯 Tailwind base: fonts, colors/branding, breakpoints
    │   ├── global.css            # Custom global rules + single-source-of-truth styles (e.g. buttons)
    │   ├── long-text-content.css # Styling for text-heavy pages (e.g. privacy policy)
    │   ├── blog.css              # Styling for the blog section (excluding the markdown styling)
    │   └── markdown.css          # Styling for rendered markdown pages
    │
    └── utils/                    # Helpers
```

---

<br />

## 🎛️ Configuration

### General

The configuration for your project happens on multiple levels.

First, you should adjust the [theme.config.ts](theme.config.ts) to match your requirements and specifications.
This already gives the boilerplate your branding.

Second, you would adjust the whole codebase to your needs.
This is an Astro project. The boilerplate brings in the easy-to-use general theme config as well as a pre-structured website.
You still need to build the actual website 😉.

Third, some things are configurable via env variables at build time.

* SITE_OVERRIDE: Would override the global site url. Useful for dev environments.
* ROBOTS: Would override the global default robots setting. Useful for dev environments. Settings on the page level would still override this again!
* CF_PURGE_API_KEY and CF_PURGE_ZONE_ID: Required if you want to use the Cloudflare purge script when hosting on Cloudflare workers.

### Step by Step Guide

1. If you did not use the `create stardrive` command to create the project, check the [Trimming Guide](./.ai/TRIMMING_GUIDE.md) to remove those features you do not need first! The guide is built for AI agents, but can also be used for manual actions.
2. Adjust the [package.json](./package.json) to reflect your project.
3. Adjust the [README.md](./README.md) file to at least hold the name of your project as headline. This makes it easier for you to identify your project later.
4. Replace the favicon and web-app-manifest files in ./public/. We recommend to use [realfavicongenerator.net](https://realfavicongenerator.net/) to do so. You only need to replace the image files. The webmanifest is generated dynamically based on the theme.config.ts. Mind that for the favicons, we have different ones for light vs. dark mode users (refering to their device, not the website). This makes sense for transparent or black/white icons. If you do not use this, also adjust [./src/components/head/base.astro](./src/components/head/base.astro) and drop the dark-mode icons. For the svg file, we recommend to handle light/dark mode directly in the svg code - you can check our [demo favicon.svg](./public/favicon.svg) for reference.
5. Also replace the social preview images (og.png, x.png, structured-preview.png) in ./public/images/. They act as a general fallback, For articles, we auto-generate them from the article's main image.
6. Adjust the [theme.config.ts](./theme.config.ts).
  1. Set the base information first - like the site url, primary color, ... Everything is typed here - your IDE should be able to read the comments from the types to help you understand the respective settings.
  2. Decide which languages you want to support, create a respective json file in the ./src/i18n/ directory, and import it in the config file. Adjust the "i18n" block respectively.
  3. Load the expressiveCodeThemes you want to use. Pick two. 1 for light and 1 for dark mode. If you do not use dark mode, only pick one. Find the available options at the [shikijs repository](https://github.com/shikijs/textmate-grammars-themes/tree/main/packages/tm-themes).
  4. If you are using the blog feature, specifying basic article settings would be next. This mainly defines the general layout and functionality. if you decide to use the image fallback feature, check the [demo fallback image](./src/images/content/articles-fallback.jpg) and replace it.
  5. Set promotion slots, if you want to - you can adjust the content later. Drop it or set everything to `false`, if you do not need this at the moment.
  6. Last but not least, define how the llms.txt file is created. As of today, it is not clearly stated whether this is really useful or not - however, Lighthouse has started testing for it, so it doesn't hurt.
7. If you want to use Webfonts, add them by installing via fontsource. The boilerplate comes with "Geist". You might want to uninstall this with `npm un @fontsource/geist` and install your own.
8. Adjust the TailwindCSS base config at [./src/styles/tailwind.config.css](./src/styles/tailwind.config.css).
  1. Adjust the font section. For example, replace "Geist" with your main font or even add new font styles.
  2. Adjust the colors section (Branding and maybe Utility). We recommend to only adjust color hex codes and optionally add additional ones. If you remove lines, this breaks the demo content, which can be confusing - only do this at the very end when you replaced the demo content with your own!
  3. Adjusting breakpoints could be a thing for design nerds.
  4. Add anything else you already know you require. But, of course, you can also adjust things any time later.
9. If you already have some CSS you want to use, adjust/extend the [global.css](./src/styles/global.css) file to your needs. Also have a look at the other CSS files in the ./src/styles folder and adjust to your needs and taste. Our logic for styling goes as follows:
  * TailwindCSS as base
  * global.css to add custom rules and base styling. We also put things there, that are duplicated a lot and where the Tailwind classes should have a single source of truth (e.g. buttons).
  * Additional CSS files for special pages (gets imported in addition on the page level). For example, we have a long-text-content.css, which is super useful to style boring things like the privacy policy page.
  * Super custom stuff goes into the respective page or component; and on that level, as Tailwind classes or into its own scoped CSS block, if we would have a lot of class duplication otherwise (mind to set the [reference](https://tailwindcss.com/docs/functions-and-directives#reference-directive) to the tailwind.config.css file in those `<style>` blocks!).
10. Delete the subfolders in ./src/content/ and ./src/pages/ for those languages (e.g. "/fr"), which you do not want to support (see step 2). If you are only using 1 language, you can also drop the ./src/pages/[lang] folder as well as the [language-switcher.tsx](./src/components/layout/language-switcher.tsx) and [language-select.astro](./src/components/layout/language-select.astro) files in the components folder.
11. Check what we put into the `<head>` for open graph and x at [./src/components/head/ogx.astro](./src/components/head/ogx.astro). Extend if you want to.
12. Define your page structure and adjust the given demo structure under ./src/pages/ by creating a file (can be empty at first) per page. If you support >1 language, you should have a subfolder for that language as well as the generic [lang] folder. Pages, where i18n only happens via translated string go into [lang]. This keeps things simple. If you are changing a lot per language (different content) or have huge text blocks, put them in the explicit subfolder and hard-code the text.
13. Check the layout files at ./src/layouts and also everything within ./src/components/layout. Adjust to match the general layout of your website.
14. Already while building the layout, adjust the content of the json files in ./src/i18n/ to match your project.
15. Adjust or delete the [map data file](./public/map/office.pmtiles), which is used at the demo contact page.
16. Delete the demo content in ./src/images. Mind to keep the folder structure for the content! The images for your website should go into this images folder, images for articles and integrations into their respective subdirectoy. Fyi: Use ./public/images/ for images that need to be available via a clean and stable url to external pages/services/bots and **are not** about articles. Use ./public/data/ for public files you want to share - files used in articles go into the respective subfolder.
17. Adjust the [`_headers`](./public/_headers) and [`_redirects`](./public/_redirects) files - only if on Cloudflare. Check their [documentation](https://developers.cloudflare.com/workers/static-assets/).
18. Prepare for deployment. If going with Cloudflare, you can use the integrated wrangler/worker config. Adjust the [wrangler.jsonc](./wrangler.jsonc) to your needs and link your (usually) GitHub repository with a Cloudflare worker. Set environment variables for `CF_PURGE_API_KEY` and `CF_PURGE_ZONE_ID` and set `npm run purge:cloudflare` as command after build to clean the cache on each deployment.

### Additional things you might want to check

1. Check the [astro.config.ts](./astro.config.ts) file. It holds the base Astro configuration. Theoretically, you do not need to touch it, if your project is close to the boilerplate. See the [official Astro docs](https://astro.build/config) for more information on what you can set up there.
2. In ./src/components/structured, we define a Schema.org structure for the website. This is covering an opinionated base scope. Extend, if you want to go wild on this.
3. The [webmcp-tools.astro](./src/components/webmcp-tools.astro) presents some basic tools to the new concept of [WebMCP](https://astro-stardrive.com/blog/webmcp-introduction). This is rather experimental and acts as base and inspiration. Extend it to your needs, if you want.
4. Adjus the ESLint, Typescript, and Prettier rules, if you have special needs here and do not like the default.
5. In [astro.config.ts](./astro.config.ts), we explicitly disabled the session functionality, so the page can be easier deployed. Check it, if you require session handling.

<br />

---

<br />

## 🤗 Support it!

You like this project? It would be awesome if you would support it, so it lives on!

- ⭐ [Star the repository](#) in order to stay up-to-date and save it for later!
- 📣 Spread the word! On X, Medium, Discord, Facebook, ...
- 💌 Send us some positive feedback at the [discussion board](https://github.com/peltmonger/stardrive/discussions).

<br /><br />

## ⚡ Changelog

Find all minor and major changes at the [CHANGELOG.md](CHANGELOG.md).

<br /><br />

## 🙌 Contributing

Anyone is welcome to contribute. Mind the [guidelines](.github/CONTRIBUTING.md):

- [Bug reports](.github/CONTRIBUTING.md#bugs)
- [Feature requests](.github/CONTRIBUTING.md#features)
- [Pull requests](.github/CONTRIBUTING.md#pull-requests)

**IMPORTANT NOTE:** Run `npm install` and `npm run format` to auto-lint!

<br /><br />

## 📃 Copyright and License

Created by [Jens Kuerschner](https://jekuer.com) (Peltmonger Ventures GmbH).

Licensed under the [MIT License](LICENSE.txt).

<br />
