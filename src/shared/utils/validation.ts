/**
 * Validation utility functions
 * Consolidated from multiple files across the codebase
 * @module validation
 */

//// EMAIL VALIDATION
//
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

//// FIELD VALIDATION
//
/**
 * Validates that a required field has a value
 * @param {string} value - The value to validate
 * @returns {boolean} True if valid (not empty), false otherwise
 * @example
 * validateRequired('hello') // true
 * validateRequired('   ') // false
 */
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validates a number within optional min/max bounds
 * @param {string} value - The value to validate as a number
 * @param {number} [min] - Optional minimum value
 * @param {number} [max] - Optional maximum value
 * @returns {boolean} True if valid number within bounds, false otherwise
 * @example
 * validateNumber('123', 0, 1000) // true
 * validateNumber('abc') // false
 */
export const validateNumber = (
  value: string,
  min?: number,
  max?: number
): boolean => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
};

/**
 * Validates a phone number format
 * @param {string} phone - The phone number to validate
 * @returns {boolean} True if valid, false otherwise
 * @example
 * validatePhone('+1234567890') // true
 */
export const validatePhone = (phone: string): boolean => {
  if (!phone) return true; // Optional field
  return /^[+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-()]/g, ""));
};

//// FILE VALIDATION
//
/**
 * Validates file upload constraints
 * @param {File} file - The file to validate
 * @param {number} [maxSize] - Maximum file size in bytes (default: 10MB)
 * @param {string[]} [allowedTypes] - Array of allowed MIME types
 * @returns {object} Validation result with isValid boolean and optional error message
 * @example
 * validateFileUpload(file) // { isValid: true } or { isValid: false, error: "..." }
 */
export const validateFileUpload = (
  file: File,
  maxSize: number = 10 * 1024 * 1024, // 10MB default
  allowedTypes: string[] = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "image/jpeg",
    "image/png",
  ]
): { isValid: boolean; error?: string } => {
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File ${file.name} is too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB.`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File ${file.name} is not a supported format.`,
    };
  }

  return { isValid: true };
};

//// DATE VALIDATION
//
/**
 * Validates that a date is not in the past
 * @param {string | Date} date - The date to validate
 * @returns {boolean} True if date is today or in the future, false otherwise
 * @example
 * validateFutureDate('2025-12-31') // true (assuming current date is before this)
 */
export const validateFutureDate = (date: string | Date): boolean => {
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate >= today;
};

/**
 * Validates that a date is not in the future
 * @param {string | Date} date - The date to validate
 * @returns {boolean} True if date is today or in the past, false otherwise
 * @example
 * validatePastDate('2020-01-01') // true (assuming current date is after this)
 */
export const validatePastDate = (date: string | Date): boolean => {
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return inputDate <= today;
};

//// FORM VALIDATION HELPERS
//
/**
 * Validates a form field and returns an error message if invalid
 * @param {string} value - The field value
 * @param {object} rules - Validation rules
 * @returns {string | null} Error message or null if valid
 * @example
 * validateField('', { required: true }) // "This field is required"
 */
export const validateField = (
  value: string,
  rules: {
    required?: boolean;
    email?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customMessage?: string;
  }
): string | null => {
  if (rules.required && !validateRequired(value)) {
    return rules.customMessage || "This field is required";
  }

  if (value && rules.email && !validateEmail(value)) {
    return rules.customMessage || "Please enter a valid email address";
  }

  if (value && rules.minLength && value.length < rules.minLength) {
    return rules.customMessage || `Minimum length is ${rules.minLength} characters`;
  }

  if (value && rules.maxLength && value.length > rules.maxLength) {
    return rules.customMessage || `Maximum length is ${rules.maxLength} characters`;
  }

  if (value && rules.pattern && !rules.pattern.test(value)) {
    return rules.customMessage || "Invalid format";
  }

  return null;
};

/**
 * Validates multiple form fields at once
 * @param {object} formData - Object with field names as keys and values as values
 * @param {object} validationRules - Object with field names as keys and validation rules as values
 * @returns {object} Object with field names as keys and error messages as values
 * @example
 * validateForm({ email: 'invalid' }, { email: { required: true, email: true } })
 * // { email: "Please enter a valid email address" }
 */
export const validateForm = (
  formData: Record<string, string>,
  validationRules: Record<string, Parameters<typeof validateField>[1]>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.keys(validationRules).forEach((fieldName) => {
    const value = formData[fieldName] || "";
    const rules = validationRules[fieldName];
    const error = validateField(value, rules);
    
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

//// UTILITY VALIDATION FUNCTIONS
//
/**
 * Checks if a string is a valid URL
 * @param {string} url - The URL to validate
 * @returns {boolean} True if valid URL, false otherwise
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
 * Validates a password meets basic security requirements
 * @param {string} password - The password to validate
 * @param {object} [requirements] - Password requirements
 * @returns {object} Validation result with isValid boolean and optional error message
 */
export const validatePassword = (
  password: string,
  requirements: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  } = {}
): { isValid: boolean; error?: string } => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false,
  } = requirements;

  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${minLength} characters long`,
    };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one uppercase letter",
    };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one lowercase letter",
    };
  }

  if (requireNumbers && !/\d/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one number",
    };
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one special character",
    };
  }

  return { isValid: true };
};
