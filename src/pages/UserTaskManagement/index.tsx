/**
 * UserTaskManagement Component
 *
 * A unified task management interface that merges functionality from:
 * - MemberTasks (Kanban board view)
 * - TaskManagement (Table view)
 *
 * Features:
 * - Dual view modes: Table and Kanban
 * - Comprehensive task CRUD operations
 * - Advanced filtering and search
 * - Real-time statistics dashboard
 * - Role-based permissions
 * - Toast notifications for user feedback
 * - Responsive design with ShadCN UI components
 *
 * Route: /member/tasks
 */

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

  // Quick status change handler with loading state
  // const handleQuickStatusChange = async ( // Unused function
  //   taskId: string,
  //   newStatus: Task["status"]
  // ) => {
  //   setIsLoading(true);

  //   // Simulate API call
  //   setTimeout(() => {
  //     const updatedTask = tasks.find((task) => task.id === taskId);
  //     if (updatedTask) {
  //       const updated = {
  //         ...updatedTask,
  //         status: newStatus,
  //         updatedAt: new Date().toISOString(),
  //       };
  //       handleUpdateTask(updated);
  //     }
  //     setIsLoading(false);
  //   }, 500);
  // };

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
      {/* Fixed Header - Always Visible */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                Task Management
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Organize, track, and manage your team's work with powerful tools
              </p>
            </div>

            {/* Header Statistics and Controls */}
            <div className="flex items-center space-x-6">
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">
                    {taskStats.total} Tasks
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{teamMembers} Members</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{projectTags} Projects</span>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={activeView === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveView("table")}
                  className="flex items-center space-x-2"
                >
                  <TableIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Table</span>
                </Button>
                <Button
                  variant={activeView === "kanban" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveView("kanban")}
                  className="flex items-center space-x-2"
                >
                  <Kanban className="w-4 h-4" />
                  <span className="hidden sm:inline">Kanban</span>
                </Button>
              </div>

              {/* Create Task Button */}
              {isLeader && (
                <Button
                  onClick={handleCreateTaskClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Task</span>
                </Button>
              )}

              {/* Live Status */}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area with Top Margin for Fixed Header */}
      <div className="pt-[140px]">
        {activeView === "table" ? (
          <>
            {/* Task Statistics Dashboard - Table View */}
            <div className="max-w-7xl mx-auto px-6 py-4">
              <TaskStatsCards
                stats={taskStats}
                teamMembers={teamMembers}
                projectTags={projectTags}
                showExtendedStats={true}
              />
            </div>

            {/* Table View */}
            <div className="max-w-7xl mx-auto px-6 pb-6">
              <TaskTable
                tasks={tasks}
                onTaskEdit={handleTaskEdit}
                onTaskView={handleTaskView}
                onTaskClick={handleTaskClick}
                onCreateTask={handleCreateTaskClick}
                isLeader={isLeader}
                title="Task Management"
                description="Manage and track all project tasks with advanced filtering and sorting"
              />
            </div>
          </>
        ) : (
          /* Kanban View - Full Screen with Custom Stats */
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
