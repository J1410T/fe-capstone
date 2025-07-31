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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, X, Save, Users, Flag, Tag, Link } from "lucide-react";
import { format, parseISO } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";
import { useMemberTasksByTaskId } from "@/hooks/queries/task";
import { MemberInfoByAccount } from "./MemberInfo";

// Task interface - updated to match TaskModal structure
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

interface TaskDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Omit<Task, "projectId" | "milestoneId"> | null;
  onUpdate?: (task: Omit<Task, "projectId" | "milestoneId">) => void;
  projectId?: string;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  open,
  onOpenChange,
  task,
  onUpdate,
  projectId = "",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Task>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDueDate, setSelectedDueDate] = useState<Date | undefined>();
  const [selectedStartDate, setSelectedStartDate] = useState<
    Date | undefined
  >();

  // Fetch member tasks for this task
  const { data: memberTasksData } = useMemberTasksByTaskId(
    task?.id || "",
    1,
    100
  );
  const currentMemberTasks = memberTasksData?.["data-list"] || [];
  const memberIds = currentMemberTasks.map((memberTask) => memberTask.memberId);

  useEffect(() => {
    if (task) {
      setEditData(task);
      setSelectedDueDate(task.dueDate ? parseISO(task.dueDate) : undefined);
      setSelectedStartDate(
        task.startDate ? parseISO(task.startDate) : undefined
      );
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
    setSelectedDueDate(task.dueDate ? parseISO(task.dueDate) : undefined);
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
            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Start Date</span>
              </label>
              {isEditing ? (
                <div>
                  <DatePicker
                    date={selectedStartDate}
                    onDateChange={(date) => {
                      setSelectedStartDate(date);
                      handleInputChange(
                        "startDate",
                        date ? date.toISOString() : ""
                      );
                    }}
                    placeholder="Select start date"
                    disablePastDates={false}
                    inDialog={true}
                    className={`${
                      errors.startDate
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700">
                    {task.startDate
                      ? format(parseISO(task.startDate), "MMM dd, yyyy")
                      : "Not set"}
                  </span>
                </div>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>End Date</span>
              </label>
              {isEditing ? (
                <div>
                  <DatePicker
                    date={selectedDueDate}
                    onDateChange={(date) => {
                      setSelectedDueDate(date);
                      handleInputChange(
                        "dueDate",
                        date ? date.toISOString() : ""
                      );
                    }}
                    placeholder="Select end date"
                    disablePastDates={false}
                    inDialog={true}
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

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center space-x-1">
                <Flag className="w-4 h-4" />
                <span>Priority</span>
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

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center space-x-1">
                <Tag className="w-4 h-4" />
                <span>Status</span>
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
          </div>

          {/* Meeting URL */}
          {(task.meetingUrl || isEditing) && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center space-x-1">
                <Link className="w-4 h-4" />
                <span>Meeting URL</span>
              </label>
              {isEditing ? (
                <Input
                  value={editData.meetingUrl || ""}
                  onChange={(e) =>
                    handleInputChange("meetingUrl", e.target.value)
                  }
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter meeting URL"
                />
              ) : task.meetingUrl ? (
                <a
                  href={task.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                >
                  {task.meetingUrl}
                </a>
              ) : (
                <span className="text-slate-500">No meeting URL</span>
              )}
            </div>
          )}

          {/* Note */}
          {(task.note || isEditing) && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Note</label>
              {isEditing ? (
                <Textarea
                  value={editData.note || ""}
                  onChange={(e) => handleInputChange("note", e.target.value)}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
                  placeholder="Add any additional notes"
                />
              ) : (
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">
                  {task.note || "No additional notes"}
                </p>
              )}
            </div>
          )}

          {/* Assigned Members */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Assigned Members</span>
            </label>
            {memberIds && memberIds.length > 0 ? (
              <div className="space-y-2">
                {memberIds.map((memberId) => (
                  <div key={memberId} className="p-3 bg-slate-50 rounded-lg">
                    <MemberInfoByAccount
                      accountId={memberId}
                      projectId={projectId}
                      showRole={true}
                      size="md"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-lg text-center">
                <p className="text-sm text-slate-500">
                  No members assigned to this task
                </p>
              </div>
            )}
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
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          {/* Main Action Buttons - Right Side */}
          <div className="flex items-center space-x-3">
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
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Edit Task
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
