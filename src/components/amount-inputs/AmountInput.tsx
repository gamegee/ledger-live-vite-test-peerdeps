import { useEffect, useMemo, useState } from "react";

export type FormatMode = "blur" | "change";

/**
 * Canonical-string AmountInput — the consumer only provides `format`.
 *
 * - value / onChange speak a canonical string, e.g. "1234.56" (dot decimal, no grouping).
 * - `format` turns that canonical string into the locale display (the only fn needed).
 * - The reverse direction (display -> canonical) is derived from `format`, so no `parse` prop.
 * - mode: "blur" shows raw text while typing then formats on blur; "change" formats live.
 */
export interface AmountInputProps {
  value: string;
  onChange: (canonical: string) => void;
  format: (canonical: string) => string;
  mode: FormatMode;
  currencyText?: string;
}

// Safety gate (always on, not locale-aware): keep digits, separators, spaces.
const gate = (raw: string) => raw.replace(/[^0-9.,\s]/g, "");

// Build the display -> canonical parser purely from `format`.
function deriveParse(format: (canonical: string) => string) {
  const seps = [...format("1234567.8")].filter((c) => c < "0" || c > "9");
  const decimal = seps.at(-1) ?? ".";
  const group = seps.find((c) => c !== decimal) ?? "";

  return (gated: string): string => {
    const digits = /\s/.test(group) || group === ""
      ? gated.replace(/\s/g, "")
      : gated.split(group).join("");
    const [int = "", ...rest] = digits.split(decimal);
    const decimals = rest.join("").replace(/\D/g, "");
    const integer = int.replace(/\D/g, "");
    if (!integer && !decimals) return "";
    return digits.includes(decimal) ? `${integer}.${decimals}` : integer;
  };
}

export function AmountInput({ value, onChange, format, mode, currencyText }: AmountInputProps) {
  const parse = useMemo(() => deriveParse(format), [format]);
  const [buffer, setBuffer] = useState(() => format(value));
  const [editing, setEditing] = useState(false);

  // Keep the display in sync with the value whenever the user isn't typing.
  useEffect(() => {
    if (!editing) setBuffer(format(value));
  }, [editing, value, format]);

  // "change" re-formats live; "blur" shows the raw typed text until focus is lost.
  const display = mode === "change" ? format(value) : buffer;

  return (
    <div className="flex h-56 items-center gap-8 rounded-sm bg-muted px-16 transition-colors focus-within:ring-2 focus-within:ring-active hover:bg-muted-hover">
      {currencyText ? (
        <span className="heading-4-semi-bold shrink-0 text-muted">{currencyText}</span>
      ) : null}
      <input
        className="heading-4-semi-bold w-full min-w-0 bg-transparent text-base caret-active outline-hidden"
        inputMode="decimal"
        placeholder="0"
        value={display}
        onFocus={() => setEditing(true)}
        onBlur={() => setEditing(false)}
        onChange={(event) => {
          const gated = gate(event.target.value);
          setBuffer(gated);
          onChange(parse(gated));
        }}
      />
    </div>
  );
}
