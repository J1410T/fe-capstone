import { TimeLimit, PaymentSchedule, PaymentPhase } from "./types";
// Use centralized helpers for date, currency, file size, budget, and email
import {
  formatDate,
  formatDateTime,
  formatCurrency,
  formatFileSize,
  calculateBudgetUtilization,
  validateEmail,
  validateRequired,
  validateNumber,
  getStatusColor,
  getCurrentQuarter,
  isOverdue,
  getDaysUntilDeadline,
  calculateProgress,
  validateFileUpload,
} from "@/shared/utils/helpers";

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

// Re-export commonly used utilities from shared helpers
export {
  formatDate,
  formatDateTime,
  formatCurrency,
  formatFileSize,
  calculateBudgetUtilization,
  validateEmail,
  validateRequired,
  validateNumber,
  getStatusColor,
  getCurrentQuarter,
  isOverdue,
  getDaysUntilDeadline,
  calculateProgress,
  validateFileUpload,
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
