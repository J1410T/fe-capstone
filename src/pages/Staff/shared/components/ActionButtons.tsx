import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  Ban,
} from "lucide-react";
import { cn } from "../utils";

export interface ActionItem {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: "default" | "destructive" | "secondary";
  disabled?: boolean;
  separator?: boolean;
}

interface ActionButtonsProps {
  actions: ActionItem[];
  className?: string;
  size?: "sm" | "lg" | "default";
  variant?: "dropdown" | "inline";
}

export function ActionButtons({
  actions,
  className,
  size = "sm",
  variant = "dropdown",
}: ActionButtonsProps) {
  if (variant === "inline") {
    return (
      <div className={cn("flex items-center space-x-1", className)}>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              size={size}
              onClick={action.onClick}
              disabled={action.disabled}
              className={cn(
                "h-8 w-8 p-0 hover:scale-105 transition-transform",
                action.variant === "destructive" &&
                  "text-red-600 hover:text-red-700 hover:bg-red-50",
                action.label === "View Details" &&
                  "text-blue-600 hover:text-blue-700 hover:bg-blue-50",
                action.label === "Edit" &&
                  "text-green-600 hover:text-green-700 hover:bg-green-50"
              )}
              title={action.label}
            >
              {Icon && <Icon className="w-4 h-4" />}
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={size}
          className={cn("h-8 w-8 p-0", className)}
        >
          <MoreHorizontal className="w-4 h-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {actions.map((action, index) => {
          const Icon = action.icon;

          if (action.separator && index > 0) {
            return (
              <React.Fragment key={index}>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={cn(
                    action.variant === "destructive" &&
                      "text-red-600 focus:text-red-600"
                  )}
                >
                  {Icon && <Icon className="w-4 h-4 mr-2" />}
                  {action.label}
                </DropdownMenuItem>
              </React.Fragment>
            );
          }

          return (
            <DropdownMenuItem
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              className={cn(
                action.variant === "destructive" &&
                  "text-red-600 focus:text-red-600"
              )}
            >
              {Icon && <Icon className="w-4 h-4 mr-2" />}
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Predefined common action sets
export const createCommonActions = {
  view: (onClick: () => void): ActionItem => ({
    label: "View Details",
    icon: Eye,
    onClick,
  }),

  edit: (onClick: () => void): ActionItem => ({
    label: "Edit",
    icon: Edit,
    onClick,
  }),

  delete: (onClick: () => void): ActionItem => ({
    label: "Delete",
    icon: Trash2,
    onClick,
    variant: "destructive" as const,
    separator: true,
  }),

  activate: (onClick: () => void): ActionItem => ({
    label: "Activate",
    icon: Play,
    onClick,
  }),

  deactivate: (onClick: () => void): ActionItem => ({
    label: "Deactivate",
    icon: Pause,
    onClick,
    variant: "destructive" as const,
  }),

  suspend: (onClick: () => void): ActionItem => ({
    label: "Suspend",
    icon: Ban,
    onClick,
    variant: "destructive" as const,
  }),
};

export default ActionButtons;
