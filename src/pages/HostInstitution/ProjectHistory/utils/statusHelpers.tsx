<<<<<<< HEAD
// Re-export from consolidated utils
export { getStatusColorEmerald as getStatusColor } from "@/utils/status";
export { getReportColor } from "@/utils/status";
export { getStatusIcon } from "@/utils/status";
export { getReportIcon } from "@/utils/status";
=======
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { getStatusColorEmerald, getReportColor } from "@/shared/utils/status";

// Use the shared status color functions
export const getStatusColor = getStatusColorEmerald;
export { getReportColor };

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
>>>>>>> e2eea07370f2f74e9ee2bf9e8b1500b8ad014cf9
