import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Suspended":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getReportColor = (reports: string) => {
  switch (reports) {
    case "Complete":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Incomplete":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "Missing":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return <CheckCircle className="h-4 w-4" />;
    case "Suspended":
      return <XCircle className="h-4 w-4" />;
    default:
      return null;
  }
};

export const getReportIcon = (reports: string) => {
  switch (reports) {
    case "Complete":
      return <CheckCircle className="h-4 w-4" />;
    case "Incomplete":
      return <AlertTriangle className="h-4 w-4" />;
    case "Missing":
      return <XCircle className="h-4 w-4" />;
    default:
      return null;
  }
};
