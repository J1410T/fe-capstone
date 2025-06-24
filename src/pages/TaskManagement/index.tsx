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

// Project and Milestone interfaces
interface Project {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Completed" | "On Hold";
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  projectId: string;
  deadline: string;
  status: "Not Started" | "In Progress" | "Completed" | "Overdue";
}

// Unified Task interface
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

// Mock data for projects
const mockProjects: Project[] = [
  {
    id: "1",
    name: "Machine Learning Research",
    description: "AI algorithms for medical diagnosis",
    status: "Active",
  },
  {
    id: "2",
    name: "Web Application Development",
    description: "Full-stack web application project",
    status: "Active",
  },
  {
    id: "3",
    name: "Data Analytics Platform",
    description: "Business intelligence and analytics",
    status: "Active",
  },
  {
    id: "4",
    name: "New Project Setup",
    description: "Project in planning phase with no milestones yet",
    status: "Active",
  },
];

// Mock data for milestones
const mockMilestones: Milestone[] = [
  {
    id: "1",
    name: "Phase 1: Research & Planning",
    description: "Initial research and project planning",
    projectId: "1",
    deadline: "2024-03-31",
    status: "Completed",
  },
  {
    id: "2",
    name: "Phase 2: Development",
    description: "Core development phase",
    projectId: "1",
    deadline: "2024-06-30",
    status: "In Progress",
  },
  {
    id: "3",
    name: "Phase 3: Testing",
    description: "Testing and quality assurance",
    projectId: "1",
    deadline: "2024-09-30",
    status: "Not Started",
  },
  {
    id: "4",
    name: "Frontend Development",
    description: "User interface development",
    projectId: "2",
    deadline: "2024-04-30",
    status: "In Progress",
  },
  {
    id: "5",
    name: "Backend Development",
    description: "Server-side development",
    projectId: "2",
    deadline: "2024-05-31",
    status: "Not Started",
  },
  {
    id: "6",
    name: "Data Collection",
    description: "Gathering and preparing data",
    projectId: "3",
    deadline: "2024-07-31",
    status: "In Progress",
  },
];

// Enhanced mock data with more variety
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Implement User Authentication",
    description:
      "Set up JWT-based authentication system with login/logout functionality",
    status: "In Progress",
    dueDate: "2024-02-15T17:00:00Z",
    priority: "High",
    projectTag: "Backend API",
    projectId: "1",
    milestoneId: "2",
    assignedTo: {
      id: "user1",
      name: "Sarah Chen",
      avatar: "",
      email: "sarah.chen@company.com",
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "2",
    title: "Design Dashboard UI",
    description: "Create responsive dashboard layout with charts and widgets",
    status: "Complete",
    dueDate: "2024-01-30T17:00:00Z",
    priority: "Medium",
    projectTag: "Frontend",
    projectId: "2",
    milestoneId: "4",
    assignedTo: {
      id: "user2",
      name: "Michael Rodriguez",
      avatar: "",
      email: "michael.rodriguez@company.com",
    },
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-28T16:45:00Z",
  },
  {
    id: "3",
    title: "Database Migration",
    description: "Migrate legacy database to new PostgreSQL instance",
    status: "Overdue",
    dueDate: "2024-01-20T17:00:00Z",
    priority: "High",
    projectTag: "Database",
    projectId: "3",
    milestoneId: "6",
    assignedTo: {
      id: "user3",
      name: "Emily Johnson",
      avatar: "",
      email: "emily.johnson@company.com",
    },
    createdAt: "2024-01-05T08:00:00Z",
    updatedAt: "2024-01-18T11:20:00Z",
  },
  {
    id: "4",
    title: "API Documentation",
    description: "Write comprehensive API documentation using OpenAPI/Swagger",
    status: "Not Started",
    dueDate: "2024-02-20T17:00:00Z",
    priority: "Low",
    projectTag: "Documentation",
    projectId: "1",
    milestoneId: "3",
    assignedTo: {
      id: "user1",
      name: "Sarah Chen",
      avatar: "",
      email: "sarah.chen@company.com",
    },
    createdAt: "2024-01-12T14:00:00Z",
    updatedAt: "2024-01-12T14:00:00Z",
  },
  {
    id: "5",
    title: "Performance Optimization",
    description: "Optimize application performance and reduce load times",
    status: "In Progress",
    dueDate: "2024-02-10T17:00:00Z",
    priority: "Medium",
    projectTag: "Performance",
    projectId: "2",
    milestoneId: "5",
    assignedTo: {
      id: "user2",
      name: "Michael Rodriguez",
      avatar: "",
      email: "michael.rodriguez@company.com",
    },
    createdAt: "2024-01-18T11:30:00Z",
    updatedAt: "2024-01-25T09:15:00Z",
  },
  {
    id: "6",
    title: "Mobile App Testing",
    description:
      "Comprehensive testing of mobile application across different devices",
    status: "Not Started",
    dueDate: "2024-02-25T17:00:00Z",
    priority: "Medium",
    projectTag: "Mobile",
    projectId: "2",
    milestoneId: "4",
    assignedTo: {
      id: "user4",
      name: "David Kim",
      avatar: "",
      email: "david.kim@company.com",
    },
    createdAt: "2024-01-20T11:00:00Z",
    updatedAt: "2024-01-20T11:00:00Z",
  },
];

