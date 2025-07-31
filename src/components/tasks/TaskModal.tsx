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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar, User, Flag, Tag, X, Save, Trash2, Eye } from "lucide-react";
import { DatePicker } from "../ui";
import {
  getInputClassName,
  getTextareaClassName,
  UI_CONSTANTS,
  getDialogClassName,
} from "@/lib/ui-constants";
import { useUserRolesByProjectId } from "@/hooks/queries/useAuth";
import {
  useCreateTask,
  useCreateMemberTask,
  useUpdateTask,
  useDeleteTask,
  useDeleteMemberTask,
  useMemberTasksByTaskId,
} from "@/hooks/queries/task";
import { UserRole } from "@/types/auth";
import { toast } from "sonner";
import { parseISO } from "date-fns";
import { MemberInfo } from "./MemberInfo";

// Task interface for the modal - matches TaskManagement interface
interface Task {
  id: string;
  title: string;
  description: string;
  status: "Not Started" | "In Progress" | "Complete" | "Overdue";
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  projectTag: string;
  projectId: string;
  milestoneId: string;
  assignedTo: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };
  memberTaskIds?: string[]; // Array of member IDs assigned to this task
  memberTasks?: Array<{ id: string; memberId: string }>; // Array of member task objects with IDs
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
  note?: string;
  meetingUrl?: string;
}

