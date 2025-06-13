import React, { useState, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { TaskColumn, TaskCard, SearchBar, StatusFilter } from "./professional";
import { toast } from "sonner";
import { Task as ProfessionalTask } from "@/types/task";
import { UserRole } from "@/contexts/AuthContext";

// Unified Task interface that matches UserTaskManagement
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

// Kanban task interface for internal use
interface KanbanTask extends Omit<Task, "status"> {
  assignee: Task["assignedTo"];
  status: KanbanStatus;
}

// Convert UserTaskManagement task to Professional task format
const convertToProfessionalTask = (task: KanbanTask): ProfessionalTask => {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assignee: {
      ...task.assignee,
      role: UserRole.MEMBER, // Default role for compatibility
    },
    createdAt: task.createdAt,
    dueDate: task.dueDate,
    updatedAt: task.updatedAt,
    projectId: task.projectTag, // Map projectTag to projectId
  };
};

// Map UserTaskManagement statuses to ProfessionalTaskBoard statuses
const STATUS_MAPPING = {
  "Not Started": "To Do",
  "In Progress": "In Progress",
  Complete: "Completed",
  Overdue: "Overdue",
} as const;

const REVERSE_STATUS_MAPPING = {
  "To Do": "Not Started",
  "In Progress": "In Progress",
  Completed: "Complete",
  Overdue: "Overdue",
} as const;

type KanbanStatus = "To Do" | "In Progress" | "Completed" | "Overdue";
const KANBAN_STATUSES: KanbanStatus[] = [
  "To Do",
  "In Progress",
  "Completed",
  "Overdue",
];

interface SharedTaskBoardProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  onTaskClick?: (task: Task) => void;
  isLeader?: boolean;
}

export const SharedTaskBoard: React.FC<SharedTaskBoardProps> = ({
  tasks,
  onTaskUpdate,
  onTaskClick,
  // isLeader = true, // Unused parameter
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<KanbanStatus | "All">("All");
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );

  // Convert tasks to Kanban format
  const kanbanTasks = useMemo(() => {
    return tasks.map((task) => ({
      ...task,
      // Map the assignedTo to assignee for compatibility
      assignee: task.assignedTo,
      // Map status to Kanban status
      status: STATUS_MAPPING[task.status] as KanbanStatus,
    }));
  }, [tasks]);

  // Filter tasks based on search and status filter
  const filteredTasks = useMemo(() => {
    return kanbanTasks.filter((task) => {
      // Status filter
      if (statusFilter !== "All" && task.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (
        searchQuery &&
        !task.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [kanbanTasks, statusFilter, searchQuery]);

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    return KANBAN_STATUSES.reduce((acc, status) => {
      acc[status] = filteredTasks.filter((task) => task.status === status);
      return acc;
    }, {} as Record<KanbanStatus, KanbanTask[]>);
  }, [filteredTasks]);

  // Calculate statistics for displayed tasks only
  const stats = useMemo(
    () => ({
      total: filteredTasks.length,
      toDo: tasksByStatus["To Do"].length,
      inProgress: tasksByStatus["In Progress"].length,
      completed: tasksByStatus["Completed"].length,
      overdue: tasksByStatus["Overdue"].length,
    }),
    [filteredTasks, tasksByStatus]
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const task = kanbanTasks.find((t) => t.id === event.active.id);
    // Convert task status to match expected format
    if (task) {
      const convertedTask = {
        ...task,
        assignee: task.assignedTo, // Add assignee property
        status:
          REVERSE_STATUS_MAPPING[task.status as KanbanStatus] || task.status,
      };
      setActiveTask(convertedTask);
    } else {
      setActiveTask(null);
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) {
      return;
    }

    const taskId = active.id as string;
    const dropTargetId = over.id as string;

    // Check if we're dropping on a column (status) or a task
    let newKanbanStatus: KanbanStatus;

    // If dropping on a column directly
    if (KANBAN_STATUSES.includes(dropTargetId as KanbanStatus)) {
      newKanbanStatus = dropTargetId as KanbanStatus;
    }
    // If dropping on a task, get the task's column
    else {
      // Find which column this task belongs to
      const targetTask = kanbanTasks.find((t) => t.id === dropTargetId);
      if (targetTask) {
        newKanbanStatus = targetTask.status;
      } else {
        toast.error("Invalid drop target");
        return;
      }
    }

    const newStatus = REVERSE_STATUS_MAPPING[newKanbanStatus];

    // Find the original task
    const originalTask = tasks.find((task) => task.id === taskId);
    if (!originalTask) {
      return;
    }

    // Only update if status actually changed
    if (originalTask.status === newStatus) {
      return;
    }

    // Validate the new status
    if (!newStatus) {
      toast.error("Invalid status update", {
        description: `Cannot move task to ${newKanbanStatus}`,
      });
      return;
    }

    // Update task status
    const updatedTask: Task = {
      ...originalTask,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    onTaskUpdate(updatedTask);

    // Show toast notification
    toast.success("Task status updated!", {
      description: `"${updatedTask.title}" moved to ${newStatus}.`,
    });
  };

  return (
    <div className="min-h-full bg-slate-50">
      {/* Search and Filter Bar - Mobile Responsive */}
      <div className="bg-white border-b border-slate-200 py-3 sm:py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search tasks..."
              />
            </div>
            <div className="w-full sm:w-auto">
              <StatusFilter value={statusFilter} onChange={setStatusFilter} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar - Aligned with Header */}
      <div className="bg-white border-b border-slate-200 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-slate-700">Total:</span>
              <span className="font-semibold text-slate-900">
                {stats.total}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-blue-700">To Do:</span>
              <span className="font-semibold text-blue-900">{stats.toDo}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-yellow-700">In Progress:</span>
              <span className="font-semibold text-yellow-900">
                {stats.inProgress}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-green-700">Completed:</span>
              <span className="font-semibold text-green-900">
                {stats.completed}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-red-700">Overdue:</span>
              <span className="font-semibold text-red-900">
                {stats.overdue}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-slate-700">Progress:</span>
              <span className="font-semibold text-slate-900">
                {stats.total > 0
                  ? Math.round((stats.completed / stats.total) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board - Responsive with Column Wrapping */}
      <div className="p-2 sm:p-4 lg:overflow-x-auto kanban-container">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Responsive Grid: Mobile(1col) -> Tablet(2col) -> Desktop(4col flex) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:gap-4 gap-3 lg:items-start lg:min-w-max pb-4">
            {KANBAN_STATUSES.map((status) => (
              <div
                key={status}
                className="w-full lg:flex-shrink-0 lg:w-80 lg:min-w-[320px] kanban-column"
              >
                <TaskColumn
                  status={status}
                  tasks={tasksByStatus[status].map(convertToProfessionalTask)}
                  onTaskClick={(task) => {
                    // Convert back to original task format
                    const originalTask = tasks.find((t) => t.id === task.id);
                    if (originalTask && onTaskClick) {
                      onTaskClick(originalTask);
                    }
                  }}
                />
              </div>
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="transform rotate-3 scale-105 opacity-95">
                <TaskCard
                  task={{
                    ...activeTask,
                    assignee: {
                      ...activeTask.assignedTo,
                      role: UserRole.MEMBER,
                    },
                    status: STATUS_MAPPING[activeTask.status] as KanbanStatus,
                  }}
                  onClick={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};
