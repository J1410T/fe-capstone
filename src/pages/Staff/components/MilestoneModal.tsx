import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Target,
  ChevronDown,
  ChevronRight,
  // X,
  Plus,
  Edit2,
  Trash2,
  Save,
} from "lucide-react";
import {
  useMilestonesByProjectId,
  useCreateMilestone,
  useUpdateMilestone,
  useDeleteMilestone,
} from "@/hooks/queries/milestone";
import {
  useTasksByMilestoneId,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@/hooks/queries/task";
import { format } from "date-fns";
import { ProjectTask } from "@/types/task";
import { Milestone } from "@/types/milestone";
import { toast } from "sonner";
import { useBaseUserRoleId } from "@/hooks/queries";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  assignedTo: string;
  createdAt: string;
  completedAt?: string;
  "start-date": string;
  "end-date": string;
  "member-tasks": string;
}

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

// Transform API milestone to component format
const transformMilestone = (apiMilestone: Milestone): Milestone => ({
  id: apiMilestone.id,
  code: apiMilestone.code,
  title: apiMilestone.title || `Milestone ${apiMilestone.code}`,
  description: apiMilestone.description || "",
  objective: apiMilestone.objective || "",
  cost: apiMilestone.cost,
  type: apiMilestone.type,
  status: transformMilestoneStatus(apiMilestone.status),
  "start-date": apiMilestone["start-date"] || "",
  "end-date": apiMilestone["end-date"] || "",
  "created-at": apiMilestone["created-at"] || "",
  "project-id": apiMilestone["project-id"],
  "creator-id": apiMilestone["creator-id"],
  project: apiMilestone.project,
  creator: apiMilestone.creator,
  evaluations: apiMilestone.evaluations,
  tasks: [],
});

// Transform milestone status
const transformMilestoneStatus = (
  status: string
): "Not Started" | "In Progress" | "Completed" | "Overdue" => {
  switch (status?.toLowerCase()) {
    case "in_progress":
    case "in-progress":
      return "In Progress";
    case "completed":
    case "complete":
      return "Completed";
    case "overdue":
      return "Overdue";
    default:
      return "Not Started";
  }
};

// Transform API task to component format
const transformTask = (apiTask: ProjectTask): Task => ({
  id: apiTask.id,
  title: apiTask.name,
  description: apiTask.description || "",
  status: transformTaskStatus(apiTask.status),
  priority: transformTaskPriority(apiTask.priority),
  dueDate: apiTask["end-date"] || "",
  assignedTo: "",
  createdAt: apiTask["start-date"] || "",
  completedAt: apiTask["delivery-date"] || undefined,
  "start-date": apiTask["start-date"] || "",
  "end-date": apiTask["end-date"] || "",
  "member-tasks": "",
});

// Transform task status
const transformTaskStatus = (
  status: string
): "To Do" | "In Progress" | "Completed" => {
  switch (status?.toLowerCase()) {
    case "in_progress":
    case "in-progress":
      return "In Progress";
    case "completed":
    case "complete":
      return "Completed";
    default:
      return "To Do";
  }
};

// Transform task priority
const transformTaskPriority = (
  priority: string | null
): "Low" | "Medium" | "High" => {
  if (!priority) return "Low";
  switch (priority.toLowerCase()) {
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
    default:
      return "Low";
  }
};

// Utility function to format datetime-local input value
const formatDateTimeLocal = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return "";
  }
};

