import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Task, TaskPriority, UpdateTaskData } from "@/types/task";
import { User, UserRole } from "@/contexts/AuthContext";
import { Calendar, Clock, Edit, Save, X, User as UserIcon } from "lucide-react";
import { format, parseISO, isAfter } from "date-fns";

interface TaskDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  currentUser: User;
  teamMembers: User[];
  onUpdate: (taskId: string, data: UpdateTaskData) => void;
  isLoading?: boolean;
}

const priorityOptions: TaskPriority[] = ["Low", "Medium", "High"];

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case "High":
      return { color: "text-red-600", bgColor: "bg-red-100", icon: "🔴" };
    case "Medium":
      return { color: "text-amber-600", bgColor: "bg-amber-100", icon: "🟡" };
    case "Low":
      return { color: "text-blue-600", bgColor: "bg-blue-100", icon: "🔵" };
    default:
      return { color: "text-slate-600", bgColor: "bg-slate-100", icon: "⚪" };
  }
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "To Do":
      return { color: "text-slate-600", bgColor: "bg-slate-100" };
    case "In Progress":
      return { color: "text-blue-600", bgColor: "bg-blue-100" };
    case "Completed":
      return { color: "text-green-600", bgColor: "bg-green-100" };
    case "Overdue":
      return { color: "text-red-600", bgColor: "bg-red-100" };
    default:
      return { color: "text-slate-600", bgColor: "bg-slate-100" };
  }
};

export const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({
  open,
  onOpenChange,
  task,
  currentUser,
  teamMembers,
  onUpdate,
  isLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateTaskData>({});
  const [errors, setErrors] = useState<Partial<UpdateTaskData>>({});

  // Reset editing state when task changes or drawer closes
  useEffect(() => {
    if (!open || !task) {
      setIsEditing(false);
      setEditData({});
      setErrors({});
    } else if (task) {
      setEditData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        assigneeId: task.assignee.id,
        dueDate: task.dueDate.split('T')[0], // Convert to date input format
      });
    }
  }, [open, task]);

  if (!task) return null;

  const isLeader = currentUser.role === UserRole.PRINCIPAL_INVESTIGATOR || 
                   currentUser.role === UserRole.HOST_INSTITUTION ||
                   currentUser.role === UserRole.STAFF;

  const canEdit = isLeader || task.assignee.id === currentUser.id;
  const isOverdue = isAfter(new Date(), parseISO(task.dueDate)) && task.status !== "Completed";
  
  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);

  const validateForm = (): boolean => {
    const newErrors: Partial<UpdateTaskData> = {};

    if (!editData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!editData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    if (!editData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const dueDate = new Date(editData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today && task.status !== "Completed") {
        newErrors.dueDate = "Due date cannot be in the past for incomplete tasks";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onUpdate(task.id, editData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      assigneeId: task.assignee.id,
      dueDate: task.dueDate.split('T')[0],
    });
    setErrors({});
  };

  const handleInputChange = (field: keyof UpdateTaskData, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto bg-white">
        <SheetHeader className="pb-4 border-b border-slate-200">
          <SheetTitle className="flex items-center justify-between text-lg font-semibold text-slate-900">
            <span>Task Details</span>
            {canEdit && !isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status and Priority Badges */}
          <div className="flex gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
              {task.status}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig.bgColor} ${priorityConfig.color}`}>
              {priorityConfig.icon} {task.priority} Priority
            </span>
            {isOverdue && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                Overdue
              </span>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Title</Label>
            {isEditing ? (
              <div>
                <Input
                  value={editData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={`${errors.title ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"}`}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                )}
              </div>
            ) : (
              <p className="text-sm font-medium text-slate-900">{task.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Description</Label>
            {isEditing ? (
              <div>
                <Textarea
                  value={editData.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className={`min-h-[100px] resize-none ${errors.description ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"}`}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{task.description}</p>
            )}
          </div>

          {/* Priority */}
          {isEditing && isLeader && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Priority</Label>
              <Select
                value={editData.priority || task.priority}
                onValueChange={(value) => handleInputChange("priority", value)}
              >
                <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          {priority === "High" ? "🔴" : priority === "Medium" ? "🟡" : "🔵"}
                        </span>
                        <span>{priority} Priority</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Assignee */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Assigned To</Label>
            {isEditing && isLeader ? (
              <Select
                value={editData.assigneeId || task.assignee.id}
                onValueChange={(value) => handleInputChange("assigneeId", value)}
              >
                <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-600">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span>{member.name}</span>
                        <span className="text-xs text-slate-500">({member.role})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                  <AvatarFallback className="bg-slate-200 text-slate-600 text-sm">
                    {task.assignee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-slate-900">{task.assignee.name}</p>
                  <p className="text-xs text-slate-500">{task.assignee.role}</p>
                </div>
              </div>
            )}
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Due Date</Label>
            {isEditing && (isLeader || task.assignee.id === currentUser.id) ? (
              <div>
                <Input
                  type="date"
                  min={task.status === "Completed" ? undefined : today}
                  value={editData.dueDate || ""}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  className={`${errors.dueDate ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"}`}
                />
                {errors.dueDate && (
                  <p className="text-sm text-red-600 mt-1">{errors.dueDate}</p>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className={`text-sm ${isOverdue ? "text-red-600 font-medium" : "text-slate-700"}`}>
                  {format(parseISO(task.dueDate), "EEEE, MMMM dd, yyyy")}
                </span>
              </div>
            )}
          </div>

          <Separator className="bg-slate-200" />

          {/* Timestamps */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              <span>Created: {format(parseISO(task.createdAt), "MMM dd, yyyy 'at' HH:mm")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              <span>Updated: {format(parseISO(task.updatedAt), "MMM dd, yyyy 'at' HH:mm")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="font-mono">Task ID: #{task.id}</span>
            </div>
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex gap-2 pt-4 border-t border-slate-200">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