const UserTaskManagement: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<"table" | "kanban">("table");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    mockProjects[0]?.id || ""
  );
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(() => {
    const firstProject = mockProjects[0];
    if (firstProject) {
      const firstMilestone = mockMilestones.find(
        (m) => m.projectId === firstProject.id
      );
      return firstMilestone?.id || "no-milestones";
    }
    return "no-milestones";
  });
  // Add a refresh trigger to force re-render when tasks change
  const [, forceUpdate] = useState(0);
  const triggerRefresh = () => forceUpdate((prev) => prev + 1);

  // Role-based permissions (can be made dynamic based on user context)
  const isLeader = true;

  // Filter milestones based on selected project
  const filteredMilestones = useMemo(() => {
    if (!selectedProjectId) return [];
    return mockMilestones.filter(
      (milestone) => milestone.projectId === selectedProjectId
    );
  }, [selectedProjectId]);

  // Filter tasks based on selected project and milestone
  const getFilteredTasks = () => {
    let filtered = mockTasks;

    if (selectedProjectId) {
      filtered = filtered.filter(
        (task) => task.projectId === selectedProjectId
      );
    }

    if (selectedMilestoneId && selectedMilestoneId !== "no-milestones") {
      filtered = filtered.filter(
        (task) => task.milestoneId === selectedMilestoneId
      );
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

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
    // Find the full task from our mock data
    const fullTask = mockTasks.find((t: Task) => t.id === componentTask.id);
    if (fullTask) {
      setSelectedTask(fullTask);
      setIsDetailModalOpen(true);
    }
  };

  const handleTaskView = (
    componentTask: Omit<Task, "projectId" | "milestoneId">
  ) => {
    // Find the full task from our mock data
    const fullTask = mockTasks.find((t: Task) => t.id === componentTask.id);
    if (fullTask) {
      setSelectedTask(fullTask);
      setIsDetailModalOpen(true);
    }
  };

  const handleTaskClick = (
    componentTask: Omit<Task, "projectId" | "milestoneId">
  ) => {
    // Find the full task from our mock data
    const fullTask = mockTasks.find((t: Task) => t.id === componentTask.id);
    if (fullTask) {
      setSelectedTask(fullTask);
      setIsDetailModalOpen(true);
    }
  };

  const handleCreateTaskClick = () => {
    setIsCreateModalOpen(true);
  };

  // Task creation handler
  const handleCreateTaskSubmit = (
    newTask: Omit<
      Task,
      "id" | "createdAt" | "updatedAt" | "projectId" | "milestoneId"
    >
  ) => {
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

    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      projectId: selectedProjectId,
      milestoneId: selectedMilestoneId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to the original mock data
    mockTasks.unshift(task);
    setIsCreateModalOpen(false);

    // Trigger refresh to update filtered tasks
    triggerRefresh();

    // Show success toast
    toast.success("Task created successfully!", {
      description: `"${task.title}" has been added to your task list.`,
    });
  };

  // Task update handler - handles component-compatible tasks
  const handleUpdateTask = (
    componentUpdatedTask: Omit<Task, "projectId" | "milestoneId">
  ) => {
    // Find the original task to preserve projectId and milestoneId
    const originalTask = mockTasks.find(
      (task: Task) => task.id === componentUpdatedTask.id
    );
    if (!originalTask) return;

    const updatedTask: Task = {
      ...componentUpdatedTask,
      projectId: originalTask.projectId,
      milestoneId: originalTask.milestoneId,
      updatedAt: new Date().toISOString(),
    };

    const previousTask = mockTasks.find(
      (task: Task) => task.id === updatedTask.id
    );
    const statusChanged =
      previousTask && previousTask.status !== updatedTask.status;

    // Update the original mock data
    const taskIndex = mockTasks.findIndex((t: Task) => t.id === updatedTask.id);
    if (taskIndex !== -1) {
      mockTasks[taskIndex] = updatedTask;
    }

    setSelectedTask(updatedTask);

    // Trigger refresh to update filtered tasks
    triggerRefresh();

    // Show appropriate toast based on what changed
    if (statusChanged) {
      toast.success("Task status updated!", {
        description: `"${updatedTask.title}" status changed to ${updatedTask.status}.`,
      });
    } else {
      toast.success("Task updated successfully!", {
        description: `"${updatedTask.title}" has been updated.`,
      });
    }
  };

  // Task delete handler
  const handleDeleteTask = (taskId: string) => {
    // Remove from mock data
    const taskIndex = mockTasks.findIndex((t: Task) => t.id === taskId);
    const taskToDelete = mockTasks[taskIndex];

    if (taskIndex !== -1) {
      mockTasks.splice(taskIndex, 1);
    }

    // Close modal if the deleted task was selected
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
      setIsDetailModalOpen(false);
    }

    // Trigger refresh to update filtered tasks
    triggerRefresh();

    // Show success toast
    toast.success("Task deleted successfully!", {
      description: `"${
        taskToDelete?.title || "Task"
      }" has been removed from your task list.`,
    });
  };

  // Calculate task statistics
  const taskStats = {
    total: filteredTasks.length,
    notStarted: filteredTasks.filter((t: Task) => t.status === "Not Started")
      .length,
    inProgress: filteredTasks.filter((t: Task) => t.status === "In Progress")
      .length,
    completed: filteredTasks.filter((t: Task) => t.status === "Complete")
      .length,
    overdue: filteredTasks.filter((t: Task) => {
      if (t.status === "Complete") return false;
      return new Date() > new Date(t.dueDate);
    }).length,
  };

  // Get unique team members for statistics
  const teamMembers = Array.from(
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
                    // Reset milestone to first milestone of selected project
                    const firstMilestone = mockMilestones.find(
                      (m) => m.projectId === value
                    );
                    setSelectedMilestoneId(
                      firstMilestone?.id || "no-milestones"
                    );
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a project..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
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
                  disabled={
                    !selectedProjectId || filteredMilestones.length === 0
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        !selectedProjectId
                          ? "Select a project first..."
                          : filteredMilestones.length === 0
                          ? "None - No milestones available"
                          : "Choose a milestone..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredMilestones.length === 0 ? (
                      <SelectItem value="no-milestones" disabled>
                        No milestones available
                      </SelectItem>
                    ) : (
                      filteredMilestones.map((milestone) => (
                        <SelectItem key={milestone.id} value={milestone.id}>
                          {milestone.name}
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
                    {teamMembers} Members
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
                teamMembers={teamMembers}
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
              isLeader={isLeader}
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
      />
    </div>
  );
};

export default UserTaskManagement;
