import { Badge } from "@/components/ui/badge";
import { cn } from "../utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
  breadcrumb,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {breadcrumb && (
        <div className="text-sm text-muted-foreground">{breadcrumb}</div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>
            {badge && (
              <Badge variant={badge.variant || "default"}>{badge.text}</Badge>
            )}
          </div>
          {description && (
            <p className="text-muted-foreground max-w-2xl">{description}</p>
          )}
        </div>

        {actions && (
          <div className="flex items-center space-x-2">{actions}</div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
