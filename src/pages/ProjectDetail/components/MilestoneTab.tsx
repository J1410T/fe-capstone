import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Card, Accordion } from "@/components/ui";
import { Plus, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Milestone, Task, PIUser } from "../shared/types";
import { calculateMilestoneProgress } from "@/shared/utils";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { MilestoneCard, MilestoneDialog, TaskDialog } from "./milestone";
=======
import { StatusBadge } from "../shared/components";
import { formatDate } from "@/shared/utils/helpers";
import { calculateMilestoneProgress } from "../shared/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card } from "@/components/ui";
import { DatePicker } from "@/components/ui/date-picker";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
>>>>>>> main-backup

const MilestoneTab: React.FC = () => {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [teamMembers, setTeamMembers] = useState<PIUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<string>("");

  // Use ref as backup to ensure milestone ID doesn't get lost
  const selectedMilestoneRef = useRef<string>("");

  const [milestoneForm, setMilestoneForm] = useState({
    name: "",
    description: "",
    deadline: "",
  });
  const [milestoneDeadlineDate, setMilestoneDeadlineDate] = useState<
    Date | undefined
  >();

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "unassigned",
    priority: "Medium" as "Low" | "Medium" | "High",
    dueDate: "",
  });
  const [taskDueDate, setTaskDueDate] = useState<Date | undefined>();

  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(
    null
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Check if current user is the project leader
  const isCurrentUserLeader =
    user?.role === UserRole.PRINCIPAL_INVESTIGATOR ||
    user?.role === UserRole.STAFF;

  // Helper functions for form management
  const resetMilestoneForm = () => {
    setMilestoneForm({ name: "", description: "", deadline: "" });
    setMilestoneDeadlineDate(undefined);
    setEditingMilestone(null);
  };

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

  const handleMilestoneFormChange = (field: string, value: string) => {
    setMilestoneForm((prev) => ({ ...prev, [field]: value }));
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
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const mockMilestones: Milestone[] = [
          {
            id: "1",
            name: "Literature Review",
            description:
              "Complete comprehensive literature review on machine learning applications",
            deadline: "2024-03-31",
            status: "Completed",
            progress: 100,
            tasks: [
              {
                id: "1",
                title: "Research paper collection",
                description:
                  "Collect relevant research papers from the last 5 years",
                assignedTo: "john.smith@example.com",
                status: "Completed",
                priority: "High",
                dueDate: "2024-03-15",
                createdAt: "2024-01-15T00:00:00Z",
                completedAt: "2024-03-14T00:00:00Z",
                evaluatedBy: user?.email,
                evaluation: "Excellent work on comprehensive paper collection",
              },
              {
                id: "2",
                title: "Literature analysis",
                description:
                  "Analyze and summarize key findings from collected papers",
                assignedTo: "emily.chen@example.com",
                status: "Completed",
                priority: "High",
                dueDate: "2024-03-30",
                createdAt: "2024-03-16T00:00:00Z",
                completedAt: "2024-03-28T00:00:00Z",
              },
            ],
          },
          {
            id: "2",
            name: "Data Collection",
            description:
              "Gather and prepare datasets for machine learning experiments",
            deadline: "2024-06-30",
            status: "In Progress",
            progress: 60,
            tasks: [
              {
                id: "3",
                title: "Dataset identification",
                description: "Identify suitable datasets for the research",
                assignedTo: "john.smith@example.com",
                status: "Completed",
                priority: "High",
                dueDate: "2024-05-15",
                createdAt: "2024-04-01T00:00:00Z",
                completedAt: "2024-05-10T00:00:00Z",
              },
              {
                id: "4",
                title: "Data preprocessing",
                description: "Clean and preprocess the collected datasets",
                assignedTo: "emily.chen@example.com",
                status: "In Progress",
                priority: "Medium",
                dueDate: "2024-06-15",
                createdAt: "2024-05-16T00:00:00Z",
              },
              {
                id: "5",
                title: "Data validation",
                description: "Validate data quality and completeness",
                status: "To Do",
                priority: "Medium",
                dueDate: "2024-06-25",
                createdAt: "2024-05-16T00:00:00Z",
              },
            ],
          },
          {
            id: "3",
            name: "Algorithm Development",
            description: "Develop and test machine learning algorithms",
            deadline: "2024-09-30",
            status: "Completed",
            progress: 100,
            tasks: [
              {
                id: "1",
                title: "Research paper collection",
                description:
                  "Collect relevant research papers from the last 5 years",
                assignedTo: "john.smith@example.com",
                status: "Completed",
                priority: "High",
                dueDate: "2024-03-15",
                createdAt: "2024-01-15T00:00:00Z",
                completedAt: "2024-03-14T00:00:00Z",
                evaluatedBy: user?.email,
                evaluation: "Excellent work on comprehensive paper collection",
              },
              {
                id: "2",
                title: "Literature analysis",
                description:
                  "Analyze and summarize key findings from collected papers",
                assignedTo: "emily.chen@example.com",
                status: "Completed",
                priority: "High",
                dueDate: "2024-03-30",
                createdAt: "2024-03-16T00:00:00Z",
                completedAt: "2024-03-28T00:00:00Z",
              },
            ],
          },
        ];

        // Calculate progress for each milestone
        const milestonesWithProgress = mockMilestones.map((milestone) => ({
          ...milestone,
          progress: calculateMilestoneProgress(milestone.tasks),
        }));

        setMilestones(milestonesWithProgress);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading milestones:", error);
      setIsLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    loadMilestonesAndTasks();
    loadTeamMembers();
  }, [loadMilestonesAndTasks]);

  const loadTeamMembers = async () => {
    // Mock team members
    const mockMembers: PIUser[] = [
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
    setTeamMembers(mockMembers);
  };

  // Milestone handlers
  const handleAddMilestone = () => {
    resetMilestoneForm();
    setShowMilestoneDialog(true);
  };

  const handleEditMilestone = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setMilestoneForm({
      name: milestone.name,
      description: milestone.description,
      deadline: milestone.deadline,
    });
    setMilestoneDeadlineDate(new Date(milestone.deadline));
    setShowMilestoneDialog(true);
  };

  const handleCloseMilestoneDialog = () => {
    setShowMilestoneDialog(false);
    resetMilestoneForm();
  };

  const handleCreateMilestone = async () => {
    if (
      !milestoneForm.name ||
      !milestoneForm.description ||
      !milestoneDeadlineDate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        if (editingMilestone) {
          // Update existing milestone
          setMilestones((prev) =>
            prev.map((m) =>
              m.id === editingMilestone.id
                ? {
                    ...m,
                    name: milestoneForm.name,
                    description: milestoneForm.description,
                    deadline: milestoneDeadlineDate!
                      .toISOString()
                      .split("T")[0],
                  }
                : m
            )
          );
          toast.success("Milestone updated successfully");
        } else {
          // Create new milestone
          const newMilestone: Milestone = {
            id: `milestone_${Date.now()}`,
            name: milestoneForm.name,
            description: milestoneForm.description,
            deadline: milestoneDeadlineDate!.toISOString().split("T")[0],
            status: "Not Started",
            progress: 0,
            tasks: [],
          };

          setMilestones((prev) => [...prev, newMilestone]);
          toast.success("Milestone created successfully");
        }

        setMilestoneForm({ name: "", description: "", deadline: "" });
        setMilestoneDeadlineDate(undefined);
        setEditingMilestone(null);
        setShowMilestoneDialog(false);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving milestone:", error);
      toast.error("Failed to save milestone");
      setIsLoading(false);
    }
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    try {
      setMilestones((prev) => prev.filter((m) => m.id !== milestoneId));
      toast.success("Milestone deleted successfully");
    } catch {
      toast.error("Failed to delete milestone");
    }
  };

  // Task handlers
  const handleAddTask = (milestoneId: string) => {
    console.log("Adding task to milestone:", milestoneId);
    setSelectedMilestone(milestoneId);
    selectedMilestoneRef.current = milestoneId; // Store in ref as backup
    resetTaskForm(false); // Don't clear the milestone when adding a new task
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

    // Use ref as fallback if state is lost
    const milestoneId = selectedMilestone || selectedMilestoneRef.current;

    if (!milestoneId) {
      console.error(
        "No milestone selected. State:",
        selectedMilestone,
        "Ref:",
        selectedMilestoneRef.current
      );
      toast.error("No milestone selected. Please try again.");
      return;
    }

    console.log("Creating task for milestone:", milestoneId);

    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        if (editingTask) {
          // Update existing task
          setMilestones((prev) =>
            prev.map((milestone) =>
              milestone.id === milestoneId
                ? {
                    ...milestone,
                    tasks: milestone.tasks.map((task) =>
                      task.id === editingTask.id
                        ? {
                            ...task,
                            title: taskForm.title,
                            description: taskForm.description,
                            assignedTo:
                              taskForm.assignedTo === "unassigned"
                                ? undefined
                                : taskForm.assignedTo,
                            priority: taskForm.priority,
                            dueDate: taskDueDate!.toISOString().split("T")[0],
                          }
                        : task
                    ),
                    progress: calculateMilestoneProgress(
                      milestone.tasks.map((task) =>
                        task.id === editingTask.id
                          ? {
                              ...task,
                              title: taskForm.title,
                              description: taskForm.description,
                              assignedTo:
                                taskForm.assignedTo === "unassigned"
                                  ? undefined
                                  : taskForm.assignedTo,
                              priority: taskForm.priority,
                              dueDate: taskDueDate!.toISOString().split("T")[0],
                            }
                          : task
                      )
                    ),
                  }
                : milestone
            )
          );
          toast.success("Task updated successfully");
        } else {
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
        }

        // Reset form and close dialog
        resetTaskForm();
        setShowTaskDialog(false);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to save task");
      setIsLoading(false);
    }
  };

  const handleEditTask = (task: Task, milestoneId: string) => {
    setEditingTask(task);
    setSelectedMilestone(milestoneId);
    selectedMilestoneRef.current = milestoneId; // Store in ref as backup
    const dueDate = new Date(task.dueDate);
    setTaskForm({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo || "unassigned",
      priority: task.priority,
      dueDate: task.dueDate,
    });
    setTaskDueDate(dueDate);
    setShowTaskDialog(true);
  };

  const handleDeleteTask = async (milestoneId: string, taskId: string) => {
    try {
      setMilestones((prev) =>
        prev.map((milestone) =>
          milestone.id === milestoneId
            ? {
                ...milestone,
                tasks: milestone.tasks.filter((task) => task.id !== taskId),
                progress: calculateMilestoneProgress(
                  milestone.tasks.filter((task) => task.id !== taskId)
                ),
              }
            : milestone
        )
      );
      toast.success("Task deleted successfully");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleTaskStatusChange = async (
    milestoneId: string,
    taskId: string,
    newStatus: Task["status"]
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setMilestones((prev) =>
          prev.map((milestone) =>
            milestone.id === milestoneId
              ? {
                  ...milestone,
                  tasks: milestone.tasks.map((task) =>
                    task.id === taskId
                      ? {
                          ...task,
                          status: newStatus,
                          completedAt:
                            newStatus === "Completed"
                              ? new Date().toISOString()
                              : undefined,
                        }
                      : task
                  ),
                  progress: calculateMilestoneProgress(
                    milestone.tasks.map((task) =>
                      task.id === taskId ? { ...task, status: newStatus } : task
                    )
                  ),
                }
              : milestone
          )
        );
        toast.success("Task status updated");
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
      setIsLoading(false);
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
              Track progress and manage tasks for each milestone
            </p>
          </div>
          {isCurrentUserLeader && (
            <Button
              onClick={handleAddMilestone}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Milestone
            </Button>
          )}
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
                  <Plus className="w-5 h-5 text-gray-600" />
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
                  onEdit={handleEditMilestone}
                  onDelete={handleDeleteMilestone}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onTaskStatusChange={handleTaskStatusChange}
                  isLoading={isLoading}
                />
              ))}
            </Accordion>

            {milestones.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>
=======
                          {isCurrentUserLeader && (
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditMilestone(milestone);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <ConfirmDialog
                                itemName={milestone.name}
                                onConfirm={() =>
                                  handleDeleteMilestone(milestone.id)
                                }
                                trigger={
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                }
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4 px-4">
                        <p className="text-base text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {milestone.description}
                        </p>

                        {/* Add Task Button */}
                        {isCurrentUserLeader && (
                          <Dialog
                            open={showTaskDialog}
                            onOpenChange={(open) => {
                              setShowTaskDialog(open);
                              if (!open) resetTaskForm();
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setSelectedMilestone(milestone.id)
                                }
                                className="border-0 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-base"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Task
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[95vw] max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-xl sm:text-2xl">
                                  {editingTask
                                    ? "Edit Task"
                                    : "Create New Task"}
                                </DialogTitle>
                                <DialogDescription className="text-base sm:text-lg">
                                  {editingTask
                                    ? `Update task in ${milestone.name}`
                                    : `Add a new task to ${milestone.name}`}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="task-title"
                                    className="text-base"
                                  >
                                    Task Title *
                                  </Label>
                                  <Input
                                    id="task-title"
                                    value={taskForm.title}
                                    onChange={(e) =>
                                      setTaskForm((prev) => ({
                                        ...prev,
                                        title: e.target.value,
                                      }))
                                    }
                                    placeholder="Enter task title"
                                    className="text-base"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="task-description"
                                    className="text-base"
                                  >
                                    Description *
                                  </Label>
                                  <Textarea
                                    id="task-description"
                                    value={taskForm.description}
                                    onChange={(e) =>
                                      setTaskForm((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                      }))
                                    }
                                    placeholder="Describe the task"
                                    rows={3}
                                    className="text-base"
                                  />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="task-assignee"
                                      className="text-base"
                                    >
                                      Assign To
                                    </Label>
                                    <Select
                                      value={taskForm.assignedTo}
                                      onValueChange={(value) =>
                                        setTaskForm((prev) => ({
                                          ...prev,
                                          assignedTo: value,
                                        }))
                                      }
                                    >
                                      <SelectTrigger className="text-base">
                                        <SelectValue placeholder="Select member" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem
                                          value="unassigned"
                                          className="text-base"
                                        >
                                          Unassigned
                                        </SelectItem>
                                        {teamMembers.map((member) => (
                                          <SelectItem
                                            key={member.id}
                                            value={member.email}
                                            className="text-base"
                                          >
                                            {member.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="task-priority"
                                      className="text-base"
                                    >
                                      Priority
                                    </Label>
                                    <Select
                                      value={taskForm.priority}
                                      onValueChange={(
                                        value: "Low" | "Medium" | "High"
                                      ) =>
                                        setTaskForm((prev) => ({
                                          ...prev,
                                          priority: value,
                                        }))
                                      }
                                    >
                                      <SelectTrigger className="text-base">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem
                                          value="Low"
                                          className="text-base"
                                        >
                                          Low
                                        </SelectItem>
                                        <SelectItem
                                          value="Medium"
                                          className="text-base"
                                        >
                                          Medium
                                        </SelectItem>
                                        <SelectItem
                                          value="High"
                                          className="text-base"
                                        >
                                          High
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-base">
                                    Due Date *
                                  </Label>
                                  <DatePicker
                                    date={taskDueDate}
                                    onDateChange={setTaskDueDate}
                                    placeholder="Select a date"
                                    disablePastDates={true}
                                  />
                                  <p className="text-sm text-muted-foreground">
                                    Selected:{" "}
                                    {taskDueDate
                                      ? taskDueDate.toLocaleDateString()
                                      : "None"}
                                  </p>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setShowTaskDialog(false)}
                                  className="text-base"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleCreateTask}
                                  disabled={isLoading}
                                  className="text-base"
                                >
                                  {isLoading
                                    ? editingTask
                                      ? "Updating..."
                                      : "Creating..."
                                    : editingTask
                                    ? "Update Task"
                                    : "Create Task"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}

                        {/* Tasks List */}
                        <div className="space-y-2 ml-6">
                          {milestone.tasks.map((task) => (
                            <div
                              key={task.id}
                              className="bg-gray-50 hover:bg-gray-100 rounded-lg p-3 sm:p-4 space-y-3 transition-colors"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div className="space-y-1 min-w-0 flex-1">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <h4 className="font-normal text-base sm:text-lg text-gray-800">
                                      {task.title}
                                    </h4>
                                    <Badge
                                      className={`${getPriorityColor(
                                        task.priority
                                      )} text-sm border-0`}
                                    >
                                      {task.priority}
                                    </Badge>
                                  </div>
                                  <p className="text-sm sm:text-base text-gray-600">
                                    {task.description}
                                  </p>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-500">
                                    <span>Due: {formatDate(task.dueDate)}</span>
                                    {task.assignedTo && (
                                      <span className="truncate">
                                        Assigned to:{" "}
                                        {teamMembers.find(
                                          (m) => m.email === task.assignedTo
                                        )?.name || task.assignedTo}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                  <Select
                                    value={task.status}
                                    onValueChange={(
                                      value:
                                        | "To Do"
                                        | "In Progress"
                                        | "Completed"
                                    ) =>
                                      handleTaskStatusChange(
                                        milestone.id,
                                        task.id,
                                        value
                                      )
                                    }
                                    disabled={
                                      !isCurrentUserLeader &&
                                      task.assignedTo !== user?.email
                                    }
                                  >
                                    <SelectTrigger className="w-24 sm:w-32 text-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem
                                        value="To Do"
                                        className="text-sm"
                                      >
                                        To Do
                                      </SelectItem>
                                      <SelectItem
                                        value="In Progress"
                                        className="text-sm"
                                      >
                                        In Progress
                                      </SelectItem>
                                      <SelectItem
                                        value="Completed"
                                        className="text-sm"
                                      >
                                        Completed
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <StatusBadge status={task.status} />
                                  {isCurrentUserLeader && (
                                    <div className="flex items-center space-x-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleEditTask(task, milestone.id)
                                        }
                                        className="h-8 w-8 p-0"
                                      >
                                        <Edit className="w-3 h-3" />
                                      </Button>
                                      <ConfirmDialog
                                        itemName={task.title}
                                        onConfirm={() =>
                                          handleDeleteTask(
                                            milestone.id,
                                            task.id
                                          )
                                        }
                                        trigger={
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-red-600 hover:text-red-700"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </Button>
                                        }
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>

                              {task.evaluation && (
                                <div className="bg-green-50 rounded-lg p-2 sm:p-3 border-0">
                                  <p className="text-sm sm:text-base text-green-800">
                                    <strong>Evaluation:</strong>{" "}
                                    {task.evaluation}
                                  </p>
                                  {task.evaluatedBy && (
                                    <p className="text-xs sm:text-sm text-green-600 mt-1">
                                      Evaluated by: {task.evaluatedBy}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}

                          {milestone.tasks.length === 0 && (
                            <p className="text-gray-500 text-center py-4 ml-6 text-base">
                              No tasks added to this milestone yet.
                            </p>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {milestones.length === 0 && (
                <p className="text-gray-500 text-center py-8 text-base">
>>>>>>> main-backup
                  No milestones created yet. Create your first milestone to
                  start tracking progress.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <MilestoneDialog
        isOpen={showMilestoneDialog}
        onClose={handleCloseMilestoneDialog}
        onSave={handleCreateMilestone}
        isLoading={isLoading}
        editingMilestone={editingMilestone}
        form={milestoneForm}
        onFormChange={handleMilestoneFormChange}
        deadlineDate={milestoneDeadlineDate}
        onDeadlineDateChange={setMilestoneDeadlineDate}
      />

      <TaskDialog
        isOpen={showTaskDialog}
        onClose={handleCloseTaskDialog}
        onSave={handleCreateTask}
        isLoading={isLoading}
        editingTask={editingTask}
        form={taskForm}
        onFormChange={handleTaskFormChange}
        dueDate={taskDueDate}
        onDueDateChange={handleTaskDueDateChange}
        teamMembers={teamMembers}
      />
    </Card>
  );
};

export default MilestoneTab;
