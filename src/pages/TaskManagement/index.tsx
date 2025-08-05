import React, { useState, useMemo, useEffect } from "react";
import {
  TaskTable,
  SharedTaskBoard,
  TaskStatsCards,
  TaskModal,
} from "@/components/tasks";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import {
  Table as TableIcon,
  Kanban,
  Plus,
  BarChart3,
  Users,
  Filter,
} from "lucide-react";

// Import API hooks
import { useMyProject } from "@/hooks/queries/project";
import { useMilestonesByProjectId } from "@/hooks/queries/milestone";
import {
  useTasksByMilestoneId,
  useUpdateTask,
  useUpdateTaskStatusKanban,
  useDeleteTask,
} from "@/hooks/queries/task";
import { formatDateTime } from "@/utils/date";
import { isValid, parseISO } from "date-fns";

// Import types from API
import type { ProjectTask } from "@/types/task";

// TaskTable-compatible Task interface
interface TaskTableTask {
  id: string;
  title: string;
  description: string;
  status: "Not Started" | "In Progress" | "Complete" | "Overdue";
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  projectTag: string;
  "member-tasks": Array<{
    id: string;
    "member-id": string;
    member: {
      id: string;
      name: string;
      avatarUrl: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

// Unified Task interface for component compatibility
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
  }>;
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
}

// Safe date formatting helper - returns ISO date string for TaskTable compatibility
const safeFormatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return new Date().toISOString();

  try {
    const parsedDate = parseISO(dateString);
    if (isValid(parsedDate)) {
      // Return the original ISO string for TaskTable to handle formatting
      return dateString;
    }
  } catch {
    // Fall through to default
  }

  return new Date().toISOString();
};

const safeFormatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return new Date().toISOString();

  try {
    const parsedDate = parseISO(dateString);
    if (isValid(parsedDate)) {
      return formatDateTime(dateString);
    }
  } catch {
    // Fall through to default
  }

  return new Date().toISOString();
};

// Data transformation functions
const transformProjectTask = (task: ProjectTask): Task => {
  // Get the first member task for primary assignee
  const primaryMemberTask = task["member-tasks"]?.[0];

  return {
    id: task.id,
    title: task.name,
    description: task.description,
    status: transformTaskStatus(task.status),
    dueDate: safeFormatDate(task["end-date"]),
    priority: transformTaskPriority(task.priority),
    projectTag: task.code || "Task",
    projectId: "", // Will be set from context
    milestoneId: task["milestone-id"],
    assignedTo: {
      id: primaryMemberTask?.memberId || "",
      name: primaryMemberTask ? "Loading..." : "Unassigned", // Will be resolved by MemberInfo component
      avatar: "",
      email: "",
    },
    // Store all member task IDs for later use (backward compatibility)
    memberTaskIds: task["member-tasks"]?.map((mt) => mt.memberId) || [],
    // Store member task objects with both member ID and member task ID (backward compatibility)
    memberTasks:
      task["member-tasks"]?.map((mt) => ({
        id: mt.id,
        memberId: mt.memberId,
      })) || [],
    // Include the full member-tasks data for enhanced TaskModal display
    "member-tasks": task["member-tasks"]?.map((mt) => ({
      id: mt.id,
      "member-id": mt.memberId,
      member: {
        id: mt.memberId,
        name: mt["full-name"] || "Unknown Member",
        avatarUrl: mt["avatar-url"] || "",
      },
      progress: mt.progress,
      overdue: mt.overdue,
      status: mt.status,
      note: mt.note,
    })) || [],
    createdAt: safeFormatDateTime(task["start-date"]),
    updatedAt: safeFormatDateTime(task["delivery-date"]),
    // Add start and end date fields for TaskModal
    startDate: safeFormatDate(task["start-date"]),
    endDate: safeFormatDate(task["end-date"]),
  };
};

const transformTaskStatus = (
  status: string
): "Not Started" | "In Progress" | "Complete" | "Overdue" => {
  switch (status?.toLowerCase()) {
    case "create":
    case "todo":
    case "to do":
      return "Not Started"; // 'create' → ToDo
    case "in progress":
    case "inprogress":
      return "In Progress";
    case "completed":
    case "complete":
      return "Complete";
    case "overdue":
      return "Overdue";
    default:
      return "Not Started";
  }
};

