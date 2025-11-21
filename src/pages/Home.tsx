import { startOfDay } from "date-fns";
import { useState } from "react";

import CalendarModal from "../components/CalendarModal";
import DayView from "../components/DayView";
import Header from "../components/Header";
import useLocationToggle from "../hooks/useLocationToggle";
import WebviewModal from "../components/WebviewModal";
import toast from "react-hot-toast";
import Footer from "../components/Footer";
import { useTracker } from "../hooks/useTracker";

function Home() {
  const [selectedDate, setSelectedDate] = useState(() =>
    startOfDay(new Date())
  );
  const [showCalendar, toggleShowCalendar] = useLocationToggle("calendar");
  const [showWebview, setShowWebview] = useLocationToggle("show-webview");

  const { refresh } = useTracker();

  const onRefreshClick = () => {
    toast.promise(refresh(), {
      loading: "Refreshing...",
      success: "Refreshed successfully!",
      error: "Failed to refresh.",
    });
  };

  return (
    <>
      <Header
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onCalendarClick={() => toggleShowCalendar(true)}
        onWebviewClick={() => setShowWebview(true)}
        onRefreshClick={onRefreshClick}
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
          }}
          onClose={() => toggleShowCalendar(false)}
        />
      )}

      {showWebview && (
        <WebviewModal onOpenChange={(open) => setShowWebview(open)} />
      )}

      <Footer />
    </>
  );
}

export default Home;
