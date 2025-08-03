import { cn } from "../lib/utils";

export default function PageContainer(props: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("w-full mx-auto max-w-md p-2", props.className)}
    />
  );
}
