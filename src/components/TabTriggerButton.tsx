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
      "py-2 bg-neutral-800 rounded-xl",
      "text-white font-bold text-sm",
      "cursor-pointer",
      "data-[state=active]:text-pink-500",
      props.className
    )}
  />
);
