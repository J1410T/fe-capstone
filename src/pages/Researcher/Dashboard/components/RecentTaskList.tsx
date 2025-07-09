import React, { useState } from "react";
import {
  TaskTable,
  TaskDetailModal,
  CreateTaskModal,
} from "@/components/tasks";
// import { useAuth } from "@/contexts/AuthContext"; // Unused import
import { toast } from "sonner";

// Task interface for TaskTable compatibility
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

// Mock task data
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Q4 Financial Report Review",
    description:
      "Review and analyze Q4 financial statements for board presentation",
    status: "Complete",
    priority: "High",
    projectTag: "Finance",
    assignedTo: {
      id: "user1",
      name: "Sarah Chen",
      avatar: "",
      email: "sarah.chen@company.com",
    },
    createdAt: "2024-01-15T10:00:00Z",
    dueDate: "2024-01-25T17:00:00Z",
    updatedAt: "2024-01-20T16:45:00Z",
  },
  {
    id: "2",
    title: "Client Onboarding Process Update",
    description:
      "Streamline the client onboarding workflow and update documentation",
    status: "In Progress",
    priority: "Medium",
    projectTag: "Operations",
    assignedTo: {
      id: "user1",
      name: "Sarah Chen",
      avatar: "",
      email: "sarah.chen@company.com",
    },
    createdAt: "2024-01-10T09:00:00Z",
    dueDate: "2024-01-30T17:00:00Z",
    updatedAt: "2024-01-16T14:30:00Z",
  },
  {
    id: "3",
    title: "Marketing Campaign Analysis",
    description: "Analyze performance metrics from recent marketing campaigns",
    status: "Overdue",
    priority: "Medium",
    projectTag: "Marketing",
    assignedTo: {
      id: "user1",
      name: "Sarah Chen",
      avatar: "",
      email: "sarah.chen@company.com",
    },
    createdAt: "2024-01-01T10:00:00Z",
    dueDate: "2024-01-15T17:00:00Z",
    updatedAt: "2024-01-08T11:20:00Z",
  },
  {
    id: "4",
    title: "Team Performance Review",
    description:
      "Conduct quarterly team performance reviews and feedback sessions",
    status: "Not Started",
    priority: "Low",
    projectTag: "HR",
    assignedTo: {
      id: "user1",
      name: "Sarah Chen",
      avatar: "",
      email: "sarah.chen@company.com",
    },
    createdAt: "2024-01-12T14:00:00Z",
    dueDate: "2024-02-01T17:00:00Z",
    updatedAt: "2024-01-12T14:00:00Z",
  },
  {
    id: "5",
    title: "Security Audit Implementation",
    description: "Implement security recommendations from the annual audit",
    status: "In Progress",
    priority: "High",
    projectTag: "Security",
    assignedTo: {
      id: "user2",
      name: "Michael Rodriguez",
      avatar: "",
      email: "michael.rodriguez@company.com",
    },
    createdAt: "2024-01-20T09:00:00Z",
    dueDate: "2024-02-15T17:00:00Z",
    updatedAt: "2024-01-25T11:30:00Z",
  },
];

export const RecentTaskList: React.FC = () => {
  // const { user } = useAuth(); // Unused variable
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Leader role context
  const isLeader = true;

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

  return (
    <div className="space-y-6">
      <TaskTable
        tasks={tasks}
        onTaskEdit={handleTaskEdit}
        onTaskView={handleTaskView}
        onTaskClick={handleTaskClick}
        onCreateTask={handleCreateTaskClick}
        isLeader={isLeader}
        title="Recent Tasks"
        description="Manage your assigned tasks and track progress"
      />

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
