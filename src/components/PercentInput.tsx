import { useState, useCallback, useEffect, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
}

const PercentInput = forwardRef<HTMLInputElement, PercentInputProps>(
  ({ value, onChange, className, decimalPlaces = 2, min = 0, max = 100, ...props }, ref) => {
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
      
      // Allow digits and decimal point
      const sanitized = rawValue.replace(/[^0-9.]/g, "");
      
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
    }, [onChange, min, max]);

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

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn("h-8 sm:h-10 text-left text-xs sm:text-sm", className)}
        {...props}
      />
    );
  }
);

PercentInput.displayName = "PercentInput";

export default PercentInput;
