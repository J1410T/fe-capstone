import React, { useState, useCallback } from "react";
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
import { Target, Save } from "lucide-react";
import { useCreateTask, useUpdateTask } from "@/hooks/queries/task";
import { toast } from "sonner";

// Helper function to format date-time for input
const formatDateTimeLocal = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Validation functions
const validateRequired = (value: string, fieldName: string): string => {
  if (!value.trim()) {
    return `${fieldName} is required`;
  }
  return "";
};

const validateUrl = (value: string): string => {
  // First check if required
  const requiredError = validateRequired(value, "Meeting URL");
  if (requiredError) return requiredError;

  // Then validate URL format
  try {
    const url = new URL(value);
    if (!url.protocol.startsWith("http")) {
      return "URL must start with http:// or https://";
    }
    return "";
  } catch {
    return "Please enter a valid URL";
  }
};

const validateDateNotPast = (dateString: string, fieldName: string): string => {
  if (!dateString) return "";

  const selectedDate = new Date(dateString);
  const now = new Date();

  if (selectedDate < now) {
    return `${fieldName} cannot be in the past`;
  }
  return "";
};

const validateEndDateAfterStart = (
  startDate: string,
  endDate: string
): string => {
  if (!startDate || !endDate) return "";

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    return "End date must be after start date";
  }
  return "";
};

interface MeetingTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  task?: {
    id: string;
    title: string;
    description: string;
    priority: string;
    "start-date": string;
    "end-date": string;
    "meeting-url": string | null;
    note: string;
    status: string;
    "milestone-id": string;
  } | null;
  milestoneId: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  "start-date": string;
  "end-date": string;
  "meeting-url": string | null;
  note: string;
  status: string;
  "milestone-id": string;
}

interface FormErrors {
  name: string;
  description: string;
  priority: string;
  "start-date": string;
  "end-date": string;
  "meeting-url": string;
  dateRange: string;
}

