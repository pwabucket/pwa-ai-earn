import { Dialog } from "radix-ui";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useMemo, useState } from "react";

import Modal from "./Modal";
import { DAY_NAMES, MONTH_NAMES } from "../constants/calendar";
import { cn } from "../lib/utils";
import { generateCalendarDays } from "../utils/dateUtils";
import { startOfDay } from "date-fns";
import useActiveAccount from "../hooks/useActiveAccount";

export default function CalendarModal({
  selectedDate,
  onSelectDate,
  onClose,
}: {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );

  const account = useActiveAccount();
  const transactions = account.transactions;

  const activityDates = useMemo(() => {
    const datesSet = new Set<number>();
    transactions.forEach((tx) => {
      const dateTime = startOfDay(tx.date).getTime();
      datesSet.add(dateTime);
    });
    return datesSet;
  }, [transactions]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    return generateCalendarDays(currentMonth, selectedDate, activityDates);
  }, [currentMonth, selectedDate, activityDates]);

  const navigateMonth = (direction: number) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateSelect = (date: Date) => {
    onSelectDate(date);
  };

  return (
    <Modal onOpenChange={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {/* Previous month button */}
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <FiChevronLeft className="w-5 h-5 text-pink-400" />
        </button>

        {/* Current month display */}
        <div className="text-center">
          <Dialog.Title className="text-xl font-medium">
            {MONTH_NAMES[currentMonth.getMonth()]}
          </Dialog.Title>
          <Dialog.Description className="text-neutral-400 text-sm">
            {currentMonth.getFullYear()}
          </Dialog.Description>
        </div>

        {/* Next month button */}
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
        >
          <FiChevronRight className="w-5 h-5 text-pink-400" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAY_NAMES.map((day, index) => (
          <div
            key={day}
            className={cn("text-center text-sm font-medium py-2", {
              "text-pink-400": index === 0 || index === 6,
              "text-neutral-400": index !== 0 && index !== 6,
            })}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <Dialog.Close
            key={index}
            onClick={() => handleDateSelect(day.date)}
            className={cn(
              "aspect-square flex items-center justify-center",
              "text-sm rounded-lg transition-all cursor-pointer",
              "relative",
              {
                "text-neutral-600": !day.isCurrentMonth,
                "hover:bg-neutral-800":
                  day.isCurrentMonth && !day.isSelected && !day.isToday,
                "bg-pink-500 text-white font-medium": day.isSelected,
                "bg-neutral-800 text-white font-medium":
                  day.isToday && !day.isSelected,
                "text-neutral-300":
                  day.isCurrentMonth && !day.isSelected && !day.isToday,
              }
            )}
          >
            {day.date.getDate()}

            {/* Activity indicator */}
            {day.hasActivity && (
              <span
                className={cn(
                  "absolute bottom-2 size-1.5 rounded-full bg-pink-500/30",
                  "left-1/2 transform -translate-x-1/2"
                )}
              />
            )}
          </Dialog.Close>
        ))}
      </div>

      {/* Footer buttons */}
      <div className="flex gap-3 mt-6">
        <Dialog.Close
          className={cn(
            "flex-1 py-2.5 font-medium transition-colors",
            "text-neutral-400 hover:text-white",
            "cursor-pointer"
          )}
        >
          CLOSE
        </Dialog.Close>
        <Dialog.Close
          onClick={() => handleDateSelect(new Date())}
          className={cn(
            "flex-1 py-2.5 font-medium rounded-lg transition-colors",
            "text-white bg-pink-500 hover:bg-pink-600",
            "cursor-pointer"
          )}
        >
          TODAY
        </Dialog.Close>
      </div>
    </Modal>
  );
}
