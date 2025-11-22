import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import { HeaderButton } from "./HeaderButton";
import { useCallback } from "react";

export const DayNavigator = ({
  selectedDate,
  onDateChange,
}: {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}) => {
  const navigateDay = useCallback(
    (direction: number) => {
      const currentDate = new Date(selectedDate);
      currentDate.setDate(currentDate.getDate() + direction);
      onDateChange(currentDate);
    },
    [onDateChange, selectedDate]
  );

  return (
    <>
      <HeaderButton onClick={() => navigateDay(-1)} title="Previous day">
        <LuChevronLeft className="size-5" />
      </HeaderButton>
      <HeaderButton onClick={() => navigateDay(1)} title="Next day">
        <LuChevronRight className="size-5" />
      </HeaderButton>
    </>
  );
};
