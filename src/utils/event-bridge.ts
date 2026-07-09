import { getCollection, getEntry } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { sanitizeTrustedHtmlFragment } from '@utils/security';
import { themeConfig } from '~/theme.config';

/**
 * Event bridge
 *
 * Single source of truth for reading events.
 * Depending on `themeConfig.dynamicEvents.pullFromAddToCalendarPro` the events are either read from the local `events` content collection or pulled live from the Add to Calendar PRO API (https://add-to-calendar-pro.com).
 *
 * All call sites keep working with the familiar `getCollection('events', predicate)` signature by calling {@link getEvents} instead, and `getEntry('events', id)` by calling {@link getEventEntry}.
 *
 * API notes:
 * - Base URL: https://api.add-to-calendar-pro.com/v1
 * - Auth: `Authorization: <API_KEY>` header (raw key, read scope is enough). The key is read from the `ADD_TO_CALENDAR_PRO_API_KEY` environment variable.
 * - `GET /event/all` is used for the overview/lists. We request an enriched payload so a single call is enough to build the list without hitting the per-event endpoint for every entry.
 * - `GET /event/:prokey` is used for the detail page (rich body/description).
 * - Since there are no translations for API events, every event is duplicated across all configured locales (id = `<locale>/<slug>`).
 */

const API_BASE = 'https://api.add-to-calendar-pro.com/v1';

type EventEntry = CollectionEntry<'events'>;

/** Predicate matching the callback shape of Astro's `getCollection`. */
type EventFilter = (entry: { id: string; data: EventEntry['data'] }) => boolean;

/** Whether events should be pulled from the Add to Calendar PRO API. */
export const usesDynamicEvents = (): boolean => Boolean(themeConfig.dynamicEvents?.pullFromAddToCalendarPro);

/** A single date inside an event. With `?dates=true` the `/all` endpoint returns one of these per date; an event can have more than one (multi-date event). */
interface ApiEventDate {
  /** Title of the date. */
  name?: string;
  /** Date part `YYYY-MM-DD`. */
  startDate: string;
  /** Date part `YYYY-MM-DD`. Falls back to `startDate` when omitted. */
  endDate?: string | null;
  /** Time part `HH:mm`. When both start/end time are missing the date is all-day. */
  startTime?: string | null;
  /** Time part `HH:mm`. */
  endTime?: string | null;
  timeZone?: string;
  location?: string;
  organizer_name?: string;
  organizer_email?: string;
  /** HTML description (used as the detail body). */
  description?: string;
}

/**
 * Shape of a single entry returned by `GET /event/all?dates=true`.
 * Each entry carries its dates; every date is exposed as its own event.
 */
interface ApiListEvent {
  prokey: string;
  dates?: ApiEventDate[];
}

/** Shape of the `GET /event/:prokey` response (subset we consume). */
interface ApiSingleEvent {
  status?: string;
  dates: ApiEventDate[];
  prokey: string;
}

/**
 * A synthetic event entry that mirrors `CollectionEntry<'events'>` but also carries a pre-rendered HTML body for events coming from the API (which have no markdown to `render()`).
 */
export type BridgeEventEntry = EventEntry & {
  /** `true` when the entry originates from the Add to Calendar PRO API. */
  dynamic?: boolean;
  /** Sanitized HTML body for dynamic events. */
  bodyHtml?: string;
  /** Add to Calendar PRO prokey the entry was derived from (API events only). */
  prokey?: string;
  /** Index of the date within the source event's `dates` array (API events only). */
  dateIndex?: number;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getApiKey = (): string => {
  const key = import.meta.env.ADD_TO_CALENDAR_PRO_API_KEY || process.env.ADD_TO_CALENDAR_PRO_API_KEY;
  if (!key) {
    throw new Error('dynamicEvents.pullFromAddToCalendarPro is enabled but ADD_TO_CALENDAR_PRO_API_KEY is not set.');
  }
  return key;
};

/** Build the query string for the `/all` request (always requesting the dates). */
const buildAllQuery = (): string => {
  const params = new URLSearchParams();
  // `dates=true` makes the endpoint return the full date objects per event
  params.set('dates', 'true');
  const filterBy = themeConfig.dynamicEvents?.filterBy;
  if (filterBy?.from) params.set('from', filterBy.from);
  if (filterBy?.to) params.set('to', filterBy.to);
  if (filterBy?.group) params.set('group', filterBy.group);
  return `?${params.toString()}`;
};

const apiFetch = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: getApiKey() },
  });
  if (!response.ok) {
    throw new Error(`Add to Calendar PRO API request failed (${response.status}) for ${path}`);
  }
  return (await response.json()) as T;
};

