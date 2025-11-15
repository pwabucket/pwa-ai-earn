import { Link } from "react-router";
import { LuCalendar, LuGlobe, LuMenu } from "react-icons/lu";
import { LuChevronLeft } from "react-icons/lu";

import PageContainer from "./PageContainer";
import WeeklyCalendar from "./WeeklyCalendar";
import useNavigateBack from "../hooks/useNavigateBack";
import { DayNavigator } from "./DayNavigator";
import { HeaderButton } from "./HeaderButton";
import { cn } from "../lib/utils";
import { formatHeaderDate } from "../utils/dateUtils";
import useAppStore from "../store/useAppStore";
import { MdRefresh } from "react-icons/md";

const HeaderContainer = ({ children }: { children: React.ReactNode }) => (
  <header
    className={cn(
      "sticky top-0 z-10 bg-neutral-900 border-b border-neutral-800"
    )}
  >
    <PageContainer className="flex flex-col gap-2">{children}</PageContainer>
  </header>
);

export function SecondaryHeader({ title }: { title: string }) {
  const navigateBack = useNavigateBack();
  return (
    <HeaderContainer>
      <div className="flex items-center gap-2">
        <HeaderButton onClick={() => navigateBack()}>
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
  onWebviewClick,
  onRefreshClick,
}: {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onCalendarClick: () => void;
  onWebviewClick: () => void;
  onRefreshClick: () => void;
}) {
  const url = useAppStore((state) => state.url);

  return (
    <HeaderContainer>
      <div className={cn("flex items-center justify-between gap-3")}>
        <div className="flex items-center gap-1">
          <HeaderButton as={Link} to="/menu">
            <LuMenu className="size-5" />
          </HeaderButton>

          {url && (
            <>
              <HeaderButton onClick={onWebviewClick}>
                <LuGlobe className="size-5" />
              </HeaderButton>
              <HeaderButton onClick={onRefreshClick}>
                <MdRefresh className="size-5" />
              </HeaderButton>
            </>
          )}
        </div>
        <h3
          className={cn("font-bold grow min-w-0 truncate", "text-neutral-100")}
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
