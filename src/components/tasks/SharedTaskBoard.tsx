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
import { TaskColumn, TaskCard } from "./professional";
import { toast } from "sonner";
import { Task as ProfessionalTask } from "@/types/task";
import { UserRole } from "@/contexts/AuthContext";

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

interface KanbanTask extends Omit<Task, "status"> {
  assignee: Task["assignedTo"];
  status: KanbanStatus;
}

const convertToProfessionalTask = (task: KanbanTask): ProfessionalTask => ({
  id: task.id,
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  assignee: {
    ...task.assignee,
    role: UserRole.RESEARCHER,
  },
  createdAt: task.createdAt,
  dueDate: task.dueDate,
  updatedAt: task.updatedAt,
  projectId: task.projectTag,
});

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
}

export const SharedTaskBoard: React.FC<SharedTaskBoardProps> = ({
  tasks,
  onTaskUpdate,
  onTaskClick,
}) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    })
  );

  const kanbanTasks = useMemo(() => {
    return tasks.map((task) => ({
      ...task,
      assignee: task.assignedTo,
      status: STATUS_MAPPING[task.status] as KanbanStatus,
    }));
  }, [tasks]);

  const tasksByStatus = useMemo(() => {
    return KANBAN_STATUSES.reduce((acc, status) => {
      acc[status] = kanbanTasks.filter((task) => task.status === status);
      return acc;
    }, {} as Record<KanbanStatus, KanbanTask[]>);
  }, [kanbanTasks]);

  const stats = useMemo(
    () => ({
      total: kanbanTasks.length,
      toDo: tasksByStatus["To Do"].length,
      inProgress: tasksByStatus["In Progress"].length,
      completed: tasksByStatus["Completed"].length,
      overdue: tasksByStatus["Overdue"].length,
    }),
    [kanbanTasks, tasksByStatus]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = kanbanTasks.find((t) => t.id === event.active.id);
    if (task) {
      const convertedTask = {
        ...task,
        assignee: task.assignedTo,
        status:
          REVERSE_STATUS_MAPPING[task.status as KanbanStatus] || task.status,
      };
      setActiveTask(convertedTask);
    } else {
      setActiveTask(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskId = active.id as string;
    const dropTargetId = over.id as string;

    let newKanbanStatus: KanbanStatus;

    if (KANBAN_STATUSES.includes(dropTargetId as KanbanStatus)) {
      newKanbanStatus = dropTargetId as KanbanStatus;
    } else {
      const targetTask = kanbanTasks.find((t) => t.id === dropTargetId);
      if (targetTask) {
        newKanbanStatus = targetTask.status;
      } else {
        toast.error("Invalid drop target");
        return;
      }
    }

    const newStatus = REVERSE_STATUS_MAPPING[newKanbanStatus];
    const originalTask = tasks.find((task) => task.id === taskId);
    if (!originalTask || originalTask.status === newStatus || !newStatus)
      return;

    const updatedTask: Task = {
      ...originalTask,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    onTaskUpdate(updatedTask);

    toast.success("Task status updated!", {
      description: `"${updatedTask.title}" moved to ${newStatus}.`,
    });
  };

  return (
    <div className="min-h-full bg-slate-50">
      {/* Stats Bar */}
      <div className="bg-white border-b border-slate-200 py-4">
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

      {/* Kanban Columns */}
      <div className="p-2 sm:p-4 lg:overflow-x-auto flex justify-center">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:gap-4 gap-3 lg:items-start max-w-7xl w-full pb-4">
            {KANBAN_STATUSES.map((status) => (
              <div key={status} className="w-full lg:w-80 lg:min-w-[320px]">
                <TaskColumn
                  status={status}
                  tasks={tasksByStatus[status].map(convertToProfessionalTask)}
                  onTaskClick={(task) => {
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
            {activeTask && (
              <div className="transform rotate-3 scale-105 opacity-95">
                <TaskCard
                  task={{
                    ...activeTask,
                    assignee: {
                      ...activeTask.assignedTo,
                      role: UserRole.RESEARCHER,
                    },
                    status: STATUS_MAPPING[activeTask.status] as KanbanStatus,
                  }}
                  onClick={() => {}}
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};
