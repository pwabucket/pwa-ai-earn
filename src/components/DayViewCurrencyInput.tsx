import Input from "./Input";
import { cn } from "../lib/utils";

// =============================================================================
// FORM COMPONENTS
// =============================================================================
export const DayViewCurrencyInput = ({
  value,
  onChange,
  placeholder = "1.00",
}: {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
}) => (
  <div className="relative grow min-w-0">
    <span
      className={cn(
        "absolute text-neutral-400 h-full left-0 px-4",
        "flex items-center justify-center"
      )}
    >
      $
    </span>
    <Input
      type="number"
      inputMode="decimal"
      placeholder={placeholder}
      className="pl-8"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
