/**
 * String utility functions
 * Text manipulation and formatting utilities
 */

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Converts a string to camelCase
 */
export const toCamelCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
};

/**
 * Converts a string to kebab-case
 */
export const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
};

/**
 * Converts a string to snake_case
 */
export const toSnakeCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
};

/**
 * Truncates a string to a specified length and adds ellipsis
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
 * Removes HTML tags from a string
 */
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, "");
};

/**
 * Converts a string to title case
 */
export const toTitleCase = (str: string): string => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Escapes special characters for use in regex
 */
export const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Generates a slug from a string (URL-friendly)
 */
export const generateSlug = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Pluralizes a word based on count
 */
export const pluralize = (
  word: string,
  count: number,
  plural?: string
): string => {
  if (count === 1) return word;
  return plural || `${word}s`;
};

/**
 * Extracts initials from a name
 */
export const getInitials = (name: string, maxInitials = 2): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, maxInitials)
    .join("");
};

/**
 * Masks sensitive information (email, phone, etc.)
 */
export const maskString = (
  str: string,
  visibleChars = 4,
  maskChar = "*"
): string => {
  if (str.length <= visibleChars) return str;

  const visiblePart = str.slice(0, visibleChars);
  const maskedPart = maskChar.repeat(str.length - visibleChars);

  return visiblePart + maskedPart;
};

/**
 * Checks if a string contains only whitespace
 */
export const isWhitespace = (str: string): boolean => {
  return /^\s*$/.test(str);
};

/**
 * Wraps text to specified line length
 */
export const wrapText = (text: string, lineLength: number): string => {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + word).length > lineLength) {
      if (currentLine) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        lines.push(word);
      }
    } else {
      currentLine += word + " ";
    }
  }

  if (currentLine) {
    lines.push(currentLine.trim());
  }

  return lines.join("\n");
};
