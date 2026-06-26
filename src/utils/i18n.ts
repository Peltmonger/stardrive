import { getRelativeLocaleUrl, getAbsoluteLocaleUrl } from 'astro:i18n';
import { themeConfig } from '~/theme.config';
import { getCollection, getEntry } from 'astro:content';
import type { CollectionKey, CollectionEntry } from 'astro:content';

const defaultLocale = themeConfig.i18n.defaultLocale;

// Safe accessor for dynamic keys to avoid object-injection sinks
function getProp(obj: unknown, key: string | number): unknown {
  if (obj == null || typeof obj !== 'object' || !Object.hasOwn(obj, key)) return undefined;
  // eslint-disable-next-line security/detect-object-injection -- key existence verified via Object.hasOwn
  return (obj as Record<string, unknown>)[key];
}

// Dynamically assign to the translations object
const translations = Object.fromEntries(themeConfig.i18n.locales.map((lang) => [lang, getProp(themeConfig.i18n.languageModules, lang)])) as {
  [key: string]: {
    [key: string]: string | { [key: string]: string | { [key: string]: string } };
  };
};

// function to be able to use t() in astro components
export function useTranslations(lang?: keyof typeof translations) {
  if (!lang || lang === '') lang = defaultLocale;
  return function t(key: keyof (typeof translations)[typeof defaultLocale]): string {
    const keyParts = key.toString().split('.');
    if (keyParts.length > 1) {
      const cleanedSecond = keyParts[1].toLowerCase().replace(/\s/g, '-');
      const cleanedThird = keyParts.length > 2 ? keyParts[2].toLowerCase().replace(/\s/g, '-') : '';
      for (const source of [lang, defaultLocale]) {
        const firstLevel = getProp(getProp(translations, source), keyParts[0]);
        if (firstLevel && typeof firstLevel === 'object') {
          if (cleanedThird) {
            const secondLevel = getProp(firstLevel, cleanedSecond);
            if (secondLevel && typeof secondLevel === 'object') {
              const thirdLevel = getProp(secondLevel, cleanedThird);
              if (thirdLevel != null) return String(thirdLevel);
            }
          } else {
            const value = getProp(firstLevel, cleanedSecond);
            if (typeof value === 'string') return value;
          }
        }
      }
      return keyParts[keyParts.length - 1].toString();
    }
    const cleanedKey = keyParts[0].toLowerCase().replace(/\s/g, '-');
    const value = (getProp(getProp(translations, lang), cleanedKey) ?? getProp(getProp(translations, defaultLocale), cleanedKey)) as string | undefined;
    return (value ?? keyParts[0]).toString();
  };
}

// function to get the current path without the locale
export function getUrlWithoutLocale(url: URL, currentLang?: keyof typeof translations) {
  const path = url.pathname;
  if (!currentLang || currentLang === defaultLocale || path === '/') return path;
  return path === `/${currentLang}` || path === `/${currentLang}.html` ? '/' : path.replace(`/${currentLang}/`, '/');
}

// get path with locale, minding the dynamic nature of content
export async function getLocaleUrlWithContent(entryId: string, collection: CollectionKey, targetLang: keyof typeof translations, absolute?: boolean, absoluteBasePath?: string) {
  // get entry first
  const baseEntry = await getEntry(collection, entryId);
  // if baseEntry includes i18nSlug, we use that, otherwise we use the entryId
  const i18nSlug = baseEntry && 'i18nSlug' in baseEntry.data ? baseEntry.data.i18nSlug : undefined;
  const targetId = (getProp(i18nSlug, targetLang) as string | undefined) ?? entryId;
  if (!targetLang) targetLang = defaultLocale;
  const contentEntries = [
    ...new Set(
      (
        (await getCollection(collection, ({ data }) => {
          return !data.draft;
        })) as CollectionEntry<typeof collection>[]
      )
        .map((entry) => (entry.id === targetLang + '/' + targetId.split('/').pop() ? targetId.split('/').pop() : null))
        .filter(Boolean),
    ),
  ];
  // fallback
  return getLocaleUrl((absoluteBasePath ? absoluteBasePath + '/' : '') + (contentEntries[0] ? contentEntries[0].split('/').pop() : targetId.split('/').pop()), targetLang, absolute);
}

// get path with locale
export function getLocaleUrl(slug: string, targetLang?: keyof typeof translations, absolute?: boolean) {
  if (!targetLang) targetLang = defaultLocale;
  if (slug === '/' && targetLang === defaultLocale) return absolute ? themeConfig.site + '/' : '/';
  const path = absolute ? getAbsoluteLocaleUrl(targetLang.toString(), slug) : getRelativeLocaleUrl(targetLang.toString(), slug);
  return path.replace(/\/$/, '');
}

// validating if the translated path exists
export async function checkTranslatedPath(currentLocale: keyof typeof translations, noi18n?: boolean, collection?: CollectionKey, entryId?: string) {
  const i18nSlug = await (async function () {
    if (!collection || !entryId) return null;
    const baseEntry = await getEntry(collection, entryId);
    return baseEntry && 'i18nSlug' in baseEntry.data ? baseEntry.data.i18nSlug : null;
  })();
  const contentEntries =
    collection && entryId
      ? [
          ...new Set(
            (
              (await getCollection(collection, ({ data }) => {
                return !data.draft;
              })) as CollectionEntry<typeof collection>[]
            )
              .map((entry) => (entry.id.endsWith('/' + entryId.split('/').pop()) || getProp(i18nSlug, entry.id.split('/')[0]) ? entry.id.split('/')[0] : null))
              .filter(Boolean),
          ),
        ]
      : [];
  // unfortunately, at the moment only works with content collections
  // TODO: when there is a stable way to identify whether the target page is 404, adjust the logic here
  return Object.fromEntries(
    Object.keys(translations).map((languageCode) => {
      if (languageCode === currentLocale) return [languageCode, true];
      if (noi18n) return [languageCode, false];
      if (collection && entryId) return [languageCode, contentEntries.includes(languageCode)];
      return [languageCode, true];
    }),
  ) as Record<string, boolean>;
}