const toDate = (value?: string | null, fallback?: Date): Date => {
  if (!value) return fallback ?? new Date();
  const date = new Date(value);
  return isNaN(date.getTime()) ? (fallback ?? new Date()) : date;
};

/**
 * Resolve a day value into a `YYYY-MM-DD` string.
 * Supports the relative schemes `today` (current UTC date) and `today+x` (current UTC date plus `x` days).
 * Any other value is returned unchanged.
 */
const resolveDay = (day?: string | null): string | null | undefined => {
  if (!day) return day;
  const normalized = day.trim().toLowerCase().replace(/\s+/g, '');
  if (normalized !== 'today' && !normalized.startsWith('today+')) return day;
  const offset = normalized === 'today' ? 0 : Number(normalized.slice('today+'.length));
  if (isNaN(offset)) return day;
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
};

/** Combine a `YYYY-MM-DD` day (or `today`/`today+x`) and optional `HH:mm` time into a UTC Date. */
const combineDateTime = (day?: string | null, time?: string | null): Date => {
  const resolvedDay = resolveDay(day);
  return toDate(resolvedDay ? (time ? `${resolvedDay}T${time}:00Z` : `${resolvedDay}T00:00:00Z`) : undefined);
};

// ---------------------------------------------------------------------------
// API → collection-entry mapping
// ---------------------------------------------------------------------------

/**
 * The URL slug for a date: the bare prokey for a single-date event, or
 * `<prokey>-<index>` for the 2nd and following dates of a multi-date event.
 */
const dateSlug = (prokey: string, index: number, total: number): string => (total > 1 ? `${prokey}-${index}` : prokey);

/** Map a single API date to the event collection `data` shape. */
const dateToData = (date: ApiEventDate): EventEntry['data'] => {
  const start = combineDateTime(date.startDate, date.startTime);
  const end = combineDateTime(date.endDate ?? date.startDate, date.endTime);
  // all-day when neither a start nor an end time is provided
  const allDay = !date.startTime && !date.endTime;

  return {
    publishDate: start,
    draft: false,
    title: date.name ?? '',
    description: date.description ? stripHtml(date.description) : undefined,
    startDate: start,
    endDate: end,
    allDay,
    timeZone: date.timeZone ?? undefined,
    location: date.location ?? undefined,
    organizer: date.organizer_name ? { name: date.organizer_name, email: date.organizer_email ?? '' } : undefined,
  };
};

/**
 * Build the per-locale synthetic entries for a single API list event.
 * Each date of the event becomes its own event (duplicated across all locales).
 * The prokey is the URL slug; multi-date events append the date index (`<prokey>-<index>`).
 */
const listEventToEntries = (event: ApiListEvent): BridgeEventEntry[] => {
  const dates = event.dates ?? [];
  return dates.flatMap((date, index) => {
    const slug = dateSlug(event.prokey, index, dates.length);
    const data = dateToData(date);
    return themeConfig.i18n.locales.map(
      (locale) =>
        ({
          id: `${locale}/${slug}`,
          collection: 'events',
          data,
          dynamic: true,
          prokey: event.prokey,
          dateIndex: index,
        }) as unknown as BridgeEventEntry,
    );
  });
};

/** Build a detail entry (with rich body) for one date of a single API event. */
const singleEventToEntry = (event: ApiSingleEvent, locale: string, slug: string, dateIndex: number): BridgeEventEntry | undefined => {
  const date = (event.dates ?? []).at(dateIndex);
  if (!date) return undefined;

  return {
    id: `${locale}/${slug}`,
    collection: 'events',
    data: {
      ...dateToData(date),
      icsFile: `https://event.caldn.net/${event.prokey}/event.ics`,
    },
    dynamic: true,
    bodyHtml: sanitizeTrustedHtmlFragment(date.description ?? ''),
    prokey: event.prokey,
    dateIndex,
  } as unknown as BridgeEventEntry;
};

