import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
<<<<<<< HEAD
import { cn } from "@/utils";
=======
import { cn } from "@/lib/utils";
>>>>>>> e2eea07370f2f74e9ee2bf9e8b1500b8ad014cf9
import { type LucideIcon } from "lucide-react";
import {
  type ComponentAction,
  type ComponentBadge,
  type ComponentMetadata,
  type CardVariant,
  type IconColorClass,
  type BaseComponentProps,
} from "@/components/types";

interface DataCardProps extends BaseComponentProps {
  title: string;
  description?: string;
  status?: string;
  badges?: ComponentBadge[];
  icon?: LucideIcon;
  iconColor?: IconColorClass;
  actions?: ComponentAction[];
  variant?: CardVariant;
  clickable?: boolean;
  onClick?: () => void;
  metadata?: ComponentMetadata[];
}

/**
 * Unified DataCard component
 * Consolidates card patterns used across the codebase for displaying data
 */
export const DataCard: React.FC<DataCardProps> = ({
  title,
  description,
  status,
  badges = [],
  icon: Icon,
  iconColor = "text-gray-500",
  actions = [],
  children,
  className,
  variant = "default",
  clickable = false,
  onClick,
  metadata = [],
}) => {
  const cardClasses = cn(
    "transition-all duration-200",
    clickable && "cursor-pointer hover:shadow-md hover:scale-[1.02]",
    className
  );

  const renderHeader = () => (
    <CardHeader className={variant === "compact" ? "pb-2" : undefined}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {Icon && (
            <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", iconColor)} />
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">
              {title}
            </CardTitle>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          {status && <StatusBadge status={status} size="sm" />}
          {badges.map((badge, index) => (
            <Badge key={index} variant={badge.variant || "secondary"}>
              {badge.label}
            </Badge>
          ))}
        </div>
      </div>
    </CardHeader>
  );

  const renderMetadata = () => {
    if (metadata.length === 0) return null;

    return (
      <div className="grid grid-cols-2 gap-4 text-sm">
        {metadata.map((item, index) => (
          <div key={index}>
            <span className="text-gray-500">{item.label}:</span>
            <span className="ml-2 font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderActions = () => {
    if (actions.length === 0) return null;

    return (
      <div className="flex items-center justify-end space-x-2 pt-4 border-t">
        {actions.map((action, index) => {
          const ActionIcon = action.icon;
          return (
            <Button
              key={index}
              variant={action.variant || "outline"}
              size="sm"
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {ActionIcon && <ActionIcon className="h-4 w-4 mr-2" />}
              {action.label}
            </Button>
          );
        })}
      </div>
    );
  };

  const renderContent = () => (
    <CardContent className={variant === "compact" ? "pt-0" : undefined}>
      {variant === "detailed" && renderMetadata()}
      {children}
      {renderActions()}
    </CardContent>
  );

  return (
    <Card className={cardClasses} onClick={clickable ? onClick : undefined}>
      {renderHeader()}
      {renderContent()}
    </Card>
  );
};

// Export alias for backward compatibility
export { DataCard as UnifiedDataCard };
