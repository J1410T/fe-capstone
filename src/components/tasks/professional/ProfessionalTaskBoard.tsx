import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { SearchBar } from "./SearchBar";
import { StatusFilter } from "./StatusFilter";
import { TaskStatsBar } from "./TaskStatsBar";
import { TaskColumn } from "./TaskColumn";
import { TaskCard } from "./TaskCard";
import { TaskFormModal } from "./TaskFormModal";
import { TaskDetailDrawer } from "./TaskDetailDrawer";
import { Task, TaskStatus, CreateTaskData, UpdateTaskData } from "@/types/task";

// Professional mock data with realistic company tasks
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Q4 Financial Report Review",
    description:
      "Review and analyze Q4 financial statements for board presentation",
    status: "To Do",
    priority: "High",
    assignee: {
      id: "user1",
      name: "Sarah Chen",
      email: "sarah.chen@company.com",
      role: UserRole.MEMBER,
      avatar: "",
    },
    createdAt: "2024-01-15T10:00:00Z",
    dueDate: "2024-01-25T17:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Client Onboarding Process Update",
    description:
      "Streamline the client onboarding workflow and update documentation",
    status: "In Progress",
    priority: "Medium",
    assignee: {
      id: "user2",
      name: "Michael Rodriguez",
      email: "michael.rodriguez@company.com",
      role: UserRole.PRINCIPAL_INVESTIGATOR,
      avatar: "",
    },
    createdAt: "2024-01-10T09:00:00Z",
    dueDate: "2024-01-30T17:00:00Z",
    updatedAt: "2024-01-16T14:30:00Z",
  },
  {
    id: "3",
    title: "Security Audit Compliance",
    description:
      "Complete annual security audit and implement recommended changes",
    status: "Completed",
    priority: "High",
    assignee: {
      id: "user3",
      name: "Emily Johnson",
      email: "emily.johnson@company.com",
      role: UserRole.MEMBER,
      avatar: "",
    },
    createdAt: "2024-01-05T08:00:00Z",
    dueDate: "2024-01-20T17:00:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
  },
  {
    id: "4",
    title: "Marketing Campaign Analysis",
    description: "Analyze performance metrics from recent marketing campaigns",
    status: "Overdue",
    priority: "Medium",
    assignee: {
      id: "user1",
      name: "Sarah Chen",
      email: "sarah.chen@company.com",
      role: UserRole.MEMBER,
      avatar: "",
    },
    createdAt: "2024-01-01T10:00:00Z",
    dueDate: "2024-01-15T17:00:00Z",
    updatedAt: "2024-01-08T11:20:00Z",
  },
  {
    id: "5",
    title: "Team Performance Review",
    description:
      "Conduct quarterly team performance reviews and feedback sessions",
    status: "To Do",
    priority: "Low",
    assignee: {
      id: "user2",
      name: "Michael Rodriguez",
      email: "michael.rodriguez@company.com",
      role: UserRole.PRINCIPAL_INVESTIGATOR,
      avatar: "",
    },
    createdAt: "2024-01-12T14:00:00Z",
    dueDate: "2024-02-01T17:00:00Z",
    updatedAt: "2024-01-12T14:00:00Z",
  },
];

const mockTeamMembers = [
  {
    id: "user1",
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    role: UserRole.MEMBER,
    avatar: "",
  },
  {
    id: "user2",
    name: "Michael Rodriguez",
    email: "michael.rodriguez@company.com",
    role: UserRole.PRINCIPAL_INVESTIGATOR,
    avatar: "",
  },
  {
    id: "user3",
    name: "Emily Johnson",
    email: "emily.johnson@company.com",
    role: UserRole.MEMBER,
    avatar: "",
  },
];

const TASK_STATUSES: TaskStatus[] = [
  "To Do",
  "In Progress",
  "Completed",
  "Overdue",
];

export const ProfessionalTaskBoard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "All">("All");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Check if user can create tasks (Leaders only)
  const canCreateTask =
    user?.role === UserRole.PRINCIPAL_INVESTIGATOR ||
    user?.role === UserRole.HOST_INSTITUTION ||
    user?.role === UserRole.STAFF;

  // Filter tasks based on search and status filter
  const filteredTasks = tasks.filter((task) => {
    // Status filter
    if (statusFilter !== "All" && task.status !== statusFilter) {
      return false;
    }

    // Search filter (only in displayed tasks)
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Group tasks by status
  const tasksByStatus = TASK_STATUSES.reduce((acc, status) => {
    acc[status] = filteredTasks.filter((task) => task.status === status);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  // Calculate statistics for displayed tasks only
  const stats = {
    total: filteredTasks.length,
    toDo: tasksByStatus["To Do"].length,
    inProgress: tasksByStatus["In Progress"].length,
    completed: tasksByStatus["Completed"].length,
    overdue: tasksByStatus["Overdue"].length,
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    // Update task status
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  // Handle task click
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailDrawerOpen(true);
  };

  // Handle create task
  const handleCreateTask = async (data: CreateTaskData) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const assignee = mockTeamMembers.find(
        (member) => member.id === data.assigneeId
      );
      if (!assignee) return;

      const newTask: Task = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        status: "To Do",
        priority: data.priority,
        assignee,
        createdAt: new Date().toISOString(),
        dueDate: new Date(data.dueDate).toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setTasks((prev) => [...prev, newTask]);
      setIsCreateModalOpen(false);
      setIsLoading(false);
    }, 1000);
  };

  // Handle update task
  const handleUpdateTask = async (taskId: string, data: UpdateTaskData) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === taskId) {
            const assignee = data.assigneeId
              ? mockTeamMembers.find(
                  (member) => member.id === data.assigneeId
                ) || task.assignee
              : task.assignee;

            return {
              ...task,
              ...data,
              assignee,
              dueDate: data.dueDate
                ? new Date(data.dueDate).toISOString()
                : task.dueDate,
              updatedAt: new Date().toISOString(),
            };
          }
          return task;
        })
      );

      // Update selected task if it's the one being updated
      if (selectedTask?.id === taskId) {
        const updatedTask = tasks.find((t) => t.id === taskId);
        if (updatedTask) {
          setSelectedTask(updatedTask);
        }
      }

      setIsLoading(false);
    }, 1000);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600">Please log in to view tasks.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Search and Filter Bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search tasks in current view..."
              />
              <StatusFilter value={statusFilter} onChange={setStatusFilter} />
            </div>
            {canCreateTask && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Task
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-slate-200 flex-shrink-0">
        <div className="px-6 py-3">
          <TaskStatsBar stats={stats} />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto kanban-container">
        <div className="p-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 items-start justify-center min-w-full">
              {TASK_STATUSES.map((status) => (
                <div key={status} className="flex-shrink-0 w-80 min-w-[300px]">
                  <TaskColumn
                    status={status}
                    tasks={tasksByStatus[status]}
                    onTaskClick={handleTaskClick}
                  />
                </div>
              ))}
            </div>

            <DragOverlay>
              {activeTask ? (
                <TaskCard task={activeTask} onClick={() => {}} />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Create Task Modal */}
      <TaskFormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateTask}
        currentUser={user}
        teamMembers={mockTeamMembers}
        isLoading={isLoading}
      />

      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        open={isDetailDrawerOpen}
        onOpenChange={setIsDetailDrawerOpen}
        task={selectedTask}
        currentUser={user}
        teamMembers={mockTeamMembers}
        onUpdate={handleUpdateTask}
        isLoading={isLoading}
      />
    </div>
  );
};
