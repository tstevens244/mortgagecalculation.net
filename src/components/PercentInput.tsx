import { useState, useCallback, useEffect, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn, splitLayoutClasses } from "@/lib/utils";

interface PercentInputProps {
  value: number;
  onChange: (value: number) => void;
  id?: string;
  className?: string;
  decimalPlaces?: number;
  min?: number;
  max?: number;
  "aria-describedby"?: string;
  "aria-label"?: string;
  /** Allow values below zero (e.g. an expected rate decrease). */
  allowNegative?: boolean;
  /** Unit shown inside the field. Defaults to "%". */
  suffix?: string;
}

const PercentInput = forwardRef<HTMLInputElement, PercentInputProps>(
  ({ value, onChange, className, decimalPlaces = 2, min = 0, max = 100, allowNegative = false, suffix = "%", ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(value.toFixed(decimalPlaces));
    const [isFocused, setIsFocused] = useState(false);

    // Sync display value when external value changes (and not focused)
    useEffect(() => {
      if (!isFocused) {
        setDisplayValue(value.toFixed(decimalPlaces));
      }
    }, [value, isFocused, decimalPlaces]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      
      // Allow digits and a decimal point (and a leading minus sign when allowed)
      const negative = allowNegative && rawValue.trim().startsWith("-");
      const sanitized = (negative ? "-" : "") + rawValue.replace(/[^0-9.]/g, "");
      
      // Prevent multiple decimal points
      const parts = sanitized.split(".");
      const cleanValue = parts.length > 2 
        ? parts[0] + "." + parts.slice(1).join("")
        : sanitized;
      
      setDisplayValue(cleanValue);
      
      // Parse and clamp the value
      let numericValue = parseFloat(cleanValue) || 0;
      numericValue = Math.max(min, Math.min(max, numericValue));
      
      onChange(numericValue);
    }, [onChange, min, max, allowNegative]);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
      // Show raw value when focused, trim trailing zeros
      if (value === 0) {
        setDisplayValue("");
      } else {
        // Remove trailing zeros but keep the decimal if there are decimals
        const str = value.toString();
        setDisplayValue(str);
      }
    }, [value]);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      // Clamp on blur
      let finalValue = parseFloat(displayValue) || 0;
      finalValue = Math.max(min, Math.min(max, finalValue));
      onChange(finalValue);
      setDisplayValue(finalValue.toFixed(decimalPlaces));
    }, [displayValue, min, max, decimalPlaces, onChange]);

    // The wrapper takes the layout classes (width, flex); the field keeps the rest.
    const { layout, field } = splitLayoutClasses(className);
    return (
      <div className={cn("relative min-w-0", /(^|\s|:)w-/.test(layout) ? "" : "flex-1", layout)}>
        <Input
          ref={ref}
          type="text"
          inputMode={allowNegative ? "text" : "decimal"}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn("h-10 w-full text-left text-sm tabular-nums", field, suffix && "pr-7")}
          {...props}
        />
        {suffix && (
          <span
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {suffix}
          </span>
        )}
      </div>
    );
  }
);

PercentInput.displayName = "PercentInput";

export default PercentInput;
