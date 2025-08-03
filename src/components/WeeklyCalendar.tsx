import { useMemo } from "react";

import { DAY_NAMES } from "../constants/calendar";
import { cn } from "../lib/utils";
import { generateWeekDates } from "../utils/dateUtils";

export default function WeeklyCalendar({
  selectedDate,
  onSelectDate,
}: {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}) {
  // Generate the week dates
  const weekDates = useMemo(() => {
    return generateWeekDates(selectedDate, DAY_NAMES);
  }, [selectedDate]);

  const handleDateSelect = (date: Date) => {
    onSelectDate(date);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {weekDates.map((dateInfo, index) => (
          <button
            key={index}
            onClick={() => handleDateSelect(dateInfo.date)}
            className={cn(
              "flex flex-col items-center justify-center py-2 rounded-2xl transition-all",
              "cursor-pointer shrink-0 grow basis-0",
              "bg-neutral-800 text-neutral-300 hover:bg-neutral-700",
              {
                "bg-pink-500 text-white hover:bg-pink-600": dateInfo.isSelected,
                "bg-neutral-600": dateInfo.isToday && !dateInfo.isSelected,
              }
            )}
          >
            <span className="text-xs font-medium">{dateInfo.dayName}</span>
            <span className="text-lg font-semibold">
              {dateInfo.date.getDate()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
