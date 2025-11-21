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
import { MdRefresh } from "react-icons/md";
import useActiveAccount from "../hooks/useActiveAccount";

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
  const account = useActiveAccount();
  const url = account.url;

  return (
    <HeaderContainer>
      <div className={cn("flex items-center justify-between gap-3")}>
        <div className="flex items-center gap-1 shrink-0">
          <HeaderButton as={Link} to="/menu" title="Open Menu">
            <LuMenu className="size-5" />
          </HeaderButton>

          {url && (
            <>
              <HeaderButton onClick={onWebviewClick} title="Open webview">
                <LuGlobe className="size-5" />
              </HeaderButton>
              <HeaderButton
                onClick={onRefreshClick}
                title="Refresh transactions"
              >
                <MdRefresh className="size-5" />
              </HeaderButton>
            </>
          )}
        </div>
        <h3
          className={cn(
            "font-bold grow min-w-0 truncate",
            "text-lg text-neutral-100"
          )}
          title={formatHeaderDate(selectedDate)}
        >
          {formatHeaderDate(selectedDate)}
        </h3>

        <div className="flex items-center gap-1 shrink-0">
          <DayNavigator
            selectedDate={selectedDate}
            onDateChange={onSelectDate}
          />

          <HeaderButton
            onClick={onCalendarClick}
            aria-label="Open calendar"
            title="Open calendar"
          >
            <LuCalendar className="size-5" />
          </HeaderButton>
        </div>
      </div>

      <WeeklyCalendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
    </HeaderContainer>
  );
}
