import { useEffect, useState, type ChangeEvent } from "react";
import { safetyGate } from "./sanitize";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export interface GateDebug {
  raw: string;
  gated: string;
}

/**
 * Shared "format on blur" behaviour used by the string / number / generic
 * variants. While the field is focused it shows the raw safety-gated text the
 * user is editing; on blur it snaps to the consumer's formatted representation.
 */
export function useFormatOnBlurField<T>({
  value,
  parse,
  format,
  onChange,
  onGate,
}: {
  value: T;
  parse: (gated: string) => T;
  format: (value: T) => string;
  onChange: (value: T) => void;
  onGate?: (debug: GateDebug) => void;
}) {
  const [buffer, setBuffer] = useState(() => format(value));
  const [focused, setFocused] = useState(false);

  // Keep the display in sync with the canonical value while not editing.
  useEffect(() => {
    if (!focused) setBuffer(format(value));
  }, [value, focused, format]);

  return {
    buffer,
    inputProps: {
      value: buffer,
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        const raw = event.target.value;
        const gated = safetyGate(raw);
        setBuffer(gated);
        onGate?.({ raw, gated });
        onChange(parse(gated));
      },
    },
  };
}