// Milestone Form Component with updated validation
const MilestoneForm: React.FC<{
  milestone?: Milestone;
  projectId: string;
  onSave: () => void;
  onCancel: () => void;
}> = ({ milestone, projectId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: milestone?.title || "",
    description: milestone?.description || "",
    objective: milestone?.objective || "",
    type: milestone?.type || "milestone",
    "start-date": milestone?.["start-date"]
      ? milestone["start-date"].split("T")[0]
      : "",
    "end-date": milestone?.["end-date"]
      ? milestone["end-date"].split("T")[0]
      : "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  const { data: userRoleData } = useBaseUserRoleId();
  const createMutation = useCreateMilestone();
  const updateMutation = useUpdateMilestone();

  // Validation function for milestones
  const validateMilestoneDates = useCallback(
    (startDate: string, endDate: string) => {
      const errors: { startDate?: string; endDate?: string } = {};
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (startDate) {
        const startDateTime = new Date(startDate);
        if (startDateTime < today) {
          errors.startDate = "Start date cannot be in the past";
        }
      }

      if (endDate) {
        const endDateTime = new Date(endDate);
        if (endDateTime < today) {
          errors.endDate = "End date cannot be in the past";
        }
      }

      if (startDate && endDate) {
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);

        // Check if end date is the same day as start date
        const isSameDay =
          startDateTime.toDateString() === endDateTime.toDateString();
        if (isSameDay) {
          errors.endDate = "End date cannot be the same day as start date";
        } else if (endDateTime <= startDateTime) {
          errors.endDate = "End date must be after start date";
        }
      }

      return errors;
    },
    []
  );

  // Real-time validation when dates change
  useEffect(() => {
    const errors = validateMilestoneDates(
      formData["start-date"],
      formData["end-date"]
    );
    setValidationErrors(errors);
  }, [formData["start-date"], formData["end-date"], validateMilestoneDates]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userRoleData?.data) {
      toast.error("User ID not found");
      return;
    }

    // Final validation before submit
    const errors = validateMilestoneDates(
      formData["start-date"],
      formData["end-date"]
    );
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix validation errors before submitting");
      return;
    }

    try {
      const submitData = {
        ...formData,
        "project-id": projectId,
        "creator-id": userRoleData.data,
        "start-date": formData["start-date"]
          ? new Date(formData["start-date"]).toISOString()
          : "",
        "end-date": formData["end-date"]
          ? new Date(formData["end-date"]).toISOString()
          : "",
      };

      if (milestone) {
        await updateMutation.mutateAsync({
          id: milestone.id,
          data: submitData,
        });
        toast.success("Milestone updated successfully");
      } else {
        await createMutation.mutateAsync(submitData);
        toast.success("Milestone created successfully");
      }
      onSave();
    } catch (error) {
      console.error("Error saving milestone:", error);
      toast.error(`Failed to ${milestone ? "update" : "create"} milestone`);
    }
  };

  const isFormValid = Object.keys(validationErrors).length === 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <Input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
          placeholder="Enter milestone title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Enter milestone description"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Objective
        </label>
        <Textarea
          value={formData.objective}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, objective: e.target.value }))
          }
          placeholder="Enter milestone objective"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <Input
            type="date"
            value={formData["start-date"]}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, "start-date": e.target.value }))
            }
            className={validationErrors.startDate ? "border-red-500" : ""}
          />
          {validationErrors.startDate && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.startDate}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <Input
            type="date"
            value={formData["end-date"]}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, "end-date": e.target.value }))
            }
            className={validationErrors.endDate ? "border-red-500" : ""}
          />
          {validationErrors.endDate && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.endDate}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            createMutation.isPending || updateMutation.isPending || !isFormValid
          }
        >
          {createMutation.isPending || updateMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {milestone ? "Update" : "Create"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

// Task Form Component with updated validation
const TaskForm: React.FC<{
  task?: Task;
  milestoneId: string;
  onSave: () => void;
  onCancel: () => void;
}> = ({ task, milestoneId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "Low",
    "start-date": task?.["start-date"]
      ? formatDateTimeLocal(task["start-date"])
      : "",
    "end-date": task?.["end-date"] ? formatDateTimeLocal(task["end-date"]) : "",
    note: "",
    "meeting-url": "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  const { data: userRoleData } = useBaseUserRoleId();
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();

  // Validation function for tasks
  const validateTaskDates = useCallback(
    (startDate: string, endDate: string) => {
      const errors: { startDate?: string; endDate?: string } = {};
      const now = new Date();

      if (startDate) {
        const startDateTime = new Date(startDate);
        if (startDateTime < now) {
          errors.startDate = "Start date cannot be in the past";
        }
      }

      if (endDate) {
        const endDateTime = new Date(endDate);
        if (endDateTime < now) {
          errors.endDate = "End date cannot be in the past";
        }
      }

      if (startDate && endDate) {
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);

        // For tasks: end date can be the same day as start date,
        // but cannot be the same time or before the start time
        if (endDateTime <= startDateTime) {
          errors.endDate = "End time must be after start time";
        }
      }

      return errors;
    },
    []
  );

  // Real-time validation when dates change
  useEffect(() => {
    const errors = validateTaskDates(
      formData["start-date"],
      formData["end-date"]
    );
    setValidationErrors(errors);
  }, [formData["start-date"], formData["end-date"], validateTaskDates]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userRoleData?.data) {
      toast.error("User ID not found");
      return;
    }

    // Final validation before submit
    const errors = validateTaskDates(
      formData["start-date"],
      formData["end-date"]
    );
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix validation errors before submitting");
      return;
    }

    try {
      if (task) {
        const updateData = {
          name: formData.name,
          description: formData.description,
          "start-date": formData["start-date"]
            ? new Date(formData["start-date"]).toISOString()
            : "",
          "end-date": formData["end-date"]
            ? new Date(formData["end-date"]).toISOString()
            : "",
          priority: formData.priority,
          progress: 0,
          overdue: 0,
          "meeting-url": formData["meeting-url"] || null,
          note: formData.note,
          "milestone-id": milestoneId,
          "member-tasks": null,
        };

        await updateMutation.mutateAsync({
          taskId: task.id,
          taskData: updateData,
        });
        toast.success("Task updated successfully");
      } else {
        const createData = {
          name: formData.name,
          description: formData.description,
          "start-date": formData["start-date"]
            ? new Date(formData["start-date"]).toISOString()
            : "",
          "end-date": formData["end-date"]
            ? new Date(formData["end-date"]).toISOString()
            : "",
          priority: formData.priority,
          progress: 0,
          overdue: 0,
          "meeting-url": formData["meeting-url"] || null,
          note: formData.note,
          "milestone-id": milestoneId,
          //   "creator-id": userRoleData.data,
        };

        await createMutation.mutateAsync(createData);
        toast.success("Task created successfully");
      }
      onSave();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error(`Failed to ${task ? "update" : "create"} task`);
    }
  };

  const isFormValid = Object.keys(validationErrors).length === 0;

  return (
    <div className="max-h-[60vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-4 pr-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Name
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
            placeholder="Enter task name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Enter task description"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <Select
            value={formData.priority}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                priority: value as "Low" | "Medium" | "High",
              }))
            }
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date & Time
            </label>
            <Input
              type="datetime-local"
              value={formData["start-date"]}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  "start-date": e.target.value,
                }))
              }
              className={validationErrors.startDate ? "border-red-500" : ""}
            />
            {validationErrors.startDate && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.startDate}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date & Time
            </label>
            <Input
              type="datetime-local"
              value={formData["end-date"]}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, "end-date": e.target.value }))
              }
              className={validationErrors.endDate ? "border-red-500" : ""}
            />
            {validationErrors.endDate && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.endDate}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meeting URL
          </label>
          <Input
            type="url"
            value={formData["meeting-url"]}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                "meeting-url": e.target.value,
              }))
            }
            placeholder="Enter meeting URL (optional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <Textarea
            value={formData.note}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, note: e.target.value }))
            }
            placeholder="Enter additional notes"
            rows={2}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              createMutation.isPending ||
              updateMutation.isPending ||
              !isFormValid
            }
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {task ? "Update" : "Create"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

// Individual milestone task fetcher component
const MilestoneTaskFetcher: React.FC<{
  milestoneId: string;
  onTasksLoaded: (milestoneId: string, tasks: Task[]) => void;
}> = ({ milestoneId, onTasksLoaded }) => {
  const {
    data: tasksData,
    isLoading,
    error,
  } = useTasksByMilestoneId(milestoneId, 1, 100);

  useEffect(() => {
    if (!isLoading) {
      if (tasksData?.data?.["data-list"]) {
        const transformedTasks = tasksData.data["data-list"].map(transformTask);
        onTasksLoaded(milestoneId, transformedTasks);
      } else {
        onTasksLoaded(milestoneId, []);
      }
    }
  }, [tasksData, isLoading, error, milestoneId, onTasksLoaded]);

  return null;
};

// Custom hook to manage tasks for multiple milestones
const useMilestonesTasks = (milestoneIds: string[]) => {
  const [tasksMap, setTasksMap] = useState<Record<string, Task[]>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const handleTasksLoaded = useCallback(
    (milestoneId: string, tasks: Task[]) => {
      setTasksMap((prev) => ({ ...prev, [milestoneId]: tasks }));
      setLoadingMap((prev) => ({ ...prev, [milestoneId]: false }));
    },
    []
  );

  useEffect(() => {
    setLoadingMap((prev) => {
      const updated = { ...prev };
      milestoneIds.forEach((id) => {
        if (!(id in updated)) {
          updated[id] = true;
        }
      });
      return updated;
    });

    setTasksMap((prev) => {
      const updated = { ...prev };
      milestoneIds.forEach((id) => {
        if (!(id in updated)) {
          updated[id] = [];
        }
      });
      return updated;
    });
  }, [milestoneIds]);

  return { tasksMap, loadingMap, handleTasksLoaded };
};

// Enhanced Milestone Card Component for Modal
const MilestoneCard: React.FC<{
  milestone: Milestone;
  tasks: Task[];
  progress: number;
  isLoading: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}> = ({
  milestone,
  tasks,
  isLoading,
  onEdit,
  onDelete,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4" />;
      case "In Progress":
        return <Clock className="w-4 h-4" />;
      case "Overdue":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div
            className="flex-1 cursor-pointer hover:bg-gray-50 p-2 rounded-md -m-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-base font-semibold text-gray-900 break-words whitespace-normal flex-1">
                {milestone.title}
              </h3>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(
                  milestone.status
                )}`}
              >
                <div className="flex items-center gap-1">
                  {getStatusIcon(milestone.status)}
                  {milestone.status}
                </div>
              </span>
            </div>

            {milestone.description && (
              <p className="text-gray-600 mb-3 text-sm line-clamp-2">
                {milestone.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>End: {formatDate(milestone["end-date"] || "")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                <span>{tasks.length} tasks</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <div
              className="cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100 px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-900 text-sm">
              Tasks ({tasks.length})
            </h4>
            <Button size="sm" onClick={onAddTask} className="h-8">
              <Plus className="w-4 h-4 mr-1" />
              Add Task
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">
                Loading tasks...
              </span>
            </div>
          ) : tasks.length > 0 ? (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md text-sm"
                >
                  <div className="flex-1">
                    <h5 className="font-normal text-gray-900 text-sm">
                      {task.title}
                    </h5>
                    {task.description && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        task.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : task.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {task.status}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        task.priority === "High"
                          ? "bg-red-100 text-red-800"
                          : task.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {task.priority}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditTask(task)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTask(task)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Target className="w-6 h-6 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No tasks found for this milestone</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MilestoneModal: React.FC<MilestoneModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectName,
}) => {
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(
    null
  );
  const [creatingMilestone, setCreatingMilestone] = useState(false);
  const [editingTask, setEditingTask] = useState<{
    task: Task | null;
    milestoneId: string;
  } | null>(null);
  const [creatingTask, setCreatingTask] = useState<string | null>(null);

  // API hooks
  const { data: milestonesData } = useMilestonesByProjectId(projectId);
  const deleteMilestoneMutation = useDeleteMilestone();
  const deleteTaskMutation = useDeleteTask();

  // Extract milestones from API response
  const apiMilestones = useMemo(
    () => milestonesData?.data || [],
    [milestonesData?.data]
  );

  // Transform milestones to component format
  const milestones = useMemo(() => {
    return apiMilestones.map(transformMilestone);
  }, [apiMilestones]);

  // Get milestone IDs for task fetching
  const milestoneIds = useMemo(() => milestones.map((m) => m.id), [milestones]);

  // Fetch tasks for all milestones
  const {
    tasksMap: milestoneTasksMap,
    loadingMap,
    handleTasksLoaded,
  } = useMilestonesTasks(milestoneIds);

  // Enhanced milestones with tasks
  const milestonesWithTasks = useMemo(() => {
    return milestones.map((milestone) => {
      const tasks = milestoneTasksMap[milestone.id] || [];
      const completedTasks = tasks.filter(
        (t) => t.status === "Completed"
      ).length;
      const progress =
        tasks.length > 0
          ? Math.round((completedTasks / tasks.length) * 100)
          : 0;

      return {
        ...milestone,
        tasks,
        progress,
      };
    });
  }, [milestones, milestoneTasksMap]);

  // Statistics calculations
  const completedMilestones = milestonesWithTasks.filter(
    (m) => m.status === "Completed"
  ).length;
  const inProgressMilestones = milestonesWithTasks.filter(
    (m) => m.status === "In Progress"
  ).length;
  const notStartedMilestones = milestonesWithTasks.filter(
    (m) => m.status === "Not Started"
  ).length;
  const totalTasks = milestonesWithTasks.reduce(
    (total, m) => total + (m.tasks?.length || 0),
    0
  );

  // Handle milestone operations
  const handleCreateMilestone = () => {
    setCreatingMilestone(true);
  };

  const handleEditMilestone = (milestone: Milestone) => {
    setEditingMilestone(milestone);
  };

  const handleDeleteMilestone = async (milestone: Milestone) => {
    if (
      window.confirm(`Are you sure you want to delete "${milestone.title}"?`)
    ) {
      try {
        await deleteMilestoneMutation.mutateAsync({
          id: milestone.id,
          projectId: projectId,
        });
        toast.success("Milestone deleted successfully");
      } catch (error) {
        console.error("Error deleting milestone:", error);
        toast.error("Failed to delete milestone");
      }
    }
  };

  // Handle task operations
  const handleCreateTask = (milestoneId: string) => {
    setCreatingTask(milestoneId);
  };

  const handleEditTask = (task: Task, milestoneId: string) => {
    setEditingTask({ task, milestoneId });
  };

  const handleDeleteTask = async (task: Task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      try {
        await deleteTaskMutation.mutateAsync(task.id);
        toast.success("Task deleted successfully");
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete task");
      }
    }
  };

  // Handle form submissions
  const handleMilestoneFormSave = () => {
    setEditingMilestone(null);
    setCreatingMilestone(false);
  };

  const handleTaskFormSave = () => {
    setEditingTask(null);
    setCreatingTask(null);
  };

  // Reset forms when modal closes
  const handleClose = () => {
    setEditingMilestone(null);
    setCreatingMilestone(false);
    setEditingTask(null);
    setCreatingTask(null);
    onClose();
  };

  // Check if any form is open
  const isFormOpen =
    creatingMilestone || editingMilestone || creatingTask || editingTask;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-blue-600" />
              <div>
                <DialogTitle className="text-xl font-bold">
                  Project Milestones
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">{projectName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isFormOpen && (
                <Button onClick={handleCreateMilestone} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Milestone
                </Button>
              )}
              {/* <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button> */}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4 overflow-hidden min-h-0">
          {/* Task fetchers - invisible components that handle data fetching */}
          {milestoneIds.map((milestoneId) => (
            <MilestoneTaskFetcher
              key={milestoneId}
              milestoneId={milestoneId}
              onTasksLoaded={handleTasksLoaded}
            />
          ))}

          {/* Forms */}
          {creatingMilestone && (
            <div className="flex-shrink-0 bg-gray-50 rounded-lg p-4 border">
              <h3 className="text-lg font-semibold mb-4">
                Create New Milestone
              </h3>
              <MilestoneForm
                projectId={projectId}
                onSave={handleMilestoneFormSave}
                onCancel={() => setCreatingMilestone(false)}
              />
            </div>
          )}

          {editingMilestone && (
            <div className="flex-shrink-0 bg-gray-50 rounded-lg p-4 border">
              <h3 className="text-lg font-semibold mb-4">Edit Milestone</h3>
              <MilestoneForm
                milestone={editingMilestone}
                projectId={projectId}
                onSave={handleMilestoneFormSave}
                onCancel={() => setEditingMilestone(null)}
              />
            </div>
          )}

          {creatingTask && (
            <div className="flex-shrink-0 bg-gray-50 rounded-lg p-4 border">
              <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
              <TaskForm
                milestoneId={creatingTask}
                onSave={handleTaskFormSave}
                onCancel={() => setCreatingTask(null)}
              />
            </div>
          )}

          {editingTask && (
            <div className="flex-shrink-0 bg-gray-50 rounded-lg p-4 border">
              <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
              <TaskForm
                task={editingTask.task ?? undefined}
                milestoneId={editingTask.milestoneId}
                onSave={handleTaskFormSave}
                onCancel={() => setEditingTask(null)}
              />
            </div>
          )}

          {/* Statistics Cards */}
          {!isFormOpen && (
            <div className="flex-shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-xl font-bold text-green-900">
                      {completedMilestones}
                    </p>
                    <p className="text-xs text-green-700">Completed</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-xl font-bold text-blue-900">
                      {inProgressMilestones}
                    </p>
                    <p className="text-xs text-blue-700">In Progress</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-xl font-bold text-orange-900">
                      {notStartedMilestones}
                    </p>
                    <p className="text-xs text-orange-700">Not Started</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-xl font-bold text-purple-900">
                      {totalTasks}
                    </p>
                    <p className="text-xs text-purple-700">Total Tasks</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Milestones List */}
          {!isFormOpen && (
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-3 pr-2">
                {milestones.length > 0 ? (
                  milestones.map((milestone) => {
                    const tasks = milestoneTasksMap[milestone.id] || [];
                    const isLoading = loadingMap[milestone.id] ?? true;
                    const progress =
                      tasks.length > 0
                        ? Math.round(
                            (tasks.filter((t) => t.status === "Completed")
                              .length /
                              tasks.length) *
                              100
                          )
                        : 0;

                    return (
                      <MilestoneCard
                        key={milestone.id}
                        milestone={milestone}
                        tasks={tasks}
                        progress={progress}
                        isLoading={isLoading}
                        onEdit={() => handleEditMilestone(milestone)}
                        onDelete={() => handleDeleteMilestone(milestone)}
                        onAddTask={() => handleCreateTask(milestone.id)}
                        onEditTask={(task) =>
                          handleEditTask(task, milestone.id)
                        }
                        onDeleteTask={handleDeleteTask}
                      />
                    );
                  })
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="max-w-md mx-auto">
                      <div className="p-3 bg-gray-200 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mb-2">
                        No milestones found
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Milestones will appear here once they are created for
                        this project.
                      </p>
                      <Button onClick={handleCreateMilestone}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Milestone
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MilestoneModal;
