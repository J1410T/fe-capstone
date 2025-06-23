/**
 * Project-specific utility functions
 * Business logic utilities for project management
 */

// Types for project-specific functionality
interface TimeLimit {
  quarter: 1 | 2 | 3 | 4;
  allowedProjectTypes: string[];
  deadline: string;
  isActive: boolean;
}

interface PaymentPhase {
  phase: number;
  percentage: number;
  amount: number;
  dueDate: string;
  status: "Pending" | "Paid" | "Overdue";
}

interface PaymentSchedule {
  projectType: "Basic" | "Application";
  schedule: PaymentPhase[];
  totalAmount: number;
  paidAmount: number;
}

/**
 * Project type and time limit validation
 */
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

/**
 * Check if a project type can be created in the current time period
 */
export const canCreateProjectType = (
  projectType: "Basic" | "Application"
): boolean => {
  const timeLimit = getTimeLimit();
  return (
    timeLimit.isActive && timeLimit.allowedProjectTypes.includes(projectType)
  );
};

/**
 * Get project type restriction message
 */
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

/**
 * Generate payment schedule based on project type
 */
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

/**
 * Calculate project completion percentage
 */
export const calculateProjectCompletion = (
  milestones: { completed: boolean }[]
): number => {
  if (!milestones.length) return 0;
  const completedCount = milestones.filter((m) => m.completed).length;
  return Math.round((completedCount / milestones.length) * 100);
};

/**
 * Check if project is overdue
 */
export const isProjectOverdue = (dueDate: string | Date): boolean => {
  return new Date(dueDate) < new Date();
};

/**
 * Get project status badge color
 */
export const getProjectStatusColor = (status: string): string => {
  const normalizedStatus = status.toLowerCase().trim();

  switch (normalizedStatus) {
    case "active":
    case "in progress":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "on hold":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * Calculate budget utilization for a project
 */
export const calculateProjectBudgetUtilization = (
  usedBudget: number,
  totalBudget: number
): { percentage: number; status: "good" | "warning" | "critical" } => {
  const percentage = Math.round((usedBudget / totalBudget) * 100);

  let status: "good" | "warning" | "critical" = "good";
  if (percentage >= 90) {
    status = "critical";
  } else if (percentage >= 75) {
    status = "warning";
  }

  return { percentage, status };
};

/**
 * Get project priority level
 */
export const getProjectPriority = (
  dueDate: string | Date,
  importance: "high" | "medium" | "low"
): "urgent" | "high" | "medium" | "low" => {
  const daysUntilDue = Math.ceil(
    (new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilDue <= 7 && importance === "high") {
    return "urgent";
  }

  return importance;
};

/**
 * Validate project data
 */
export const validateProjectData = (projectData: {
  title: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!projectData.title.trim()) {
    errors.push("Project title is required");
  }

  if (!projectData.description.trim()) {
    errors.push("Project description is required");
  }

  if (projectData.budget <= 0) {
    errors.push("Project budget must be greater than 0");
  }

  if (new Date(projectData.startDate) >= new Date(projectData.endDate)) {
    errors.push("Start date must be before end date");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper function used internally
function getCurrentQuarter(): 1 | 2 | 3 | 4 {
  const month = new Date().getMonth() + 1;
  if (month <= 3) return 1;
  if (month <= 6) return 2;
  if (month <= 9) return 3;
  return 4;
}
