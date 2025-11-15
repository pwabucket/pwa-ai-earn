import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import { HeaderButton } from "./HeaderButton";

export const DayNavigator = ({
  selectedDate,
  onDateChange,
}: {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}) => {
  const navigateDay = (direction: number) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + direction);
    onDateChange(currentDate);
  };

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
