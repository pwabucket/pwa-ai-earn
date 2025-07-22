import { useState } from "react";

import CalenderModal from "./components/CalendarModal";
import DayView from "./components/DayView";
import Header from "./components/Header";
import WeeklyCalendar from "./components/WeeklyCalender";

function App() {
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="min-h-dvh bg-neutral-900 text-white">
      <Header
        selectedDate={selectedDate}
        onCalendarClick={() => setShowCalendar(!showCalendar)}
      />

      <div className="flex flex-col gap-4">
        {/* Weekly Calendar */}
        <WeeklyCalendar
          selectedDate={selectedDate}
          onSelectDate={(date) =>
            setSelectedDate(date.toISOString().split("T")[0])
          }
        />

        {/* Day View */}
        <DayView key={selectedDate} selectedDate={selectedDate} />
      </div>

      {showCalendar && (
        <CalenderModal
          selectedDate={selectedDate}
          onSelectDate={(date) => {
            setSelectedDate(date.toISOString().split("T")[0]);
            setShowCalendar(false);
          }}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
}

export default App;
