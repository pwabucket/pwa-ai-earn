import { cn } from "../lib/utils";

const Select = (props: React.ComponentProps<"select">) => {
  return (
    <select
      {...props}
      className={cn(
        "w-full px-4 py-2 bg-neutral-800 rounded-xl text-white",
        "focus:outline-none focus:ring-2 focus:ring-pink-500",
        "transition-colors",
        props.className
      )}
    />
  );
};

const SelectOption = (props: React.ComponentProps<"option">) => {
  return (
    <option {...props} className={cn("bg-neutral-900", props.className)} />
  );
};

Select.Option = SelectOption;

export { Select };
