import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Video,
  Users,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Search,
  Clock,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loaders";
import { useProjectListWithMeetingTask } from "@/hooks/queries/project";
import { useDeleteTask } from "@/hooks/queries/task";
import { ProjectItemWithTask } from "@/types/project";
import { ProjectTask } from "@/types/task";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import MeetingTaskModal from "./MeetingTaskModal";
import { formatDateTime } from "@/utils";

// Default image URL for projects without logo
const DEFAULT_PROJECT_IMAGE =
  "https://t3.ftcdn.net/jpg/04/72/54/68/360_F_472546867_4MBw9cVFYE7AwnrIIbmZ8xXS0V3mrIzr.jpg";

const StaffMeetings: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set()
  );
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState<{
    id: string;
    title: string;
    description: string;
    priority: string;
    "start-date": string;
    "end-date": string;
    "meeting-url": string | null;
    note: string;
    status: string;
    "milestone-id": string;
  } | null>(null);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Track initial load state
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  // API call to get projects with meeting tasks
  const {
    data: projectsData,
    isLoading,
    error,
    refetch: refetchProjects,
  } = useProjectListWithMeetingTask({
    title: searchTitle,
    genres: ["proposal"],
    statuses: ["inprogress"],
    "page-index": currentPage,
    "page-size": pageSize,
  });

  const deleteTaskMutation = useDeleteTask();

  // Extract projects from API response
  const projects = useMemo(() => {
    return projectsData?.["data-list"] || [];
  }, [projectsData]);

  // Track when data has been loaded for the first time
  useEffect(() => {
    if (projectsData && !hasInitiallyLoaded) {
      setHasInitiallyLoaded(true);
    }
  }, [projectsData, hasInitiallyLoaded]);

  // Determine loading states
  const isInitialLoading = isLoading && !hasInitiallyLoaded;
  const isRefetching = isLoading && hasInitiallyLoaded;

  // Toggle project expansion
  const toggleProjectExpansion = (projectId: string) => {
    setExpandedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Handler functions
  const handleJoinMeeting = (meetingUrl: string) => {
    if (meetingUrl) {
      window.open(meetingUrl, "_blank");
      toast.success("Joining meeting");
    } else {
      toast.error("No meeting URL available");
    }
  };

  const handleCreateTask = (project: ProjectItemWithTask) => {
    setSelectedTask(null);
    // Sử dụng milestoneID từ project hoặc milestone đầu tiên nếu có
    const milestoneId =
      project.milestoneID ||
      (project.milestones && project.milestones.length > 0
        ? project.milestones[0].id
        : "");

    if (!milestoneId) {
      toast.error("No milestone found for this project");
      return;
    }

    setSelectedMilestoneId(milestoneId);
    setIsTaskModalOpen(true);
  };

  const handleUpdateTask = (task: ProjectTask) => {
    setSelectedTask({
      id: task.id,
      title: task.name,
      description: task.description,
      priority: task.priority,
      "start-date": task["start-date"],
      "end-date": task["end-date"],
      "meeting-url": task["meeting-url"],
      note: task.note,
      status: task.status,
      "milestone-id": task["milestone-id"],
    });
    setSelectedMilestoneId(task["milestone-id"]);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = async (task: ProjectTask) => {
    setIsDeleting(true);
    try {
      await deleteTaskMutation.mutateAsync(task.id);
      toast.success("Task deleted successfully");
      // Refresh the projects list to reflect the changes
      refetchProjects();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTaskModalSuccess = () => {
    setIsTaskModalOpen(false);
    // Refresh the projects list to reflect the changes
    refetchProjects();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "inprogress":
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Show loading only on initial load when there's no data
  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-2">Error loading projects</div>
        <p className="text-gray-600">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Staff Meetings
            </h1>
            <p className="text-sm text-gray-600">
              Manage project meetings and tasks across all projects
            </p>
          </div>
        </div>

        {/* Search Bar - Full width */}
        <div className="w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects by title..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="pl-10 w-full h-9"
            />
          </div>
        </div>
      </div>

      {/* Projects with Meeting Tasks */}
      <div className="space-y-3 relative">
        {/* Loading overlay for project list when refetching */}
        {isRefetching && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-lg">
            <div className="bg-white rounded-lg shadow-md p-3">
              <Loading />
            </div>
          </div>
        )}
        {projects.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-gray-500 mb-1">No projects found</div>
              <p className="text-sm text-gray-400">
                No projects with meeting available
              </p>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isExpanded={expandedProjects.has(project.id)}
              onToggleExpansion={() => toggleProjectExpansion(project.id)}
              onJoinMeeting={handleJoinMeeting}
              onCreateTask={handleCreateTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              getPriorityColor={getPriorityColor}
              getStatusColor={getStatusColor}
            />
          ))
        )}
      </div>

      {/* Pagination - Always show */}
      {projectsData && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {projectsData["total-page"] || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === (projectsData["total-page"] || 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Loading Dialog for Delete Task */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center gap-4">
            <Loading />
            <p className="text-gray-700 font-medium">Deleting meeting...</p>
          </div>
        </div>
      )}

      {/* Meeting Task Modal */}
      <MeetingTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSuccess={handleTaskModalSuccess}
        task={selectedTask}
        milestoneId={selectedMilestoneId}
      />
    </div>
  );
};

// ProjectCard Component
interface ProjectCardProps {
  project: ProjectItemWithTask;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onJoinMeeting: (meetingUrl: string) => void;
  onCreateTask: (project: ProjectItemWithTask) => void;
  onUpdateTask: (task: ProjectTask) => void;
  onDeleteTask: (task: ProjectTask) => void;
  getPriorityColor: (priority: string) => string;
  getStatusColor: (status: string) => string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isExpanded,
  onToggleExpansion,
  onJoinMeeting,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  getPriorityColor,
  getStatusColor,
}) => {
  const getImageSrc = (logoUrl: string | null) => {
    return logoUrl || DEFAULT_PROJECT_IMAGE;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = DEFAULT_PROJECT_IMAGE;
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {/* Project Header */}
        <div
          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={onToggleExpansion}
        >
          <div className="flex items-start gap-3">
            {/* Project Logo */}
            <div className="flex-shrink-0">
              <img
                src={getImageSrc(project["logo-url"])}
                alt={project["english-title"]}
                className="w-12 h-12 rounded-lg object-cover border shadow-sm"
                onError={handleImageError}
              />
            </div>

            {/* Project Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 truncate">
                    {project["english-title"]}
                  </h3>
                  <p className="text-xs text-gray-600 truncate mt-1">
                    {project["vietnamese-title"]}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      {project.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      {project.category}
                    </Badge>
                    {project.duration && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {project.duration} months
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  {project.tasks && project.tasks.length > 0 && (
                    <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5">
                      {project.tasks.length} meeting
                      {project.tasks.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                  {project.milestoneID && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCreateTask(project);
                      }}
                      className="flex items-center gap-1 h-8 px-3"
                    >
                      <Plus className="w-3 h-3" />
                      Create Meeting
                    </Button>
                  )}

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meeting Tasks (Expanded) */}
        {isExpanded && project.tasks && project.tasks.length > 0 && (
          <div className="border-t bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Meeting
              </h4>
              <div className="grid gap-3">
                {project.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg border shadow-sm p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="grid grid-cols-12 gap-3 mb-3">
                      {/* Title + Description + Note */}
                      <div className="col-span-5 flex flex-col min-w-0">
                        <h5 className="font-semibold text-gray-900 text-sm truncate">
                          {task.name}
                        </h5>
                        {task.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        {task.note && (
                          <p className="text-xs text-gray-500 italic mt-1">
                            Note: {task.note}
                          </p>
                        )}
                      </div>

                      {/* DateTime */}
                      <div className="col-span-4 flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-md px-2 py-1">
                          <Calendar className="w-3 h-3 text-blue-600" />
                          <span>
                            {formatDateTime(task["start-date"])}
                            <span className="mx-1 text-gray-500">→</span>
                            {formatDateTime(task["end-date"])}
                          </span>
                        </div>
                      </div>

                      {/* Priority + Status */}
                      <div className="col-span-3 flex items-start justify-end gap-1">
                        <Badge
                          className={`text-xs px-2 py-0.5 ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </Badge>
                        <Badge
                          className={`text-xs px-2 py-0.5 ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div>
                        {task["meeting-url"] ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-7 px-2"
                            onClick={() => onJoinMeeting(task["meeting-url"]!)}
                          >
                            <Video className="w-3 h-3" />
                            Join Meeting
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-500 italic">
                            No meeting link available
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onUpdateTask(task)}
                          className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50 h-7 px-2"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </Button>
                        <ConfirmDialog
                          trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </Button>
                          }
                          onConfirm={() => onDeleteTask(task)}
                          title="Delete Task"
                          description={`Are you sure you want to delete the task "${task.name}"? This action cannot be undone.`}
                          confirmText="Delete"
                          cancelText="Cancel"
                          variant="destructive"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Tasks Message */}
        {isExpanded && (!project.tasks || project.tasks.length === 0) && (
          <div className="border-t bg-gray-50 p-4 text-center flex flex-col items-center">
            <div className="text-gray-400 mb-1">
              <Users className="w-6 h-6 mx-auto mb-1" />
            </div>
            <p className="text-sm text-gray-500 mb-2">
              No meeting found for this project
            </p>
            {project.milestoneID && (
              <Button
                size="sm"
                variant="default"
                onClick={() => onCreateTask(project)}
                className="flex items-center gap-1 h-8 px-3"
              >
                <Plus className="w-3 h-3" />
                Create First Meeting
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffMeetings;
