import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/core";
import { getStatusBadgeClassName } from "@/lib/ui-constants";

// Status type mapping - can be extended as needed
export type StatusType =
  | "success"
  | "approved"
  | "completed"
  | "active"
  | "warning"
  | "pending"
  | "in-progress"
  | "review"
  | "error"
  | "rejected"
  | "failed"
  | "overdue"
  | "info"
  | "draft"
  | "submitted"
  | "neutral"
  | "inactive"
  | "not-started";

// Map status strings to our standardized status types
const getStatusType = (
  status: string
): "success" | "warning" | "error" | "info" | "neutral" => {
  const normalizedStatus = status.toLowerCase().replace(/[_\s]/g, "-");

  switch (normalizedStatus) {
    case "approved":
    case "completed":
    case "complete":
    case "active":
    case "success":
      return "success";

    case "pending":
    case "in-progress":
    case "review":
    case "under-review":
    case "warning":
      return "warning";

    case "rejected":
    case "failed":
    case "error":
    case "overdue":
      return "error";

    case "draft":
    case "submitted":
    case "info":
      return "info";

    case "inactive":
    case "not-started":
    case "neutral":
    default:
      return "neutral";
  }
};

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "secondary";
  className?: string;
}

/**
 * Unified StatusBadge component
 * Consolidates all status badge implementations across the codebase
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  variant = "default",
  className,
}) => {
  const statusType = getStatusType(status);
  const baseClassName = getStatusBadgeClassName(statusType);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <Badge
      variant={variant}
      className={cn(
        baseClassName,
        sizeClasses[size],
        "font-medium border rounded-full",
        className
      )}
    >
      {status}
    </Badge>
  );
};

// Export alias for backward compatibility
export { StatusBadge as UnifiedStatusBadge };
