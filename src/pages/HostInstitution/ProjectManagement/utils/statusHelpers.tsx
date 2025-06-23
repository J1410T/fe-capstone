import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
// Re-export from consolidated utils
export { getStatusColorEmerald as getStatusColor } from "@/utils/status";

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
