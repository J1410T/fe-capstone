import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateTaskData, TaskPriority } from "@/types/task";
import { User, UserRole } from "@/contexts/AuthContext";
// Removed unused import

interface TaskFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateTaskData) => void;
  currentUser: User;
  teamMembers: User[];
  isLoading?: boolean;
}

const priorityOptions: TaskPriority[] = ["Low", "Medium", "High"];

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  currentUser,
  teamMembers,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: "",
    description: "",
    priority: "Medium",
    assigneeId: currentUser.id,
    dueDate: "",
  });

  const [errors, setErrors] = useState<Partial<CreateTaskData>>({});

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        assigneeId: currentUser.id,
        dueDate: "",
      });
      setErrors({});
    }
  }, [open, currentUser.id]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateTaskData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Task description is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    if (!formData.assigneeId) {
      newErrors.assigneeId = "Assignee is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof CreateTaskData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const isLeader =
    currentUser.role === UserRole.PRINCIPAL_INVESTIGATOR ||
    currentUser.role === UserRole.HOST_INSTITUTION ||
    currentUser.role === UserRole.STAFF;

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader className="pb-4 border-b border-slate-200">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Create New Task
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-slate-700"
            >
              Task Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter a clear, descriptive task title..."
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`${
                errors.title
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-slate-700"
            >
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Provide detailed information about the task requirements and objectives..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`min-h-[100px] resize-none ${
                errors.description
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Priority
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleInputChange("priority", value)}
            >
              <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">
                        {priority === "High"
                          ? "🔴"
                          : priority === "Medium"
                          ? "🟡"
                          : "🔵"}
                      </span>
                      <span>{priority} Priority</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Assign To *
            </Label>
            <Select
              value={formData.assigneeId}
              onValueChange={(value) => handleInputChange("assigneeId", value)}
            >
              <SelectTrigger
                className={`${
                  errors.assigneeId
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {isLeader ? (
                  // Leaders can assign to anyone
                  teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-600">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span>{member.name}</span>
                        <span className="text-xs text-slate-500">
                          ({member.role})
                        </span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  // Members can only assign to themselves
                  <SelectItem value={currentUser.id}>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-600">
                        {currentUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span>{currentUser.name} (Myself)</span>
                    </div>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.assigneeId && (
              <p className="text-sm text-red-600">{errors.assigneeId}</p>
            )}
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label
              htmlFor="dueDate"
              className="text-sm font-medium text-slate-700"
            >
              Due Date *
            </Label>
            <Input
              id="dueDate"
              type="date"
              min={today}
              value={formData.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
              className={`${
                errors.dueDate
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
            />
            {errors.dueDate && (
              <p className="text-sm text-red-600">{errors.dueDate}</p>
            )}
          </div>
        </form>

        <DialogFooter className="pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? "Creating..." : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
