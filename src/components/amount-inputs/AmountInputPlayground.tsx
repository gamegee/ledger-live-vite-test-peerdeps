import { useMemo, useState } from "react";
import {
  SegmentedControl,
  SegmentedControlButton,
  Tag,
} from "@ledgerhq/lumen-ui-react";
import { getLocaleSeparators } from "./locale";
import { AmountInputStringDemo } from "./AmountInputString";
import { AmountInputNumberDemo } from "./AmountInputNumber";
import { AmountInputGenericDemo } from "./AmountInputGeneric";
import { AmountInputLiveFormatDemo } from "./AmountInputLiveFormat";

const LOCALES = [
  { value: "en-US", label: "US" },
  { value: "fr-FR", label: "FR" },
  { value: "de-DE", label: "DE" },
];

type VariantMeta = {
  id: string;
  title: string;
  valueType: string;
  tag: "accent" | "success" | "warning" | "gray";
  description: string;
  Demo: (props: { locale: string }) => React.ReactNode;
};

const VARIANTS: VariantMeta[] = [
  {
    id: "string",
    title: "Canonical string",
    valueType: 'value: "1234.56"',
    tag: "accent",
    description:
      "value / onChange speak a canonical string. Consumer owns locale parse & format. Formats on blur.",
    Demo: AmountInputStringDemo,
  },
  {
    id: "number",
    title: "Number",
    valueType: "value: number",
    tag: "warning",
    description:
      "Real number end-to-end via Intl.NumberFormat. Can't hold in-progress state: trailing '.' and trailing zeros are lost.",
    Demo: AmountInputNumberDemo,
  },
  {
    id: "generic",
    title: "Generic T",
    valueType: "value: T",
    tag: "success",
    description:
      "Component is agnostic of T. Here T is a bigint of minor units (2 decimals). Consumer supplies parse: string→T and format: T→string.",
    Demo: AmountInputGenericDemo,
  },
  {
    id: "live",
    title: "Canonical string · live format",
    valueType: 'value: "1234.56"',
    tag: "accent",
    description:
      "Same string contract, but grouping appears while typing with caret preservation. Canonical strings keep in-progress state.",
    Demo: AmountInputLiveFormatDemo,
  },
];

function LayerLegend() {
  const layers = [
    { owner: "Lumen", text: "safety-gate — is this char allowed at all? (not locale-aware)" },
    { owner: "consumer", text: "parse — which canonical number did they mean? (locale-aware)" },
    { owner: "consumer", text: "format — how should it look here? (locale-aware)" },
  ];
  return (
    <div className="flex flex-col gap-6">
      {layers.map((l) => (
        <div key={l.text} className="flex items-center gap-8">
          <span
            className={
              l.owner === "Lumen"
                ? "body-4 rounded-xs bg-active-subtle px-6 py-2 text-active"
                : "body-4 rounded-xs bg-muted-transparent px-6 py-2 text-muted"
            }
          >
            {l.owner}
          </span>
          <span className="body-3 text-muted">{l.text}</span>
        </div>
      ))}
    </div>
  );
}

export function AmountInputPlayground() {
  const [locale, setLocale] = useState("en-US");
  const separators = useMemo(() => getLocaleSeparators(locale), [locale]);

  const renderSeparator = (value: string) =>
    value === " " || /\s/.test(value) ? "space" : value;

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-32 px-32 py-40">
      <header className="flex flex-col gap-12">
        <h1 className="heading-3-semi-bold text-base">AmountInput v2 — strategies</h1>
        <p className="body-2 text-muted">
          Every variant runs the same 3-layer pipeline. Type letters, symbols,
          spaces, dots and commas and watch each layer react below the field.
        </p>
        <LayerLegend />
      </header>

      <div className="flex flex-wrap items-center gap-16">
        <SegmentedControl
          selectedValue={locale}
          onSelectedChange={setLocale}
          tabLayout="fit"
        >
          {LOCALES.map((l) => (
            <SegmentedControlButton key={l.value} value={l.value}>
              {l.label}
            </SegmentedControlButton>
          ))}
        </SegmentedControl>
        <div className="flex items-center gap-8">
          <Tag appearance="gray" size="sm" label={`locale: ${locale}`} />
          <Tag appearance="gray" size="sm" label={`group: ${renderSeparator(separators.group)}`} />
          <Tag appearance="gray" size="sm" label={`decimal: ${separators.decimal}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-24 xl:grid-cols-2">
        {VARIANTS.map(({ id, title, valueType, tag, description, Demo }) => (
          <section
            key={id}
            className="flex flex-col gap-16 rounded-lg border border-muted-subtle bg-canvas-muted p-24"
          >
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between gap-12">
                <h2 className="heading-5-semi-bold text-base">{title}</h2>
                <Tag appearance={tag} size="sm" label={valueType} />
              </div>
              <p className="body-3 text-muted">{description}</p>
            </div>
            <Demo locale={locale} />
          </section>
        ))}
      </div>
    </div>
  );
}
