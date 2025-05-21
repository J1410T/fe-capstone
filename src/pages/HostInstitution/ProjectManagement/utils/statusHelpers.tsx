import React from "react";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "In Progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Completed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Overdue":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return <CheckCircle className="h-4 w-4" />;
    case "In Progress":
      return <Clock className="h-4 w-4" />;
    case "Pending":
      return <Clock className="h-4 w-4" />;
    case "Overdue":
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return null;
  }
};
