import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Edit,
  Trash2,
  CalendarIcon,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Milestone, Task, PIUser } from "../shared/types";
import { StatusBadge } from "../shared/components";
import { formatDate, calculateMilestoneProgress } from "../shared/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const MilestoneTab: React.FC = () => {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [teamMembers, setTeamMembers] = useState<PIUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<string>("");

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

  const handleDeleteMilestone = async (milestoneId: string) => {
    try {
      setMilestones((prev) => prev.filter((m) => m.id !== milestoneId));
      toast.success("Milestone deleted successfully");
    } catch {
      toast.error("Failed to delete milestone");
    }
  };

  const handleCreateTask = async () => {
    if (
      !taskForm.title ||
      !taskForm.description ||
      !taskDueDate ||
      !selectedMilestone
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        if (editingTask) {
          // Update existing task
          setMilestones((prev) =>
            prev.map((milestone) =>
              milestone.id === selectedMilestone
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
            title: taskForm.title,
            description: taskForm.description,
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
              milestone.id === selectedMilestone
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

        setTaskForm({
          title: "",
          description: "",
          assignedTo: "unassigned",
          priority: "Medium",
          dueDate: "",
        });
        setTaskDueDate(undefined);
        setEditingTask(null);
        setShowTaskDialog(false);
        setSelectedMilestone("");
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
    setTaskForm({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo || "unassigned",
      priority: task.priority,
      dueDate: task.dueDate,
    });
    setTaskDueDate(new Date(task.dueDate));
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "In Progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "Overdue":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isCurrentUserLeader = true; // In real app, check user role

  const resetMilestoneForm = () => {
    setMilestoneForm({ name: "", description: "", deadline: "" });
    setMilestoneDeadlineDate(undefined);
    setEditingMilestone(null);
  };

  const resetTaskForm = () => {
    setTaskForm({
      title: "",
      description: "",
      assignedTo: "unassigned",
      priority: "Medium",
      dueDate: "",
    });
    setTaskDueDate(undefined);
    setEditingTask(null);
    setSelectedMilestone("");
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-0 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
              Project Milestones
            </CardTitle>
            <CardDescription className="text-sm sm:text-base mt-1">
              Track progress and manage tasks for each milestone
            </CardDescription>
          </div>
          {isCurrentUserLeader && (
            <div className="flex space-x-2 flex-shrink-0">
              <Dialog
                open={showMilestoneDialog}
                onOpenChange={(open) => {
                  setShowMilestoneDialog(open);
                  if (!open) resetMilestoneForm();
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 cursor-pointer text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Add Milestone</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">
                      {editingMilestone
                        ? "Edit Milestone"
                        : "Create New Milestone"}
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base">
                      {editingMilestone
                        ? "Update milestone details"
                        : "Define a new milestone for your research project"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="milestone-name">Milestone Name *</Label>
                      <Input
                        id="milestone-name"
                        value={milestoneForm.name}
                        onChange={(e) =>
                          setMilestoneForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter milestone name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="milestone-description">
                        Description *
                      </Label>
                      <Textarea
                        id="milestone-description"
                        value={milestoneForm.description}
                        onChange={(e) =>
                          setMilestoneForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Describe the milestone objectives"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Deadline *</Label>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !milestoneDeadlineDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {milestoneDeadlineDate ? (
                              format(milestoneDeadlineDate, "PPP")
                            ) : (
                              <span>Pick a deadline</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="p-3 space-y-3">
                            <Calendar
                              mode="single"
                              selected={milestoneDeadlineDate}
                              onSelect={setMilestoneDeadlineDate}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              className="rounded-md border-0"
                            />
                            {milestoneDeadlineDate && (
                              <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-sm text-muted-foreground">
                                  {format(
                                    milestoneDeadlineDate,
                                    "EEEE, MMMM do, yyyy"
                                  )}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setMilestoneDeadlineDate(undefined)
                                  }
                                  className="h-7 px-2 text-xs"
                                >
                                  Clear
                                </Button>
                              </div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowMilestoneDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateMilestone}
                      disabled={isLoading}
                    >
                      {isLoading
                        ? editingMilestone
                          ? "Updating..."
                          : "Creating..."
                        : editingMilestone
                        ? "Update Milestone"
                        : "Create Milestone"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6 pt-0">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-lg sm:text-2xl font-bold">
                    {milestones.filter((m) => m.status === "Completed").length}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    Completed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-lg sm:text-2xl font-bold">
                    {
                      milestones.filter((m) => m.status === "In Progress")
                        .length
                    }
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    In Progress
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-lg sm:text-2xl font-bold">
                    {
                      milestones.filter((m) => m.status === "Not Started")
                        .length
                    }
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    Not Started
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-lg sm:text-2xl font-bold">
                    {milestones.reduce((total, m) => total + m.tasks.length, 0)}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    Total Tasks
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Milestones List */}
        <Card>
          <CardHeader>
            <CardTitle>Project Milestones</CardTitle>
            <CardDescription>
              Track progress and manage tasks for each milestone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {milestones.map((milestone) => (
                <AccordionItem key={milestone.id} value={milestone.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mr-2 sm:mr-4 gap-3 sm:gap-4">
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        {getStatusIcon(milestone.status)}
                        <div className="text-left min-w-0 flex-1">
                          <h3 className="font-medium text-sm sm:text-base truncate">
                            {milestone.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Due: {formatDate(milestone.deadline)} •{" "}
                            {milestone.tasks.length} tasks
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4 flex-shrink-0">
                        {/* <StatusBadge status={milestone.status} /> */}
                        <div className="text-left sm:text-right">
                          <p className="text-xs sm:text-sm font-medium text-gray-700">
                            {milestone.progress}% Complete
                          </p>
                          <div className="relative w-20 sm:w-28 h-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden shadow-inner">
                            <div
                              className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out ${
                                milestone.progress === 100
                                  ? "bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-200"
                                  : milestone.progress >= 75
                                  ? "bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg shadow-blue-200"
                                  : milestone.progress >= 50
                                  ? "bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-200"
                                  : milestone.progress >= 25
                                  ? "bg-gradient-to-r from-orange-400 to-orange-600 shadow-lg shadow-orange-200"
                                  : "bg-gradient-to-r from-red-400 to-red-600 shadow-lg shadow-red-200"
                              }`}
                              style={{ width: `${milestone.progress}%` }}
                            >
                              {milestone.progress > 0 && (
                                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </div>

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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMilestone(milestone.id);
                              }}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <p className="text-muted-foreground">
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
                              onClick={() => setSelectedMilestone(milestone.id)}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Task
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-lg sm:text-xl">
                                {editingTask ? "Edit Task" : "Create New Task"}
                              </DialogTitle>
                              <DialogDescription className="text-sm sm:text-base">
                                {editingTask
                                  ? `Update task in ${milestone.name}`
                                  : `Add a new task to ${milestone.name}`}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="task-title">Task Title *</Label>
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
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="task-description">
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
                                />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="task-assignee">
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
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="unassigned">
                                        Unassigned
                                      </SelectItem>
                                      {teamMembers.map((member) => (
                                        <SelectItem
                                          key={member.id}
                                          value={member.email}
                                        >
                                          {member.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="task-priority">
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
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Low">Low</SelectItem>
                                      <SelectItem value="Medium">
                                        Medium
                                      </SelectItem>
                                      <SelectItem value="High">High</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Due Date *</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !taskDueDate && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {taskDueDate ? (
                                        format(taskDueDate, "PPP")
                                      ) : (
                                        <span>Pick a due date</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <div className="p-3 space-y-3">
                                      <Calendar
                                        mode="single"
                                        selected={taskDueDate}
                                        onSelect={setTaskDueDate}
                                        disabled={(date) =>
                                          date <
                                          new Date(
                                            new Date().setHours(0, 0, 0, 0)
                                          )
                                        }
                                        className="rounded-md border-0"
                                      />
                                      {taskDueDate && (
                                        <div className="flex justify-between items-center pt-2 border-t">
                                          <span className="text-sm text-muted-foreground">
                                            {format(
                                              taskDueDate,
                                              "EEEE, MMMM do, yyyy"
                                            )}
                                          </span>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              setTaskDueDate(undefined)
                                            }
                                            className="h-7 px-2 text-xs"
                                          >
                                            Clear
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setShowTaskDialog(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleCreateTask}
                                disabled={isLoading}
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
                      <div className="space-y-3">
                        {milestone.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="border rounded-lg p-3 sm:p-4 space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <h4 className="font-medium text-sm sm:text-base">
                                    {task.title}
                                  </h4>
                                  <Badge
                                    className={`${getPriorityColor(
                                      task.priority
                                    )} text-xs`}
                                  >
                                    {task.priority}
                                  </Badge>
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                  {task.description}
                                </p>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-muted-foreground">
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
                                    value: "To Do" | "In Progress" | "Completed"
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
                                  <SelectTrigger className="w-24 sm:w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="To Do">To Do</SelectItem>
                                    <SelectItem value="In Progress">
                                      In Progress
                                    </SelectItem>
                                    <SelectItem value="Completed">
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
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleDeleteTask(milestone.id, task.id)
                                      }
                                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {task.evaluation && (
                              <div className="bg-green-50 border border-green-200 rounded p-2 sm:p-3">
                                <p className="text-xs sm:text-sm text-green-800">
                                  <strong>Evaluation:</strong> {task.evaluation}
                                </p>
                                {task.evaluatedBy && (
                                  <p className="text-xs text-green-600 mt-1">
                                    Evaluated by: {task.evaluatedBy}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}

                        {milestone.tasks.length === 0 && (
                          <p className="text-muted-foreground text-center py-4">
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
              <p className="text-muted-foreground text-center py-8">
                No milestones created yet. Create your first milestone to start
                tracking progress.
              </p>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default MilestoneTab;
