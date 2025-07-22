/**
 * Generates calendar days for a given month
 * @param {Date} currentMonth - The month to generate calendar for
 * @param {Date|null} selectedDate - The currently selected date
 * @returns {Array} Array of calendar day objects
 */
export function generateCalendarDays(currentMonth, selectedDate = null) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // First day of the month
  const firstDay = new Date(year, month, 1);
  // First day of the week for the first day of month
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days = [];
  const currentDate = new Date(startDate);

  // Generate 6 weeks (42 days) to ensure consistent grid
  for (let i = 0; i < 42; i++) {
    days.push({
      date: new Date(currentDate),
      isCurrentMonth: currentDate.getMonth() === month,
      isToday: currentDate.toDateString() === new Date().toDateString(),
      isSelected:
        selectedDate &&
        currentDate.toDateString() === new Date(selectedDate).toDateString(),
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
}

/**
 * Generates week dates starting from Sunday
 * @param {Date|null} selectedDate - The reference date for the week
 * @param {Array} dayNames - Array of day names for the week
 * @returns {Array} Array of week day objects
 */
export function generateWeekDates(selectedDate = null, dayNames) {
  const currentWeek = selectedDate ? new Date(selectedDate) : new Date();
  const startOfWeek = new Date(currentWeek);

  // Start from Sunday (index 0 in JS Date)
  const dayOfWeek = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push({
      date: new Date(date),
      dayName: dayNames[i],
      isToday: date.toDateString() === new Date().toDateString(),
      isSelected:
        selectedDate &&
        date.toDateString() === new Date(selectedDate).toDateString(),
    });
  }

  return dates;
}
/**
 * Checks if a date is today
 * @param {Date} date - The date to check
 * @returns {boolean} True if the date is today
 */
export function isToday(date) {
  return date.toDateString() === new Date().toDateString();
}

/**
 * Checks if two dates are the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if the dates are the same day
 */
export function isSameDay(date1, date2) {
  if (!date1 || !date2) return false;
  return date1.toDateString() === date2.toDateString();
}

/**
 * Formats a date for display in the header
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string ("Today" or "Aug 17, 2025")
 */
export function formatHeaderDate(date) {
  const today = new Date();
  const targetDate = new Date(date);
  const isDateToday = targetDate.toDateString() === today.toDateString();

  if (isDateToday) {
    return "Today";
  }

  return targetDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Converts a Date object to local date string (YYYY-MM-DD) avoiding timezone issues
 * @param {Date} date - The date to convert
 * @returns {string} Date string in YYYY-MM-DD format
 */
export function toLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
