import { startOfDay } from "date-fns";
import { useState } from "react";

import CalendarModal from "../components/CalendarModal";
import DayView from "../components/DayView";
import Header from "../components/Header";
import useLocationToggle from "../hooks/useLocationToggle";
import WebviewModal from "../components/WebviewModal";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function Home() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(() =>
    startOfDay(new Date())
  );
  const [showCalendar, toggleShowCalendar] = useLocationToggle("calendar");
  const [showWebview, setShowWebview] = useLocationToggle("show-webview");

  const onRefreshClick = () => {
    toast.promise(
      queryClient.refetchQueries({
        queryKey: ["transactions"],
      }),
      {
        loading: "Refreshing...",
        success: "Refreshed successfully!",
        error: "Failed to refresh.",
      }
    );
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
    </>
  );
}

export default Home;
