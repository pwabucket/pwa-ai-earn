import { cn } from "../lib/utils";

export default function PageContainer(props) {
  return (
    <div
      {...props}
      className={cn("w-full mx-auto max-w-md p-2", props.className)}
    />
  );
}
