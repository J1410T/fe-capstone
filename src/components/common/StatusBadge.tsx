import React from "react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { getStatusColor } from "@/shared/utils/helpers";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import {
  type ComponentSize,
  type StatusType,
  type BaseComponentProps,
} from "@/components/types";

interface StatusBadgeProps extends Omit<BaseComponentProps, "children"> {
  status: string | StatusType;
  variant?: BadgeProps["variant"];
  showIcon?: boolean;
  size?: ComponentSize;
}

/**
 * Unified StatusBadge component
 * Consolidates all status badge implementations across the codebase
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = "outline",
  className = "",
  showIcon = false,
  size = "md",
}) => {
  const colorClass = getStatusColor(status);

  const getStatusIcon = () => {
    if (!showIcon) return null;

    const normalizedStatus = status.toLowerCase();
    const iconSize =
      size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

    if (
      normalizedStatus.includes("completed") ||
      normalizedStatus.includes("complete")
    ) {
      return <CheckCircle className={`${iconSize} mr-1`} />;
    }
    if (
      normalizedStatus.includes("progress") ||
      normalizedStatus.includes("processing")
    ) {
      return <Clock className={`${iconSize} mr-1`} />;
    }
    if (
      normalizedStatus.includes("pending") ||
      normalizedStatus.includes("waiting")
    ) {
      return <AlertCircle className={`${iconSize} mr-1`} />;
    }
    if (
      normalizedStatus.includes("overdue") ||
      normalizedStatus.includes("late")
    ) {
      return <AlertTriangle className={`${iconSize} mr-1`} />;
    }
    if (
      normalizedStatus.includes("cancelled") ||
      normalizedStatus.includes("rejected") ||
      normalizedStatus.includes("failed")
    ) {
      return <XCircle className={`${iconSize} mr-1`} />;
    }

    return null;
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  };

  return (
    <Badge
      variant={variant}
      className={`${colorClass} ${sizeClasses[size]} ${className} inline-flex items-center`}
    >
      {getStatusIcon()}
      {status}
    </Badge>
  );
};

// Export alias for backward compatibility
export { StatusBadge as UnifiedStatusBadge };
