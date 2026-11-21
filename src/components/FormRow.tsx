import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface FormRowProps {
  id: string;
  label: ReactNode;
  /** Short help shown under the field. */
  hint?: ReactNode;
  children: ReactNode;
}

/** Label above its field, matching the calculator forms (calc/Form Field). */
const FormRow = ({ id, label, hint, children }: FormRowProps) => (
  <div className="flex min-w-0 flex-col gap-1.5">
    <Label htmlFor={id} className="text-sm font-medium text-foreground">
      {label}
    </Label>
    {children}
    {hint && (
      <span id={`${id}-hint`} className="text-xs text-muted-foreground">
        {hint}
      </span>
    )}
  </div>
);

export default FormRow;
