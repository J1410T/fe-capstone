import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, Ban, Play, Pause } from "lucide-react";
import { cn } from "../utils";
import { DIALOG_STYLES } from "../constants";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive" | "warning";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
  onConfirm,
  onCancel,
  icon,
}: ConfirmDialogProps) {
  const getIcon = () => {
    if (icon) {
      const Icon = icon;
      return <Icon className="w-6 h-6" />;
    }

    switch (variant) {
      case "destructive":
        return <Trash2 className="w-6 h-6 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return {
          iconBg: "bg-red-100",
          confirmButton: "destructive" as const,
        };
      case "warning":
        return {
          iconBg: "bg-yellow-100",
          confirmButton: "default" as const,
        };
      default:
        return {
          iconBg: "bg-blue-100",
          confirmButton: "default" as const,
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={DIALOG_STYLES.content}>
        <DialogHeader className={DIALOG_STYLES.header}>
          <div className="flex items-center space-x-3">
            {getIcon() && (
              <div className={cn("p-2 rounded-full", styles.iconBg)}>
                {getIcon()}
              </div>
            )}
            <div className="flex-1">
              <DialogTitle className={DIALOG_STYLES.title}>
                {title}
              </DialogTitle>
              <DialogDescription className={cn(DIALOG_STYLES.description, "mt-2")}>
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className={DIALOG_STYLES.footer}>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={styles.confirmButton}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Predefined confirm dialogs for common actions
export const createConfirmDialogs = {
  delete: (
    itemName: string,
    onConfirm: () => void,
    onCancel: () => void,
    loading = false
  ) => ({
    title: "Delete Item",
    description: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
    variant: "destructive" as const,
    icon: Trash2,
    loading,
    onConfirm,
    onCancel,
  }),

  activate: (
    itemName: string,
    onConfirm: () => void,
    onCancel: () => void,
    loading = false
  ) => ({
    title: "Activate Item",
    description: `Are you sure you want to activate "${itemName}"?`,
    confirmLabel: "Activate",
    cancelLabel: "Cancel",
    variant: "default" as const,
    icon: Play,
    loading,
    onConfirm,
    onCancel,
  }),

  deactivate: (
    itemName: string,
    onConfirm: () => void,
    onCancel: () => void,
    loading = false
  ) => ({
    title: "Deactivate Item",
    description: `Are you sure you want to deactivate "${itemName}"?`,
    confirmLabel: "Deactivate",
    cancelLabel: "Cancel",
    variant: "warning" as const,
    icon: Pause,
    loading,
    onConfirm,
    onCancel,
  }),

  suspend: (
    itemName: string,
    onConfirm: () => void,
    onCancel: () => void,
    loading = false
  ) => ({
    title: "Suspend Item",
    description: `Are you sure you want to suspend "${itemName}"? This will prevent access until reactivated.`,
    confirmLabel: "Suspend",
    cancelLabel: "Cancel",
    variant: "destructive" as const,
    icon: Ban,
    loading,
    onConfirm,
    onCancel,
  }),
};

export default ConfirmDialog;
