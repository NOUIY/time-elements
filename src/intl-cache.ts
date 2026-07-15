// Shared, memoized `Intl` factories.
//
// Constructing an `Intl.*Format` instance is expensive — frequently more costly
// than the subsequent `.format()` call. `<relative-time>` re-formats on every
// tick, and a page can render hundreds of elements, so building fresh
// formatters per render is a meaningful, avoidable cost.
//
// These helpers reuse a single instance per (locale, options) combination
// across every element on the page. Formatters are immutable and stateless, so
// sharing is safe. The number of distinct combinations on a page is small and
// bounded, so a plain `Map` is sufficient and needs no eviction.

function cacheKey(locale: string, options?: object): string {
  // Options in this codebase are built as object literals with a stable key
  // order, so `JSON.stringify` produces a stable key. `undefined` values (e.g.
  // an absent `timeZone`) are dropped by `JSON.stringify`, which matches the
  // behaviour of passing them explicitly.
  return `${locale}\u0000${options ? JSON.stringify(options) : ''}`
}

const dateTimeFormats = new Map<string, Intl.DateTimeFormat>()
export function dateTimeFormat(locale: string, options?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = cacheKey(locale, options)
  let format = dateTimeFormats.get(key)
  if (!format) dateTimeFormats.set(key, (format = new Intl.DateTimeFormat(locale, options)))
  return format
}

const relativeTimeFormats = new Map<string, Intl.RelativeTimeFormat>()
export function relativeTimeFormat(locale: string, options?: Intl.RelativeTimeFormatOptions): Intl.RelativeTimeFormat {
  const key = cacheKey(locale, options)
  let format = relativeTimeFormats.get(key)
  if (!format) relativeTimeFormats.set(key, (format = new Intl.RelativeTimeFormat(locale, options)))
  return format
}

const numberFormats = new Map<string, Intl.NumberFormat>()
export function numberFormat(locale: string, options?: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = cacheKey(locale, options)
  let format = numberFormats.get(key)
  if (!format) numberFormats.set(key, (format = new Intl.NumberFormat(locale, options)))
  return format
}

const locales = new Map<string, Intl.Locale>()
export function getLocale(tag: string): Intl.Locale {
  let value = locales.get(tag)
  if (!value) locales.set(tag, (value = new Intl.Locale(tag)))
  return value
}
