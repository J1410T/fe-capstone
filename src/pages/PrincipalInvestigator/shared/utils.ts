import { TimeLimit, PaymentSchedule, PaymentPhase } from "./types";

// Time and date utilities
export const getCurrentQuarter = (): 1 | 2 | 3 | 4 => {
  const month = new Date().getMonth() + 1;
  if (month <= 3) return 1;
  if (month <= 6) return 2;
  if (month <= 9) return 3;
  return 4;
};

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

export const isOverdue = (dueDate: string): boolean => {
  return new Date(dueDate) < new Date();
};

export const getDaysUntilDeadline = (deadline: string): number => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Project type and time limit validation
export const getTimeLimit = (): TimeLimit => {
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

export const canCreateProjectType = (
  projectType: "Basic" | "Application"
): boolean => {
  const timeLimit = getTimeLimit();
  return (
    timeLimit.isActive && timeLimit.allowedProjectTypes.includes(projectType)
  );
};

export const getProjectTypeRestrictionMessage = (): string => {
  const timeLimit = getTimeLimit();
  const quarter = getCurrentQuarter();

  if (!timeLimit.isActive) {
    return "Project creation is currently not allowed. Please wait for the next registration period.";
  }

  if (quarter === 1) {
    return "Only Application projects can be created in Quarter 1.";
  }

  if (quarter === 2) {
    return "Only Basic projects can be created in Quarter 2.";
  }

  return "Project creation is currently not allowed.";
};

// Payment schedule utilities
export const generatePaymentSchedule = (
  projectType: "Basic" | "Application",
  totalAmount: number,
  startDate: string
): PaymentSchedule => {
  const phases: PaymentPhase[] = [];

  if (projectType === "Basic") {
    // Basic: 100% after acceptance
    phases.push({
      phase: 1,
      percentage: 100,
      amount: totalAmount,
      dueDate: startDate,
      status: "Pending",
    });
  } else {
    // Application: 30% - 30% - 30% - 10%
    const percentages = [30, 30, 30, 10];
    percentages.forEach((percentage, index) => {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + index * 3); // Every 3 months

      phases.push({
        phase: index + 1,
        percentage,
        amount: (totalAmount * percentage) / 100,
        dueDate: dueDate.toISOString().split("T")[0],
        status: "Pending",
      });
    });
  }

  return {
    projectType,
    schedule: phases,
    totalAmount,
    paidAmount: 0,
  };
};

// File validation utilities
export const validateFileUpload = (
  file: File
): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "image/jpeg",
    "image/png",
  ];

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File ${file.name} is too large. Maximum size is 10MB.`,
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

// Status badge utilities
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "completed":
    case "approved":
    case "paid":
      return "bg-green-100 text-green-800";
    case "in progress":
    case "processing":
    case "under review":
      return "bg-blue-100 text-blue-800";
    case "pending":
    case "draft":
      return "bg-yellow-100 text-yellow-800";
    case "overdue":
    case "rejected":
      return "bg-red-100 text-red-800";
    case "cancelled":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Form validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

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

// Progress calculation utilities
export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const calculateMilestoneProgress = (
  tasks: { status: string }[]
): number => {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  return calculateProgress(completedTasks, tasks.length);
};
