import { cn } from "../lib/utils";

export default function Input(props) {
  return (
    <input
      {...props}
      className={cn(
        "w-full px-4 py-2 bg-neutral-800 rounded-xl text-white",
        "focus:outline-none focus:ring-2 focus:ring-pink-500",
        "transition-colors",
        props.className
      )}
    />
  );
}
