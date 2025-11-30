import type Decimal from "decimal.js";
import { cn, formatCurrency } from "../lib/utils";

export default function Currency({
  value,
  prefix,
  ...props
}: React.ComponentProps<"span"> & { value: Decimal.Value; prefix?: string }) {
  return (
    <span {...props} className={cn("font-mono", props.className)}>
      {formatCurrency(value, prefix)}
    </span>
  );
}
