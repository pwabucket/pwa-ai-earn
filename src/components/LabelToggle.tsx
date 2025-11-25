import { cn } from "../lib/utils";
import { memo } from "react";

import Toggle from "./Toggle";

interface LabelToggleProps extends React.ComponentProps<"input"> {
  children: React.ReactNode;
  className?: string;
  headingClassName?: string;
}

export default memo(function LabelToggle({
  children,
  className,
  headingClassName,
  ...props
}: LabelToggleProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-4 cursor-pointer rounded-xl",
        "bg-neutral-800 rounded-xl hover:bg-neutral-700",
        "has-[input:disabled]:opacity-60",
        "px-4 py-2 text-sm",
        className
      )}
    >
      <h4
        className={cn(
          "min-w-0 min-h-0 grow flex items-center gap-2",
          headingClassName
        )}
      >
        {children}
      </h4>{" "}
      <Toggle {...props} />
    </label>
  );
});
