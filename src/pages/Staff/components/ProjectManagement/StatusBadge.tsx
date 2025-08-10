import React from "react";

interface StatusBadgeProps {
  status: string;
  size?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "sm",
  className = "",
}) => {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "created":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "in progress":
      case "in-progress":
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "submitted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSizeStyles = (size: string) => {
    switch (size) {
      case "sm":
        return "px-2 py-0.5 text-xs";
      case "md":
        return "px-2.5 py-1 text-sm";
      case "lg":
        return "px-3 py-1.5 text-base";
      default:
        return "px-2.5 py-0.5 text-xs";
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${getStatusStyles(
        status
      )} ${getSizeStyles(size)} ${className}`}
    >
      {status}
    </span>
  );
};
