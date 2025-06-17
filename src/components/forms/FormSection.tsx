import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "card" | "simple" | "bordered";
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

/**
 * Unified FormSection component
 * Provides consistent styling for form sections across the codebase
 */
export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className,
  variant = "simple",
  collapsible = false,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  const renderHeader = () => {
    if (!title && !description) return null;

    const headerContent = (
      <div className="space-y-1">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        )}
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>
    );

    if (collapsible) {
      return (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          <div className="flex items-center justify-between">
            {headerContent}
            <span className="text-gray-400">
              {isExpanded ? "−" : "+"}
            </span>
          </div>
        </button>
      );
    }

    return headerContent;
  };

  const renderContent = () => {
    if (collapsible && !isExpanded) return null;
    return children;
  };

  switch (variant) {
    case "card":
      return (
        <Card className={cn("w-full", className)}>
          {(title || description) && (
            <CardHeader>
              <CardTitle>{renderHeader()}</CardTitle>
            </CardHeader>
          )}
          <CardContent className="space-y-4">
            {renderContent()}
          </CardContent>
        </Card>
      );

    case "bordered":
      return (
        <div className={cn("border rounded-lg p-6 space-y-4", className)}>
          {renderHeader()}
          {(title || description) && <Separator />}
          {renderContent()}
        </div>
      );

    case "simple":
    default:
      return (
        <div className={cn("space-y-4", className)}>
          {renderHeader()}
          {renderContent()}
        </div>
      );
  }
};

// Export alias for backward compatibility
export { FormSection as UnifiedFormSection };
