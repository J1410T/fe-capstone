import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Target,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Milestone, Task } from "../shared/types";
import { ProjectTask } from "@/types/task";
import { Milestone as APIMilestone } from "@/types/task";
import { useMilestonesByProjectId } from "@/hooks/queries/milestone";
import { useTasksByMilestoneId } from "@/hooks/queries/task";
import { format } from "date-fns";

interface MilestoneTabProps {
  projectId: string;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
}

// Transform API milestone to component format
const transformMilestone = (apiMilestone: APIMilestone): Milestone => ({
  id: apiMilestone.id,
  name: apiMilestone.title || `Milestone ${apiMilestone.code}`,
  description: apiMilestone.description || "",
  deadline: apiMilestone.endDate || "",
  status: transformMilestoneStatus(apiMilestone.status),
  progress: 0, // Will be calculated later
  "start-date": apiMilestone.startDate || "",
  "end-date": apiMilestone.endDate || "",
  tasks: [], // Tasks will be loaded separately
});

// Transform milestone status
const transformMilestoneStatus = (
  status: string
): "Not Started" | "In Progress" | "Completed" | "Overdue" => {
  switch (status?.toLowerCase()) {
    case "in_progress":
    case "in-progress":
      return "In Progress";
    case "completed":
    case "complete":
      return "Completed";
    case "overdue":
      return "Overdue";
    default:
      return "Not Started";
  }
};

// Transform API task to component format
const transformTask = (apiTask: ProjectTask): Task => ({
  id: apiTask.id,
  title: apiTask.name,
  description: apiTask.description || "",
  status: transformTaskStatus(apiTask.status),
  priority: transformTaskPriority(apiTask.priority),
  dueDate: apiTask["end-date"] || "",
  assignedTo: "", // Will be populated from member-tasks if needed
  createdAt: apiTask["start-date"] || "",
  completedAt: apiTask["delivery-date"] || undefined,
  "start-date": apiTask["start-date"] || "",
  "end-date": apiTask["end-date"] || "",
  "member-tasks": "", // Will be populated if needed
});

// Transform task status
const transformTaskStatus = (
  status: string
): "To Do" | "In Progress" | "Completed" => {
  switch (status?.toLowerCase()) {
    case "in_progress":
    case "in-progress":
      return "In Progress";
    case "completed":
    case "complete":
      return "Completed";
    default:
      return "To Do";
  }
};

// Transform task priority
const transformTaskPriority = (
  priority: string | null
): "Low" | "Medium" | "High" => {
  if (!priority) return "Low";
  switch (priority.toLowerCase()) {
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
    default:
      return "Low";
  }
};

// Individual milestone task fetcher component
const MilestoneTaskFetcher: React.FC<{
  milestoneId: string;
  onTasksLoaded: (milestoneId: string, tasks: Task[]) => void;
}> = ({ milestoneId, onTasksLoaded }) => {
  const {
    data: tasksData,
    isLoading,
    error,
  } = useTasksByMilestoneId(milestoneId, 1, 100);

  useEffect(() => {
    // Debug logging
    console.log(`MilestoneTaskFetcher ${milestoneId}:`, {
      isLoading,
      hasData: !!tasksData?.data?.["data-list"],
      taskCount: tasksData?.data?.["data-list"]?.length || 0,
      error: !!error,
    });

    // Always call onTasksLoaded when the loading state changes or data is received
    if (!isLoading) {
      if (tasksData?.data?.["data-list"]) {
        const transformedTasks = tasksData.data["data-list"].map(transformTask);
        console.log(
          `Loading ${transformedTasks.length} tasks for milestone ${milestoneId}`
        );
        onTasksLoaded(milestoneId, transformedTasks);
      } else {
        // No tasks found or error occurred
        console.log(`No tasks found for milestone ${milestoneId}`);
        onTasksLoaded(milestoneId, []);
      }
    }
  }, [tasksData, isLoading, error, milestoneId, onTasksLoaded]);

  return null; // This component doesn't render anything
};

// Custom hook to manage tasks for multiple milestones
const useMilestonesTasks = (milestoneIds: string[]) => {
  const [tasksMap, setTasksMap] = useState<Record<string, Task[]>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const handleTasksLoaded = useCallback(
    (milestoneId: string, tasks: Task[]) => {
      console.log(
        `handleTasksLoaded called for milestone ${milestoneId} with ${tasks.length} tasks`
      );
      setTasksMap((prev) => ({ ...prev, [milestoneId]: tasks }));
      setLoadingMap((prev) => {
        const newLoadingMap = { ...prev, [milestoneId]: false };
        console.log(`Updated loading map:`, newLoadingMap);
        return newLoadingMap;
      });
    },
    []
  );

  // Initialize loading states when milestone IDs change
  useEffect(() => {
    setLoadingMap((prev) => {
      const updated = { ...prev };
      milestoneIds.forEach((id) => {
        if (!(id in updated)) {
          updated[id] = true;
        }
      });
      return updated;
    });

    setTasksMap((prev) => {
      const updated = { ...prev };
      milestoneIds.forEach((id) => {
        if (!(id in updated)) {
          updated[id] = [];
        }
      });
      return updated;
    });
  }, [milestoneIds]);

  return { tasksMap, loadingMap, handleTasksLoaded };
};

