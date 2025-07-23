import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, Accordion } from "@/components/ui";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Milestone, Task, PIUser } from "../shared/types";
import { calculateMilestoneProgress } from "../shared/utils";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { MilestoneCard, TaskDialog } from "./milestone";
import { ProjectTask } from "@/types/task";

interface MilestoneTabProps {
  milestones: Array<{
    id: string;
    name: string;
    description: string | null;
    deadline: string | null;
    status: string;
    tasks: ProjectTask[];
  }>;
}

const MilestoneTab: React.FC<MilestoneTabProps> = ({
  milestones: apiMilestones,
}) => {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [teamResearchers, setTeamResearchers] = useState<PIUser[]>([]);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<string>("");
  const selectedMilestoneRef = useRef<string>("");

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "unassigned",
    priority: "Medium" as "Low" | "Medium" | "High",
    dueDate: "",
  });
  const [taskDueDate, setTaskDueDate] = useState<Date | undefined>();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Check if current user is PI (can add tasks)
  const isPI = user?.role === UserRole.PRINCIPAL_INVESTIGATOR;

  // Helper functions for form management
  const resetTaskForm = (clearMilestone = true) => {
    setTaskForm({
      title: "",
      description: "",
      assignedTo: "unassigned",
      priority: "Medium",
      dueDate: "",
    });
    setTaskDueDate(undefined);
    setEditingTask(null);
    if (clearMilestone) {
      setSelectedMilestone("");
      selectedMilestoneRef.current = "";
    }
  };

  const handleTaskFormChange = (field: string, value: string) => {
    setTaskForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTaskDueDateChange = (date: Date | undefined) => {
    setTaskDueDate(date);
    if (date) {
      setTaskForm((prev) => ({
        ...prev,
        dueDate: date.toISOString().split("T")[0],
      }));
    } else {
      setTaskForm((prev) => ({ ...prev, dueDate: "" }));
    }
  };

  const loadMilestonesAndTasks = useCallback(async () => {
    try {
      // Handle case where apiMilestones might be empty or undefined
      if (!apiMilestones || apiMilestones.length === 0) {
        setMilestones([]);
        return;
      }

      // Convert API milestones to component format
      const convertedMilestones: Milestone[] = apiMilestones.map(
        (apiMilestone) => {
          // Convert ProjectTask[] to Task[]
          const convertedTasks: Task[] = (apiMilestone.tasks || []).map(
            (projectTask) => ({
              id: projectTask.id,
              title: projectTask.name,
              description: projectTask.description,
              assignedTo: undefined, // ProjectTask doesn't have direct assignee, would need member-tasks
              status:
                projectTask.status === "completed"
                  ? "Completed"
                  : projectTask.status === "in_progress"
                  ? "In Progress"
                  : "To Do",
              priority:
                projectTask.priority === "high"
                  ? "High"
                  : projectTask.priority === "medium"
                  ? "Medium"
                  : "Low",
              dueDate: projectTask.endDate,
              createdAt: projectTask.startDate,
              completedAt: projectTask.deliveryDate,
            })
          );

          return {
            id: apiMilestone.id,
            name: apiMilestone.name,
            description: apiMilestone.description || "",
            deadline: apiMilestone.deadline || "",
            status:
              apiMilestone.status === "completed"
                ? "Completed"
                : apiMilestone.status === "in_progress"
                ? "In Progress"
                : apiMilestone.status === "created"
                ? "Not Started"
                : "Not Started",
            progress: calculateMilestoneProgress(convertedTasks),
            tasks: convertedTasks,
          };
        }
      );

      setMilestones(convertedMilestones);
    } catch (error) {
      console.error("Error loading milestones:", error);
      setMilestones([]);
    }
  }, [apiMilestones]);

  useEffect(() => {
    loadMilestonesAndTasks();
    loadTeamResearchers();
  }, [loadMilestonesAndTasks]);

  const loadTeamResearchers = async () => {
    // Mock team RESEARCHERs
    const mockResearchers: PIUser[] = [
      {
        id: "1",
        name: "John Smith",
        email: "john.smith@example.com",
        role: "Normal",
        joinedAt: "2023-03-15",
      },
      {
        id: "2",
        name: "Emily Chen",
        email: "emily.chen@example.com",
        role: "Normal",
        joinedAt: "2023-04-01",
      },
      {
        id: "3",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@example.com",
        role: "Secretary",
        joinedAt: "2023-02-01",
      },
    ];
    setTeamResearchers(mockResearchers);
  };

  // Task handlers
  const handleAddTask = (milestoneId: string) => {
    if (!isPI) {
      toast.error("Only Principal Investigators can add tasks");
      return;
    }

    console.log("Adding task to milestone:", milestoneId);
    setSelectedMilestone(milestoneId);
    selectedMilestoneRef.current = milestoneId;
    resetTaskForm(false);
    setShowTaskDialog(true);
  };

  const handleCloseTaskDialog = () => {
    setShowTaskDialog(false);
    resetTaskForm();
  };

  const handleCreateTask = async () => {
    // Validate required fields
    if (!taskForm.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    if (!taskForm.description.trim()) {
      toast.error("Please enter a task description");
      return;
    }

    if (!taskDueDate) {
      toast.error("Please select a due date");
      return;
    }

    const milestoneId = selectedMilestone || selectedMilestoneRef.current;

    if (!milestoneId) {
      toast.error("No milestone selected. Please try again.");
      return;
    }

    try {
      // Simulate API call
      setTimeout(() => {
        // Create new task
        const newTask: Task = {
          id: `task_${Date.now()}`,
          title: taskForm.title.trim(),
          description: taskForm.description.trim(),
          assignedTo:
            taskForm.assignedTo === "unassigned"
              ? undefined
              : taskForm.assignedTo,
          status: "To Do",
          priority: taskForm.priority,
          dueDate: taskDueDate!.toISOString().split("T")[0],
          createdAt: new Date().toISOString(),
        };

        setMilestones((prev) =>
          prev.map((milestone) =>
            milestone.id === milestoneId
              ? {
                  ...milestone,
                  tasks: [...milestone.tasks, newTask],
                  progress: calculateMilestoneProgress([
                    ...milestone.tasks,
                    newTask,
                  ]),
                }
              : milestone
          )
        );
        toast.success("Task created successfully");

        // Reset form and close dialog
        resetTaskForm();
        setShowTaskDialog(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to save task");
    }
  };

  // Statistics calculations
  const completedMilestones = milestones.filter(
    (m) => m.status === "Completed"
  ).length;
  const inProgressMilestones = milestones.filter(
    (m) => m.status === "In Progress"
  ).length;
  const notStartedMilestones = milestones.filter(
    (m) => m.status === "Not Started"
  ).length;
  const totalTasks = milestones.reduce((total, m) => total + m.tasks.length, 0);

  return (
    <Card>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Project Milestones
            </h2>
            <p className="text-gray-600 mt-1">
              View project milestones and task progress
              {isPI && " - You can add tasks as Principal Investigator"}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Statistics Cards */}
          <div className="lg:col-span-1">
            <div className="space-y-3">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xl font-bold text-green-800">
                      {completedMilestones}
                    </p>
                    <p className="text-sm text-green-700">Completed</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xl font-bold text-blue-800">
                      {inProgressMilestones}
                    </p>
                    <p className="text-sm text-blue-700">In Progress</p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-xl font-bold text-orange-800">
                      {notStartedMilestones}
                    </p>
                    <p className="text-sm text-orange-700">Not Started</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xl font-bold text-gray-800">
                      {totalTasks}
                    </p>
                    <p className="text-sm text-gray-700">Total Tasks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Milestones List */}
          <div className="lg:col-span-3">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {milestones.map((milestone) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  onAddTask={isPI ? handleAddTask : undefined}
                />
              ))}
            </Accordion>

            {milestones.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No milestones found for this project.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Dialog */}
      <TaskDialog
        isOpen={showTaskDialog}
        onClose={handleCloseTaskDialog}
        onSave={handleCreateTask}
        isLoading={false}
        editingTask={editingTask}
        form={taskForm}
        onFormChange={handleTaskFormChange}
        dueDate={taskDueDate}
        onDueDateChange={handleTaskDueDateChange}
        teamResearchers={teamResearchers}
      />
    </Card>
  );
};

export default MilestoneTab;
