import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface FormRowProps {
  id: string;
  label: ReactNode;
  /** Short help shown under the field. */
  hint?: ReactNode;
  children: ReactNode;
}

/** Label above the field on phones, beside it from the small breakpoint up. */
const FormRow = ({ id, label, hint, children }: FormRowProps) => (
  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3">
    <Label htmlFor={id} className="text-sm text-muted-foreground sm:w-[200px] sm:shrink-0 sm:pt-2.5">
      {label}
    </Label>
    <div className="flex flex-1 flex-col gap-1">
      {children}
      {hint && (
        <span id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </span>
      )}
    </div>
  </div>
);

export default FormRow;
