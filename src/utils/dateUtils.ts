type SingleDateConstructorArg = number | string | Date;

/**
 * Normalizes a date to the beginning of the day (00:00:00.000)
 * @param  date - The date to normalize
 * @returns Date set to beginning of day
 */
export function startOfDay(date: SingleDateConstructorArg): Date {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
}

/**
 * Generates calendar days for a given month
 * @param currentMonth - The month to generate calendar for
 * @param selectedDate - The currently selected date
 * @returns Array of calendar day objects
 */
export function generateCalendarDays(
  currentMonth: SingleDateConstructorArg,
  selectedDate: SingleDateConstructorArg | null = null,
  activityDates: Map<
    number,
    { investments: number; withdrawals: number; exchanges: number }
  > = new Map()
) {
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

      activity: activityDates.get(dayDate.getTime()),
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
}

/**
 * Generates week dates starting from Sunday
 * @param selectedDate - The reference date for the week
 * @param dayNames - Array of day names for the week
 * @returns Array of week day objects
 */
export function generateWeekDates(
  selectedDate: SingleDateConstructorArg | null = null,
  dayNames: string[]
) {
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
 * @param date - The date to check
 * @returns True if the date is today
 */
export function isToday(date: SingleDateConstructorArg): boolean {
  return startOfDay(date).getTime() === startOfDay(new Date()).getTime();
}

/**
 * Checks if two dates are the same day
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if the dates are the same day
 */
export function isSameDay(
  date1: SingleDateConstructorArg,
  date2: SingleDateConstructorArg
): boolean {
  if (!date1 || !date2) return false;
  return startOfDay(date1).getTime() === startOfDay(date2).getTime();
}

/**
 * Formats a date for display in the header
 * @param date - The date to format
 * @returns Formatted date string ("Today" or "Aug 17, 2025")
 */
export function formatHeaderDate(date: SingleDateConstructorArg): string {
  const today = startOfDay(new Date());
  const targetDate = startOfDay(date);

  if (targetDate.getTime() === today.getTime()) {
    return "Today";
  }

  return formatDate(targetDate);
}

/**
 * Formats a date for display
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: SingleDateConstructorArg): string {
  return startOfDay(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
