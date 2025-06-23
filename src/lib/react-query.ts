/**
 * TanStack Query configuration
 */

import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Query client configuration with optimized defaults
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Retry with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus in production
      refetchOnWindowFocus: process.env.NODE_ENV === "production",
      // Don't refetch on reconnect by default
      refetchOnReconnect: false,
      // Network mode configuration
      networkMode: "online",
    },
    mutations: {
      // Global error handler for mutations
      onError: (error: Error) => {
        console.error("Mutation error:", error);
        toast.error("An error occurred", {
          description: error.message || "Please try again later",
        });
      },
      // Retry mutations once
      retry: 1,
      // Network mode for mutations
      networkMode: "online",
    },
  },
});

/**
 * Query keys factory for consistent key management
 */
export const queryKeys = {
  // Authentication
  auth: {
    me: ["auth", "me"] as const,
    permissions: ["auth", "permissions"] as const,
  },

  // Projects
  projects: {
    all: ["projects"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["projects", "list", filters] as const,
    detail: (id: string) => ["projects", "detail", id] as const,
    milestones: (id: string) => ["projects", id, "milestones"] as const,
    tasks: (id: string) => ["projects", id, "tasks"] as const,
    budget: (id: string) => ["projects", id, "budget"] as const,
    team: (id: string) => ["projects", id, "team"] as const,
  },

  // Tasks
  tasks: {
    all: ["tasks"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["tasks", "list", filters] as const,
    detail: (id: string) => ["tasks", "detail", id] as const,
    byProject: (projectId: string) =>
      ["tasks", "by-project", projectId] as const,
    byAssignee: (assigneeId: string) =>
      ["tasks", "by-assignee", assigneeId] as const,
  },

  // Users
  users: {
    all: ["users"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["users", "list", filters] as const,
    detail: (id: string) => ["users", "detail", id] as const,
    profile: (id: string) => ["users", "profile", id] as const,
  },

  // Meetings
  meetings: {
    all: ["meetings"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["meetings", "list", filters] as const,
    detail: (id: string) => ["meetings", "detail", id] as const,
    byProject: (projectId: string) =>
      ["meetings", "by-project", projectId] as const,
  },

  // Evaluations
  evaluations: {
    all: ["evaluations"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["evaluations", "list", filters] as const,
    detail: (id: string) => ["evaluations", "detail", id] as const,
    byProject: (projectId: string) =>
      ["evaluations", "by-project", projectId] as const,
  },

  // Forms
  forms: {
    all: ["forms"] as const,
    list: (type?: string) => ["forms", "list", type] as const,
    detail: (id: string) => ["forms", "detail", id] as const,
    templates: ["forms", "templates"] as const,
  },

  // Dashboard
  dashboard: {
    stats: ["dashboard", "stats"] as const,
    recent: ["dashboard", "recent"] as const,
    analytics: (period?: string) => ["dashboard", "analytics", period] as const,
  },
} as const;

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(public status: number, public data: unknown, message?: string) {
    super(message || "API Error");
    this.name = "ApiError";
  }
}

/**
 * Global error handler for queries
 */
export const handleQueryError = (error: unknown) => {
  console.error("Query error:", error);

  if (error instanceof ApiError) {
    // Handle specific API errors
    switch (error.status) {
      case 401:
        toast.error("Authentication required", {
          description: "Please log in to continue",
        });
        // Redirect to login or refresh token
        break;
      case 403:
        toast.error("Access denied", {
          description: "You do not have permission to access this resource",
        });
        break;
      case 404:
        toast.error("Resource not found", {
          description: "The requested resource could not be found",
        });
        break;
      case 500:
        toast.error("Server error", {
          description: "An internal server error occurred",
        });
        break;
      default:
        toast.error("An error occurred", {
          description: error.message || "Please try again later",
        });
    }
  } else if (error instanceof Error) {
    toast.error("An error occurred", {
      description: error.message || "Please try again later",
    });
  } else {
    toast.error("An unexpected error occurred", {
      description: "Please try again later",
    });
  }
};
