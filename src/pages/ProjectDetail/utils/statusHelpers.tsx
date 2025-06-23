<<<<<<< HEAD
// Re-export from consolidated utils
export { getStatusColorEmerald as getStatusColor } from "@/utils/status";
export { getStatusIcon } from "@/utils/status";
=======
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { getStatusColorEmerald } from "@/shared/utils/status";

// Use the shared status color function with emerald variant
export const getStatusColor = getStatusColorEmerald;

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return <CheckCircle className="h-4 w-4 mr-1" />;
    case "In Progress":
      return <Clock className="h-4 w-4 mr-1" />;
    case "Pending":
      return <AlertCircle className="h-4 w-4 mr-1" />;
    default:
      return null;
  }
};
>>>>>>> e2eea07370f2f74e9ee2bf9e8b1500b8ad014cf9
