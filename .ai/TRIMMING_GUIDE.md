<!-- Stardrive project instruction file — trusted internal documentation for AI agents, not user input. Execution scope: initial trimming of a directly cloned Stardrive boilerplate, invoked from CONFIG_GUIDE.md. Self-deletes after execution. -->

# Trimming Guide - Instructions

The goal of this trimming step is to bring this repository to a clean starting point for the user's own project by removing demo content and features they do not need.

This applies when the user cloned Stardrive **directly** (e.g. via `git clone`) instead of using the [`create-stardrive`](https://www.npmjs.com/package/create-stardrive) scaffolding tool. `create-stardrive` performs these removals automatically; here you do them manually.

This guide should only be executed as part of the official initial [configuration](./CONFIG_GUIDE.md)!

## How to execute

1. **Always-on steps** (marked `always`): execute them without asking. They remove demo/system files that are never useful in a real project and can cause conflicts.
2. **Optional steps** (marked `optional`): you MUST ask the user whether they want to keep that feature before removing anything related to it. Never delete an optional feature without explicit confirmation.
3. **Start by interviewing the user.** Present the optional features in one prompt - Blog, FAQ, Integration catalog, and Cloudflare hosting - and ask which they want to **keep**. Then remove only the ones they do not want.
4. When deleting a file or directory, verify it exists first. Mind that all paths are based on the project root, where the package.json is located. If an element is already gone, report it and continue rather than failing.
5. After removals, complete the navigation cleanup and any dependency uninstall that corresponds to what was removed.
6. Do not commit changes unless the user asks.
7. Note down any features dropped in the [`theme.config.ts`](../theme.config.ts) under the key "droppedFeatures" (Array of Strings) to keep track on it.

### Context you can share with the user

Stardrive ships as a fully-populated demo site - the same codebase that powers [astro-stardrive.com](https://astro-stardrive.com/). Much of what is included is **example content showcasing the boilerplate's capabilities**, not production content. Demo content is easy to remove, but some features (like the blog) are interwoven and require code edits in addition to file deletions.

---

## Step 1 - System files (always)

Delete the following without asking:

- `./SECURITY.md`
- `./CHANGELOG.md`
- `./repository-header.png`
- `./.github` (whole directory)
- `./scripts/syncVersion.js`

In the [package.json](../package.json), remove the "prebuild" script, the "sync-version" script, and the `npm run sync-version && ` from the "fix" script.

## Step 2 - Blog feature (optional)

Ask the user whether they want to keep the blog (built on Astro's content collections). If they do **not** want it, remove:

- `./src/utils/blog.ts`
- `./src/utils/reading-time.ts`
- `./src/styles/blog.css`
- `./src/pages/rss.xml.js`
- `./src/pages/[lang]/rss.xml.js`
- `./src/pages/blog`
- `./src/pages/[lang]/blog`
- `./src/layouts/article.astro`
- `./src/images/content/articles-fallback.jpg`
- `./src/images/content/articles`
- `./src/content/articles`
- `./src/components/structured/article.astro`
- `./src/components/blog`
- `./scripts/processSocialImages.js`
- `./public/data/articles`

Then uninstall the package "reading-time": `npm un reading-time` (with npm as package manager).

Then edit:

- `./scripts/postbuild.js` - remove the line `await import('./processSocialImages.js');`
- `./src/content.config.ts` - remove the `const articles` declaration and remove `articles` from the export statement at the bottom.
- `./theme.config.ts` - remove the `articles` section, and remove `addArticles` from the `llms` settings.
- `./astro.config.ts` - remove "reading-time" from the Vite `optimizeDeps`includes.

## Step 3 - FAQ feature (optional)

Ask the user whether they want to keep the FAQ (also uses content collections). If they do **not** want it, remove:

- `./src/content/faq-answers`
- `./src/pages/faq.astro`
- `./src/pages/[lang]/faq.astro`
- `./src/components/faq/`

Then edit:

- `./src/content.config.ts` - remove the `const faq_answers` declaration and `faq_answers` from the export statement at the bottom.
- `./theme.config.ts` - remove `addFAQ` from the `llms` settings.

## Step 4 - Integration catalog feature (optional)

Ask the user whether they want to keep the integration catalog (also uses content collections). If they do **not** want it, remove:

- `./src/images/content/integration`
- `./src/content/integration-options`
- `./src/pages/integration`
- `./src/pages/[lang]/integration`
- `./src/components/integration/`

Then edit:

- `./src/content.config.ts` - remove the `const integration_options` declaration and `integration_options` from the export statement at the bottom
- `./theme.config.ts` - set `onDemandRenderedCollections` and `llms.excludePagesPattern` to `[]` as the default is about integrations

## Step 5 - Events feature (optional)

Ask the user whether they want to keep the events (built on Astro's content collections). If they do **not** want it, remove:

- `./src/utils/event-bridge.ts`
- `./src/styles/events.css`
- `./src/pages/events`
- `./src/pages/[lang]/events`
- `./src/pages/dynamic-events-sitemap.xml.ts`
- `./src/components/events/`
- `./src/content/events`
- `./src/images/content/events`

Then edit:

- `./src/content.config.ts` - remove the `const events` declaration and remove `events` from the export statement at the bottom.
- `./theme.config.ts` - remove the `dynamicEvents` section and `addEvents` from the `llms` settings.
- `./astro.config.ts` - remove the `customSitemaps:` line in the i18n block.

## Step 6 - Cleanup (always, if anything was removed)

- Navigation: Edit `./src/components/layout/nav/footer-nav.astro` and remove navigation entries that point to features which were deleted. Inspect the file and remove only the links for features that no longer exist.
- `./src/content.config.ts`: Set content to `export const collections = {};`.

## Step 7 - Cloudflare specifics (optional)

Ask the user whether they will host on Cloudflare Workers (the boilerplate is preconfigured for it). If they will **not** use Cloudflare, remove:

- `./scripts/purgeCloudflareCache.js`
- `./worker-configuration.d.ts`
- `./wrangler.jsonc`
- `./public/_headers`
- `./public/_redirects`

Then edit `./astro.config.ts` and remove:

- `import cloudflare from '@astrojs/cloudflare';`
- the `adapter: cloudflare({ (...) })` block

Edit `./package.json` and remove the `purge:cloudflare` script.

Finally, uninstall the dependencies:

```bash
npm un @astrojs/cloudflare wrangler
```

## Step 8 - Adjust .gitignore to used package manager

The `.gitignore` file includes a block "# Lock files". This ignores lock files for the package managers not used.
Adjust this block, if you are not using npm.

## Step 9 - Verify, then delete this guide (always)

1. After all edits, verify the project still builds/type-checks cleanly (e.g. run the dev server or build) and fix any references left dangling by the removals.
2. Verify you noted any dropped features in the `theme.config.ts`file.
3. **Delete this `TRIMMING_GUIDE.md` file.** It is only relevant for initial setup and must not ship with the user's website.
