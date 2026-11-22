import { useState, useCallback, useEffect, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn, splitLayoutClasses } from "@/lib/utils";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  id?: string;
  className?: string;
  allowDecimals?: boolean;
  "aria-describedby"?: string;
  "aria-label"?: string;
  /** Amount the up/down arrow keys change the value by. Defaults to a step that fits the value's size. */
  step?: number;
}

/** A step that suits the number: $5,000 for a home price, $100 for a tax bill, $10 for HOA dues. */
const autoStep = (value: number) => {
  const v = Math.abs(value);
  if (v >= 100_000) return 5_000;
  if (v >= 10_000) return 1_000;
  if (v >= 1_000) return 100;
  return 10;
};

const formatNumber = (value: number, allowDecimals: boolean): string => {
  if (allowDecimals) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US").format(Math.round(value));
};

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, className, allowDecimals = true, step, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(formatNumber(value, allowDecimals));
    const [isFocused, setIsFocused] = useState(false);

    // Sync display value when external value changes (and not focused)
    useEffect(() => {
      if (!isFocused) {
        setDisplayValue(formatNumber(value, allowDecimals));
      }
    }, [value, isFocused, allowDecimals]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      // Allow digits and decimal point
      const sanitized = rawValue.replace(/[^0-9.]/g, "");
      
      // Prevent multiple decimal points
      const parts = sanitized.split(".");
      const cleanValue = parts.length > 2 
        ? parts[0] + "." + parts.slice(1).join("")
        : sanitized;
      
      setDisplayValue(cleanValue);
      
      // Update the actual value
      const numericValue = parseFloat(cleanValue) || 0;
      onChange(numericValue);
    }, [onChange]);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
      // Show raw number without formatting when focused
      if (value === 0) {
        setDisplayValue("");
      } else if (allowDecimals && value % 1 !== 0) {
        setDisplayValue(value.toString());
      } else {
        setDisplayValue(Math.round(value).toString());
      }
    }, [value, allowDecimals]);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      // Format the number on blur
      setDisplayValue(formatNumber(value, allowDecimals));
    }, [value, allowDecimals]);

    // Up/down arrows nudge the value (Shift for 10x), like a native number field.
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
        e.preventDefault();
        const base = step ?? autoStep(value);
        const size = base * (e.shiftKey ? 10 : 1);
        const next = Math.max(0, Math.round((value + (e.key === "ArrowUp" ? size : -size)) / base) * base);
        onChange(next);
        setDisplayValue(Math.round(next).toString());
      },
      [value, step, onChange],
    );

    // The wrapper takes the layout classes (width, flex); the field keeps the rest.
    const { layout, field } = splitLayoutClasses(className);
    return (
      <div className={cn("relative min-w-[5.5rem]", /(^|\s|:)w-/.test(layout) ? "" : "flex-[2]", layout)}>
        <span
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-muted-foreground"
          aria-hidden="true"
        >
          $
        </span>
        <Input
          ref={ref}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn("h-10 w-full text-sm font-medium tabular-nums", field, "pl-6")}
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export default CurrencyInput;
