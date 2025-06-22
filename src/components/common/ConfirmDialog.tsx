import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UI_CONSTANTS } from "@/lib/ui-constants";

interface ConfirmDialogProps {
  trigger: React.ReactNode;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  itemName?: string;
  variant?: "destructive" | "default";
}

export const ConfirmDialog = ({
  trigger,
  onConfirm,
  title = "Are you sure?",
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  itemName,
  variant = "destructive",
}: ConfirmDialogProps) => {
  const [open, setOpen] = useState(false);
  const finalDescription =
    description ||
    (itemName
      ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
      : "This action cannot be undone.");

  // Choose button color based on variant
  const confirmClass =
    variant === "destructive"
      ? UI_CONSTANTS.BUTTONS.danger
      : UI_CONSTANTS.BUTTONS.primary;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        asChild
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {trigger}
      </AlertDialogTrigger>

      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle className={UI_CONSTANTS.TYPOGRAPHY.cardTitle}>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription
            className={UI_CONSTANTS.TYPOGRAPHY.description}
          >
            {finalDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
            className={`${confirmClass} text-white`}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
