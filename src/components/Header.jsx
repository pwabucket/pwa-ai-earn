import { Link } from "react-router";
import { LuCalendar, LuMenu } from "react-icons/lu";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import PageContainer from "./PageContainer";
import WeeklyCalendar from "./WeeklyCalendar";
import useNavigateBack from "../hooks/useNavigateBack";
import { cn } from "../lib/utils";
import { formatHeaderDate } from "../utils/dateUtils";

const HeaderButton = ({
  as: Component = "button", // eslint-disable-line no-unused-vars
  onClick,
  children,
  className = "",
  ...props
}) => (
  <Component
    {...props}
    onClick={onClick}
    className={cn(
      "p-2 rounded-lg transition-colors bg-neutral-800 hover:bg-neutral-700",
      "cursor-pointer text-neutral-400 hover:text-neutral-200",
      className
    )}
  >
    {children}
  </Component>
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

const HeaderContainer = ({ children }) => (
  <header
    className={cn(
      "sticky top-0 z-10 bg-neutral-900 border-b border-neutral-800"
    )}
  >
    <PageContainer className="flex flex-col gap-2">{children}</PageContainer>
  </header>
);

export function SecondaryHeader({ title }) {
  const navigateBack = useNavigateBack();
  return (
    <HeaderContainer>
      <div className="flex items-center gap-2">
        <HeaderButton onClick={navigateBack}>
          <LuChevronLeft className="size-5" />
        </HeaderButton>
        <h2 className="text-lg font-semibold text-neutral-100">{title}</h2>
      </div>
    </HeaderContainer>
  );
}

export default function Header({
  selectedDate,
  onSelectDate,
  onCalendarClick,
}) {
  return (
    <HeaderContainer>
      <div className={cn("flex items-center justify-between gap-4")}>
        <HeaderButton as={Link} to="/menu">
          <LuMenu className="size-5" />
        </HeaderButton>
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
    </HeaderContainer>
  );
}
