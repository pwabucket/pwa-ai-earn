import { cn } from "../lib/utils";
import { memo } from "react";

export default memo(function Toggle({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <>
      <input {...props} type="checkbox" className="sr-only peer" />
      <span
        className={cn(
          "shrink-0",
          "relative rounded-full",
          "inline-flex h-6 w-11 items-center",
          "dark:bg-neutral-600",
          "peer-checked:bg-pink-500",

          // Before
          "peer-checked:before:translate-x-6 before:translate-x-1",
          "before:inline-block before:h-4 before:w-4",
          "before:transform before:transition",
          "before:rounded-full",
          "before:bg-neutral-500 peer-checked:before:bg-white",

          className
        )}
      />
    </>
  );
});