// Modal mode type
type TaskModalMode = "create" | "update" | "view";

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: TaskModalMode;
  task?: Omit<Task, "projectId" | "milestoneId"> | null;
  onCreate?: (
    task: Omit<
      Task,
      "id" | "createdAt" | "updatedAt" | "projectId" | "milestoneId"
    >
  ) => void;
  onUpdate?: (task: Omit<Task, "projectId" | "milestoneId">) => void;
  onDelete?: (taskId: string) => void;
  selectedProjectId?: string;
  selectedMilestoneId?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onOpenChange,
  mode,
  task,
  onCreate,
  onUpdate,
  onDelete,
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

  // Determine project ID for API calls
  const projectId = selectedProjectId;
  const taskId = task?.id || "";

  // API hooks
  const { data: userRolesData } = useUserRolesByProjectId(projectId);
  const { data: memberTasksData } = useMemberTasksByTaskId(taskId, 1, 100);
  const createTaskMutation = useCreateTask();
  const createMemberTaskMutation = useCreateMemberTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const deleteMemberTaskMutation = useDeleteMemberTask();

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

  // Get current member tasks for display
  const currentMemberTasks = memberTasksData?.["data-list"] || [];
  const memberIds = currentMemberTasks.map((memberTask) => memberTask.memberId);

  // Initialize form data when task or mode changes
  useEffect(() => {
    if (mode === "create") {
      // Reset form for create mode
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
    } else if (task && (mode === "update" || mode === "view")) {
      // Populate form for update/view mode
      setFormData({
        title: task.title,
        description: task.description,
        startDate: task.startDate || "",
        endDate: task.endDate || task.dueDate || "",
        priority: task.priority,
        note: task.note || "",
        hasMeetingUrl: !!task.meetingUrl,
        meetingUrl: task.meetingUrl || "",
      });

      // Set dates
      if (task.startDate) {
        setSelectedStartDate(parseISO(task.startDate));
      } else if (task.createdAt) {
        setSelectedStartDate(parseISO(task.createdAt));
      }

      if (task.endDate) {
        setSelectedEndDate(parseISO(task.endDate));
      } else if (task.dueDate) {
        setSelectedEndDate(parseISO(task.dueDate));
      }

      // Load current assigned members from user roles data
      if (userRolesData?.["data-list"] && task.memberTaskIds) {
        const currentMembers = userRolesData["data-list"].filter(
          (role: UserRole) => task.memberTaskIds?.includes(role["account-id"])
        );
        setSelectedMembers(currentMembers);
      }

      setErrors({});
    }
  }, [task, mode, userRolesData]);

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

  // Determine if form is read-only
  const isReadOnly = mode === "view";

  // Get modal title and icon based on mode
  const getModalTitle = () => {
    switch (mode) {
      case "create":
        return { title: "Create New Task", icon: Tag };
      case "update":
        return { title: "Update Task", icon: Save };
      case "view":
        return { title: "View Task", icon: Eye };
      default:
        return { title: "Task", icon: Tag };
    }
  };

  const { title: modalTitle, icon: ModalIcon } = getModalTitle();

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

      if (mode === "create" && selectedStartDate < today) {
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

    if (mode === "create" && !selectedMilestoneId) {
      toast.error("Milestone is required");
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "create") {
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

        // Call the onCreate callback for compatibility
        if (onCreate) {
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
                getDisplayName(selectedMembers[0]?.["full-name"]) ||
                "Unassigned",
              avatar: selectedMembers[0]?.["avatar-url"] || "",
              email: selectedMembers[0]?.email || "",
            },
          });
        }

        toast.success("Task created successfully");
      } else if (mode === "update" && task) {
        // Update task
        const taskData = {
          name: formData.title,
          description: formData.description,
          "start-date": selectedStartDate!.toISOString(),
          "end-date": selectedEndDate!.toISOString(),
          priority: formData.priority,
          progress: task.status === "Complete" ? 100 : 0,
          overdue: 0,
          "meeting-url": formData.hasMeetingUrl ? formData.meetingUrl : null,
          note: formData.note,
          "milestone-id": selectedMilestoneId,
        };

        await updateTaskMutation.mutateAsync({
          taskId: task.id!,
          taskData,
        });

        // Handle member task updates
        const currentMemberIds = currentMemberTasks.map((mt) => mt.memberId);
        const newMemberIds = selectedMembers.map((m) => m["account-id"]);

        // Remove members that are no longer selected
        const membersToRemove = currentMemberTasks.filter(
          (mt) => !newMemberIds.includes(mt.memberId)
        );

        for (const memberTask of membersToRemove) {
          await deleteMemberTaskMutation.mutateAsync(memberTask.id);
        }

        // Add new members
        const membersToAdd = selectedMembers.filter(
          (m) => !currentMemberIds.includes(m["account-id"])
        );

        for (const member of membersToAdd) {
          await createMemberTaskMutation.mutateAsync({
            progress: 0,
            overdue: 0,
            note: "",
            "member-id": member["account-id"],
            "task-id": task.id!,
          });
        }

        // Call the onUpdate callback
        if (onUpdate) {
          const updatedTask = {
            ...task,
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            dueDate: selectedEndDate!.toISOString(),
            startDate: selectedStartDate!.toISOString(),
            endDate: selectedEndDate!.toISOString(),
            note: formData.note,
            meetingUrl: formData.hasMeetingUrl
              ? formData.meetingUrl
              : undefined,
          };

          onUpdate(updatedTask);
        }

        toast.success("Task updated successfully");
      }

      onOpenChange(false);
    } catch (error) {
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} task:`,
        error
      );
      toast.error(`Failed to ${mode === "create" ? "create" : "update"} task`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task?.id || !onDelete) return;

    setIsLoading(true);
    try {
      await deleteTaskMutation.mutateAsync(task.id);
      onDelete(task.id);
      onOpenChange(false);
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (isReadOnly) return;

    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleMemberSelect = (member: UserRole) => {
    if (isReadOnly) return;

    if (
      !selectedMembers.some(
        (selected) => selected["account-id"] === member["account-id"]
      )
    ) {
      setSelectedMembers((prev) => [...prev, member]);
    }
  };

  const handleMemberRemove = (accountId: string) => {
    if (isReadOnly) return;

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
            <ModalIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            <span>{modalTitle}</span>
          </DialogTitle>
          <DialogDescription className={UI_CONSTANTS.TYPOGRAPHY.description}>
            {mode === "create" &&
              "Create a new task and assign it to team members. Fill in all the required information below."}
            {mode === "update" &&
              "Update the task information and member assignments."}
            {mode === "view" && "View task details and assigned members."}
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
              disabled={isReadOnly}
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
              disabled={isReadOnly}
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
                onDateChange={isReadOnly ? undefined : setSelectedStartDate}
                placeholder="Select start date"
                disablePastDates={mode === "create"}
                disabled={isReadOnly}
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
                onDateChange={isReadOnly ? undefined : setSelectedEndDate}
                placeholder="Select end date"
                disablePastDates={mode === "create"}
                disabled={isReadOnly}
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
                onValueChange={
                  isReadOnly
                    ? undefined
                    : (value) => handleInputChange("priority", value)
                }
                disabled={isReadOnly}
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
                  onCheckedChange={
                    isReadOnly
                      ? undefined
                      : (checked) => handleInputChange("hasMeetingUrl", checked)
                  }
                  disabled={isReadOnly}
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
                disabled={isReadOnly}
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
              disabled={isReadOnly}
            />
          </div>

          {/* Assign Members */}
          <div className={UI_CONSTANTS.SPACING.formField}>
            <Label className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>Assigned Members</span>
            </Label>

            {/* Display current members for view/update modes */}
            {(mode === "view" || mode === "update") && memberIds.length > 0 && (
              <div className="mb-3">
                <Label className="text-sm font-medium text-slate-700 mb-2 block">
                  Current Members:
                </Label>
                <div className="space-y-2">
                  {memberIds.map((memberId) => (
                    <div key={memberId} className="p-2 bg-slate-50 rounded-md">
                      <MemberInfo
                        memberId={memberId}
                        showRole={true}
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Display empty state for view mode when no members */}
            {mode === "view" && memberIds.length === 0 && (
              <div className="p-3 bg-slate-50 rounded-lg text-center">
                <p className="text-sm text-slate-500">
                  No members assigned to this task
                </p>
              </div>
            )}

            {/* Member Selection for create/update modes */}
            {!isReadOnly && (
              <>
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
                    <Label className="text-sm font-medium">
                      Selected Members:
                    </Label>
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
                            onClick={() =>
                              handleMemberRemove(member["account-id"])
                            }
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {/* Delete button for update mode */}
            {mode === "update" && onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={isLoading}
                    className="sm:mr-auto"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Task
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Task</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this task? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <div className="flex gap-2 sm:ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {mode === "view" ? "Close" : "Cancel"}
              </Button>

              {!isReadOnly && (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="var(--primary) hover:var(--secondary)"
                >
                  {isLoading
                    ? mode === "create"
                      ? "Creating..."
                      : "Updating..."
                    : mode === "create"
                    ? "Create Task"
                    : "Update Task"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
