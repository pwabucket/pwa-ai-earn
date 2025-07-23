/**
 * Normalizes a date to the beginning of the day (00:00:00.000)
 * @param {Date|string} date - The date to normalize
 * @returns {Date} Date set to beginning of day
 */
export function startOfDay(date) {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
}

/**
 * Generates calendar days for a given month
 * @param {Date} currentMonth - The month to generate calendar for
 * @param {Date|null} selectedDate - The currently selected date
 * @returns {Array} Array of calendar day objects
 */
export function generateCalendarDays(currentMonth, selectedDate = null) {
  const normalizedMonth = startOfDay(currentMonth);
  const year = normalizedMonth.getFullYear();
  const month = normalizedMonth.getMonth();

  const firstDay = startOfDay(new Date(year, month, 1));
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days = [];
  const currentDate = startOfDay(startDate);
  const today = startOfDay(new Date());
  const normalizedSelected = selectedDate ? startOfDay(selectedDate) : null;

  for (let i = 0; i < 42; i++) {
    const dayDate = startOfDay(new Date(currentDate));
    days.push({
      date: dayDate,
      isCurrentMonth: dayDate.getMonth() === month,
      isToday: dayDate.getTime() === today.getTime(),
      isSelected:
        normalizedSelected &&
        dayDate.getTime() === normalizedSelected.getTime(),
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
  const currentWeek = selectedDate
    ? startOfDay(selectedDate)
    : startOfDay(new Date());
  const startOfWeek = startOfDay(new Date(currentWeek));

  const dayOfWeek = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

  const dates = [];
  const today = startOfDay(new Date());
  const normalizedSelected = selectedDate ? startOfDay(selectedDate) : null;

  for (let i = 0; i < 7; i++) {
    const date = startOfDay(new Date(startOfWeek));
    date.setDate(startOfWeek.getDate() + i);
    const dayDate = startOfDay(date);

    dates.push({
      date: dayDate,
      dayName: dayNames[i],
      isToday: dayDate.getTime() === today.getTime(),
      isSelected:
        normalizedSelected &&
        dayDate.getTime() === normalizedSelected.getTime(),
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
  return startOfDay(date).getTime() === startOfDay(new Date()).getTime();
}

/**
 * Checks if two dates are the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if the dates are the same day
 */
export function isSameDay(date1, date2) {
  if (!date1 || !date2) return false;
  return startOfDay(date1).getTime() === startOfDay(date2).getTime();
}

/**
 * Formats a date for display in the header
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string ("Today" or "Aug 17, 2025")
 */
export function formatHeaderDate(date) {
  const today = startOfDay(new Date());
  const targetDate = startOfDay(date);

  if (targetDate.getTime() === today.getTime()) {
    return "Today";
  }

  return formatDate(targetDate);
}

/**
 * Formats a date for display
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  return startOfDay(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
