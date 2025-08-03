import type { DynamicComponent } from "../types/types";
import { cn } from "../lib/utils";

export const HeaderButton: DynamicComponent<"button"> = ({ as, ...props }) => {
  const Component = as || "button";
  return (
    <Component
      {...props}
      className={cn(
        "p-2 rounded-lg transition-colors bg-neutral-800 hover:bg-neutral-700",
        "cursor-pointer text-neutral-400 hover:text-neutral-200",
        props.className
      )}
    />
  );
};
