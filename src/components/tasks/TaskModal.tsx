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
  useUpdateTaskStatusKanban,
} from "@/hooks/queries/task";
import { UserRole } from "@/types/auth";
import { toast } from "sonner";
import { parseISO, isValid } from "date-fns";

// Type for handling different member task formats
type MemberTaskUnion = {
  id: string;
  "member-id"?: string;
  memberId?: string;
  member?: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  progress?: number;
  overdue?: number;
  status?: string;
  note?: string;
};
import { MemberInfo } from "./MemberInfo";

// Task interface for the modal - matches TaskManagement interface
interface Task {
  id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed" | "Overdue";
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
  memberTaskIds?: string[]; // Array of member IDs assigned to this task (backward compatibility)
  memberTasks?: Array<{ id: string; memberId: string }>; // Array of member task objects with IDs (backward compatibility)
  // Enhanced member-tasks field from the API response
  "member-tasks"?: Array<{
    id: string;
    "member-id": string;
    member: {
      id: string;
      name: string;
      avatarUrl: string;
    };
    progress?: number;
    overdue?: number;
    status?: string;
    note?: string;
    // Legacy fields for backward compatibility
    memberId?: string;
  }>;
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
    status: "To Do" as "To Do" | "In Progress" | "Completed" | "Overdue",
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
  const [currentMode, setCurrentMode] = useState<TaskModalMode>(mode);

