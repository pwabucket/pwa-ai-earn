import { cn } from "../lib/utils";

export default function Radius({
  max,
  position,
  className,
}: {
  max: number;
  position: number;
  className?: string;
}) {
  const progress = Math.min(position, max);
  const radius = 18;
  const stroke = 4;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (progress / max) * circumference;

  return (
    <div className="relative size-10 shrink-0">
      <svg height="40" width="40">
        <circle
          stroke="#404040"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx="20"
          cy="20"
        />
        <circle
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={normalizedRadius}
          cx="20"
          cy="20"
          style={{ transition: "stroke-dashoffset 0.5s" }}
          className={cn("stroke-pink-500", className)}
        />
      </svg>
      <span
        className={cn(
          "absolute inset-0",
          "flex items-center justify-center font-bold text-xs"
        )}
      >
        {position}
      </span>
    </div>
  );
}
