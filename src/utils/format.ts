/**
 * Formatting utility functions
 * Number, currency, file size, and other formatting utilities
 */

/**
 * Formats a number as currency (VND by default)
 */
export const formatCurrency = (amount: number, currency = "VND"): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
  }).format(amount);
};

/**
 * Formats a number as VND currency with proper Vietnamese formatting
 */
export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a file size in bytes into a human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Formats a number with thousand separators
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num);
};

/**
 * Formats a percentage with specified decimal places
 */
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Calculates budget utilization as a percentage
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
 */
export const calculateProgress = (completed: number, total: number): number => {
  if (!total || total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * Calculates milestone progress based on task statuses
 */
export const calculateMilestoneProgress = (
  tasks: { status: string }[]
): number => {
  if (!tasks.length) return 0;
  const completedTasks = tasks.filter(
    (task) =>
      task.status.toLowerCase() === "completed" ||
      task.status.toLowerCase() === "complete"
  ).length;

  return calculateProgress(completedTasks, tasks.length);
};

/**
 * Formats a duration in milliseconds to human readable format
 */
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

/**
 * Truncates text to specified length with ellipsis
 */
export const truncateText = (
  text: string,
  maxLength: number,
  ellipsis = "..."
): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
};

/**
 * Formats a phone number (basic US format)
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phone;
};
