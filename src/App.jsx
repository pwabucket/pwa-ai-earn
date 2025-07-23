import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useState } from "react";

import CalendarModal from "./components/CalendarModal";
import DayView from "./components/DayView";
import Header from "./components/Header";
import WeeklyCalendar from "./components/WeeklyCalendar";
import { cn } from "./lib/utils";

const NavigationButton = ({ onClick, children, className = "" }) => (
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
    <div className="flex items-center justify-center gap-2">
      <NavigationButton onClick={() => navigateDay(-1)}>
        <LuChevronLeft className="size-5" />
      </NavigationButton>
      <NavigationButton onClick={() => navigateDay(1)}>
        <LuChevronRight className="size-5" />
      </NavigationButton>
    </div>
  );
};

function App() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="min-h-dvh bg-neutral-900 text-white">
      <Header
        selectedDate={selectedDate}
        onCalendarClick={() => setShowCalendar(!showCalendar)}
      />

      <div className="flex flex-col gap-4">
        <WeeklyCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <DayNavigator
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        <DayView
          key={selectedDate.toISOString()}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>

      {showCalendar && (
        <CalendarModal
          selectedDate={selectedDate}
          onSelectDate={(date) => {
            setSelectedDate(date);
            setShowCalendar(false);
          }}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
}

export default App;
