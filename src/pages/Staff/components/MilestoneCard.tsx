import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  ChevronDown,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Video,
  ExternalLink,
  Users,
} from "lucide-react";
import { Milestone } from "@/types/milestone";
import { ProjectTask } from "@/types/task";

interface MilestoneCardProps {
  milestone: Milestone;
  tasks: ProjectTask[];
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddTask: () => void;
  onEditTask: (task: ProjectTask) => void;
  onDeleteTask: (task: ProjectTask) => void;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  tasks,
  isExpanded,
  onToggleExpansion,
  onEdit,
  onDelete,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Milestone Header */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleExpansion}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-shrink-0 mt-1">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(milestone.status)}
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {milestone.title}
                </h3>
                <Badge className={getStatusColor(milestone.status)}>
                  {milestone.status}
                </Badge>
              </div>
              {milestone.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {milestone.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {formatDate(milestone["start-date"])} -{" "}
                    {formatDate(milestone["end-date"])}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{tasks.length} tasks</span>
                  {tasks.length > 0 && (
                    <span>({Math.round(progress)}% complete)</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="h-8 w-8 p-0"
            >
              <Edit2 className="w-3 h-3" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Milestone</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{milestone.title}"? This action
                    cannot be undone and will also delete all associated tasks.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Tasks Section (Expanded) */}
      {isExpanded && (
        <div className="border-t bg-gray-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-900">
                Tasks ({tasks.length})
              </h4>
              <Button size="sm" onClick={onAddTask}>
                <Plus className="w-3 h-3 mr-1" />
                Add Task
              </Button>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500 mb-2">No tasks yet</p>
                <Button size="sm" onClick={onAddTask}>
                  <Plus className="w-3 h-3 mr-1" />
                  Create First Task
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg border p-3 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-gray-900 truncate">
                            {task.name}
                          </h5>
                          <Badge
                            variant={
                              task.status === "completed" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {task.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              task.priority === "High"
                                ? "border-red-200 text-red-700"
                                : task.priority === "Medium"
                                ? "border-yellow-200 text-yellow-700"
                                : "border-green-200 text-green-700"
                            }`}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>
                            {new Date(task["start-date"]).toLocaleDateString()} -{" "}
                            {new Date(task["end-date"]).toLocaleDateString()}
                          </span>
                          {task["member-tasks"] && task["member-tasks"].length > 0 && (
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{task["member-tasks"].length} members</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        {task["meeting-url"] && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(task["meeting-url"]!, "_blank")}
                            className="h-7 px-2"
                          >
                            <Video className="w-3 h-3 mr-1" />
                            Join
                            <ExternalLink className="w-2 h-2 ml-1" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditTask(task)}
                          className="h-7 w-7 p-0"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Task</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{task.name}"? This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDeleteTask(task)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneCard;
