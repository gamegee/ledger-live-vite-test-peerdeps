/**
 * CONSUMER-OWNED locale helpers.
 *
 * Lumen provides these as a sensible default, but the consumer (e.g. Swap) can
 * swap them out with its own formatter helpers. They implement LAYER 2 (parse)
 * and LAYER 3 (format) from the design:
 *
 *   parse:  "given this locale, what canonical number did the user mean?"
 *   format: "how should this canonical number look in this locale?"
 *
 * The canonical representation is always a plain string like "1234.56" (dot as
 * decimal separator, no grouping) so it round-trips cleanly to Number/BigInt.
 */

export interface LocaleSeparators {
  /** Thousands / grouping separator, e.g. "," (US), " " (FR), "." (DE). */
  group: string;
  /** Decimal separator, e.g. "." (US) or "," (FR / DE). */
  decimal: string;
}

/**
 * Derives the grouping and decimal separators for a locale straight from
 * `Intl.NumberFormat`. fr-FR resolves to a narrow no-break space (U+202F) for
 * grouping, which is exactly why we let Intl tell us rather than hardcoding.
 */
export function getLocaleSeparators(locale: string): LocaleSeparators {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  const group = parts.find((p) => p.type === "group")?.value ?? ",";
  const decimal = parts.find((p) => p.type === "decimal")?.value ?? ".";
  return { group, decimal };
}

/**
 * LAYER 2 — PARSE (locale-aware). Safety-gated text -> canonical number string.
 */
export function makeStringParse({ group, decimal }: LocaleSeparators) {
  const groupIsWhitespace = /\s/.test(group);

  return (gated: string): string => {
    // Drop grouping separators, they carry no value.
    const withoutGroups = groupIsWhitespace
      ? gated.replace(/\s/g, "")
      : gated.split(group).join("");

    const hasDecimal = withoutGroups.includes(decimal);
    const [intRaw = "", ...rest] = withoutGroups.split(decimal);
    const decDigits = rest.join("").replace(/\D/g, "");
    const intDigits = intRaw.replace(/\D/g, "");

    if (!intDigits && !decDigits) return "";
    if (!hasDecimal) return intDigits;
    return `${intDigits}.${decDigits}`;
  };
}

/**
 * LAYER 3 — FORMAT (locale-aware). Canonical number string -> display string.
 *
 * Preserves an in-progress trailing decimal separator and trailing zeros
 * ("12." / "12.50"), which a `number`-based formatter cannot.
 */
export function makeStringFormat({ group, decimal }: LocaleSeparators) {
  return (canonical: string): string => {
    if (canonical === "") return "";

    const negative = canonical.startsWith("-");
    const body = negative ? canonical.slice(1) : canonical;
    const hasDecimal = body.includes(".");
    const [intRaw = "", decRaw = ""] = body.split(".");

    const intClean = intRaw.replace(/\D/g, "") || "0";
    const grouped = intClean.replace(/\B(?=(\d{3})+(?!\d))/g, group);

    let out = grouped;
    if (hasDecimal) out += decimal + decRaw.replace(/\D/g, "");
    return (negative ? "-" : "") + out;
  };
}

/** Number of digit characters in `s` located before `index`. */
export function countDigitsBefore(s: string, index: number): number {
  let n = 0;
  for (let i = 0; i < index && i < s.length; i++) {
    if (s[i] >= "0" && s[i] <= "9") n++;
  }
  return n;
}

/** Caret offset positioned right after the `n`-th digit of `s`. */
export function caretAfterNthDigit(s: string, n: number): number {
  if (n <= 0) return 0;
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] >= "0" && s[i] <= "9") {
      count++;
      if (count === n) return i + 1;
    }
  }
  return s.length;
}