// Enhanced Milestone Card Component
const EnhancedMilestoneCard: React.FC<{
  milestone: Milestone;
  tasks: Task[];
  progress: number;
  isLoading: boolean;
}> = ({ milestone, tasks, progress, isLoading }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Debug logging
  console.log(`EnhancedMilestoneCard ${milestone.id}:`, {
    tasksCount: tasks.length,
    isLoading,
    progress,
    isExpanded,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4" />;
      case "In Progress":
        return <Clock className="w-4 h-4" />;
      case "Overdue":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-base font-semibold text-gray-900">
                {milestone.name}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  milestone.status
                )}`}
              >
                <div className="flex items-center gap-1">
                  {getStatusIcon(milestone.status)}
                  {milestone.status}
                </div>
              </span>
            </div>

            {milestone.description && (
              <p className="text-gray-600 mb-4 line-clamp-2">
                {milestone.description}
              </p>
            )}

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Due: {formatDate(milestone.deadline)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{tasks.length} tasks</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progress
                </span>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="ml-4">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100 px-4 py-3">
          <h4 className="font-medium text-gray-900 mb-3">
            Tasks ({tasks.length})
          </h4>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-500">Loading tasks...</span>
            </div>
          ) : tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className=" flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md text-sm"
                >
                  <div className="flex-1">
                    <h5 className="font-normal text-gray-900">{task.title}</h5>
                    {task.description && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        task.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : task.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {task.status}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        task.priority === "High"
                          ? "bg-red-100 text-red-800"
                          : task.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No tasks found for this milestone</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MilestoneTab: React.FC<MilestoneTabProps> = ({ projectId }) => {
  // API hooks following TaskManagement pattern
  const { data: milestonesData, error: milestonesError } =
    useMilestonesByProjectId(projectId);

  // Extract milestones from API response
  const apiMilestones = useMemo(
    () => milestonesData?.data || [],
    [milestonesData?.data]
  );

  // Transform milestones to component format
  const milestones = useMemo(() => {
    return apiMilestones.map(transformMilestone);
  }, [apiMilestones]);

  // Get milestone IDs for task fetching
  const milestoneIds = useMemo(() => milestones.map((m) => m.id), [milestones]);

  // Fetch tasks for all milestones
  const {
    tasksMap: milestoneTasksMap,
    loadingMap,
    handleTasksLoaded,
  } = useMilestonesTasks(milestoneIds);

  // Log any API errors
  useEffect(() => {
    if (milestonesError) {
      console.error("Milestones API error:", milestonesError);
    }
  }, [milestonesError]);

  // Enhanced milestones with tasks
  const milestonesWithTasks = useMemo(() => {
    return milestones.map((milestone) => {
      const tasks = milestoneTasksMap[milestone.id] || [];
      const completedTasks = tasks.filter(
        (t) => t.status === "Completed"
      ).length;
      const progress =
        tasks.length > 0
          ? Math.round((completedTasks / tasks.length) * 100)
          : 0;

      return {
        ...milestone,
        tasks,
        progress,
      };
    });
  }, [milestones, milestoneTasksMap]);

  // Statistics calculations
  const completedMilestones = milestonesWithTasks.filter(
    (m) => m.status === "Completed"
  ).length;
  const inProgressMilestones = milestonesWithTasks.filter(
    (m) => m.status === "In Progress"
  ).length;
  const notStartedMilestones = milestonesWithTasks.filter(
    (m) => m.status === "Not Started"
  ).length;
  const totalTasks = milestonesWithTasks.reduce(
    (total, m) => total + (m.tasks?.length || 0),
    0
  );
  console.log("MilestoneTab render:", {
    milestonesCount: milestones.length,
    milestoneIds,
    loadingMap,
    tasksMap: Object.keys(milestoneTasksMap).map((id) => ({
      id,
      taskCount: milestoneTasksMap[id]?.length || 0,
    })),
  });

  return (
    <div className="space-y-4">
      {/* Task fetchers - invisible components that handle data fetching */}
      {milestoneIds.map((milestoneId) => {
        console.log(`Rendering MilestoneTaskFetcher for ${milestoneId}`);
        return (
          <MilestoneTaskFetcher
            key={milestoneId}
            milestoneId={milestoneId}
            onTasksLoaded={handleTasksLoaded}
          />
        );
      })}

      {/* Header */}
      <div className="bg-gradient-to-r rounded-xl p-6 border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Project Milestones
            </h2>
            <p className="text-sm text-gray-600">
              Track your project's milestone progress and tasks
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{milestones.length} milestones</span>
          </div>
        </div>
        {/* Statistics Cards */}
        <div className="pt-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {completedMilestones}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {inProgressMilestones}
                </p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {notStartedMilestones}
                </p>
                <p className="text-sm text-gray-600">Not Started</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
                <p className="text-sm text-gray-600">Total Tasks</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-3">
        {milestones.length > 0 ? (
          milestones.map((milestone) => {
            const tasks = milestoneTasksMap[milestone.id] || [];
            const isLoading = loadingMap[milestone.id] ?? true; // Default to true if undefined
            const progress =
              tasks.length > 0
                ? Math.round(
                    (tasks.filter((t) => t.status === "Completed").length /
                      tasks.length) *
                      100
                  )
                : 0;

            console.log(`Rendering milestone ${milestone.id}:`, {
              tasksCount: tasks.length,
              isLoading,
              progress,
              loadingMapValue: loadingMap[milestone.id],
              loadingMapKeys: Object.keys(loadingMap),
            });

            return (
              <EnhancedMilestoneCard
                key={milestone.id}
                milestone={milestone}
                tasks={tasks}
                progress={progress}
                isLoading={isLoading}
              />
            );
          })
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No milestones found
              </h3>
              <p className="text-gray-600">
                Milestones will appear here once they are created for this
                project.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestoneTab;
