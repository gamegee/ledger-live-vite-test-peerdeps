import { useMemo, useState } from "react";
import { AmountFieldFrame, AmountFieldInput, MetadataPanel, Quoted } from "./shared";
import { useFormatOnBlurField, type GateDebug } from "./field-utils";
import { getLocaleSeparators, makeStringFormat, makeStringParse } from "./locale";

/**
 * VARIANT 1 — Canonical `string` value.
 *
 * Simon's original proposal: `value` / `onChange` speak a canonical string
 * ("1234.56"). The consumer owns `parse` (locale text -> canonical) and
 * `format` (canonical -> locale text). Lumen owns the always-on safety gate.
 * Display formats on blur so the caret is never fought while typing.
 */
export interface AmountInputStringProps {
  value: string;
  onChange: (canonical: string) => void;
  parse: (gated: string) => string;
  format: (canonical: string) => string;
  currencyText?: string;
  currencyPosition?: "left" | "right";
  onGate?: (debug: GateDebug) => void;
}

export function AmountInputString({
  value,
  onChange,
  parse,
  format,
  currencyText,
  currencyPosition,
  onGate,
}: AmountInputStringProps) {
  const { inputProps } = useFormatOnBlurField({
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

export function AmountInputStringDemo({ locale }: { locale: string }) {
  const separators = useMemo(() => getLocaleSeparators(locale), [locale]);
  const parse = useMemo(() => makeStringParse(separators), [separators]);
  const format = useMemo(() => makeStringFormat(separators), [separators]);

  const [value, setValue] = useState("1234.56");
  const [gate, setGate] = useState<GateDebug>({ raw: "", gated: "" });

  return (
    <div className="flex flex-col gap-12">
      <AmountInputString
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
            label: "4 · formatted",
            owner: "consumer",
            value: <Quoted value={format(value)} />,
          },
        ]}
      />
    </div>
  );
}
