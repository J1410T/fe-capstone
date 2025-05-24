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
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle } from "lucide-react";
import { PendingApproval } from "./PendingApprovalsTable";

interface ApprovalActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  approval: PendingApproval | null;
  action: "approve" | "reject" | null;
  comment: string;
  onCommentChange: (value: string) => void;
  onSubmit: () => void;
}

export const ApprovalActionDialog: React.FC<ApprovalActionDialogProps> = ({
  isOpen,
  onClose,
  approval,
  action,
  comment,
  onCommentChange,
  onSubmit,
}) => {
  if (!approval || !action) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === "approve" ? "Approve Request" : "Reject Request"}
          </DialogTitle>
          <DialogDescription>
            {action === "approve"
              ? "Confirm approval of this request"
              : "Provide a reason for rejection"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-right">Project:</span>
            <span className="col-span-3 text-sm font-medium">
              {approval.title}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-right">Type:</span>
            <span className="col-span-3 text-sm">
              {approval.type}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-right">Amount:</span>
            <span className="col-span-3 text-sm">
              ${approval.amount.toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <span className="text-sm font-medium text-right">Comments:</span>
            <Textarea
              className="col-span-3"
              placeholder={
                action === "approve"
                  ? "Optional approval comments..."
                  : "Please provide a reason for rejection..."
              }
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant={action === "approve" ? "default" : "destructive"}
            onClick={onSubmit}
            disabled={action === "reject" && !comment}
          >
            {action === "approve" ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
