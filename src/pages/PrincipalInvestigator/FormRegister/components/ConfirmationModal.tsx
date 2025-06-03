import React, { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/loaders";
import { AlertTriangle, FileText } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  formTitle: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = memo(
  ({ isOpen, onConfirm, onCancel, isLoading, formTitle }) => {
    return (
      <Dialog open={isOpen} onOpenChange={isLoading ? undefined : onCancel}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-lg font-semibold">
                  Confirm Form Submission
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm">
                  Please review your form before submitting. This action cannot
                  be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium text-foreground">Form Details</h4>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {formTitle}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Important:</strong> Once submitted, this form will be
                sent for review and cannot be modified. Please ensure all
                information is accurate.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="min-w-[80px]"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <ButtonLoading />
                  <span className="ml-2">Submitting...</span>
                </>
              ) : (
                "Submit Form"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
