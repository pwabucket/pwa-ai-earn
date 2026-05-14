import { cn } from "../lib/utils";

export default function Radius({
  max,
  position,
  label,
  className,
}: {
  max: number;
  position: number;
  label?: React.ReactNode;
  className?: string;
}) {
  const progress = Math.min(position, max);
  const radius = 22;
  const stroke = 4;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (progress / max) * circumference;

  return (
    <div className="relative size-12 shrink-0">
      <svg height="48" width="48">
        <circle
          stroke="#404040"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx="24"
          cy="24"
        />
        <circle
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={normalizedRadius}
          cx="24"
          cy="24"
          style={{ transition: "stroke-dashoffset 0.5s" }}
          className={cn("stroke-pink-500", className)}
        />
      </svg>
      <span
        className={cn(
          "absolute inset-0",
          "flex items-center justify-center font-bold text-[10px]",
        )}
      >
        {label ?? position}
      </span>
    </div>
  );
}
