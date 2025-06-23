import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
<<<<<<< HEAD
// Re-export from consolidated utils
export { getStatusColorEmerald as getStatusColor } from "@/utils/status";
=======
import { getStatusColorEmerald } from "@/shared/utils/status";

// Use the shared status color function with emerald variant
export const getStatusColor = getStatusColorEmerald;
>>>>>>> e2eea07370f2f74e9ee2bf9e8b1500b8ad014cf9

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
