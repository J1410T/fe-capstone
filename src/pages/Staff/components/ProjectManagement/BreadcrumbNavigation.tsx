import React from "react";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  id: string;
  label: string;
  type:
    | "overview"
    | "project"
    | "milestone"
    | "evaluation"
    | "evaluation-stage"
    | "request"
    | "proposal"
    | "document";
  data?: unknown;
  parentId?: string; // For hierarchical relationships
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  onNavigate: (item: BreadcrumbItem) => void;
  onBack: () => void;
}

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  items,
  onNavigate,
}) => {
  if (items.length === 0) return null;

  return (
    <div className="flex items-center space-x-2">
      {/* Breadcrumb Items */}
      <div className="flex items-center space-x-2 flex-1">
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <ChevronRight className="w-3 h-3 text-gray-400" />}
            <button
              onClick={() => onNavigate(item)}
              className={`text-sm font-medium transition-colors hover:bg-gray-100 px-2 py-1 rounded ${
                index === items.length - 1
                  ? "text-blue-600 cursor-default bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 cursor-pointer"
              }`}
              disabled={index === items.length - 1}
            >
              {index === 0 && <Home className="w-3 h-3 inline mr-1" />}
              {item.label}
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Helper function to create breadcrumb items
export const createBreadcrumbItem = (
  id: string,
  label: string,
  type: BreadcrumbItem["type"],
  data?: unknown,
  parentId?: string
): BreadcrumbItem => ({
  id,
  label,
  type,
  data,
  parentId,
});

// Helper function to get breadcrumb label based on type and data
export const getBreadcrumbLabel = (
  type: string,
  data: Record<string, unknown>
): string => {
  switch (type) {
    case "overview":
      return "Projects";
    case "project":
      return (data?.["english-title"] as string) || "Project Detail";
    case "milestone":
      return "Milestones";
    case "evaluation":
      return "Evaluation";
    case "evaluation-stage":
      return "Evaluation Stage";
    case "request":
      return "PI Request Details";
    case "proposal":
      return (data?.title as string) || "Proposal Details";
    case "document":
      return (data?.name as string) || "Document";
    default:
      return "Details";
  }
};
