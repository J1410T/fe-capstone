/**
 * String manipulation and ID generation utility functions
 * Consolidated from multiple files across the codebase
 * @module string
 */

//// STRING MANIPULATION
//
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

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 * @example
 * capitalize('hello world') // "Hello world"
 */
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Converts a string to title case (capitalizes each word)
 * @param {string} str - The string to convert
 * @returns {string} The title case string
 * @example
 * toTitleCase('hello world') // "Hello World"
 */
export const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Converts a string to kebab-case
 * @param {string} str - The string to convert
 * @returns {string} The kebab-case string
 * @example
 * toKebabCase('Hello World') // "hello-world"
 */
export const toKebabCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Converts a string to camelCase
 * @param {string} str - The string to convert
 * @returns {string} The camelCase string
 * @example
 * toCamelCase('hello world') // "helloWorld"
 */
export const toCamelCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (_, char) => char.toUpperCase());
};

/**
 * Removes extra whitespace and normalizes spacing
 * @param {string} str - The string to normalize
 * @returns {string} The normalized string
 * @example
 * normalizeWhitespace('  hello    world  ') // "hello world"
 */
export const normalizeWhitespace = (str: string): string => {
  return str.trim().replace(/\s+/g, " ");
};

//// ID GENERATION
//
/**
 * Generates a unique ID using timestamp and random string
 * @returns {string} A unique identifier
 * @example
 * generateId() // "1640995200000_abc123def"
 */
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Generates a UUID v4 (random UUID)
 * @returns {string} A UUID v4 string
 * @example
 * generateUUID() // "550e8400-e29b-41d4-a716-446655440000"
 */
export const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Generates a short random ID
 * @param {number} [length=8] - Length of the ID
 * @returns {string} A short random ID
 * @example
 * generateShortId() // "a1b2c3d4"
 */
export const generateShortId = (length = 8): string => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Extracts initials from a full name
 * @param {string} name - The full name
 * @param {number} [maxInitials=2] - Maximum number of initials to return
 * @returns {string} The initials
 * @example
 * getInitials('John Doe Smith') // "JD" (with maxInitials=2)
 * getInitials('John Doe Smith', 3) // "JDS"
 */
export const getInitials = (name: string, maxInitials = 2): string => {
  return name
    .split(" ")
    .filter((word) => word.length > 0)
    .slice(0, maxInitials)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

//// STRING SEARCH AND FILTERING
//
/**
 * Searches for items based on multiple searchable fields
 * @param {T[]} items - Array of items to search
 * @param {string} searchTerm - The search term
 * @param {(keyof T)[]} searchFields - Fields to search in
 * @returns {T[]} Filtered array of items
 * @example
 * searchItems(users, 'john', ['name', 'email']) // Returns users with 'john' in name or email
 */
export const searchItems = <T extends Record<string, unknown>>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] => {
  if (!searchTerm.trim()) return items;

  const lowercaseSearch = searchTerm.toLowerCase();
  return items.filter((item) =>
    searchFields.some((field) =>
      String(item[field]).toLowerCase().includes(lowercaseSearch)
    )
  );
};

/**
 * Filters items by status
 * @param {T[]} items - Array of items with status property
 * @param {string} status - Status to filter by ('all' returns all items)
 * @returns {T[]} Filtered array of items
 * @example
 * filterByStatus(tasks, 'completed') // Returns only completed tasks
 */
export const filterByStatus = <T extends { status: string }>(
  items: T[],
  status: string
): T[] => {
  if (status === "all") return items;
  return items.filter(
    (item) => item.status.toLowerCase() === status.toLowerCase()
  );
};

/**
 * Highlights search terms in text
 * @param {string} text - The text to highlight
 * @param {string} searchTerm - The term to highlight
 * @param {string} [highlightClass='bg-yellow-200'] - CSS class for highlighting
 * @returns {string} HTML string with highlighted terms
 * @example
 * highlightText('Hello world', 'world') // "Hello <span class='bg-yellow-200'>world</span>"
 */
export const highlightText = (
  text: string,
  searchTerm: string,
  highlightClass = "bg-yellow-200"
): string => {
  if (!searchTerm.trim()) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
};

//// STRING FORMATTING
//
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
 * Formats a phone number for display
 * @param {string} phone - The phone number to format
 * @returns {string} The formatted phone number
 * @example
 * formatPhoneNumber('1234567890') // "(123) 456-7890"
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  } else if (cleaned.length === 11 && cleaned[0] === "1") {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(
      7
    )}`;
  }

  return phone; // Return original if can't format
};

//// STRING VALIDATION HELPERS
//
/**
 * Checks if a string contains only alphanumeric characters
 * @param {string} str - The string to check
 * @returns {boolean} True if alphanumeric, false otherwise
 */
export const isAlphanumeric = (str: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(str);
};

/**
 * Checks if a string is a valid slug (URL-friendly)
 * @param {string} str - The string to check
 * @returns {boolean} True if valid slug, false otherwise
 */
export const isValidSlug = (str: string): boolean => {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(str);
};

/**
 * Converts text to a URL-friendly slug
 * @param {string} text - The text to convert
 * @returns {string} The slug
 * @example
 * textToSlug('Hello World!') // "hello-world"
 */
export const textToSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

//// UTILITY FUNCTIONS
//
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
 * Calculates progress percentage
 * @param {number} completed - Number of completed items
 * @param {number} total - Total number of items
 * @returns {number} Progress percentage (0-100)
 * @example
 * calculateProgress(3, 10) // 30
 */
export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * Calculate milestone progress based on task completion
 * @param {Array<{status: string}>} tasks - Array of tasks with status
 * @returns {number} Progress percentage (0-100)
 * @example
 * calculateMilestoneProgress([{status: 'Completed'}, {status: 'Pending'}]) // 50
 */
export const calculateMilestoneProgress = (
  tasks: Array<{ status: string }>
): number => {
  if (tasks.length === 0) return 0;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  return Math.round((completedTasks / tasks.length) * 100);
};
