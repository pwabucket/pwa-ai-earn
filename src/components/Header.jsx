import { LuCalendar } from "react-icons/lu";

import { cn } from "../lib/utils";
import { formatHeaderDate } from "../utils/dateUtils";

export default function Header({ selectedDate, onCalendarClick }) {
  return (
    <div className={cn("flex items-center justify-between gap-4", "px-4 py-2")}>
      <h3
        className={cn(
          "font-bold grow min-w-0 truncate",
          "text-lg text-neutral-100"
        )}
      >
        {formatHeaderDate(selectedDate)}
      </h3>

      <button
        onClick={onCalendarClick}
        className={cn(
          "p-2 rounded-lg transition-colors",
          "hover:bg-neutral-800 cursor-pointer",
          "text-neutral-400 hover:text-neutral-200"
        )}
        aria-label="Open calendar"
      >
        <LuCalendar className="size-5" />
      </button>
    </div>
  );
}
