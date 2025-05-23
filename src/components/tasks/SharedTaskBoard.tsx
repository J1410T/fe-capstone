import React, { useState, useMemo } from "react";
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
import { TaskColumn, TaskCard, SearchBar, StatusFilter, TaskStatsBar } from "./professional";
import { toast } from "sonner";

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

// Map UserTaskManagement statuses to ProfessionalTaskBoard statuses
const STATUS_MAPPING = {
  "Not Started": "To Do",
  "In Progress": "In Progress", 
  "Complete": "Completed",
  "Overdue": "Overdue"
} as const;

const REVERSE_STATUS_MAPPING = {
  "To Do": "Not Started",
  "In Progress": "In Progress",
  "Completed": "Complete", 
  "Overdue": "Overdue"
} as const;

type KanbanStatus = "To Do" | "In Progress" | "Completed" | "Overdue";
const KANBAN_STATUSES: KanbanStatus[] = ["To Do", "In Progress", "Completed", "Overdue"];

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
  isLeader = true,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<KanbanStatus | "All">("All");
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Convert tasks to Kanban format
  const kanbanTasks = useMemo(() => {
    return tasks.map(task => ({
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
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
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
    }, {} as Record<KanbanStatus, any[]>);
  }, [filteredTasks]);

  // Calculate statistics for displayed tasks only
  const stats = useMemo(() => ({
    total: filteredTasks.length,
    toDo: tasksByStatus["To Do"].length,
    inProgress: tasksByStatus["In Progress"].length,
    completed: tasksByStatus["Completed"].length,
    overdue: tasksByStatus["Overdue"].length,
  }), [filteredTasks, tasksByStatus]);

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const task = kanbanTasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newKanbanStatus = over.id as KanbanStatus;
    const newStatus = REVERSE_STATUS_MAPPING[newKanbanStatus];

    // Find the original task
    const originalTask = tasks.find(task => task.id === taskId);
    if (!originalTask) return;

    // Only update if status actually changed
    if (originalTask.status === newStatus) return;

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

  // Handle task click
  const handleTaskClick = (task: any) => {
    // Convert back to original task format
    const originalTask = tasks.find(t => t.id === task.id);
    if (originalTask && onTaskClick) {
      onTaskClick(originalTask);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search and Filter Bar */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search tasks in Kanban view..."
            />
            <StatusFilter
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <TaskStatsBar stats={stats} />
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-full">
            {KANBAN_STATUSES.map((status) => (
              <TaskColumn
                key={status}
                status={status}
                tasks={tasksByStatus[status]}
                onTaskClick={handleTaskClick}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <TaskCard
                task={activeTask}
                onClick={() => {}}
                isDragging
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};
