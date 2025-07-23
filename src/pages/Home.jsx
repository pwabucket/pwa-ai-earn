import { useState } from "react";

import CalendarModal from "../components/CalendarModal";
import DayView from "../components/DayView";
import Header from "../components/Header";
import useLocationToggle from "../hooks/useLocationToggle";

function Home() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [showCalendar, toggleShowCalendar] = useLocationToggle("calendar");

  return (
    <>
      <Header
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onCalendarClick={toggleShowCalendar}
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
            toggleShowCalendar();
          }}
          onClose={() => toggleShowCalendar()}
        />
      )}
    </>
  );
}

export default Home;
