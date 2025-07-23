import { LuCalendar } from "react-icons/lu";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import WeeklyCalendar from "./WeeklyCalendar";
import { cn } from "../lib/utils";
import { formatHeaderDate } from "../utils/dateUtils";

const HeaderButton = ({ onClick, children, className = "" }) => (
  <button
    onClick={onClick}
    className={cn(
      "p-2 rounded-lg transition-colors bg-neutral-800 hover:bg-neutral-700",
      "cursor-pointer text-neutral-400 hover:text-neutral-200",
      className
    )}
  >
    {children}
  </button>
);

const DayNavigator = ({ selectedDate, onDateChange }) => {
  const navigateDay = (direction) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + direction);
    onDateChange(currentDate);
  };

  return (
    <>
      <HeaderButton onClick={() => navigateDay(-1)}>
        <LuChevronLeft className="size-5" />
      </HeaderButton>
      <HeaderButton onClick={() => navigateDay(1)}>
        <LuChevronRight className="size-5" />
      </HeaderButton>
    </>
  );
};

export default function Header({
  selectedDate,
  onSelectDate,
  onCalendarClick,
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 p-2 bg-neutral-900 border-b border-neutral-800",
        "flex flex-col gap-2"
      )}
    >
      <div className={cn("flex items-center justify-between gap-4")}>
        <h3
          className={cn(
            "font-bold grow min-w-0 truncate",
            "text-lg text-neutral-100"
          )}
        >
          {formatHeaderDate(selectedDate)}
        </h3>

        <div className="flex items-center gap-1">
          <DayNavigator
            selectedDate={selectedDate}
            onDateChange={onSelectDate}
          />

          <HeaderButton onClick={onCalendarClick} aria-label="Open calendar">
            <LuCalendar className="size-5" />
          </HeaderButton>
        </div>
      </div>

      <WeeklyCalendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
    </header>
  );
}
