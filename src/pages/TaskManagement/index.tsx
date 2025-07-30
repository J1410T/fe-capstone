import React, { useState, useMemo } from "react";
import {
  TaskTable,
  TaskDetailModal,
  SharedTaskBoard,
  TaskStatsCards,
  CreateTaskModal,
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
import { useTasksByMilestoneId } from "@/hooks/queries/task";
import { formatDate, formatDateTime } from "@/utils/date";
import { isValid, parseISO } from "date-fns";

// Import types from API
import type { ProjectTask } from "@/types/task";

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
  createdAt: string;
  updatedAt: string;
}

// Safe date formatting helper
const safeFormatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return new Date().toISOString().split("T")[0];

  try {
    const parsedDate = parseISO(dateString);
    if (isValid(parsedDate)) {
      return formatDate(dateString);
    }
  } catch {
    // Fall through to default
  }

  return new Date().toISOString().split("T")[0];
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
  return {
    id: task.id,
    title: task.name,
    description: task.description,
    status: transformTaskStatus(task.status),
    dueDate: safeFormatDate(task.endDate),
    priority: transformTaskPriority(task.priority),
    projectTag: task.code || "Task",
    projectId: "", // Will be set from context
    milestoneId: task.milestoneId,
    assignedTo: {
      id: task["member-tasks"]?.[0]?.memberId || "",
      name: task["member-tasks"]?.[0] ? "Assigned" : "None", // Handle null member-task
      avatar: "",
      email: "",
    },
    createdAt: safeFormatDateTime(task.startDate),
    updatedAt: safeFormatDateTime(task.deliveryDate),
  };
};

const transformTaskStatus = (
  status: string
): "Not Started" | "In Progress" | "Complete" | "Overdue" => {
  switch (status?.toLowerCase()) {
    case "create":
      return "Not Started"; // 'create' → Todo
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

  // Task event handlers - these handle component-compatible tasks
  const handleTaskEdit = (
    componentTask: Omit<Task, "projectId" | "milestoneId">
  ) => {
    // Find the full task from our transformed data
    const fullTask = filteredTasks.find((t: Task) => t.id === componentTask.id);
    if (fullTask) {
      setSelectedTask(fullTask);
      setIsDetailModalOpen(true);
    }
  };

  const handleTaskView = (
    componentTask: Omit<Task, "projectId" | "milestoneId">
  ) => {
    // Find the full task from our transformed data
    const fullTask = filteredTasks.find((t: Task) => t.id === componentTask.id);
    if (fullTask) {
      setSelectedTask(fullTask);
      setIsDetailModalOpen(true);
    }
  };

  const handleTaskClick = (
    componentTask: Omit<Task, "projectId" | "milestoneId">
  ) => {
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

    const updatedTask: Task = {
      ...componentUpdatedTask,
      projectId: originalTask.projectId,
      milestoneId: originalTask.milestoneId,
      updatedAt: new Date().toISOString(),
    };

    setSelectedTask(updatedTask);

    // TODO: Implement API call to update task
    toast.success("Task update not implemented yet", {
      description: "API integration for task updates is pending.",
    });
  };

  // Task delete handler
  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = filteredTasks.find((t: Task) => t.id === taskId);

    // Close modal if the deleted task was selected
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
      setIsDetailModalOpen(false);
    }

    // TODO: Implement API call to delete task
    toast.success("Task deletion not implemented yet", {
      description: `"${
        taskToDelete?.title || "Task"
      }" deletion API integration is pending.`,
    });
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
                tasks={tasksForComponents}
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
              onTaskClick={handleTaskClick}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {/* Task Detail Modal */}
      <TaskDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        task={selectedTask ? convertTaskForComponents(selectedTask) : null}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        isLeader={isLeader}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreate={handleCreateTaskSubmit}
        selectedProjectId={selectedProjectId}
        selectedMilestoneId={selectedMilestoneId}
      />
    </div>
  );
};

export default UserTaskManagement;
