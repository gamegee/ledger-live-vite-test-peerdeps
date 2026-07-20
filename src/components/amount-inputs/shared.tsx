import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "./field-utils";

const MONO: React.CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

/** Shared visual frame: focus ring + optional currency symbol on either side. */
export function AmountFieldFrame({
  currencyText,
  currencyPosition = "left",
  invalid,
  children,
}: {
  currencyText?: string;
  currencyPosition?: "left" | "right";
  invalid?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        "group flex h-56 items-center gap-8 rounded-sm bg-muted px-16 transition-colors",
        "focus-within:ring-2 focus-within:ring-active hover:bg-muted-hover",
        invalid && "ring-2 ring-error",
      )}
    >
      {currencyText && currencyPosition === "left" ? (
        <span className="heading-4-semi-bold shrink-0 text-muted">{currencyText}</span>
      ) : null}
      {children}
      {currencyText && currencyPosition === "right" ? (
        <span className="heading-4-semi-bold shrink-0 text-muted">{currencyText}</span>
      ) : null}
    </div>
  );
}

/** The bare input used by every variant, styled consistently. */
export const AmountFieldInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function AmountFieldInput(props, ref) {
  return (
    <input
      ref={ref}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      {...props}
      className={cx(
        "heading-4-semi-bold w-full min-w-0 bg-transparent text-base caret-active outline-hidden",
        "placeholder:text-muted-subtle",
        props.className,
      )}
    />
  );
});

/** Renders a string value making whitespace/emptiness obvious. */
export function Quoted({ value }: { value: string }) {
  if (value === "") return <span className="text-muted-subtle">(empty)</span>;
  return (
    <span className="text-base" style={MONO}>
      &quot;{value.replace(/\u00a0/g, "\u2423").replace(/\u202f/g, "\u2423")}&quot;
    </span>
  );
}

type Tone = "base" | "muted" | "success" | "error";

export interface MetaRow {
  label: string;
  owner?: "Lumen" | "consumer";
  value: ReactNode;
  tone?: Tone;
}

function toneClass(tone: Tone | undefined): string {
  switch (tone) {
    case "success":
      return "text-success";
    case "error":
      return "text-error";
    case "muted":
      return "text-muted";
    default:
      return "text-base";
  }
}

/** The runtime metadata panel rendered under every input. */
export function MetadataPanel({ rows }: { rows: MetaRow[] }) {
  return (
    <div className="flex flex-col rounded-sm bg-surface">
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={cx(
            "flex items-baseline justify-between gap-16 px-12 py-8",
            i > 0 && "border-t border-muted-subtle",
          )}
        >
          <span className="body-4 flex shrink-0 items-center gap-6 text-muted">
            {row.label}
            {row.owner ? (
              <span
                className={cx(
                  "body-4 rounded-xs px-4",
                  row.owner === "Lumen"
                    ? "bg-active-subtle text-active"
                    : "bg-muted-transparent text-muted",
                )}
              >
                {row.owner}
              </span>
            ) : null}
          </span>
          <span
            className={cx("body-3 break-all text-right", toneClass(row.tone))}
            style={MONO}
          >
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}
