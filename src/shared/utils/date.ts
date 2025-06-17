/**
 * Date and time utility functions
 * Consolidated from multiple files across the codebase
 * @module date
 */

// ============================================================================
// DATE FORMATTING
// ============================================================================

/**
 * Formats a date into a human-readable string
 *
 * @param {Date | string} date - The date to format
 * @param {Intl.DateTimeFormatOptions} [options] - Optional formatting options
 * @returns {string} The formatted date string
 *
 * @example
 * const date = new Date('2024-03-15');
 * const formatted = formatDate(date); // "March 15, 2024"
 */
export const formatDate = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", options);
};

/**
 * Formats a date and time into a human-readable string
 * @param {Date | string} date - The date to format
 * @param {Intl.DateTimeFormatOptions} [options] - Optional formatting options
 * @returns {string} The formatted date and time string
 * @example
 * const date = new Date('2024-03-15T14:30:00');
 * const formatted = formatDateTime(date); // "March 15, 2024, 2:30 PM"
 */
export const formatDateTime = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
): string => {
  const d = new Date(date);
  return d.toLocaleString("en-US", options);
};

// ============================================================================
// DATE CALCULATIONS
// ============================================================================

/**
 * Checks if a date is overdue (past the current date)
 * @param {string} dueDate - The due date to check
 * @param {string} [status] - Optional status to check (if "Complete", never overdue)
 * @returns {boolean} True if overdue, false otherwise
 * @example
 * isOverdue('2020-01-01') // true (assuming current date is after this)
 */
export const isOverdue = (dueDate: string, status?: string): boolean => {
  if (status && status.toLowerCase() === "complete") return false;
  return new Date(dueDate) < new Date();
};

/**
 * Gets the number of days until a deadline
 * @param {string} deadline - The deadline date
 * @returns {number} Number of days until deadline (negative if past due)
 * @example
 * getDaysUntilDeadline('2024-12-31') // Number of days from now until Dec 31, 2024
 */
export const getDaysUntilDeadline = (deadline: string): number => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Gets the current quarter (1-4) based on the current month
 * @returns {1 | 2 | 3 | 4} The current quarter
 * @example
 * getCurrentQuarter() // 1 (if current month is Jan-Mar)
 */
export const getCurrentQuarter = (): 1 | 2 | 3 | 4 => {
  const month = new Date().getMonth() + 1;
  if (month <= 3) return 1;
  if (month <= 6) return 2;
  if (month <= 9) return 3;
  return 4;
};

// ============================================================================
// DATE SORTING AND FILTERING
// ============================================================================

/**
 * Sorts an array of items by date property
 * @param {T[]} items - Array of items with date property
 * @param {boolean} [ascending=false] - Sort order (true for ascending, false for descending)
 * @returns {T[]} Sorted array
 * @example
 * sortByDate([{date: '2024-01-01'}, {date: '2023-01-01'}]) // Newest first by default
 */
export const sortByDate = <T extends { date: string }>(
  items: T[],
  ascending = false
): T[] => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Filters items by date range
 * @param {T[]} items - Array of items with date property
 * @param {string} startDate - Start date (inclusive)
 * @param {string} endDate - End date (inclusive)
 * @returns {T[]} Filtered array
 */
export const filterByDateRange = <T extends { date: string }>(
  items: T[],
  startDate: string,
  endDate: string
): T[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return items.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= start && itemDate <= end;
  });
};

// ============================================================================
// DATE UTILITIES FOR BUSINESS LOGIC
// ============================================================================

/**
 * Gets time limit information based on current quarter
 * @returns {object} Time limit configuration
 */
export const getTimeLimit = () => {
  const quarter = getCurrentQuarter();
  const currentYear = new Date().getFullYear();

  switch (quarter) {
    case 1:
      return {
        quarter: 1,
        allowedProjectTypes: ["Application"],
        deadline: `${currentYear}-03-31`,
        isActive: true,
      };
    case 2:
      return {
        quarter: 2,
        allowedProjectTypes: ["Basic"],
        deadline: `${currentYear}-06-30`,
        isActive: true,
      };
    default:
      return {
        quarter,
        allowedProjectTypes: [],
        deadline: `${currentYear}-12-31`,
        isActive: false,
      };
  }
};

/**
 * Checks if a project type can be created in the current quarter
 * @param {string} projectType - The project type to check
 * @returns {boolean} True if project type can be created, false otherwise
 */
export const canCreateProjectType = (
  projectType: "Basic" | "Application"
): boolean => {
  const timeLimit = getTimeLimit();
  return (
    timeLimit.isActive && timeLimit.allowedProjectTypes.includes(projectType)
  );
};

// ============================================================================
// DATE CONVERSION UTILITIES
// ============================================================================

/**
 * Converts a date to ISO string format (YYYY-MM-DD)
 * @param {Date | string} date - The date to convert
 * @returns {string} ISO date string
 * @example
 * toISODateString(new Date()) // "2024-03-15"
 */
export const toISODateString = (date: Date | string): string => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

/**
 * Adds months to a date
 * @param {Date | string} date - The base date
 * @param {number} months - Number of months to add
 * @returns {Date} New date with months added
 * @example
 * addMonths(new Date('2024-01-15'), 3) // Date object for 2024-04-15
 */
export const addMonths = (date: Date | string, months: number): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

/**
 * Adds days to a date
 * @param {Date | string} date - The base date
 * @param {number} days - Number of days to add
 * @returns {Date} New date with days added
 * @example
 * addDays(new Date('2024-01-15'), 7) // Date object for 2024-01-22
 */
export const addDays = (date: Date | string, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

// ============================================================================
// DATE COMPARISON UTILITIES
// ============================================================================

/**
 * Checks if two dates are the same day
 * @param {Date | string} date1 - First date
 * @param {Date | string} date2 - Second date
 * @returns {boolean} True if same day, false otherwise
 */
export const isSameDay = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

/**
 * Checks if a date is today
 * @param {Date | string} date - The date to check
 * @returns {boolean} True if date is today, false otherwise
 */
export const isToday = (date: Date | string): boolean => {
  return isSameDay(date, new Date());
};

/**
 * Gets a relative time string (e.g., "2 days ago", "in 3 hours")
 * @param {Date | string} date - The date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date: Date | string): string => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (Math.abs(diffDays) >= 1) {
    return diffDays > 0 ? `in ${diffDays} days` : `${Math.abs(diffDays)} days ago`;
  } else if (Math.abs(diffHours) >= 1) {
    return diffHours > 0 ? `in ${diffHours} hours` : `${Math.abs(diffHours)} hours ago`;
  } else if (Math.abs(diffMinutes) >= 1) {
    return diffMinutes > 0 ? `in ${diffMinutes} minutes` : `${Math.abs(diffMinutes)} minutes ago`;
  } else {
    return "just now";
  }
};
