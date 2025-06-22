import React from "react";
import {
  Button,
  Input,
  Textarea,
  Label,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { DatePicker } from "@/components/ui/date-picker";
import { Milestone } from "../../shared/types";

interface MilestoneDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  isLoading: boolean;
  editingMilestone: Milestone | null;
  form: {
    name: string;
    description: string;
    deadline: string;
  };
  onFormChange: (field: string, value: string) => void;
  deadlineDate: Date | undefined;
  onDeadlineDateChange: (date: Date | undefined) => void;
}

export const MilestoneDialog: React.FC<MilestoneDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading,
  editingMilestone,
  form,
  onFormChange,
  deadlineDate,
  onDeadlineDateChange,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingMilestone ? "Edit Milestone" : "Create New Milestone"}
          </DialogTitle>
          <DialogDescription>
            {editingMilestone
              ? "Update the milestone details below."
              : "Add a new milestone to track project progress."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="milestone-name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="milestone-name"
              placeholder="Enter milestone name"
              value={form.name}
              onChange={(e) => onFormChange("name", e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="milestone-description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="milestone-description"
              placeholder="Describe the milestone objectives and deliverables"
              value={form.description}
              onChange={(e) => onFormChange("description", e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>
              Deadline <span className="text-red-500">*</span>
            </Label>
            <DatePicker
              date={deadlineDate}
              onDateChange={onDeadlineDateChange}
              placeholder="Select deadline"
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSave}
            disabled={
              isLoading || !form.name || !form.description || !deadlineDate
            }
          >
            {isLoading ? "Saving..." : editingMilestone ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
