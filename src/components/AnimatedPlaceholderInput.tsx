import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type InputHTMLAttributes,
} from "react";

export interface AnimatedPlaceholderInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder"> {
  /** The list of placeholders to cycle through. */
  placeholders: string[];
  /** Optional leading icon (e.g. from `@ledgerhq/lumen-ui-react/symbols`). */
  icon?: ElementType;
  /** Time (ms) a placeholder stays fully visible before it is removed. Default 3000. */
  holdDuration?: number;
  /** Time (ms) it takes to type a placeholder in, char by char. Default 500. */
  typingDuration?: number;
  /** Time (ms) it takes to delete a placeholder, char by char. Default 500. */
  deletingDuration?: number;
  className?: string;
}

/**
 * Drives the typewriter placeholder: types each char in, holds, deletes each
 * char out, then moves to the next placeholder. Pauses while `enabled` is false
 * (e.g. when the input already has a value).
 */
function useTypewriterPlaceholder(
  placeholders: string[],
  {
    enabled,
    holdDuration,
    typingDuration,
    deletingDuration,
  }: {
    enabled: boolean;
    holdDuration: number;
    typingDuration: number;
    deletingDuration: number;
  },
) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!enabled || placeholders.length === 0) {
      setText("");
      return;
    }

    let cancelled = false;
    const timers = new Set<ReturnType<typeof setTimeout>>();

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const timer = setTimeout(() => {
          timers.delete(timer);
          resolve();
        }, ms);
        timers.add(timer);
      });

    const run = async () => {
      let index = 0;
      while (!cancelled) {
        const full = placeholders[index];
        const length = Math.max(full.length, 1);

        // (1) Reveal each char one by one.
        const perCharIn = typingDuration / length;
        for (let i = 1; i <= full.length; i++) {
          if (cancelled) return;
          setText(full.slice(0, i));
          await wait(perCharIn);
        }

        if (cancelled) return;
        await wait(holdDuration);

        // (2) Remove each char one by one.
        if (cancelled) return;
        const perCharOut = deletingDuration / length;
        for (let i = full.length - 1; i >= 0; i--) {
          if (cancelled) return;
          setText(full.slice(0, i));
          await wait(perCharOut);
        }

        // (3) Move on to the next placeholder and start again.
        index = (index + 1) % placeholders.length;
      }
    };

    void run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, [placeholders, enabled, holdDuration, typingDuration, deletingDuration]);

  return text;
}

export function AnimatedPlaceholderInput({
  placeholders,
  icon: Icon,
  holdDuration = 3000,
  typingDuration = 400,
  deletingDuration = 400,
  className,
  value,
  defaultValue,
  onChange,
  ...inputProps
}: AnimatedPlaceholderInputProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(
    defaultValue?.toString() ?? "",
  );
  const currentValue = isControlled ? value?.toString() ?? "" : internalValue;
  const isEmpty = currentValue.length === 0;

  const inputRef = useRef<HTMLInputElement>(null);

  const animatedPlaceholder = useTypewriterPlaceholder(placeholders, {
    enabled: isEmpty,
    holdDuration,
    typingDuration,
    deletingDuration,
  });

  return (
    <div
      className={[
        "group relative flex h-48 w-full cursor-text items-center gap-8 rounded-sm bg-muted px-16 transition-colors",
        "focus-within:ring-2 focus-within:ring-active hover:bg-muted-hover",
        className ?? "",
      ].join(" ")}
      onPointerDown={(event) => {
        if ((event.target as HTMLElement).closest("input, button, a")) return;
        inputRef.current?.focus();
      }}
    >
      {Icon ? <Icon size={20} className="shrink-0 text-muted" /> : null}

      <div className="relative flex-1">
        <input
          {...inputProps}
          ref={inputRef}
          value={isControlled ? value : internalValue}
          onChange={(event) => {
            if (!isControlled) setInternalValue(event.target.value);
            onChange?.(event);
          }}
          className="peer w-full bg-transparent body-1 text-base caret-active outline-hidden"
        />
        {isEmpty ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center body-1 text-muted"
          >
            {animatedPlaceholder}
            <span className="ml-1 inline-block w-1 animate-pulse self-stretch bg-muted" />
          </span>
        ) : null}
      </div>
    </div>
  );
}
