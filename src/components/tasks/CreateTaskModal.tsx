import React, { useState } from "react";
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

// Mock team members data
const mockTeamMembers = [
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Task description is required";
    }

    if (!formData.dueDate) {
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
      const assignedTo = mockTeamMembers.find(
        (member) => member.id === formData.assignedToId
      );
      if (!assignedTo) return;

      const newTask = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        dueDate: new Date(formData.dueDate).toISOString(),
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
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span>Create New Task</span>
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Create a new task and assign it to a team member. Fill in all the
            required information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the task in detail..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`min-h-[100px] ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Form Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Due Date *</span>
              </Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                className={errors.dueDate ? "border-red-500" : ""}
              />
              {errors.dueDate && (
                <p className="text-sm text-red-500">{errors.dueDate}</p>
              )}
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
                  className={errors.projectTag ? "border-red-500" : ""}
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
                  className={errors.assignedToId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {mockTeamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <span>{member.name}</span>
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
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