  // Sync mode prop with local state
  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

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
  const updateTaskStatusKanbanMutation = useUpdateTaskStatusKanban();

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
  // Check if task has member-tasks data (from enhanced hook) or use separate API call
  const currentMemberTasks: MemberTaskUnion[] = (task?.["member-tasks"] ||
    memberTasksData?.["data-list"] ||
    []) as MemberTaskUnion[];

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
        status: "To Do",
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
        status: task.status,
        note: task.note || "",
        hasMeetingUrl: !!task.meetingUrl,
        meetingUrl: task.meetingUrl || "",
      });

      // Set dates - handle both ISO datetime and date-only formats, and null values
      // Fix timezone offset issues by creating dates in local timezone
      try {
        if (
          task.startDate &&
          task.startDate !== "null" &&
          task.startDate !== ""
        ) {
          const startDate = parseISO(task.startDate);
          if (isValid(startDate)) {
            // Create a new date in local timezone to avoid offset issues
            const localStartDate = new Date(
              startDate.getFullYear(),
              startDate.getMonth(),
              startDate.getDate()
            );
            setSelectedStartDate(localStartDate);
          }
        } else if (
          task.createdAt &&
          task.createdAt !== "null" &&
          task.createdAt !== ""
        ) {
          const createdDate = parseISO(task.createdAt);
          if (isValid(createdDate)) {
            // Create a new date in local timezone to avoid offset issues
            const localCreatedDate = new Date(
              createdDate.getFullYear(),
              createdDate.getMonth(),
              createdDate.getDate()
            );
            setSelectedStartDate(localCreatedDate);
          }
        } else {
          setSelectedStartDate(undefined); // Clear date if null
        }
      } catch (error) {
        console.error("Error parsing start date:", error);
        setSelectedStartDate(undefined);
      }

      try {
        if (task.endDate && task.endDate !== "null" && task.endDate !== "") {
          const endDate = parseISO(task.endDate);
          if (isValid(endDate)) {
            // Create a new date in local timezone to avoid offset issues
            const localEndDate = new Date(
              endDate.getFullYear(),
              endDate.getMonth(),
              endDate.getDate()
            );
            setSelectedEndDate(localEndDate);
          }
        } else if (
          task.dueDate &&
          task.dueDate !== "null" &&
          task.dueDate !== ""
        ) {
          const dueDate = parseISO(task.dueDate);
          if (isValid(dueDate)) {
            // Create a new date in local timezone to avoid offset issues
            const localDueDate = new Date(
              dueDate.getFullYear(),
              dueDate.getMonth(),
              dueDate.getDate()
            );
            setSelectedEndDate(localDueDate);
          }
        } else {
          setSelectedEndDate(undefined); // Clear date if null
        }
      } catch (error) {
        console.error("Error parsing end date:", error);
        setSelectedEndDate(undefined);
      }

      // Load current assigned members from user roles data
      // Enhanced logic to handle both legacy memberTaskIds and member-tasks data
      if (userRolesData?.["data-list"]) {
        let currentMembers: UserRole[] = [];

        // First try to use member-tasks data (from enhanced hook)
        if (task["member-tasks"] && task["member-tasks"].length > 0) {
          const memberIds = task["member-tasks"].map((mt) => mt["member-id"]);
          currentMembers = userRolesData["data-list"].filter((role: UserRole) =>
            memberIds.includes(role["account-id"])
          );
        }
        // Fallback to legacy memberTaskIds
        else if (task.memberTaskIds && task.memberTaskIds.length > 0) {
          currentMembers = userRolesData["data-list"].filter((role: UserRole) =>
            task.memberTaskIds?.includes(role["account-id"])
          );
        }
        // Also try to get from separate member tasks API call
        else if (
          memberTasksData?.["data-list"] &&
          memberTasksData["data-list"].length > 0
        ) {
          const memberIds = memberTasksData["data-list"].map(
            (mt: MemberTaskUnion) => mt.memberId || mt["member-id"] || ""
          );
          currentMembers = userRolesData["data-list"].filter((role: UserRole) =>
            memberIds.includes(role["account-id"])
          );
        }

        setSelectedMembers(currentMembers);
      }

      setErrors({});
    }
  }, [task, mode, userRolesData, memberTasksData]);

  // Sync date fields - Fix timezone offset issues
  useEffect(() => {
    if (selectedStartDate) {
      // Use local date string to avoid timezone offset issues
      const year = selectedStartDate.getFullYear();
      const month = String(selectedStartDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedStartDate.getDate()).padStart(2, "0");
      const localDateString = `${year}-${month}-${day}`;

      setFormData((prev) => ({
        ...prev,
        startDate: localDateString,
      }));
    }
  }, [selectedStartDate]);

  useEffect(() => {
    if (selectedEndDate) {
      // Use local date string to avoid timezone offset issues
      const year = selectedEndDate.getFullYear();
      const month = String(selectedEndDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedEndDate.getDate()).padStart(2, "0");
      const localDateString = `${year}-${month}-${day}`;

      setFormData((prev) => ({
        ...prev,
        endDate: localDateString,
      }));
    }
  }, [selectedEndDate]);

  // Determine if form is read-only based on current mode
  const isReadOnly = currentMode === "view";

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

    // Required field validations
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Task title must be at least 3 characters long";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Task description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description =
        "Task description must be at least 10 characters long";
    }

    if (!formData.startDate && !selectedStartDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate && !selectedEndDate) {
      newErrors.endDate = "End date is required";
    }

    if (!formData.priority) {
      newErrors.priority = "Priority is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    // Date validations
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

    // Meeting URL validation
    if (formData.hasMeetingUrl && !formData.meetingUrl.trim()) {
      newErrors.meetingUrl = "Meeting URL is required when enabled";
    } else if (formData.hasMeetingUrl && formData.meetingUrl.trim()) {
      // Basic URL validation
      try {
        new URL(formData.meetingUrl.trim());
      } catch {
        newErrors.meetingUrl = "Please enter a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Show validation error summary
      const errorCount = Object.keys(errors).length;
      if (errorCount > 0) {
        toast.error(
          `Please fix ${errorCount} validation error${
            errorCount > 1 ? "s" : ""
          } before saving`
        );
      }
      return;
    }

    if (mode === "create" && !selectedMilestoneId) {
      toast.error("Milestone is required");
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "create") {
        // Create task - Fix timezone offset by using local date at noon
        const startDateAtNoon = new Date(selectedStartDate!);
        startDateAtNoon.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues

        const endDateAtNoon = new Date(selectedEndDate!);
        endDateAtNoon.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues

        const taskData = {
          name: formData.title,
          description: formData.description,
          "start-date": startDateAtNoon.toISOString(),
          "end-date": endDateAtNoon.toISOString(),
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
            status: "To Do" as Task["status"],
            dueDate: endDateAtNoon.toISOString(),
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
        // Update task - Fix timezone offset by using local date at noon
        const startDateAtNoon = new Date(selectedStartDate!);
        startDateAtNoon.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues

        const endDateAtNoon = new Date(selectedEndDate!);
        endDateAtNoon.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues

        const taskData = {
          name: formData.title,
          description: formData.description,
          "start-date": startDateAtNoon.toISOString(),
          "end-date": endDateAtNoon.toISOString(),
          priority: formData.priority,
          progress: formData.status === "Completed" ? 100 : 0,
          overdue: 0,
          "meeting-url": formData.hasMeetingUrl ? formData.meetingUrl : null,
          note: formData.note,
          "milestone-id": selectedMilestoneId,
        };

        console.log("🔍 TaskModal - Updating task with data:", {
          taskId: task.id,
          taskData,
          originalTask: task,
          originalMemberTasks: task["member-tasks"],
          currentMemberTasks: currentMemberTasks,
        });

        await updateTaskMutation.mutateAsync({
          taskId: task.id!,
          taskData,
        });

        // Update task status if it has changed
        if (formData.status !== task.status) {
          try {
            // Map the status to Kanban format
            const kanbanStatusMapping: Record<
              string,
              "ToDo" | "InProgress" | "Completed" | "Overdue"
            > = {
              "To Do": "ToDo",
              "In Progress": "InProgress",
              Completed: "Completed",
              Overdue: "Overdue",
            };

            const kanbanStatus = kanbanStatusMapping[formData.status];
            if (kanbanStatus) {
              await updateTaskStatusKanbanMutation.mutateAsync({
                taskId: task.id,
                status: kanbanStatus,
              });
              console.log(`✅ Task status updated to: ${formData.status}`);
            }
          } catch (error) {
            console.error("❌ Failed to update task status:", error);
            // Don't fail the entire operation if status update fails
          }
        }

        // Get current member IDs from task
        const currentMemberIds = currentMemberTasks
          .map((mt) => mt["member-id"] || mt.memberId || "")
          .filter(Boolean); // loại bỏ chuỗi rỗng nếu có

        // Lọc ra các member mới chưa có trong danh sách hiện tại
        const membersToAdd = selectedMembers.filter(
          (m) => !currentMemberIds.includes(m["account-id"])
        );

        if (membersToAdd.length > 0) {
          for (const member of membersToAdd) {
            try {
              await createMemberTaskMutation.mutateAsync({
                progress: 0,
                overdue: 0,
                note: "",
                "member-id": member["account-id"],
                "task-id": task.id!,
              });
            } catch (error) {
              console.error(
                "❌ Failed to add member task for:",
                member["account-id"],
                error
              );
            }
          }
        } else {
          console.log(
            "ℹ️ No new members to add, skipping member task creation"
          );
        }

        // Call onUpdate callback if provided (for parent component coordination)
        // But don't show duplicate toast since updateTaskMutation already shows one
        if (onUpdate) {
          const updatedTask = {
            ...task,
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            dueDate: endDateAtNoon.toISOString(),
            startDate: startDateAtNoon.toISOString(),
            endDate: endDateAtNoon.toISOString(),
            note: formData.note,
            meetingUrl: formData.hasMeetingUrl
              ? formData.meetingUrl
              : undefined,
          };

          console.log(
            "🔄 TaskModal - Calling onUpdate callback with:",
            updatedTask
          );
          onUpdate(updatedTask);
        }

        console.log("✅ TaskModal - Task update completed successfully");
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
      // First, delete all member tasks associated with this task
      if (currentMemberTasks.length > 0) {
        for (const memberTask of currentMemberTasks) {
          try {
            await deleteMemberTaskMutation.mutateAsync(memberTask.id);
          } catch (memberError) {
            console.error(
              "❌ Failed to delete member task:",
              memberTask.id,
              memberError
            );
            // Continue with other member tasks even if one fails
          }
        }
      }

      // Then delete the task itself
      await deleteTaskMutation.mutateAsync(task.id);
      onDelete(task.id);
      onOpenChange(false);
      toast.success("Task deleted successfully");
    } catch (error) {
      // Provide more specific error messages
      let errorMessage = "Failed to delete task";
      if (error instanceof Error) {
        if (error.message.includes("500")) {
          errorMessage =
            "Server error: Unable to delete task. Please try again or contact support.";
        } else if (error.message.includes("404")) {
          errorMessage = "Task not found. It may have already been deleted.";
        } else if (error.message.includes("403")) {
          errorMessage = "You don't have permission to delete this task.";
        }
      }

      toast.error(errorMessage);
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

  // Handle status change - only update local state, not API
  const handleStatusChange = (newStatus: string) => {
    if (isReadOnly) return;

    // Only update local form data, don't call API immediately
    setFormData((prev) => ({
      ...prev,
      status: newStatus as "To Do" | "In Progress" | "Completed" | "Overdue",
    }));

    // Clear any existing status error
    if (errors.status) {
      setErrors((prev) => ({ ...prev, status: "" }));
    }
  };

  // Handle member task deletion
  const handleDeleteMemberTask = async (memberTaskId: string) => {
    if (isReadOnly) return;

    try {
      await deleteMemberTaskMutation.mutateAsync(memberTaskId);
      toast.success("Member removed from task successfully");
    } catch (error) {
      console.error("Failed to remove member from task:", error);
      toast.error("Failed to remove member from task");
    }
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
                disablePastDates={mode === "create" || mode === "update"}
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
                disablePastDates={mode === "create" || mode === "update"}
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
                <span>Priority *</span>
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
                <SelectTrigger
                  className={errors.priority ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-red-500">{errors.priority}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-1">
                <Tag className="w-4 h-4" />
                <span>Status *</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={isReadOnly ? undefined : handleStatusChange}
                disabled={isReadOnly}
              >
                <SelectTrigger
                  className={errors.status ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status}</p>
              )}
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
            {(mode === "view" || mode === "update") &&
              currentMemberTasks.length > 0 && (
                <div className="mb-3">
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">
                    Current Members:
                  </Label>
                  <div className="space-y-2">
                    {currentMemberTasks.map((memberTask) => {
                      // Check if member data is embedded (from enhanced hook)
                      const memberData = memberTask.member || null;
                      const memberId =
                        memberTask["member-id"] || memberTask.memberId || "";

                      return (
                        <div
                          key={memberTask.id || memberId}
                          className="p-3 bg-slate-50 rounded-md"
                        >
                          {memberData ? (
                            // Display member data directly from member-tasks
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                                {memberData.avatarUrl ? (
                                  <img
                                    src={memberData.avatarUrl}
                                    alt={memberData.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                      const nextElement = e.currentTarget
                                        .nextElementSibling as HTMLElement;
                                      if (nextElement) {
                                        nextElement.style.display = "flex";
                                      }
                                    }}
                                  />
                                ) : null}
                                <div
                                  className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium"
                                  style={{
                                    display: memberData.avatarUrl
                                      ? "none"
                                      : "flex",
                                  }}
                                >
                                  {memberData.name?.charAt(0)?.toUpperCase() ||
                                    "U"}
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-slate-900">
                                  {memberData.name || "Unknown Member"}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {(memberTask.overdue || 0) > 0 && (
                                    <span className="text-red-500 ml-2">
                                      ({memberTask.overdue} days overdue)
                                    </span>
                                  )}
                                </p>
                              </div>
                              {/* Delete member button - only show in update mode */}
                              {/* {mode === "update" && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Remove Member
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to remove{" "}
                                        {memberData.name || "this member"} from
                                        this task? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteMemberTask(memberTask.id)
                                        }
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Remove
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )} */}
                            </div>
                          ) : (
                            // Fallback to MemberInfo component for backward compatibility
                            <div className="flex items-center justify-between">
                              <MemberInfo
                                memberId={memberId}
                                showRole={true}
                                size="sm"
                              />
                              {/* Delete member button - only show in update mode */}
                              {mode === "update" && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Remove Member
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to remove this
                                        member from this task? This action
                                        cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteMemberTask(memberTask.id)
                                        }
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Remove
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Display empty state for view mode when no members */}
            {mode === "view" && currentMemberTasks.length === 0 && (
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
                {currentMode === "view" ? "Close" : "Cancel"}
              </Button>

              {(currentMode === "create" || currentMode === "update") && (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="var(--primary) hover:var(--secondary)"
                >
                  {isLoading
                    ? currentMode === "create"
                      ? "Creating..."
                      : "Updating..."
                    : currentMode === "create"
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
