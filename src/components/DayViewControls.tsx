import { cn } from "../lib/utils";

export const ActionButton = ({
  variant = "primary",
  ...props
}: React.ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
}) => (
  <button
    {...props}
    className={cn(
      "px-4 py-2 rounded-xl text-sm shrink-0 cursor-pointer",
      "flex items-center justify-center gap-2",
      variant === "primary" && "bg-neutral-800 text-pink-500",
      variant === "secondary" && "bg-neutral-800 text-green-500",
      props.className
    )}
  />
);

export const InputSection = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2">{children}</div>
);

export const ButtonGroup = ({
  children,
  columns = 2,
}: {
  children: React.ReactNode;
  columns?: number;
}) => (
  <div className={cn("grid gap-2", { 2: "grid-cols-2" }[columns])}>
    {children}
  </div>
);
