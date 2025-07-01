import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, User, Flag, Tag } from "lucide-react";
import { DatePicker } from "../ui";
import {
  getInputClassName,
  getTextareaClassName,
  getSelectClassName,
  UI_CONSTANTS,
  getDialogClassName,
} from "@/lib/ui-constants";

interface Task {
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
}

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
}

// Mock team RESEARCHERs data
const mockTeamResearchers = [
  {
    id: "user1",
    name: "Sarah Chen",
    avatar: "",
    email: "sarah.chen@company.com",
  },
  {
    id: "user2",
    name: "Michael Rodriguez",
    avatar: "",
    email: "michael.rodriguez@company.com",
  },
  {
    id: "user3",
    name: "Emily Johnson",
    avatar: "",
    email: "emily.johnson@company.com",
  },
  {
    id: "user4",
    name: "David Kim",
    avatar: "",
    email: "david.kim@company.com",
  },
];

const projectTags = [
  "Backend API",
  "Frontend",
  "Database",
  "Documentation",
  "Performance",
  "Mobile",
  "Testing",
  "Security",
  "DevOps",
  "UI/UX",
];

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  open,
  onOpenChange,
  onCreate,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Not Started" as Task["status"],
    dueDate: "",
    priority: "Medium" as Task["priority"],
    projectTag: "",
    assignedToId: "",
  });
  const [selectedDueDate, setSelectedDueDate] = useState<Date | undefined>(
    formData.dueDate ? new Date(formData.dueDate) : undefined
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Sync selectedDueDate with formData.dueDate
  useEffect(() => {
    if (selectedDueDate) {
      setFormData((prev) => ({
        ...prev,
        dueDate: selectedDueDate.toISOString(),
      }));
    }
  }, [selectedDueDate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Task description is required";
    }

    if (!formData.dueDate && !selectedDueDate) {
      newErrors.dueDate = "Due date is required";
    }

    if (!formData.projectTag) {
      newErrors.projectTag = "Project tag is required";
    }

    if (!formData.assignedToId) {
      newErrors.assignedToId = "Assignee is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const assignedTo = mockTeamResearchers.find(
        (researcher) => researcher.id === formData.assignedToId
      );
      if (!assignedTo) return;

      const newTask = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        dueDate: selectedDueDate
          ? selectedDueDate.toISOString()
          : new Date(formData.dueDate).toISOString(),
        priority: formData.priority,
        projectTag: formData.projectTag,
        assignedTo,
      };

      onCreate(newTask);
      setIsLoading(false);
      onOpenChange(false);

      // Reset form
      setFormData({
        title: "",
        description: "",
        status: "Not Started",
        dueDate: "",
        priority: "Medium",
        projectTag: "",
        assignedToId: "",
      });
      setSelectedDueDate(undefined);
      setErrors({});
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${getDialogClassName(
          "large"
        )} w-[95vw] max-h-[90vh] overflow-y-auto`}
      >
        <DialogHeader>
          <DialogTitle
            className={`flex items-center space-x-2 ${UI_CONSTANTS.TYPOGRAPHY.cardTitle}`}
          >
            <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            <span>Create New Task</span>
          </DialogTitle>
          <DialogDescription className={UI_CONSTANTS.TYPOGRAPHY.description}>
            Create a new task and assign it to a team researcher. Fill in all
            the required information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className={UI_CONSTANTS.SPACING.form}>
          {/* Task Title */}
          <div className={UI_CONSTANTS.SPACING.formField}>
            <Label htmlFor="title" className={UI_CONSTANTS.TYPOGRAPHY.label}>
              Task Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={getInputClassName(!!errors.title)}
            />
            {errors.title && (
              <p className={UI_CONSTANTS.TYPOGRAPHY.error}>{errors.title}</p>
            )}
          </div>

          {/* Task Description */}
          <div className={UI_CONSTANTS.SPACING.formField}>
            <Label
              htmlFor="description"
              className={UI_CONSTANTS.TYPOGRAPHY.label}
            >
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the task in detail..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`min-h-[100px] ${getTextareaClassName(
                !!errors.description
              )}`}
            />
            {errors.description && (
              <p className={UI_CONSTANTS.TYPOGRAPHY.error}>
                {errors.description}
              </p>
            )}
          </div>

          {/* Form Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Due Date */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Due Date *</span>
              </Label>
              <DatePicker
                date={selectedDueDate}
                onDateChange={setSelectedDueDate}
                placeholder="Select a date"
                disablePastDates={true}
              />
              {errors.dueDate && (
                <p className="text-sm text-red-500">{errors.dueDate}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Selected:{" "}
                {selectedDueDate
                  ? selectedDueDate.toLocaleDateString()
                  : "None"}
              </p>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-1">
                <Flag className="w-4 h-4" />
                <span>Priority</span>
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Project Tag */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-1">
                <Tag className="w-4 h-4" />
                <span>Project Tag *</span>
              </Label>
              <Select
                value={formData.projectTag}
                onValueChange={(value) =>
                  handleInputChange("projectTag", value)
                }
              >
                <SelectTrigger
                  className={getSelectClassName(!!errors.projectTag)}
                >
                  <SelectValue placeholder="Select project tag" />
                </SelectTrigger>
                <SelectContent>
                  {projectTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectTag && (
                <p className="text-sm text-red-500">{errors.projectTag}</p>
              )}
            </div>

            {/* Assigned To */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>Assign To *</span>
              </Label>
              <Select
                value={formData.assignedToId}
                onValueChange={(value) =>
                  handleInputChange("assignedToId", value)
                }
              >
                <SelectTrigger
                  className={getSelectClassName(!!errors.assignedToId)}
                >
                  <SelectValue placeholder="Select team RESEARCHER" />
                </SelectTrigger>
                <SelectContent>
                  {mockTeamResearchers.map((researcher) => (
                    <SelectItem key={researcher.id} value={researcher.id}>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {researcher.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <span>{researcher.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assignedToId && (
                <p className="text-sm text-red-500">{errors.assignedToId}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="var(--primary) hover:var(--secondary)"
            >
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
