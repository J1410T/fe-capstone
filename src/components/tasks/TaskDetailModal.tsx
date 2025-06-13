import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Edit, X, Save } from "lucide-react";
import { format, parseISO } from "date-fns";

// Task interface
interface Task {
  id: string;
  title: string;
  description: string;
  status: "Not Started" | "In Progress" | "Complete" | "Overdue";
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  projectTag: string;
  assignedTo: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface TaskDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onUpdate?: (task: Task) => void;
  isLeader?: boolean;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  open,
  onOpenChange,
  task,
  onUpdate,
  isLeader = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Task>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setEditData(task);
      setErrors({});
      setIsEditing(false);
    }
  }, [task]);

  if (!task) return null;

  // Get priority configuration
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "High":
        return { color: "bg-red-100 text-red-700", icon: "" };
      case "Medium":
        return { color: "bg-yellow-100 text-yellow-700", icon: "" };
      case "Low":
        return { color: "bg-blue-100 text-blue-700", icon: "" };
      default:
        return { color: "bg-slate-100 text-slate-700", icon: "" };
    }
  };

  // Get status configuration
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Complete":
        return { color: "bg-green-100 text-green-700" };
      case "In Progress":
        return { color: "bg-blue-100 text-blue-700" };
      case "Overdue":
        return { color: "bg-red-100 text-red-700" };
      case "Not Started":
        return { color: "bg-slate-100 text-slate-700" };
      default:
        return { color: "bg-slate-100 text-slate-700" };
    }
  };

  const handleInputChange = (field: keyof Task, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!editData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!editData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    if (!editData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const updatedTask: Task = {
      ...task,
      ...editData,
      updatedAt: new Date().toISOString(),
    } as Task;

    onUpdate?.(updatedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(task);
    setErrors({});
    setIsEditing(false);
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-slate-900">
            Task Details
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-slate-600">
            {isEditing
              ? "Edit task information"
              : "View task details and make changes"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Task Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Title</label>
            {isEditing ? (
              <div>
                <Input
                  value={editData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={`${
                    errors.title
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  placeholder="Enter task title"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                )}
              </div>
            ) : (
              <p className="text-lg font-medium text-slate-900">{task.title}</p>
            )}
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>
            {isEditing ? (
              <div>
                <Textarea
                  value={editData.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className={`${
                    errors.description
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  placeholder="Enter task description"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-slate-700">{task.description}</p>
            )}
          </div>

          {/* Task Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Status
              </label>
              {isEditing ? (
                <Select
                  value={editData.status || task.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Complete">Complete</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={statusConfig.color}>{task.status}</Badge>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Priority
              </label>
              {isEditing ? (
                <Select
                  value={editData.priority || task.priority}
                  onValueChange={(value) =>
                    handleInputChange("priority", value)
                  }
                >
                  <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="outline" className={priorityConfig.color}>
                  {priorityConfig.icon} {task.priority}
                </Badge>
              )}
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Due Date
              </label>
              {isEditing ? (
                <div>
                  <Input
                    type="date"
                    value={
                      editData.dueDate ? editData.dueDate.split("T")[0] : ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "dueDate",
                        e.target.value + "T17:00:00Z"
                      )
                    }
                    className={`${
                      errors.dueDate
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                  {errors.dueDate && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.dueDate}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700">
                    {format(parseISO(task.dueDate), "MMM dd, yyyy")}
                  </span>
                </div>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Category
              </label>
              {isEditing ? (
                <Input
                  value={editData.projectTag || ""}
                  onChange={(e) =>
                    handleInputChange("projectTag", e.target.value)
                  }
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter category"
                />
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-700"
                >
                  {task.projectTag}
                </Badge>
              )}
            </div>
          </div>

          {/* Assigned To */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Assigned To
            </label>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={task.assignedTo.avatar}
                  alt={task.assignedTo.name}
                />
                <AvatarFallback className="bg-slate-100 text-slate-600">
                  {task.assignedTo.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-slate-900">
                  {task.assignedTo.name}
                </div>
                <div className="text-sm text-slate-500">
                  {task.assignedTo.email}
                </div>
              </div>
            </div>
          </div>

          {/* Task Metadata */}
          <div className="pt-4 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <span className="font-medium">Created:</span>{" "}
                {format(parseISO(task.createdAt), "MMM dd, yyyy 'at' h:mm a")}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>{" "}
                {format(parseISO(task.updatedAt), "MMM dd, yyyy 'at' h:mm a")}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Close
              </Button>
              {isLeader && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Task
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
