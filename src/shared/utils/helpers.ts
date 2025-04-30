/**
 * Collection of utility functions for common operations
 * @module helpers
 */

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
export const debounce = <T extends (...args: any[]) => any>(
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
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', options);
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
  ellipsis = '...'
): string => {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}${ellipsis}`;
}; 