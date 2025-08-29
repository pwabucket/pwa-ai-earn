import { Tabs } from "radix-ui";

import { cn } from "../lib/utils";

// =============================================================================
// UI COMPONENTS
// =============================================================================
export const TabTriggerButton = (
  props: React.ComponentProps<typeof Tabs.Trigger>
) => (
  <Tabs.Trigger
    {...props}
    className={cn(
      "py-2",
      "text-neutral-400 font-bold text-sm",
      "cursor-pointer uppercase",
      "border-b-2 border-transparent",
      "data-[state=active]:text-pink-500",
      "data-[state=active]:border-pink-500",
      props.className
    )}
  />
);