const MeetingTaskModal: React.FC<MeetingTaskModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  task,
  milestoneId,
}) => {
  // Reset forms when modal closes
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleTaskFormSave = useCallback(() => {
    handleClose();
    // Call onSuccess callback to refresh parent data
    if (onSuccess) {
      onSuccess();
    }
  }, [handleClose, onSuccess]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-blue-600" />
            <div>
              <DialogTitle className="text-xl font-bold">
                {task ? "Update Task" : "Create New Task"}
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                {task ? "Edit task details" : "Create a new meeting task"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden min-h-0">
          <TaskForm
            task={task ?? undefined}
            milestoneId={milestoneId}
            onSave={handleTaskFormSave}
            onCancel={handleClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Task Form Component
const TaskForm: React.FC<{
  task?: Task;
  milestoneId: string;
  onSave: () => void;
  onCancel: () => void;
}> = ({ task, milestoneId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: task?.title || "",
    description: task?.description || "",
    // Mặc định Priority là "High" cho Create Modal, giữ nguyên priority cũ khi Update
    priority: (task?.priority as "Low" | "Medium" | "High") || "High",
    "start-date": task?.["start-date"]
      ? formatDateTimeLocal(task["start-date"])
      : "",
    "end-date": task?.["end-date"] ? formatDateTimeLocal(task["end-date"]) : "",
    note: task?.note || "",
    "meeting-url": task?.["meeting-url"] || "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    description: "",
    priority: "",
    "start-date": "",
    "end-date": "",
    "meeting-url": "",
    dateRange: "",
  });

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();

  // Validate all fields
  const validateField = useCallback(
    (field: string, value: string) => {
      let error = "";

      switch (field) {
        case "name":
          error = validateRequired(value, "Task name");
          break;
        case "description":
          error = validateRequired(value, "Description");
          break;
        case "priority":
          error = validateRequired(value, "Priority");
          break;
        case "start-date":
          error =
            validateRequired(value, "Start date") ||
            validateDateNotPast(value, "Start date");
          break;
        case "end-date":
          error =
            validateRequired(value, "End date") ||
            validateDateNotPast(value, "End date");
          break;
        case "meeting-url":
          error = validateUrl(value);
          break;
        default:
          break;
      }

      setErrors((prev) => ({ ...prev, [field]: error }));

      // Also validate date range when either date changes
      if (field === "start-date" || field === "end-date") {
        const startDate =
          field === "start-date" ? value : formData["start-date"];
        const endDate = field === "end-date" ? value : formData["end-date"];
        const dateRangeError = validateEndDateAfterStart(startDate, endDate);
        setErrors((prev) => ({ ...prev, dateRange: dateRangeError }));
      }

      return error;
    },
    [formData]
  );

  // Validate all fields at once
  const validateAllFields = useCallback(() => {
    const newErrors: FormErrors = {
      name: validateRequired(formData.name, "Task name"),
      description: validateRequired(formData.description, "Description"),
      priority: validateRequired(formData.priority, "Priority"),
      "start-date":
        validateRequired(formData["start-date"], "Start date") ||
        validateDateNotPast(formData["start-date"], "Start date"),
      "end-date":
        validateRequired(formData["end-date"], "End date") ||
        validateDateNotPast(formData["end-date"], "End date"),
      "meeting-url": validateUrl(formData["meeting-url"]),
      dateRange: validateEndDateAfterStart(
        formData["start-date"],
        formData["end-date"]
      ),
    };

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error !== "");
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      description: true,
      priority: true,
      "start-date": true,
      "end-date": true,
      "meeting-url": true,
    });

    // Validate all fields
    const isValid = validateAllFields();

    if (!isValid) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    try {
      const submitData = {
        ...formData,
        "milestone-id": milestoneId,
        "start-date": formData["start-date"]
          ? new Date(formData["start-date"]).toISOString()
          : "",
        "end-date": formData["end-date"]
          ? new Date(formData["end-date"]).toISOString()
          : "",
        progress: 0,
        overdue: 0,
      };

      if (task) {
        await updateTaskMutation.mutateAsync({
          taskId: task.id,
          taskData: submitData,
        });
        toast.success("Task updated successfully");
      } else {
        await createTaskMutation.mutateAsync(submitData);
        toast.success("Task created successfully");
      }
      onSave();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error(`Failed to ${task ? "update" : "create"} task`);
    }
  };

  const handleFormDataChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Mark field as touched when user starts typing
      setTouched((prev) => ({ ...prev, [field]: true }));

      // Validate field on change
      validateField(field, value);
    },
    [validateField]
  );

  const handleBlur = useCallback(
    (field: string) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      validateField(field, formData[field as keyof typeof formData]);
    },
    [validateField, formData]
  );

  return (
    <div className="max-h-[60vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-4 pr-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleFormDataChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            placeholder="Enter task name"
            className={errors.name && touched.name ? "border-red-500" : ""}
          />
          {errors.name && touched.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              handleFormDataChange("description", e.target.value)
            }
            onBlur={() => handleBlur("description")}
            placeholder="Enter task description"
            rows={3}
            className={
              errors.description && touched.description ? "border-red-500" : ""
            }
          />
          {errors.description && touched.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.priority}
            onValueChange={(value: "Low" | "Medium" | "High") => {
              handleFormDataChange("priority", value);
              setTouched((prev) => ({ ...prev, priority: true }));
            }}
          >
            <SelectTrigger
              className={
                errors.priority && touched.priority ? "border-red-500" : ""
              }
            >
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
          {errors.priority && touched.priority && (
            <p className="text-red-500 text-sm mt-1">{errors.priority}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date & Time <span className="text-red-500">*</span>
            </label>
            <Input
              type="datetime-local"
              value={formData["start-date"]}
              onChange={(e) =>
                handleFormDataChange("start-date", e.target.value)
              }
              onBlur={() => handleBlur("start-date")}
              className={
                errors["start-date"] && touched["start-date"]
                  ? "border-red-500"
                  : ""
              }
            />
            {errors["start-date"] && touched["start-date"] && (
              <p className="text-red-500 text-sm mt-1">
                {errors["start-date"]}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date & Time <span className="text-red-500">*</span>
            </label>
            <Input
              type="datetime-local"
              value={formData["end-date"]}
              onChange={(e) => handleFormDataChange("end-date", e.target.value)}
              onBlur={() => handleBlur("end-date")}
              className={
                errors["end-date"] && touched["end-date"]
                  ? "border-red-500"
                  : ""
              }
            />
            {errors["end-date"] && touched["end-date"] && (
              <p className="text-red-500 text-sm mt-1">{errors["end-date"]}</p>
            )}
          </div>
        </div>

        {/* Date range validation error */}
        {errors.dateRange && (touched["start-date"] || touched["end-date"]) && (
          <p className="text-red-500 text-sm">{errors.dateRange}</p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meeting URL <span className="text-red-500">*</span>
          </label>
          <Input
            type="url"
            value={formData["meeting-url"]}
            onChange={(e) =>
              handleFormDataChange("meeting-url", e.target.value)
            }
            onBlur={() => handleBlur("meeting-url")}
            placeholder="https://meet.google.com/... or https://zoom.us/j/..."
            className={
              errors["meeting-url"] && touched["meeting-url"]
                ? "border-red-500"
                : ""
            }
          />
          {errors["meeting-url"] && touched["meeting-url"] && (
            <p className="text-red-500 text-sm mt-1">{errors["meeting-url"]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <Textarea
            value={formData.note}
            onChange={(e) => handleFormDataChange("note", e.target.value)}
            placeholder="Additional notes"
            rows={2}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            {task ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MeetingTaskModal;
