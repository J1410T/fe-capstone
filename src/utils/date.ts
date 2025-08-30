/**
 * Date and time utility functions
 * Consolidated date handling utilities
 */
import { format, parseISO } from "date-fns";

// Format ISO string -> dd/MM/yyyy
export const formatDate = (isoDate: string | undefined | null): string => {
  if (!isoDate) return "";
  try {
    return format(parseISO(isoDate), "dd/MM/yyyy");
  } catch {
    return "";
  }
};

// Format ISO string -> dd/MM/yyyy HH:mm (giờ phút)
export const formatDateTime = (isoDate: string | undefined | null): string => {
  if (!isoDate) return "";
  try {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch {
    return "";
  }
};

/**
 * Formats a date for form inputs (YYYY-MM-DD)
 */
export const formatDateForInput = (date: Date | string): string => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

/**
 * Gets the current quarter (1-4)
 */
export const getCurrentQuarter = (): 1 | 2 | 3 | 4 => {
  const month = new Date().getMonth() + 1;
  if (month <= 3) return 1;
  if (month <= 6) return 2;
  if (month <= 9) return 3;
  return 4;
};

/**
 * Checks if a date is overdue (past current date)
 */
export const isOverdue = (dueDate: string | Date): boolean => {
  return new Date(dueDate) < new Date();
};

/**
 * Gets the number of days until a deadline
 */
export const getDaysUntilDeadline = (deadline: string | Date): number => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Gets a relative time string (e.g., "2 days ago", "in 3 hours")
 */
export const getRelativeTime = (date: Date | string): string => {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = (targetDate.getTime() - now.getTime()) / 1000;

  const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2628000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];

  for (const { unit, seconds } of units) {
    const interval = diffInSeconds / seconds;
    if (Math.abs(interval) >= 1) {
      return rtf.format(Math.round(interval), unit);
    }
  }

  return rtf.format(0, "second");
};

/**
 * Checks if two dates are on the same day
 */
export const isSameDay = (
  date1: Date | string,
  date2: Date | string
): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
};

/**
 * Gets the start and end of a date range for a quarter
 */
export const getQuarterDateRange = (
  quarter: 1 | 2 | 3 | 4,
  year?: number
): { start: Date; end: Date } => {
  const currentYear = year || new Date().getFullYear();

  switch (quarter) {
    case 1:
      return {
        start: new Date(currentYear, 0, 1), // January 1
        end: new Date(currentYear, 2, 31), // March 31
      };
    case 2:
      return {
        start: new Date(currentYear, 3, 1), // April 1
        end: new Date(currentYear, 5, 30), // June 30
      };
    case 3:
      return {
        start: new Date(currentYear, 6, 1), // July 1
        end: new Date(currentYear, 8, 30), // September 30
      };
    case 4:
      return {
        start: new Date(currentYear, 9, 1), // October 1
        end: new Date(currentYear, 11, 31), // December 31
      };
  }
};
