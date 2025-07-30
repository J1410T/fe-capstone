import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Calendar, User, Flag, Tag, X } from "lucide-react";
import { DatePicker } from "../ui";
import {
  getInputClassName,
  getTextareaClassName,
  UI_CONSTANTS,
  getDialogClassName,
} from "@/lib/ui-constants";
import { useUserRolesByProjectId } from "@/hooks/queries/useAuth";
import { useCreateTask, useCreateMemberTask } from "@/hooks/queries/task";
import { UserRole } from "@/types/auth";
import { toast } from "sonner";

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
  selectedProjectId?: string;
  selectedMilestoneId?: string;
}

// Removed mock data as we're now using real API data

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  open,
  onOpenChange,
  onCreate,
  selectedProjectId = "",
  selectedMilestoneId = "",
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    priority: "Medium" as "Low" | "Medium" | "High",
    note: "",
    hasMeetingUrl: false,
    meetingUrl: "",
  });
  const [selectedStartDate, setSelectedStartDate] = useState<
    Date | undefined
  >();
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>();
  const [selectedMembers, setSelectedMembers] = useState<UserRole[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // API hooks
  const { data: userRolesData } = useUserRolesByProjectId(selectedProjectId);
  const createTaskMutation = useCreateTask();
  const createMemberTaskMutation = useCreateMemberTask();

  // Process user roles data to filter duplicates and prioritize non-Researcher roles
  const availableMembers = React.useMemo(() => {
    if (!userRolesData?.["data-list"]) return [];

    const memberMap = new Map<string, UserRole>();

    // First pass: collect all roles for each account
    userRolesData["data-list"].forEach((userRole: UserRole) => {
      const accountId = userRole["account-id"];
      const existing = memberMap.get(accountId);

      if (!existing) {
        memberMap.set(accountId, userRole);
      } else {
        // If person has multiple roles, prioritize non-Researcher roles
        if (existing.name === "Researcher" && userRole.name !== "Researcher") {
          memberMap.set(accountId, userRole);
        }
      }
    });

    return Array.from(memberMap.values()).filter(
      (member) =>
        !selectedMembers.some(
          (selected) => selected["account-id"] === member["account-id"]
        )
    );
  }, [userRolesData, selectedMembers]);

  // Sync date fields
  useEffect(() => {
    if (selectedStartDate) {
      setFormData((prev) => ({
        ...prev,
        startDate: selectedStartDate.toISOString().split("T")[0],
      }));
    }
  }, [selectedStartDate]);

  useEffect(() => {
    if (selectedEndDate) {
      setFormData((prev) => ({
        ...prev,
        endDate: selectedEndDate.toISOString().split("T")[0],
      }));
    }
  }, [selectedEndDate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Task description is required";
    }

    if (!formData.startDate && !selectedStartDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate && !selectedEndDate) {
      newErrors.endDate = "End date is required";
    }

    // Validate that end date is not equal to start date and not in the past
    if (selectedStartDate && selectedEndDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedStartDate < today) {
        newErrors.startDate = "Start date cannot be in the past";
      }

      if (selectedEndDate <= selectedStartDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    if (formData.hasMeetingUrl && !formData.meetingUrl.trim()) {
      newErrors.meetingUrl = "Meeting URL is required when enabled";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!selectedMilestoneId) {
      toast.error("Milestone is required");
      return;
    }

    setIsLoading(true);

    try {
      // Create task
      const taskData = {
        name: formData.title,
        description: formData.description,
        "start-date": selectedStartDate!.toISOString(),
        "end-date": selectedEndDate!.toISOString(),
        priority: formData.priority,
        progress: 0,
        "meeting-url": formData.hasMeetingUrl ? formData.meetingUrl : null,
        note: formData.note,
        "milestone-id": selectedMilestoneId,
      };

      const createdTask = await createTaskMutation.mutateAsync(taskData);

      // Assign members to task if any selected
      if (selectedMembers.length > 0) {
        const memberTaskPromises = selectedMembers.map((member) =>
          createMemberTaskMutation.mutateAsync({
            progress: 0,
            overdue: 0,
            note: "",
            "member-id": member["account-id"],
            "task-id": createdTask.id,
          })
        );

        await Promise.all(memberTaskPromises);
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        priority: "Medium",
        note: "",
        hasMeetingUrl: false,
        meetingUrl: "",
      });
      setSelectedStartDate(undefined);
      setSelectedEndDate(undefined);
      setSelectedMembers([]);
      setErrors({});

      onOpenChange(false);

      // Call the onCreate callback for compatibility
      onCreate({
        title: formData.title,
        description: formData.description,
        status: "Not Started" as Task["status"],
        dueDate: selectedEndDate!.toISOString(),
        priority: formData.priority as Task["priority"],
        projectTag: "Task",
        assignedTo: {
          id: selectedMembers[0]?.["account-id"] || "",
          name:
            getDisplayName(selectedMembers[0]?.["full-name"]) || "Unassigned",
          avatar: selectedMembers[0]?.["avatar-url"] || "",
          email: selectedMembers[0]?.email || "",
        },
      });

      toast.success("Task created successfully");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleMemberSelect = (member: UserRole) => {
    if (
      !selectedMembers.some(
        (selected) => selected["account-id"] === member["account-id"]
      )
    ) {
      setSelectedMembers((prev) => [...prev, member]);
    }
  };

  const handleMemberRemove = (accountId: string) => {
    setSelectedMembers((prev) =>
      prev.filter((member) => member["account-id"] !== accountId)
    );
  };

  // Helper function to safely get display name
  const getDisplayName = (fullName: string | null | undefined): string => {
    return fullName || "Unknown User";
  };

  // Default avatar URL for broken or missing avatars
  const DEFAULT_AVATAR_URL =
    "https://img.lovepik.com/background/20211021/large/lovepik-abstract-background-of-science-and-technology-image_400135542.jpg";

  // Helper function to handle avatar image errors
  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = DEFAULT_AVATAR_URL;
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
            {/* Start Date */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Start Date *</span>
              </Label>
              <DatePicker
                date={selectedStartDate}
                onDateChange={setSelectedStartDate}
                placeholder="Select start date"
                disablePastDates={true}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>End Date *</span>
              </Label>
              <DatePicker
                date={selectedEndDate}
                onDateChange={setSelectedEndDate}
                placeholder="Select end date"
                disablePastDates={true}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate}</p>
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

            {/* Meeting URL Switch */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="meeting-url-switch"
                  checked={formData.hasMeetingUrl}
                  onCheckedChange={(checked) =>
                    handleInputChange("hasMeetingUrl", checked)
                  }
                />
                <Label htmlFor="meeting-url-switch">Include Meeting URL</Label>
              </div>
            </div>
          </div>

          {/* Meeting URL Input (conditional) */}
          {formData.hasMeetingUrl && (
            <div className={UI_CONSTANTS.SPACING.formField}>
              <Label
                htmlFor="meetingUrl"
                className={UI_CONSTANTS.TYPOGRAPHY.label}
              >
                Meeting URL *
              </Label>
              <Input
                id="meetingUrl"
                placeholder="Enter meeting URL..."
                value={formData.meetingUrl}
                onChange={(e) =>
                  handleInputChange("meetingUrl", e.target.value)
                }
                className={getInputClassName(!!errors.meetingUrl)}
              />
              {errors.meetingUrl && (
                <p className={UI_CONSTANTS.TYPOGRAPHY.error}>
                  {errors.meetingUrl}
                </p>
              )}
            </div>
          )}

          {/* Note Field */}
          <div className={UI_CONSTANTS.SPACING.formField}>
            <Label htmlFor="note" className={UI_CONSTANTS.TYPOGRAPHY.label}>
              Note
            </Label>
            <Textarea
              id="note"
              placeholder="Add any additional notes (optional)..."
              value={formData.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Assign Members */}
          <div className={UI_CONSTANTS.SPACING.formField}>
            <Label className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>Assign Members</span>
            </Label>

            {/* Member Selection */}
            <Select
              onValueChange={(value) => {
                const member = availableMembers.find(
                  (m) => m["account-id"] === value
                );
                if (member) handleMemberSelect(member);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team members" />
              </SelectTrigger>
              <SelectContent>
                {availableMembers.map((member) => (
                  <SelectItem
                    key={member["account-id"]}
                    value={member["account-id"]}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <img
                          src={member["avatar-url"] || DEFAULT_AVATAR_URL}
                          alt={getDisplayName(member["full-name"])}
                          className="w-6 h-6 rounded-full"
                          onError={handleAvatarError}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {getDisplayName(member["full-name"])}
                        </span>
                        <span className="text-xs text-gray-500">
                          {member.email || "No email"}
                        </span>
                        <span className="text-xs text-blue-600">
                          {member.name || "No role"}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Selected Members List */}
            {selectedMembers.length > 0 && (
              <div className="mt-3 space-y-2">
                <Label className="text-sm font-medium">Selected Members:</Label>
                <div className="space-y-2">
                  {selectedMembers.map((member) => (
                    <div
                      key={member["account-id"]}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <img
                            src={member["avatar-url"] || DEFAULT_AVATAR_URL}
                            alt={getDisplayName(member["full-name"])}
                            className="w-6 h-6 rounded-full"
                            onError={handleAvatarError}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {getDisplayName(member["full-name"])}
                          </span>
                          <span className="text-xs text-gray-500">
                            {member.email || "No email"}
                          </span>
                          <span className="text-xs text-blue-600">
                            {member.name || "No role"}
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMemberRemove(member["account-id"])}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
