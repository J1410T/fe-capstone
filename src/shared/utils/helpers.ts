/**
 * Collection of utility functions for common operations
 * This file re-exports utilities from specialized modules for backward compatibility
 * @module helpers
 */

// Re-export from specialized utility modules
export * from "./date";
export * from "./string";
export * from "./validation";
export * from "./status";

/**
 * Creates a debounced version of a function that delays its execution
 * until after `wait` milliseconds have elapsed since the last time it was called
 *
 * @template T - Function type
 * @param {T} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {(...args: Parameters<T>) => void} A debounced version of the function
 *
 * @example
 * const debouncedSearch = debounce((query: string) => {
 *   // Search operation here
 * }, 300);
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
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

/**
 * Formats a number as currency (USD by default)
 * @param {number} amount - The amount to format
 * @param {string} [currency='USD'] - The currency code
 * @returns {string} The formatted currency string
 * @example
 * formatCurrency(1234.56) // "$1,234.56"
 */
export const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

/**
 * Formats a file size in bytes into a human-readable string
 * @param {number} bytes - The file size in bytes
 * @returns {string} The formatted file size
 * @example
 * formatFileSize(2048) // "2 KB"
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Calculates budget utilization as a percentage
 * @param {number} spent - Amount spent
 * @param {number} total - Total budget
 * @returns {number} Utilization percentage (0-100)
 * @example
 * calculateBudgetUtilization(500, 1000) // 50
 */
export const calculateBudgetUtilization = (
  spent: number,
  total: number
): number => {
  if (!total || total === 0) return 0;
  return Math.round((spent / total) * 100);
};

/**
 * Validates an email address format
 * @param {string} email - The email to validate
 * @returns {boolean} True if valid, false otherwise
 * @example
 * validateEmail('test@example.com') // true
 */
export const validateEmail = (email: string): boolean => {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Truncates a string to a specified length and adds an ellipsis
 *
 * @param {string} str - The string to truncate
 * @param {number} length - Maximum length before truncation
 * @param {string} [ellipsis='...'] - The string to append after truncation
 * @returns {string} The truncated string
 *
 * @example
 * const text = "This is a very long text";
 * const truncated = truncateString(text, 10); // "This is a..."
 */
export const truncateString = (
  str: string,
  length: number,
  ellipsis = "..."
): string => {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}${ellipsis}`;
};
