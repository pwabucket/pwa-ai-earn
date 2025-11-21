import { cn } from "../lib/utils";

const Label = (props: React.ComponentProps<"label">) => (
  <label
    {...props}
    className={cn("px-4 text-sm text-neutral-400", props.className)}
  />
);

export { Label };
