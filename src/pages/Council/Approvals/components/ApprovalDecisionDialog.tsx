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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle } from "lucide-react";

interface ApprovalDecisionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  decision: string;
  comment: string;
  isSubmitting: boolean;
  onDecisionChange: (value: string) => void;
  onCommentChange: (value: string) => void;
  onSubmit: () => void;
}

export const ApprovalDecisionDialog: React.FC<ApprovalDecisionDialogProps> = ({
  isOpen,
  onOpenChange,
  decision,
  comment,
  isSubmitting,
  onDecisionChange,
  onCommentChange,
  onSubmit,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Your Decision</DialogTitle>
          <DialogDescription>
            Approve or object to the chairman's recommendation
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="decision">Your Decision</Label>
            <Select value={decision} onValueChange={onDecisionChange}>
              <SelectTrigger id="decision">
                <SelectValue placeholder="Select your decision" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approve">
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Approve
                  </div>
                </SelectItem>
                <SelectItem value="object">
                  <div className="flex items-center">
                    <XCircle className="mr-2 h-4 w-4 text-red-500" />
                    Object
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Provide a reason for your decision..."
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Decision"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
