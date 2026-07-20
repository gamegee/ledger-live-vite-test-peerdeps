import { useMemo, useState } from "react";
import { AmountFieldFrame, AmountFieldInput, MetadataPanel, Quoted } from "./shared";
import { useFormatOnBlurField, type GateDebug } from "./field-utils";
import { getLocaleSeparators, makeStringFormat, makeStringParse } from "./locale";

/**
 * VARIANT 3 — Generic `T` value (Gaetan's design).
 *
 * The component never learns what `T` is. The consumer supplies `parse`
 * (string -> T) and `format` (T -> string), so `T` can be a number, a
 * `bigint` of minor units, a Decimal.js instance, etc. Lumen still owns the
 * always-on safety gate; everything type-specific lives with the consumer.
 *
 *   value:    T
 *   onChange: (value: T) => void
 *   parse:    (raw: string) => T
 *   format:   (value: T) => string
 */
export interface AmountInputGenericProps<T> {
  value: T;
  onChange: (value: T) => void;
  parse: (gated: string) => T;
  format: (value: T) => string;
  currencyText?: string;
  currencyPosition?: "left" | "right";
  onGate?: (debug: GateDebug) => void;
}

export function AmountInputGeneric<T>({
  value,
  onChange,
  parse,
  format,
  currencyText,
  currencyPosition,
  onGate,
}: AmountInputGenericProps<T>) {
  const { inputProps } = useFormatOnBlurField<T>({
    value,
    parse,
    format,
    onChange,
    onGate,
  });

  return (
    <AmountFieldFrame currencyText={currencyText} currencyPosition={currencyPosition}>
      <AmountFieldInput placeholder="0" {...inputProps} />
    </AmountFieldFrame>
  );
}

// --- Consumer instantiation of T: a precise `bigint` amount in minor units ---
// (2 decimals for EUR). This is the kind of type the component must stay
// agnostic about while still driving the field.
const DECIMALS = 2;

function toMinorUnits(canonical: string): bigint | null {
  if (canonical === "") return null;
  const negative = canonical.startsWith("-");
  const body = negative ? canonical.slice(1) : canonical;
  const [intPart = "", decPart = ""] = body.split(".");
  const decPadded = (decPart + "0".repeat(DECIMALS)).slice(0, DECIMALS);
  const units = BigInt((intPart || "0") + decPadded);
  return negative ? -units : units;
}

function fromMinorUnits(units: bigint | null): string {
  if (units === null) return "";
  const negative = units < 0n;
  const digits = (negative ? -units : units).toString().padStart(DECIMALS + 1, "0");
  const intPart = digits.slice(0, digits.length - DECIMALS);
  const decPart = digits.slice(digits.length - DECIMALS);
  return (negative ? "-" : "") + `${intPart}.${decPart}`;
}

export function AmountInputGenericDemo({ locale }: { locale: string }) {
  const separators = useMemo(() => getLocaleSeparators(locale), [locale]);
  const parseString = useMemo(() => makeStringParse(separators), [separators]);
  const formatString = useMemo(() => makeStringFormat(separators), [separators]);

  const parse = useMemo(
    () => (gated: string) => toMinorUnits(parseString(gated)),
    [parseString],
  );
  const format = useMemo(
    () => (units: bigint | null) => formatString(fromMinorUnits(units)),
    [formatString],
  );

  const [value, setValue] = useState<bigint | null>(123456n);
  const [gate, setGate] = useState<GateDebug>({ raw: "", gated: "" });

  return (
    <div className="flex flex-col gap-12">
      <AmountInputGeneric<bigint | null>
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
            label: "3 · parsed (value: T)",
            owner: "consumer",
            tone: "success",
            value: (
              <>
                {value === null ? "null" : `${value}n`}
                <span className="text-muted"> · bigint minor units</span>
              </>
            ),
          },
          {
            label: "4 · formatted",
            owner: "consumer",
            value: <Quoted value={format(value)} />,
          },
        ]}
      />
    </div>
  );
}