/**
 * Remove HTML tags for use as a plain-text description.
 *
 * Implemented as a character walk rather than a single regex so that nested/broken
 * tag sequences (e.g. `<scr<script>ipt>`) cannot reassemble into a surviving tag
 * after a single pass — which is what CodeQL's incomplete-sanitization rule flags.
 * Common HTML entities are decoded first so the resulting plain text reads correctly.
 */
const stripHtml = (html: string): string => {
  // Single-pass entity decode: one regex sweep with a lookup map so each input
  // character is processed exactly once (avoids double-unescape where decoding
  // `&amp;` first could synthesize a new entity like `&lt;` from `&amp;lt;`).
  const entities: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
  };
  const decoded = html.replace(/&(amp|lt|gt|quot|apos|nbsp|#39);/g, (match, name) => {
    if (name === '#39') return "'";
    return entities[name as string] ?? match;
  });

  let out = '';
  let inTag = false;
  for (const ch of decoded) {
    if (ch === '<') {
      inTag = true;
      continue;
    }
    if (inTag) {
      if (ch === '>') inTag = false;
      continue;
    }
    out += ch;
  }
  return out.replace(/\s+/g, ' ').trim();
};

// ---------------------------------------------------------------------------
// Caching (per build/request lifetime)
// ---------------------------------------------------------------------------

let allEntriesPromise: Promise<BridgeEventEntry[]> | null = null;

const fetchAllEntries = (): Promise<BridgeEventEntry[]> => {
  if (!allEntriesPromise) {
    allEntriesPromise = apiFetch<ApiListEvent[]>(`/event/all${buildAllQuery()}`)
      .then((events) => (Array.isArray(events) ? events.flatMap(listEventToEntries) : []))
      .catch((error) => {
        allEntriesPromise = null;
        throw error;
      });
  }
  return allEntriesPromise;
};

const singleEntryCache = new Map<string, Promise<BridgeEventEntry | undefined>>();

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Drop-in replacement for `getCollection('events', predicate)`.
 *
 * Returns local markdown events when `dynamicEvents.pullFromAddToCalendarPro` is disabled, and Add to Calendar PRO API events (duplicated across all locales) when enabled.
 */
export const getEvents = async (filter?: EventFilter): Promise<EventEntry[]> => {
  if (!usesDynamicEvents()) {
    return getCollection('events', filter as Parameters<typeof getCollection>[1]) as unknown as EventEntry[];
  }
  const entries = await fetchAllEntries();
  const filtered = filter ? entries.filter((entry) => filter({ id: entry.id, data: entry.data })) : entries;
  return filtered as unknown as EventEntry[];
};

/**
 * Drop-in replacement for `getEntry('events', id)`.
 *
 * For markdown events this returns the real collection entry (so `render()` works).
 * For API events it fetches the single event and returns a synthetic entry carrying a `bodyHtml` string for the detail body.
 */
export const getEventEntry = async (id: string): Promise<BridgeEventEntry | undefined> => {
  if (!usesDynamicEvents()) {
    return getEntry('events', id) as unknown as Promise<BridgeEventEntry | undefined>;
  }

  const [locale, ...slugParts] = id.split('/');
  const slug = slugParts.join('/');

  if (!singleEntryCache.has(id)) {
    const promise = (async (): Promise<BridgeEventEntry | undefined> => {
      // resolve the source event + date index from the list (which carries the
      // prokey and date index, so multi-date slugs map back reliably).
      const list = await fetchAllEntries();
      const listed = list.find((entry) => entry.id === id) as BridgeEventEntry | undefined;
      if (!listed?.prokey) return undefined;
      const single = await apiFetch<ApiSingleEvent>(`/event/${listed.prokey}`);
      return singleEventToEntry(single, locale, slug, listed.dateIndex ?? 0);
    })();
    singleEntryCache.set(id, promise);
  }
  return singleEntryCache.get(id);
};
