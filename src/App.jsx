import { useState } from "react";
import CalendarModal from "./components/CalendarModal";
import DayView from "./components/DayView";
import Header from "./components/Header";

function App() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="min-h-dvh bg-neutral-900 text-white">
      <Header
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onCalendarClick={() => setShowCalendar(!showCalendar)}
      />
      <DayView
        key={selectedDate.toISOString()}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

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
