import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import { HeaderButton } from "./HeaderButton";

export const DayNavigator = ({ selectedDate, onDateChange }) => {
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
