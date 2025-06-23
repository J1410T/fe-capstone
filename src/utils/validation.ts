/**
 * Validation utility functions
 * Form validation and data validation utilities
 */

/**
 * Validates an email address format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a phone number (basic format)
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

/**
 * Validates a URL format
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates if a string is not empty (after trimming)
 */
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validates if a number is within a specified range
 */
export const validateNumberRange = (
  value: number,
  min?: number,
  max?: number
): boolean => {
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  return true;
};

/**
 * Validates if a string represents a valid number
 */
export const validateNumber = (
  value: string,
  min?: number,
  max?: number
): boolean => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  return validateNumberRange(num, min, max);
};

/**
 * Validates password strength
 */
export const validatePassword = (
  password: string
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates if a string contains only alphabetic characters
 */
export const validateAlphaOnly = (value: string): boolean => {
  return /^[a-zA-Z]+$/.test(value);
};

/**
 * Validates if a string contains only alphanumeric characters
 */
export const validateAlphaNumeric = (value: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(value);
};

/**
 * Validates if a date is in the future
 */
export const validateFutureDate = (date: string | Date): boolean => {
  const inputDate = new Date(date);
  const now = new Date();
  return inputDate > now;
};

/**
 * Validates if a date is in the past
 */
export const validatePastDate = (date: string | Date): boolean => {
  const inputDate = new Date(date);
  const now = new Date();
  return inputDate < now;
};

/**
 * Validates if a date is within a specified range
 */
export const validateDateRange = (
  date: string | Date,
  minDate?: string | Date,
  maxDate?: string | Date
): boolean => {
  const inputDate = new Date(date);

  if (minDate && inputDate < new Date(minDate)) return false;
  if (maxDate && inputDate > new Date(maxDate)) return false;

  return true;
};

/**
 * Validates file size (in bytes)
 */
export const validateFileSize = (file: File, maxSizeBytes: number): boolean => {
  return file.size <= maxSizeBytes;
};

/**
 * Validates file type
 */
export const validateFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Validates if a string matches a regex pattern
 */
export const validatePattern = (value: string, pattern: RegExp): boolean => {
  return pattern.test(value);
};

/**
 * Validates minimum and maximum string length
 */
export const validateStringLength = (
  value: string,
  minLength?: number,
  maxLength?: number
): boolean => {
  if (minLength !== undefined && value.length < minLength) return false;
  if (maxLength !== undefined && value.length > maxLength) return false;
  return true;
};

/**
 * Generic validation function that accepts custom validator functions
 */
export const validateCustom = <T>(
  value: T,
  validators: Array<(value: T) => boolean | string>
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  for (const validator of validators) {
    const result = validator(value);
    if (result === false) {
      errors.push("Validation failed");
    } else if (typeof result === "string") {
      errors.push(result);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
