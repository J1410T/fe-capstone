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
import { DatePicker } from "@/components/ui/date-picker";
import { X, Save, Trash2, Plus } from "lucide-react";
import { parseISO } from "date-fns";

// Import API hooks
import { useUserRolesByProjectId } from "@/hooks/queries/useAuth";
import {
  useUpdateTask,
  useDeleteTask,
  useCreateMemberTask,
  useDeleteMemberTask,
} from "@/hooks/queries/task";
import { UserRole } from "@/types/auth";
import { toast } from "sonner";

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
}

interface UpdateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onUpdate: (task: Omit<Task, "projectId" | "milestoneId">) => void;
  onDelete?: (taskId: string) => void;
}

export const UpdateTaskModal: React.FC<UpdateTaskModalProps> = ({
  open,
  onOpenChange,
  task,
  onUpdate,
  onDelete,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
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
  const { data: userRolesData } = useUserRolesByProjectId(
    task?.projectId || ""
  );
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const createMemberTaskMutation = useCreateMemberTask();
  const deleteMemberTaskMutation = useDeleteMemberTask();

  const userRoles = userRolesData?.data || [];

  // Initialize form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        note: "",
        hasMeetingUrl: false,
        meetingUrl: "",
      });
      setSelectedStartDate(
        task.createdAt ? parseISO(task.createdAt) : undefined
      );
      setSelectedEndDate(task.dueDate ? parseISO(task.dueDate) : undefined);

      // Load current assigned members
      const currentMembers = userRoles.filter((role: UserRole) =>
        task.memberTaskIds?.includes(role["account-id"])
      );
      setSelectedMembers(currentMembers);
      setErrors({});
    }
  }, [task, userRoles]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!selectedStartDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!selectedEndDate) {
      newErrors.endDate = "End date is required";
    }

    if (
      selectedStartDate &&
      selectedEndDate &&
      selectedStartDate >= selectedEndDate
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !task) return;

    setIsLoading(true);

    try {
      // Update task
      const taskData = {
        name: formData.title,
        description: formData.description,
        "start-date": selectedStartDate!.toISOString(),
        "end-date": selectedEndDate!.toISOString(),
        priority: formData.priority,
        progress: 0,
        "meeting-url": formData.hasMeetingUrl ? formData.meetingUrl : null,
        note: formData.note,
        "milestone-id": task.milestoneId,
      };

      await updateTaskMutation.mutateAsync({ taskId: task.id, taskData });

      // Handle member task changes
      const currentMemberIds = task.memberTaskIds || [];
      const newMemberIds = selectedMembers.map((m) => m["account-id"]);

      // Find members to add and remove
      const membersToAdd = selectedMembers.filter(
        (m) => !currentMemberIds.includes(m["account-id"])
      );
      const memberIdsToRemove = currentMemberIds.filter(
        (memberId) => !newMemberIds.includes(memberId)
      );

      // Remove member tasks for members that are no longer assigned
      if (memberIdsToRemove.length > 0 && task.memberTasks) {
        const memberTasksToDelete = task.memberTasks.filter((mt) =>
          memberIdsToRemove.includes(mt.memberId)
        );

        const deleteMemberTaskPromises = memberTasksToDelete.map((memberTask) =>
          deleteMemberTaskMutation.mutateAsync(memberTask.id)
        );

        await Promise.all(deleteMemberTaskPromises);
      }

      // Add new member tasks
      if (membersToAdd.length > 0) {
        const memberTaskPromises = membersToAdd.map((member) =>
          createMemberTaskMutation.mutateAsync({
            progress: 0,
            overdue: 0,
            note: "",
            "member-id": member["account-id"],
            "task-id": task.id,
          })
        );

        await Promise.all(memberTaskPromises);
      }

      // Call the onUpdate callback
      onUpdate({
        ...task,
        title: formData.title,
        description: formData.description,
        dueDate: selectedEndDate!.toISOString(),
        priority: formData.priority,
        assignedTo: {
          id: selectedMembers[0]?.["account-id"] || "",
          name:
            getDisplayName(selectedMembers[0]?.["full-name"]) || "Unassigned",
          avatar: selectedMembers[0]?.["avatar-url"] || "",
          email: selectedMembers[0]?.email || "",
        },
        memberTaskIds: newMemberIds,
        updatedAt: new Date().toISOString(),
      });

      onOpenChange(false);
      toast.success("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    setIsLoading(true);

    try {
      await deleteTaskMutation.mutateAsync(task.id);
      onDelete?.(task.id);
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

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-slate-900">
            Update Task
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-slate-600">
            Edit task information and manage member assignments. You can add or
            remove members and update all task details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Task Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`${
                errors.title
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`${
                errors.description
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              } min-h-[100px]`}
              placeholder="Describe the task in detail"
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Start Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                date={selectedStartDate}
                onDateChange={setSelectedStartDate}
                placeholder="Select start date"
                className={`w-full ${
                  errors.startDate
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
              />
              {errors.startDate && (
                <p className="text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                End Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                date={selectedEndDate}
                onDateChange={setSelectedEndDate}
                placeholder="Select end date"
                className={`w-full ${
                  errors.endDate
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
              />
              {errors.endDate && (
                <p className="text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Priority
            </label>
            <Select
              value={formData.priority}
              onValueChange={(value: "Low" | "Medium" | "High") =>
                handleInputChange("priority", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Low</span>
                  </div>
                </SelectItem>
                <SelectItem value="Medium">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span>Medium</span>
                  </div>
                </SelectItem>
                <SelectItem value="High">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span>High</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Member Assignment */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">
              Assign Members
            </label>

            {/* Selected Members */}
            <div className="space-y-2">
              <p className="text-xs text-slate-600">
                Currently Assigned Members:
              </p>
              {selectedMembers.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map((member) => (
                    <div
                      key={member["account-id"]}
                      className="flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
                    >
                      <Avatar className="w-6 h-6">
                        <AvatarImage
                          src={member["avatar-url"] || undefined}
                          alt={member["full-name"]}
                          onError={handleAvatarError}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                          {getDisplayName(member["full-name"])
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-slate-900">
                        {getDisplayName(member["full-name"])}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {member.name}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMemberRemove(member["account-id"])}
                        className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <p className="text-sm text-slate-500">
                    No members assigned yet
                  </p>
                </div>
              )}
            </div>

            {/* Available Members */}
            <div className="space-y-2">
              <p className="text-xs text-slate-600">Available Members:</p>
              <div className="max-h-32 overflow-y-auto border border-slate-200 rounded-lg">
                {userRoles.length === 0 ? (
                  <div className="p-3 text-center text-sm text-slate-500">
                    No members available for this project
                  </div>
                ) : (
                  <div className="space-y-1 p-2">
                    {userRoles
                      .filter(
                        (role: UserRole) =>
                          !selectedMembers.some(
                            (selected) =>
                              selected["account-id"] === role["account-id"]
                          )
                      )
                      .map((role: UserRole) => (
                        <div
                          key={role["account-id"]}
                          className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md cursor-pointer"
                          onClick={() => handleMemberSelect(role)}
                        >
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage
                                src={role["avatar-url"] || undefined}
                                alt={role["full-name"]}
                                onError={handleAvatarError}
                              />
                              <AvatarFallback className="bg-slate-100 text-slate-700 text-xs">
                                {getDisplayName(role["full-name"])
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {getDisplayName(role["full-name"])}
                              </p>
                              <p className="text-xs text-slate-600">
                                {role.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {role.name}
                            </Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-slate-200">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Task</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  task and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? "Updating..." : "Update Task"}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
