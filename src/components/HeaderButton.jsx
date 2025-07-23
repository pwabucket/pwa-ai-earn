import { cn } from "../lib/utils";

export const HeaderButton = ({
  as: Component = "button", // eslint-disable-line no-unused-vars
  onClick,
  children,
  className = "",
  ...props
}) => (
  <Component
    {...props}
    onClick={onClick}
    className={cn(
      "p-2 rounded-lg transition-colors bg-neutral-800 hover:bg-neutral-700",
      "cursor-pointer text-neutral-400 hover:text-neutral-200",
      className
    )}
  >
    {children}
  </Component>
);
