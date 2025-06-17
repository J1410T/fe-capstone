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

interface ConfirmDialogProps {
  trigger: React.ReactNode;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  itemName?: string;
}

export const ConfirmDialog = ({
  trigger,
  onConfirm,
  title = "Are you sure?",
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  itemName,
}: ConfirmDialogProps) => {
  const [open, setOpen] = useState(false);
  const finalDescription =
    description ||
    (itemName
      ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
      : "This action cannot be undone.");

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
          <AlertDialogTitle className="text-lg font-semibold text-gray-900">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-sm text-gray-600">
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
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
