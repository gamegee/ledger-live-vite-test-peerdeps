import { useMemo, useState } from "react";
import { AmountFieldFrame, AmountFieldInput, MetadataPanel, Quoted } from "./shared";
import { useFormatOnBlurField, type GateDebug } from "./field-utils";
import { getLocaleSeparators, makeStringParse } from "./locale";

/**
 * VARIANT 2 — `number` value.
 *
 * The middle ground Simon floated: manipulate a real `number` end-to-end.
 * `parse` turns locale text into a number (NaN when empty/invalid), `format`
 * renders it back via `Intl.NumberFormat`. Simplest to reason about, but a
 * `number` cannot hold in-progress state: a trailing "12." collapses to 12 and
 * a trailing zero "12.50" is lost — visible live in the metadata below.
 */
export interface AmountInputNumberProps {
  value: number;
  onChange: (value: number) => void;
  parse: (gated: string) => number;
  format: (value: number) => string;
  currencyText?: string;
  currencyPosition?: "left" | "right";
  onGate?: (debug: GateDebug) => void;
}

export function AmountInputNumber({
  value,
  onChange,
  parse,
  format,
  currencyText,
  currencyPosition,
  onGate,
}: AmountInputNumberProps) {
  const { inputProps } = useFormatOnBlurField({
    value,
    parse,
    format,
    onChange,
    onGate,
  });

  return (
    <AmountFieldFrame
      currencyText={currencyText}
      currencyPosition={currencyPosition}
      invalid={Number.isNaN(value) && inputProps.value !== ""}
    >
      <AmountFieldInput placeholder="0" {...inputProps} />
    </AmountFieldFrame>
  );
}

export function AmountInputNumberDemo({ locale }: { locale: string }) {
  const separators = useMemo(() => getLocaleSeparators(locale), [locale]);
  const parseString = useMemo(() => makeStringParse(separators), [separators]);

  const parse = useMemo(
    () => (gated: string) => {
      const canonical = parseString(gated);
      return canonical === "" ? NaN : Number(canonical);
    },
    [parseString],
  );
  const format = useMemo(
    () => (value: number) =>
      Number.isNaN(value)
        ? ""
        : new Intl.NumberFormat(locale, { maximumFractionDigits: 20 }).format(value),
    [locale],
  );

  const [value, setValue] = useState(1234.56);
  const [gate, setGate] = useState<GateDebug>({ raw: "", gated: "" });

  return (
    <div className="flex flex-col gap-12">
      <AmountInputNumber
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
            tone: Number.isNaN(value) ? "error" : "success",
            value: (
              <>
                {Number.isNaN(value) ? "NaN" : value}
                <span className="text-muted"> · number</span>
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