const transformTaskPriority = (
  priority: string | null
): "Low" | "Medium" | "High" => {
  // Handle null priority → Low
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

// Safe date validation for overdue check
const isTaskOverdue = (dueDate: string, status: string): boolean => {
  if (status === "Complete") return false;
  if (!dueDate) return false;

  try {
    const parsedDate = parseISO(dueDate);
    if (!isValid(parsedDate)) return false;
    return new Date() > parsedDate;
  } catch {
    return false;
  }
};

const UserTaskManagement: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<"table" | "kanban">("table");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>("");
  const [pageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);


  // Role-based permissions (can be made dynamic based on user context)
  const isLeader = true;

  // Add debugging
  console.log("UserTaskManagement: Component rendering");
  console.log("UserTaskManagement: selectedProjectId:", selectedProjectId);
  console.log("UserTaskManagement: selectedMilestoneId:", selectedMilestoneId);

  // API hooks with error handling
  const { data: projectsData, error: projectsError } = useMyProject();
  const { data: milestonesData, error: milestonesError } =
    useMilestonesByProjectId(selectedProjectId);
  const { data: tasksData, error: tasksError } = useTasksByMilestoneId(
    selectedMilestoneId && selectedMilestoneId !== "no-milestones"
      ? selectedMilestoneId
      : "",
    activeView === "kanban" ? 1 : pageIndex,
    activeView === "kanban" ? totalCount || 1000 : pageSize
  );

  // Task management mutations
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const updateTaskStatusKanbanMutation = useUpdateTaskStatusKanban();

  // Log any API errors
  React.useEffect(() => {
    if (projectsError) {
      console.error("Projects API error:", projectsError);
    }
    if (milestonesError) {
      console.error("Milestones API error:", milestonesError);
    }
    if (tasksError) {
      console.error("Tasks API error:", tasksError);
    }
  }, [projectsError, milestonesError, tasksError]);

  // Extract data from API responses with memoization
  const projects = useMemo(
    () => projectsData?.data || [],
    [projectsData?.data]
  );
  const milestones = useMemo(
    () => milestonesData?.data || [],
    [milestonesData?.data]
  );
  const tasksResponse = tasksData?.data;
  const tasks = useMemo(
    () => tasksResponse?.["data-list"] || [],
    [tasksResponse]
  );

  // Initialize selections when data loads
  React.useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  React.useEffect(() => {
    if (milestones.length > 0) {
      // Always set to first milestone when milestones change (e.g., project change)
      if (!selectedMilestoneId || selectedMilestoneId === "no-milestones") {
        setSelectedMilestoneId(milestones[0].id);
      }
      // Check if current selected milestone still exists in the new list
      else if (!milestones.find((m) => m.id === selectedMilestoneId)) {
        setSelectedMilestoneId(milestones[0].id);
      }
    } else if (
      milestones.length === 0 &&
      selectedMilestoneId !== "no-milestones"
    ) {
      setSelectedMilestoneId("no-milestones");
    }
  }, [milestones, selectedMilestoneId]);

  // Update total count when tasks data changes
  React.useEffect(() => {
    if (tasksResponse?.["total-count"]) {
      setTotalCount(tasksResponse["total-count"]);
    }
  }, [tasksResponse]);

  // Transform tasks to component format
  const transformedTasks = useMemo(() => {
    return tasks.map((task) => ({
      ...transformProjectTask(task),
      projectId: selectedProjectId,
    }));
  }, [tasks, selectedProjectId]);

  // Check for overdue tasks and update them automatically
  const [checkedMilestones, setCheckedMilestones] = React.useState<Set<string>>(
    new Set()
  );

  // Function to check and update overdue tasks
  const checkOverdueTasks = React.useCallback(
    (tasks: Task[], milestoneId: string) => {
      if (!milestoneId || checkedMilestones.has(milestoneId)) return;

      const now = new Date();
      const overdueTasks = tasks.filter((task) => {
        if (task.status === "Complete" || task.status === "Overdue")
          return false;
        if (!task.dueDate) return false;

        try {
          const dueDate = parseISO(task.dueDate);
          return isValid(dueDate) && now > dueDate;
        } catch {
          return false;
        }
      });

      if (overdueTasks.length > 0) {
        console.log(
          `Found ${overdueTasks.length} overdue tasks in milestone ${milestoneId}, updating individually...`
        );

        // Mark this milestone as checked
        setCheckedMilestones((prev) => new Set(prev).add(milestoneId));

        // Update each overdue task individually using the working status update API
        overdueTasks.forEach((task, index) => {
          updateTaskStatusKanbanMutation.mutate(
            {
              taskId: task.id,
              status: "Overdue",
            },
            {
              onSuccess: () => {
                // Log progress for debugging
                console.log(
                  `Updated task ${task.id} to Overdue status (${index + 1}/${
                    overdueTasks.length
                  })`
                );
              },
            }
          );
        });
      } else {
        // Even if no overdue tasks, mark milestone as checked to avoid repeated checks
        setCheckedMilestones((prev) => new Set(prev).add(milestoneId));
      }
    },
    [checkedMilestones, updateTaskStatusKanbanMutation]
  );

  // Check overdue tasks when milestone is selected and tasks are loaded
  React.useEffect(() => {
    if (transformedTasks.length > 0 && selectedMilestoneId) {
      checkOverdueTasks(transformedTasks, selectedMilestoneId);
    }
  }, [transformedTasks, selectedMilestoneId, checkOverdueTasks]);

  // Reset checked milestones when project changes
  React.useEffect(() => {
    setCheckedMilestones(new Set());
  }, [selectedProjectId]);

  // Use transformed tasks directly since they're already filtered by API
  const filteredTasks = transformedTasks;

  // Convert extended Task to component-compatible Task
  const convertTaskForComponents = (
    task: Task
  ): Omit<Task, "projectId" | "milestoneId"> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { projectId, milestoneId, ...componentTask } = task;
    return componentTask;
  };

  // Convert tasks for components
  const tasksForComponents = useMemo(() => {
    return filteredTasks.map(convertTaskForComponents);
  }, [filteredTasks]);

  // Debug logging for TaskTable props
  useEffect(() => {
    console.log("🔍 TaskManagement - Milestone selection:", {
      selectedMilestoneId,
      milestoneIdForTable: selectedMilestoneId && selectedMilestoneId !== "no-milestones" ? selectedMilestoneId : undefined,
      isValidMilestone: selectedMilestoneId && selectedMilestoneId !== "no-milestones"
    });
  }, [selectedMilestoneId]);

  // Task event handlers - these handle TaskTable tasks
  const handleTaskEdit = (taskTableTask: TaskTableTask) => {
    // Convert TaskTable task to our internal Task format for modals
    const convertedTask: Task = {
      id: taskTableTask.id,
      title: taskTableTask.title,
      description: taskTableTask.description,
      status: taskTableTask.status,
      dueDate: taskTableTask.dueDate,
      priority: taskTableTask.priority,
      projectTag: taskTableTask.projectTag,
      projectId: selectedProjectId,
      milestoneId: selectedMilestoneId,
      assignedTo: {
        id: taskTableTask["member-tasks"]?.[0]?.["member-id"] || "",
        name: taskTableTask["member-tasks"]?.[0]?.member?.name || "Unassigned",
        avatar: taskTableTask["member-tasks"]?.[0]?.member?.avatarUrl || "",
        email: "",
      },
      memberTaskIds: taskTableTask["member-tasks"]?.map((mt) => mt["member-id"]) || [],
      memberTasks: taskTableTask["member-tasks"]?.map((mt) => ({
        id: mt.id,
        memberId: mt["member-id"],
      })) || [],
      createdAt: taskTableTask.createdAt,
      updatedAt: taskTableTask.updatedAt,
    };

    setSelectedTask(convertedTask);
    setIsUpdateModalOpen(true);
  };

  const handleTaskView = (taskTableTask: TaskTableTask) => {
    // Convert TaskTable task to our internal Task format for modals
    const convertedTask: Task = {
      id: taskTableTask.id,
      title: taskTableTask.title,
      description: taskTableTask.description,
      status: taskTableTask.status,
      dueDate: taskTableTask.dueDate,
      priority: taskTableTask.priority,
      projectTag: taskTableTask.projectTag,
      projectId: selectedProjectId,
      milestoneId: selectedMilestoneId,
      assignedTo: {
        id: taskTableTask["member-tasks"]?.[0]?.["member-id"] || "",
        name: taskTableTask["member-tasks"]?.[0]?.member?.name || "Unassigned",
        avatar: taskTableTask["member-tasks"]?.[0]?.member?.avatarUrl || "",
        email: "",
      },
      memberTaskIds: taskTableTask["member-tasks"]?.map((mt) => mt["member-id"]) || [],
      memberTasks: taskTableTask["member-tasks"]?.map((mt) => ({
        id: mt.id,
        memberId: mt["member-id"],
      })) || [],
      createdAt: taskTableTask.createdAt,
      updatedAt: taskTableTask.updatedAt,
    };

    setSelectedTask(convertedTask);
    setIsDetailModalOpen(true);
  };

  const handleTaskClick = (taskTableTask: TaskTableTask) => {
    // Convert TaskTable task to our internal Task format for modals
    const convertedTask: Task = {
      id: taskTableTask.id,
      title: taskTableTask.title,
      description: taskTableTask.description,
      status: taskTableTask.status,
      dueDate: taskTableTask.dueDate,
      priority: taskTableTask.priority,
      projectTag: taskTableTask.projectTag,
      projectId: selectedProjectId,
      milestoneId: selectedMilestoneId,
      assignedTo: {
        id: taskTableTask["member-tasks"]?.[0]?.["member-id"] || "",
        name: taskTableTask["member-tasks"]?.[0]?.member?.name || "Unassigned",
        avatar: taskTableTask["member-tasks"]?.[0]?.member?.avatarUrl || "",
        email: "",
      },
      memberTaskIds: taskTableTask["member-tasks"]?.map((mt) => mt["member-id"]) || [],
      memberTasks: taskTableTask["member-tasks"]?.map((mt) => ({
        id: mt.id,
        memberId: mt["member-id"],
      })) || [],
      createdAt: taskTableTask.createdAt,
      updatedAt: taskTableTask.updatedAt,
    };

    setSelectedTask(convertedTask);
    setIsDetailModalOpen(true);
  };

  // Separate handler for SharedTaskBoard (uses old Task format)
  const handleKanbanTaskClick = (componentTask: Omit<Task, "projectId" | "milestoneId">) => {
    // Find the full task from our transformed data
    const fullTask = filteredTasks.find((t: Task) => t.id === componentTask.id);
    if (fullTask) {
      setSelectedTask(fullTask);
      setIsDetailModalOpen(true);
    }
  };

  const handleCreateTaskClick = () => {
    setIsCreateModalOpen(true);
  };

  // Task creation handler - Note: This would need to be implemented with API call
  const handleCreateTaskSubmit = () => {
    // Ensure project and milestone are selected
    if (
      !selectedProjectId ||
      !selectedMilestoneId ||
      selectedMilestoneId === "no-milestones"
    ) {
      toast.error(
        "Please select both a project and milestone before creating a task."
      );
      return;
    }

    // TODO: Implement API call to create task
    setIsCreateModalOpen(false);
    toast.success("Task creation not implemented yet", {
      description: "API integration for task creation is pending.",
    });
  };

  // Task update handler - handles component-compatible tasks
  const handleUpdateTask = (
    componentUpdatedTask: Omit<Task, "projectId" | "milestoneId">
  ) => {
    // Find the original task to preserve projectId and milestoneId
    const originalTask = filteredTasks.find(
      (task: Task) => task.id === componentUpdatedTask.id
    );
    if (!originalTask) return;

    // Check if this is just a status update (from drag and drop)
    const isStatusOnlyUpdate =
      originalTask.title === componentUpdatedTask.title &&
      originalTask.description === componentUpdatedTask.description &&
      originalTask.dueDate === componentUpdatedTask.dueDate &&
      originalTask.priority === componentUpdatedTask.priority &&
      originalTask.status !== componentUpdatedTask.status;

    if (isStatusOnlyUpdate) {
      // Handle status update via drag and drop - use Kanban status mapping
      const kanbanStatusMapping: Record<
        string,
        "ToDo" | "InProgress" | "Completed" | "Overdue"
      > = {
        "Not Started": "ToDo",
        "In Progress": "InProgress",
        Complete: "Completed",
        Overdue: "Overdue",
      };
      const kanbanStatus = kanbanStatusMapping[componentUpdatedTask.status];
      if (kanbanStatus) {
        console.log(
          `Kanban status update: "${componentUpdatedTask.status}" -> "${kanbanStatus}"`
        );
        updateTaskStatusKanbanMutation.mutate({
          taskId: componentUpdatedTask.id,
          status: kanbanStatus,
        });
      }
    } else {
      // Handle full task update
      const updateData = {
        name: componentUpdatedTask.title,
        description: componentUpdatedTask.description,
        "start-date": new Date().toISOString(), // Use current date as start date
        "end-date": componentUpdatedTask.dueDate,
        priority: componentUpdatedTask.priority,
        progress: 0,
        overdue: 0,
        "meeting-url": null,
        note: "",
        "milestone-id": originalTask.milestoneId,
      };

      updateTaskMutation.mutate(
        { taskId: componentUpdatedTask.id, taskData: updateData },
        {
          onSuccess: async () => {
            // Handle member task changes if assignee changed
            const oldAssigneeId = originalTask.assignedTo.id;
            const newAssigneeId = componentUpdatedTask.assignedTo.id;

            if (oldAssigneeId !== newAssigneeId) {
              try {
                // Remove old member task if exists
                if (oldAssigneeId && originalTask.memberTaskIds?.length) {
                  // Find the member task ID to delete (this would need to be stored in the task data)
                  // For now, we'll skip this as we don't have the member-task ID readily available
                  // In a real implementation, you'd need to store member-task IDs in the task data
                }

                // Add new member task if new assignee exists
                if (newAssigneeId) {
                  // This would be handled by the CreateTaskModal pattern
                  // For now, we'll just update the task
                }
              } catch (error) {
                console.error("Error updating member tasks:", error);
              }
            }

            setSelectedTask(null);
            setIsUpdateModalOpen(false);
          },
        }
      );
    }
  };

  // Task delete handler
  const handleDeleteTask = (taskId: string) => {
    // Close modal if the deleted task was selected
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
      setIsUpdateModalOpen(false);
    }

    deleteTaskMutation.mutate(taskId);
  };

  // Calculate task statistics with safe date checking
  const taskStats = {
    total: filteredTasks.length,
    notStarted: filteredTasks.filter((t: Task) => t.status === "Not Started")
      .length,
    inProgress: filteredTasks.filter((t: Task) => t.status === "In Progress")
      .length,
    completed: filteredTasks.filter((t: Task) => t.status === "Complete")
      .length,
    overdue: filteredTasks.filter((t: Task) => {
      return isTaskOverdue(t.dueDate, t.status);
    }).length,
  };

  // Get unique team RESEARCHERs for statistics
  const teamResearchers = Array.from(
    new Set(filteredTasks.map((task: Task) => task.assignedTo.id))
  ).length;

  // Get unique project tags
  const projectTags = Array.from(
    new Set(filteredTasks.map((task: Task) => task.projectTag))
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Responsive Header */}
      <div className="sticky top-16 left-0 right-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {/* Mobile-first header layout */}
          <div className="space-y-4">
            {/* Title Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight truncate">
                  Task Management
                </h1>
                <p className="text-sm text-slate-600 mt-1 hidden sm:block">
                  Organize, track, and manage your team's work with powerful
                  tools
                </p>
              </div>

              {/* Create Task Button - Mobile Priority */}
              {isLeader && (
                <div className="flex-shrink-0">
                  <Button
                    onClick={handleCreateTaskClick}
                    className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer text-white flex items-center space-x-2 w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Task</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Project and Milestone Selection */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Project
                </label>
                <Select
                  value={selectedProjectId}
                  onValueChange={(value) => {
                    setSelectedProjectId(value);
                    // Reset milestone selection when project changes
                    setSelectedMilestoneId("");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        projects.length === 0
                          ? "No projects available"
                          : "Choose a project..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.length === 0 ? (
                      <SelectItem value="no-projects" disabled>
                        No projects available
                      </SelectItem>
                    ) : (
                      projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project["english-title"]}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Milestone
                </label>
                <Select
                  value={selectedMilestoneId}
                  onValueChange={setSelectedMilestoneId}
                  disabled={!selectedProjectId || milestones.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        !selectedProjectId
                          ? "Select a project first..."
                          : milestones.length === 0
                          ? "None - No milestones available"
                          : "Choose a milestone..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {milestones.length === 0 ? (
                      <SelectItem value="no-milestones" disabled>
                        No milestones available
                      </SelectItem>
                    ) : (
                      milestones.map((milestone) => (
                        <SelectItem key={milestone.id} value={milestone.id}>
                          {milestone.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Controls Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Quick Stats - Responsive */}
              <div className="flex items-center justify-between sm:justify-start sm:space-x-6 text-sm">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <BarChart3 className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 text-xs sm:text-sm">
                    {taskStats.total} Tasks
                  </span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 text-xs sm:text-sm">
                    {teamResearchers} Researchers
                  </span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 text-xs sm:text-sm">
                    {projectTags} Projects
                  </span>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center space-x-2 bg-slate-100 rounded-lg p-1">
                <Button
                  variant={activeView === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveView("table")}
                  className="flex items-center space-x-2 flex-1 sm:flex-none"
                >
                  <TableIcon className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Table</span>
                </Button>
                <Button
                  variant={activeView === "kanban" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveView("kanban")}
                  className="flex items-center space-x-2 flex-1 sm:flex-none"
                >
                  <Kanban className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Kanban</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area - Responsive */}
      <div className="flex-1">
        {activeView === "table" ? (
          <>
            {/* Task Statistics Dashboard - Table View */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
              <TaskStatsCards
                stats={taskStats}
                teamResearchers={teamResearchers}
                projectTags={projectTags}
                showExtendedStats={true}
              />
            </div>

            {/* Table View */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
              <TaskTable
                milestoneId={selectedMilestoneId && selectedMilestoneId !== "no-milestones" ? selectedMilestoneId : undefined}
                projectId={selectedProjectId}
                onTaskEdit={handleTaskEdit}
                onTaskView={handleTaskView}
                onTaskClick={handleTaskClick}
                onCreateTask={handleCreateTaskClick}
                isLeader={isLeader}
              />
            </div>
          </>
        ) : (
          /* Kanban View - Responsive */
          <div className="min-h-screen">
            <SharedTaskBoard
              tasks={tasksForComponents}
              onTaskUpdate={handleUpdateTask}
              onTaskClick={handleKanbanTaskClick}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {/* Task Detail Modal */}
      <TaskModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        mode="view"
        task={selectedTask ? convertTaskForComponents(selectedTask) : null}
        onUpdate={handleUpdateTask}
        selectedProjectId={selectedProjectId}
        selectedMilestoneId={selectedMilestoneId}
      />

      {/* Unified Task Modal for Create */}
      <TaskModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        mode="create"
        onCreate={handleCreateTaskSubmit}
        selectedProjectId={selectedProjectId}
        selectedMilestoneId={selectedMilestoneId}
      />

      {/* Unified Task Modal for Update */}
      <TaskModal
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
        mode="update"
        task={selectedTask ? convertTaskForComponents(selectedTask) : null}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        selectedProjectId={selectedProjectId}
        selectedMilestoneId={selectedMilestoneId}
      />
    </div>
  );
};

export default UserTaskManagement;
