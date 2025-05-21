import React from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Pending Approval":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "Rejected":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "Approved":
      return <CheckCircle className="h-4 w-4" />;
    case "Pending Approval":
      return <Clock className="h-4 w-4" />;
    case "Rejected":
      return <XCircle className="h-4 w-4" />;
    default:
      return null;
  }
};
