import React, { useState } from "react";
import {
  TaskTable,
  TaskDetailModal,
  SharedTaskBoard,
  TaskStatsCards,
  CreateTaskModal,
} from "@/components/tasks";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import {
  Table as TableIcon,
  Kanban,
  Plus,
  BarChart3,
  Users,
  // Calendar, // Unused import
  Filter,
} from "lucide-react";

// Unified Task interface
interface Task {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

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
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // const [isLoading] = useState(false); // Removed unused variable
  const [activeView, setActiveView] = useState<"table" | "kanban">("table");

  // Role-based permissions (can be made dynamic based on user context)
  const isLeader = true;

  // Task event handlers
  const handleTaskEdit = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleTaskView = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleCreateTaskClick = () => {
    setIsCreateModalOpen(true);
  };

  // Task creation handler
  const handleCreateTaskSubmit = (
    newTask: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [task, ...prev]);
    setIsCreateModalOpen(false);

    // Show success toast
    toast.success("Task created successfully!", {
      description: `"${task.title}" has been added to your task list.`,
    });
  };

  // Task update handler
  const handleUpdateTask = (updatedTask: Task) => {
    const previousTask = tasks.find((task) => task.id === updatedTask.id);
    const statusChanged =
      previousTask && previousTask.status !== updatedTask.status;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === updatedTask.id
          ? { ...updatedTask, updatedAt: new Date().toISOString() }
          : task
      )
    );
    setSelectedTask(updatedTask);

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

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    notStarted: tasks.filter((t) => t.status === "Not Started").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    completed: tasks.filter((t) => t.status === "Complete").length,
    overdue: tasks.filter((t) => {
      if (t.status === "Complete") return false;
      return new Date() > new Date(t.dueDate);
    }).length,
  };

  // Get unique team members for statistics
  const teamMembers = Array.from(
    new Set(tasks.map((task) => task.assignedTo.id))
  ).length;

  // Get unique project tags
  const projectTags = Array.from(
    new Set(tasks.map((task) => task.projectTag))
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
                    className="bg-emerald-600 hover:bg-emerald -700 cursor-pointer text-white flex items-center space-x-2 w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Task</span>
                  </Button>
                </div>
              )}
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
                tasks={tasks}
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
              tasks={tasks}
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
        task={selectedTask}
        onUpdate={handleUpdateTask}
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
