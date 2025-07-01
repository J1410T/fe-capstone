import React from "react";
import {
  Button,
  Input,
  Textarea,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { DatePicker } from "@/components/ui/date-picker";
import { Task, PIUser } from "../../shared/types";

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  isLoading: boolean;
  editingTask: Task | null;
  form: {
    title: string;
    description: string;
    assignedTo: string;
    priority: "Low" | "Medium" | "High";
    dueDate: string;
  };
  onFormChange: (field: string, value: string) => void;
  dueDate: Date | undefined;
  onDueDateChange: (date: Date | undefined) => void;
  teamRESEARCHERs: PIUser[];
}

export const TaskDialog: React.FC<TaskDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading,
  editingTask,
  form,
  onFormChange,
  dueDate,
  onDueDateChange,
  teamRESEARCHERs,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingTask ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription>
            {editingTask
              ? "Update the task details below."
              : "Add a new task to the milestone."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="task-title"
              placeholder="Enter task title"
              value={form.title}
              onChange={(e) => onFormChange("title", e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="task-description"
              placeholder="Describe what needs to be done"
              value={form.description}
              onChange={(e) => onFormChange("description", e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assigned To</Label>
              <Select
                value={form.assignedTo}
                onValueChange={(value) => onFormChange("assignedTo", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {teamRESEARCHERs.map((RESEARCHER) => (
                    <SelectItem key={RESEARCHER.id} value={RESEARCHER.email}>
                      {RESEARCHER.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(value: "Low" | "Medium" | "High") =>
                  onFormChange("priority", value)
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Due Date <span className="text-red-500">*</span>
            </Label>
            <DatePicker
              date={dueDate}
              onDateChange={onDueDateChange}
              placeholder="Select due date"
              disabled={isLoading}
              inDialog={true}
              disablePastDates={true}
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
              isLoading ||
              !form.title.trim() ||
              !form.description.trim() ||
              !dueDate
            }
          >
            {isLoading ? "Saving..." : editingTask ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
