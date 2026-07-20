/**
 * LAYER 1 — SAFETY GATE (Lumen-owned, always on, NOT locale-aware).
 *
 * The only question this layer answers is: "is this character even allowed to
 * appear in a number field at all?". It strips letters, currency symbols and
 * any other noise, but keeps digits and BOTH separator characters (`.` / `,`)
 * plus whitespace used for grouping. It deliberately does NOT know the locale —
 * interpreting the separators is the job of the consumer-owned parse layer.
 *
 * Examples (locale-agnostic):
 *   "12a3$"      -> "123"
 *   "1.234,56"   -> "1.234,56"   (kept intact for parse to interpret)
 *   "€ 1 234,5"  -> " 1 234,5"   (currency removed, digits/separators kept)
 *   "abc"        -> ""
 */
const DISALLOWED = /[^0-9.,\s]/g;

export function safetyGate(raw: string): string {
  return raw.replace(DISALLOWED, "");
}
