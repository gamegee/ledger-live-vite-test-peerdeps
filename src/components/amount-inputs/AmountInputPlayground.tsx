import { useMemo, useState } from "react";
import { SegmentedControl, SegmentedControlButton } from "@ledgerhq/lumen-ui-react";
import { AmountInput, type FormatMode } from "./AmountInput";

const LOCALES = [
  { value: "en-US", label: "US" },
  { value: "fr-FR", label: "FR" },
  { value: "de-DE", label: "DE" },
];

const MODES = [
  { value: "blur", label: "On blur" },
  { value: "change", label: "On change" },
];

/** Locale grouping/decimal separators, straight from Intl. */
function getSeparators(locale: string) {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  return {
    group: parts.find((p) => p.type === "group")?.value ?? ",",
    decimal: parts.find((p) => p.type === "decimal")?.value ?? ".",
  };
}

/** Canonical string -> locale display. This is the consumer's only function. */
function makeFormat(locale: string) {
  const { group, decimal } = getSeparators(locale);
  console.log({group, decimal})
  return (canonical: string): string => {
    if (canonical === "") return "";
    const [int = "", dec = ""] = canonical.split(".");
    const grouped = (int.replace(/\D/g, "") || "0").replace(/\B(?=(\d{3})+(?!\d))/g, group);
    return canonical.includes(".") ? grouped + decimal + dec : grouped;
  };
}

export function AmountInputPlayground() {
  const [locale, setLocale] = useState("en-US");
  const [mode, setMode] = useState<FormatMode>("blur");
  const [value, setValue] = useState("1234.56");
  const format = useMemo(() => makeFormat(locale), [locale]);

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col gap-24 px-32 py-40">
      <h1 className="heading-4-semi-bold text-base">AmountInput — canonical string (format only)</h1>

      <div className="flex flex-wrap gap-24">
        <div className="flex flex-col gap-8">
          <span className="body-4 text-muted">Formatting</span>
          <SegmentedControl
            selectedValue={mode}
            onSelectedChange={(v) => setMode(v as FormatMode)}
            tabLayout="fit"
          >
            {MODES.map((m) => (
              <SegmentedControlButton key={m.value} value={m.value}>
                {m.label}
              </SegmentedControlButton>
            ))}
          </SegmentedControl>
        </div>

        <div className="flex flex-col gap-8">
          <span className="body-4 text-muted">Locale</span>
          <SegmentedControl selectedValue={locale} onSelectedChange={setLocale} tabLayout="fit">
            {LOCALES.map((l) => (
              <SegmentedControlButton key={l.value} value={l.value}>
                {l.label}
              </SegmentedControlButton>
            ))}
          </SegmentedControl>
        </div>
      </div>

      <AmountInput value={value} onChange={setValue} format={format} mode={mode} currencyText="€" />

      <div className="flex flex-col gap-4 rounded-sm bg-surface p-12">
        <div className="body-3 text-muted">
          value (canonical):{" "}
          <span className="text-base">{value === "" ? "(empty)" : value}</span>
        </div>
        <div className="body-3 text-muted">
          formatted: <span className="text-base">{format(value) || "(empty)"}</span>
        </div>
      </div>
    </div>
  );
}
