import { useMemo, useRef, useState } from "react";
import { AmountFieldFrame, AmountFieldInput, MetadataPanel, Quoted } from "./shared";
import { type GateDebug } from "./field-utils";
import { safetyGate } from "./sanitize";
import {
  caretAfterNthDigit,
  countDigitsBefore,
  getLocaleSeparators,
  makeStringFormat,
  makeStringParse,
} from "./locale";

/**
 * VARIANT 4 — Canonical `string` value with LIVE formatting.
 *
 * Same string-in / string-out contract as Variant 1, but grouping separators
 * appear as you type. The tricky bit is the caret: after re-formatting we count
 * the digits before the caret and restore the position after the same digit, so
 * inserting a grouping space never makes the cursor jump. Canonical strings can
 * hold in-progress state ("12." / "12.50"), which is what makes live formatting
 * viable here where `number` would fail.
 */
export interface AmountInputLiveFormatProps {
  value: string;
  onChange: (canonical: string) => void;
  parse: (gated: string) => string;
  format: (canonical: string) => string;
  currencyText?: string;
  currencyPosition?: "left" | "right";
  onGate?: (debug: GateDebug) => void;
}

export function AmountInputLiveFormat({
  value,
  onChange,
  parse,
  format,
  currencyText,
  currencyPosition,
  onGate,
}: AmountInputLiveFormatProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const display = format(value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const raw = input.value;
    const caret = input.selectionStart ?? raw.length;
    const digitsBeforeCaret = countDigitsBefore(raw, caret);

    const gated = safetyGate(raw);
    const canonical = parse(gated);
    const nextDisplay = format(canonical);

    onGate?.({ raw, gated });
    onChange(canonical);

    // Restore the caret after React has painted the reformatted value.
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      const pos = caretAfterNthDigit(nextDisplay, digitsBeforeCaret);
      el.setSelectionRange(pos, pos);
    });
  };

  return (
    <AmountFieldFrame currencyText={currencyText} currencyPosition={currencyPosition}>
      <AmountFieldInput
        ref={inputRef}
        placeholder="0"
        value={display}
        onChange={handleChange}
      />
    </AmountFieldFrame>
  );
}

export function AmountInputLiveFormatDemo({ locale }: { locale: string }) {
  const separators = useMemo(() => getLocaleSeparators(locale), [locale]);
  const parse = useMemo(() => makeStringParse(separators), [separators]);
  const format = useMemo(() => makeStringFormat(separators), [separators]);

  const [value, setValue] = useState("1234.56");
  const [gate, setGate] = useState<GateDebug>({ raw: "", gated: "" });

  return (
    <div className="flex flex-col gap-12">
      <AmountInputLiveFormat
        value={value}
        onChange={setValue}
        parse={parse}
        format={format}
        currencyText="€"
        onGate={setGate}
      />
      <MetadataPanel
        rows={[
          { label: "1 · you typed", owner: "Lumen", value: <Quoted value={gate.raw} /> },
          { label: "2 · safety-gate", owner: "Lumen", value: <Quoted value={gate.gated} /> },
          {
            label: "3 · parsed (value)",
            owner: "consumer",
            tone: "success",
            value: <Quoted value={value} />,
          },
          {
            label: "4 · formatted (live)",
            owner: "consumer",
            value: <Quoted value={format(value)} />,
          },
        ]}
      />
    </div>
  );
}
