import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Circle,
  Play,
  CheckCircle2,
  XCircle,
  FileEdit,
  Send,
  Eye,
  Clock,
  Loader2,
  Award,
  Calendar,
} from "lucide-react";
import { StatusType, StatusConfig } from "./types";

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  size?: "sm" | "md" | "lg";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = "project",
  size = "md",
}) => {
  const statusConfigs = {
    project: {
      created: {
        variant: "secondary" as const,
        label: "Created",
        icon: Circle,
        color: "text-gray-600",
      },
      in_progress: {
        variant: "default" as const,
        label: "In Progress",
        icon: Play,
        color: "text-blue-600",
      },
      completed: {
        variant: "outline" as const,
        label: "Completed",
        icon: CheckCircle2,
        color: "text-green-600",
      },
      cancelled: {
        variant: "destructive" as const,
        label: "Cancelled",
        icon: XCircle,
        color: "text-red-600",
      },
    },
    proposal: {
      draft: {
        variant: "secondary" as const,
        label: "Draft",
        icon: FileEdit,
        color: "text-gray-600",
      },
      submitted: {
        variant: "default" as const,
        label: "Submitted",
        icon: Send,
        color: "text-blue-600",
      },
      approved: {
        variant: "outline" as const,
        label: "Approved",
        icon: CheckCircle2,
        color: "text-green-600",
      },
      rejected: {
        variant: "destructive" as const,
        label: "Rejected",
        icon: XCircle,
        color: "text-red-600",
      },
      under_review: {
        variant: "secondary" as const,
        label: "Under Review",
        icon: Eye,
        color: "text-orange-600",
      },
    },
    clone: {
      active: {
        variant: "default" as const,
        label: "Active",
        icon: Play,
        color: "text-blue-600",
      },
      pending: {
        variant: "secondary" as const,
        label: "Pending",
        icon: Clock,
        color: "text-orange-600",
      },
      approved: {
        variant: "outline" as const,
        label: "Approved",
        icon: CheckCircle2,
        color: "text-green-600",
      },
      rejected: {
        variant: "destructive" as const,
        label: "Rejected",
        icon: XCircle,
        color: "text-red-600",
      },
    },
    evaluation: {
      pending: {
        variant: "secondary" as const,
        label: "Pending",
        icon: Clock,
        color: "text-orange-600",
      },
      in_progress: {
        variant: "default" as const,
        label: "In Progress",
        icon: Loader2,
        color: "text-blue-600",
      },
      completed: {
        variant: "outline" as const,
        label: "Completed",
        icon: CheckCircle2,
        color: "text-green-600",
      },
    },
    request: {
      pending: {
        variant: "secondary" as const,
        label: "Pending",
        icon: Clock,
        color: "text-orange-600",
      },
      approved: {
        variant: "outline" as const,
        label: "Approved",
        icon: CheckCircle2,
        color: "text-green-600",
      },
      rejected: {
        variant: "destructive" as const,
        label: "Rejected",
        icon: XCircle,
        color: "text-red-600",
      },
    },
    milestone: {
      not_started: {
        variant: "secondary" as const,
        label: "Not Started",
        icon: Circle,
        color: "text-gray-600",
      },
      in_progress: {
        variant: "default" as const,
        label: "In Progress",
        icon: Calendar,
        color: "text-blue-600",
      },
      completed: {
        variant: "outline" as const,
        label: "Completed",
        icon: CheckCircle2,
        color: "text-green-600",
      },
      approved: {
        variant: "outline" as const,
        label: "Approved",
        icon: Award,
        color: "text-green-600",
      },
      rejected: {
        variant: "destructive" as const,
        label: "Rejected",
        icon: XCircle,
        color: "text-red-600",
      },
      pending: {
        variant: "secondary" as const,
        label: "Pending Review",
        icon: Clock,
        color: "text-orange-600",
      },
    },
  };

  const config =
    (statusConfigs[type] as Record<string, StatusConfig>)?.[status] ||
    statusConfigs.project.created;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <Badge
      variant={config.variant}
      className={`flex items-center gap-1 ${sizeClasses[size]}`}
    >
      <IconComponent className={iconSizes[size]} />
      {config.label}
    </Badge>
  );
};
