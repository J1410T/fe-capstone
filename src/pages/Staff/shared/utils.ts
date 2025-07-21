// Shared utilities for Staff module components

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function for merging classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

// Currency formatting
export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

// Status badge utilities
export const getStatusColor = (status: string): string => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case "active":
    case "completed":
    case "approved":
    case "paid":
      return "bg-green-100 text-green-800 border-green-200";
    case "inactive":
    case "cancelled":
    case "suspended":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "pending":
    case "draft":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "in progress":
    case "processing":
    case "under review":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "overdue":
    case "rejected":
    case "failed":
      return "bg-red-100 text-red-800 border-red-200";
    case "upcoming":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getTypeColor = (type: string): string => {
  const typeLower = type.toLowerCase();
  switch (typeLower) {
    case "milestone review":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "proposal evaluation":
      return "bg-green-100 text-green-800 border-green-200";
    case "final review":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "progress review":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "technical":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "environmental":
      return "bg-green-100 text-green-800 border-green-200";
    case "medical":
      return "bg-red-100 text-red-800 border-red-200";
    case "business":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "academic":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMinLength = (
  value: string,
  minLength: number
): boolean => {
  return value.trim().length >= minLength;
};

export const validateMaxLength = (
  value: string,
  maxLength: number
): boolean => {
  return value.trim().length <= maxLength;
};

// Search and filter utilities
export const searchInObject = (
  obj: Record<string, unknown>,
  searchTerm: string,
  fields?: string[]
): boolean => {
  const term = searchTerm.toLowerCase();
  const searchFields = fields || Object.keys(obj);

  return searchFields.some((field) => {
    const value = obj[field];
    if (typeof value === "string") {
      return value.toLowerCase().includes(term);
    }
    if (typeof value === "object" && value !== null) {
      return searchInObject(value as Record<string, unknown>, searchTerm);
    }
    return false;
  });
};

export const filterByStatus = <T extends { status: string }>(
  items: T[],
  status: string
): T[] => {
  if (status === "all") return items;
  return items.filter(
    (item) => item.status.toLowerCase() === status.toLowerCase()
  );
};

export const sortByField = <T>(
  items: T[],
  field: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] => {
  return [...items].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });
};

// ID generation utility
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// File size formatting
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Debounce utility for search
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

// Pagination utilities
export const getPaginationInfo = (
  page: number,
  pageSize: number,
  total: number
) => {
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return {
    totalPages,
    startItem,
    endItem,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

// Form validation helpers
export const createValidator = (
  rules: Array<(value: unknown) => string | undefined>
) => {
  return (value: unknown): string | undefined => {
    for (const rule of rules) {
      const error = rule(value);
      if (error) return error;
    }
    return undefined;
  };
};

export const required =
  (message = "This field is required") =>
  (value: unknown): string | undefined => {
    if (!value || (typeof value === "string" && !value.trim())) {
      return message;
    }
    return undefined;
  };

export const minLength =
  (min: number, message?: string) =>
  (value: string): string | undefined => {
    if (value && value.length < min) {
      return message || `Must be at least ${min} characters`;
    }
    return undefined;
  };

export const maxLength =
  (max: number, message?: string) =>
  (value: string): string | undefined => {
    if (value && value.length > max) {
      return message || `Must be no more than ${max} characters`;
    }
    return undefined;
  };

export const email =
  (message = "Please enter a valid email address") =>
  (value: string): string | undefined => {
    if (value && !validateEmail(value)) {
      return message;
    }
    return undefined;
  };

// Table utilities
export const getTableRowKey = (
  item: Record<string, unknown>,
  index: number
): string => {
  return (item.id as string) || (item.key as string) || index.toString();
};

// Export all utilities as a single object for easier importing
export const StaffUtils = {
  cn,
  formatDate,
  formatDateTime,
  formatTime,
  formatVND,
  formatCurrency,
  getStatusColor,
  getTypeColor,
  validateEmail,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  searchInObject,
  filterByStatus,
  sortByField,
  generateId,
  formatFileSize,
  debounce,
  getPaginationInfo,
  createValidator,
  required,
  minLength,
  maxLength,
  email,
  getTableRowKey,
};
