// Shared utilities for ProjectDetailPage components

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const calculateBudgetUtilization = (
  spent: number,
  total: number
): number => {
  if (total === 0) return 0;
  return Math.round((spent / total) * 100);
};

export const getCategoryIcon = (category: string): string => {
  switch (category) {
    case "personnel":
      return "👥";
    case "equipment":
      return "🖥️";
    case "travel":
      return "✈️";
    case "materials":
      return "📦";
    case "other":
      return "📋";
    default:
      return "💰";
  }
};

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case "personnel":
      return "bg-blue-100 text-blue-800";
    case "equipment":
      return "bg-purple-100 text-purple-800";
    case "travel":
      return "bg-green-100 text-green-800";
    case "materials":
      return "bg-orange-100 text-orange-800";
    case "other":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const isOverdue = (dueDate: string): boolean => {
  return new Date(dueDate) < new Date();
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "approved":
    case "completed":
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
    case "in progress":
    case "under review":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "rejected":
    case "cancelled":
    case "overdue":
      return "bg-red-100 text-red-800 border-red-200";
    case "draft":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-blue-100 text-blue-800 border-blue-200";
  }
};

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

export const filterByStatus = <T extends { status: string }>(
  items: T[],
  status: string
): T[] => {
  if (status === "all") return items;
  return items.filter(
    (item) => item.status.toLowerCase() === status.toLowerCase()
  );
};

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

// Calculate milestone progress based on task completion
export const calculateMilestoneProgress = (
  tasks: Array<{ status: string }>
): number => {
  if (tasks.length === 0) return 0;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  return Math.round((completedTasks / tasks.length) * 100);
};
