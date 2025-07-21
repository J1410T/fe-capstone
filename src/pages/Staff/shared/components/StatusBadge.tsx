import { Badge } from "@/components/ui/badge";
import { cn, getStatusColor, getTypeColor } from "../utils";

interface StatusBadgeProps {
  status: string;
  variant?: "status" | "type";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({
  status,
  variant = "status",
  className,
  size = "md",
}: StatusBadgeProps) {
  const colorClass =
    variant === "status" ? getStatusColor(status) : getTypeColor(status);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <Badge
      className={cn(
        colorClass,
        sizeClasses[size],
        "font-medium border",
        className
      )}
      variant="outline"
    >
      {status}
    </Badge>
  );
}

export default StatusBadge;
