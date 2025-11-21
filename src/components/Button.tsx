import { cn } from "../lib/utils";

const Button = (props: React.ComponentProps<"button">) => {
  return (
    <button
      {...props}
      className={cn(
        "flex items-center justify-center gap-2",
        "px-4 py-2 rounded-xl cursor-pointer",
        "bg-pink-500 text-white font-bold",
        "hover:bg-pink-400",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        props.className
      )}
    />
  );
};

export { Button };
